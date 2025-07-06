import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { stripe, createCustomer } from '@/lib/stripe';
import { securityLogger } from '@/lib/security';
import { z } from 'zod';
import { FEATURE_FLAGS } from '@/lib/featureFlags';

// Validation schemas
const addPaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
  setAsDefault: z.boolean().default(false),
  billingDetails: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      postal_code: z.string().optional(),
      state: z.string().optional(),
      country: z.string().default('DE')
    }).optional()
  }).optional()
});

const updatePaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
  action: z.enum(['set_default', 'update_billing', 'detach']),
  billingDetails: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      postal_code: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional()
    }).optional()
  }).optional()
});

// Add new payment method
export async function POST(request: NextRequest) {
  // Check if payments are enabled
  if (!FEATURE_FLAGS.paymentsEnabled) {
    securityLogger.warn('payment_methods_post_disabled', {
      message: 'Payments are currently disabled via feature flags'
    });
    return NextResponse.json(
      { error: 'Payments are currently disabled' },
      { status: 403 }
    );
  }
  
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = addPaymentMethodSchema.parse(body);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string }
    }) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let customerId = user.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await createCustomer({
        email: user.email,
        name: user.name || undefined,
        address: validatedData.billingDetails?.address,
        metadata: {
          userId: user.id,
          source: 'payment_method_addition'
        }
      });

      customerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      });
    }

    // Attach payment method to customer
    const paymentMethod = await stripe.paymentMethods.attach(
      validatedData.paymentMethodId,
      {
        customer: customerId
      }
    );

    // Update billing details if provided
    if (validatedData.billingDetails) {
      await stripe.paymentMethods.update(
        validatedData.paymentMethodId,
        {
          billing_details: validatedData.billingDetails
        }
      );
    }

    // Set as default payment method if requested
    if (validatedData.setAsDefault) {
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: validatedData.paymentMethodId
        }
      });

      // Also update any active subscriptions to use this payment method
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active'
      });

      for (const subscription of subscriptions.data) {
        await stripe.subscriptions.update(subscription.id, {
          default_payment_method: validatedData.paymentMethodId
        });
      }
    }

    // Get updated payment method with billing details
    const updatedPaymentMethod = await stripe.paymentMethods.retrieve(
      validatedData.paymentMethodId
    );

    securityLogger.info('payment_method_added', {
      userId: user.id,
      paymentMethodId: validatedData.paymentMethodId,
      customerId,
      setAsDefault: validatedData.setAsDefault,
      paymentMethodType: updatedPaymentMethod.type
    });

    return NextResponse.json({
      success: true,
      paymentMethod: {
        id: updatedPaymentMethod.id,
        type: updatedPaymentMethod.type,
        card: updatedPaymentMethod.card ? {
          brand: updatedPaymentMethod.card.brand,
          last4: updatedPaymentMethod.card.last4,
          exp_month: updatedPaymentMethod.card.exp_month,
          exp_year: updatedPaymentMethod.card.exp_year,
          country: updatedPaymentMethod.card.country
        } : null,
        sepa_debit: updatedPaymentMethod.sepa_debit ? {
          last4: updatedPaymentMethod.sepa_debit.last4,
          country: updatedPaymentMethod.sepa_debit.country
        } : null,
        billing_details: updatedPaymentMethod.billing_details,
        created: updatedPaymentMethod.created
      },
      isDefault: validatedData.setAsDefault
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    securityLogger.error('payment_method_addition_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Payment method addition error:', error);
    return NextResponse.json(
      { error: 'Failed to add payment method' },
      { status: 500 }
    );
  }
}

// Get user payment methods
export async function GET(request: NextRequest) {
  // Check if payments are enabled
  if (!FEATURE_FLAGS.paymentsEnabled) {
    securityLogger.warn('payment_methods_get_disabled', {
      message: 'Payments are currently disabled via feature flags'
    });
    return NextResponse.json(
      { error: 'Payments are currently disabled' },
      { status: 403 }
    );
  }
  
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string }
    }) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json({
        success: true,
        paymentMethods: [],
        defaultPaymentMethod: null
      });
    }

    // Get customer details including default payment method
    const customer = await stripe.customers.retrieve(user.stripeCustomerId) as any;
    const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method;

    // Get all payment methods for the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card' // Can be extended to include other types like 'sepa_debit'
    });

    // Get SEPA debit payment methods (common in Germany)
    const sepaPaymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'sepa_debit'
    });

    // Combine all payment methods
    const allPaymentMethods = [
      ...paymentMethods.data,
      ...sepaPaymentMethods.data
    ];

    // Format payment methods for response
    const formattedPaymentMethods = allPaymentMethods.map(pm => ({
      id: pm.id,
      type: pm.type,
      card: pm.card ? {
        brand: pm.card.brand,
        last4: pm.card.last4,
        exp_month: pm.card.exp_month,
        exp_year: pm.card.exp_year,
        country: pm.card.country,
        funding: pm.card.funding
      } : null,
      sepa_debit: pm.sepa_debit ? {
        last4: pm.sepa_debit.last4,
        country: pm.sepa_debit.country,
        bank_code: pm.sepa_debit.bank_code,
        branch_code: pm.sepa_debit.branch_code
      } : null,
      billing_details: pm.billing_details,
      created: pm.created,
      isDefault: pm.id === defaultPaymentMethodId
    }));

    // Get active subscriptions to show which payment methods are in use
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active'
    });

    const subscriptionPaymentMethods = subscriptions.data.map(sub => ({
      subscriptionId: sub.id,
      paymentMethodId: sub.default_payment_method,
      status: sub.status
    }));

    return NextResponse.json({
      success: true,
      paymentMethods: formattedPaymentMethods,
      defaultPaymentMethod: defaultPaymentMethodId,
      subscriptionPaymentMethods,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        address: customer.address,
        tax_ids: customer.tax_ids?.data || []
      }
    });

  } catch (error) {
    securityLogger.error('payment_method_retrieval_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Payment method retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment methods' },
      { status: 500 }
    );
  }
}

// Update or delete payment method
export async function PATCH(request: NextRequest) {
  // Check if payments are enabled
  if (!FEATURE_FLAGS.paymentsEnabled) {
    securityLogger.warn('payment_methods_patch_disabled', {
      message: 'Payments are currently disabled via feature flags'
    });
    return NextResponse.json(
      { error: 'Payments are currently disabled' },
      { status: 403 }
    );
  }
  
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updatePaymentMethodSchema.parse(body);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string }
    }) as any;

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'User or customer not found' },
        { status: 404 }
      );
    }

    let result;

    switch (validatedData.action) {
      case 'set_default':
        // Set as default payment method
        await stripe.customers.update(user.stripeCustomerId, {
          invoice_settings: {
            default_payment_method: validatedData.paymentMethodId
          }
        });

        // Update active subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: 'active'
        });

        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.update(subscription.id, {
            default_payment_method: validatedData.paymentMethodId
          });
        }

        result = await stripe.paymentMethods.retrieve(validatedData.paymentMethodId);

        securityLogger.info('payment_method_set_default', {
          userId: user.id,
          paymentMethodId: validatedData.paymentMethodId,
          customerId: user.stripeCustomerId
        });
        break;

      case 'update_billing':
        if (!validatedData.billingDetails) {
          return NextResponse.json(
            { error: 'Billing details are required for this action' },
            { status: 400 }
          );
        }

        result = await stripe.paymentMethods.update(
          validatedData.paymentMethodId,
          {
            billing_details: validatedData.billingDetails
          }
        );

        securityLogger.info('payment_method_billing_updated', {
          userId: user.id,
          paymentMethodId: validatedData.paymentMethodId
        });
        break;

      case 'detach':
        // Check if this payment method is being used by any active subscriptions
        const activeSubscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: 'active'
        });

        const isInUse = activeSubscriptions.data.some(
          sub => sub.default_payment_method === validatedData.paymentMethodId
        );

        if (isInUse) {
          return NextResponse.json(
            { error: 'Cannot detach payment method that is being used by active subscriptions' },
            { status: 400 }
          );
        }

        // Check if this is the default payment method
        const customer = await stripe.customers.retrieve(user.stripeCustomerId) as any;
        const isDefault = customer.invoice_settings?.default_payment_method === validatedData.paymentMethodId;

        if (isDefault) {
          // Get other payment methods to set a new default
          const otherPaymentMethods = await stripe.paymentMethods.list({
            customer: user.stripeCustomerId,
            type: 'card'
          });

          const otherMethod = otherPaymentMethods.data.find(
            pm => pm.id !== validatedData.paymentMethodId
          );

          if (otherMethod) {
            await stripe.customers.update(user.stripeCustomerId, {
              invoice_settings: {
                default_payment_method: otherMethod.id
              }
            });
          } else {
            // Clear default payment method if no other methods exist
            await stripe.customers.update(user.stripeCustomerId, {
              invoice_settings: {
                default_payment_method: null as any
              }
            });
          }
        }

        result = await stripe.paymentMethods.detach(validatedData.paymentMethodId);

        securityLogger.info('payment_method_detached', {
          userId: user.id,
          paymentMethodId: validatedData.paymentMethodId,
          wasDefault: isDefault
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      paymentMethod: {
        id: result.id,
        type: result.type,
        card: result.card ? {
          brand: result.card.brand,
          last4: result.card.last4,
          exp_month: result.card.exp_month,
          exp_year: result.card.exp_year,
          country: result.card.country
        } : null,
        sepa_debit: result.sepa_debit ? {
          last4: result.sepa_debit.last4,
          country: result.sepa_debit.country
        } : null,
        billing_details: result.billing_details
      },
      action: validatedData.action
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    securityLogger.error('payment_method_update_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Payment method update error:', error);
    return NextResponse.json(
      { error: 'Failed to update payment method' },
      { status: 500 }
    );
  }
}

// Delete payment method (alternative endpoint)
export async function DELETE(request: NextRequest) {
  // Check if payments are enabled
  if (!FEATURE_FLAGS.paymentsEnabled) {
    securityLogger.warn('payment_methods_delete_disabled', {
      message: 'Payments are currently disabled via feature flags'
    });
    return NextResponse.json(
      { error: 'Payments are currently disabled' },
      { status: 403 }
    );
  }
  
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get payment method ID from URL
    const url = new URL(request.url);
    const paymentMethodId = url.searchParams.get('paymentMethodId');

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string }
    }) as any;

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'User or customer not found' },
        { status: 404 }
      );
    }

    // Use the same logic as PATCH with 'detach' action
    const activeSubscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active'
    });

    const isInUse = activeSubscriptions.data.some(
      sub => sub.default_payment_method === paymentMethodId
    );

    if (isInUse) {
      return NextResponse.json(
        { error: 'Cannot delete payment method that is being used by active subscriptions' },
        { status: 400 }
      );
    }

    const result = await stripe.paymentMethods.detach(paymentMethodId);

    securityLogger.info('payment_method_deleted', {
      userId: user.id,
      paymentMethodId
    });

    return NextResponse.json({
      success: true,
      deletedPaymentMethodId: paymentMethodId
    });

  } catch (error) {
    securityLogger.error('payment_method_deletion_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Payment method deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
}