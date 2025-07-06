import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { 
  stripe, 
  createSubscription, 
  createCustomer, 
  cancelSubscription,
  reactivateSubscription,
  calculateGermanTax,
  stripeConfig
} from '@/lib/stripe';
import { securityLogger } from '@/lib/security';
import { z } from 'zod';
import { FEATURE_FLAGS } from '@/lib/featureFlags';

// Validation schemas
const createSubscriptionSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  couponId: z.string().optional(),
  trialPeriodDays: z.number().min(0).max(365).optional(),
  paymentMethodId: z.string().optional(),
  taxId: z.string().optional(), // German VAT ID
  billingAddress: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    state: z.string().optional(),
    country: z.string().default('DE')
  }).optional()
});

const updateSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
  action: z.enum(['cancel', 'reactivate', 'update_payment_method']),
  cancelAtPeriodEnd: z.boolean().optional(),
  newPriceId: z.string().optional(),
  paymentMethodId: z.string().optional()
});

// Create new subscription
export async function POST(request: NextRequest) {
  try {
    // Check if payments are enabled
    if (!FEATURE_FLAGS.paymentsEnabled) {
      return NextResponse.json(
        { error: 'Payments are currently disabled' },
        { status: 403 }
      );
    }
    
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
    const validatedData = createSubscriptionSchema.parse(body);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { subscriptions: true }
    }) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has an active subscription
    const activeSubscription = user.subscriptions?.find(
      (sub: any) => sub.status === 'active' || sub.status === 'trialing'
    );

    if (activeSubscription) {
      return NextResponse.json(
        { error: 'User already has an active subscription' },
        { status: 400 }
      );
    }

    let customerId = user.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await createCustomer({
        email: user.email,
        name: user.name || undefined,
        address: validatedData.billingAddress,
        taxId: validatedData.taxId,
        metadata: {
          userId: user.id,
          source: 'subscription_creation'
        }
      });

      customerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      });
    }

    // Attach payment method if provided
    if (validatedData.paymentMethodId) {
      await stripe.paymentMethods.attach(validatedData.paymentMethodId, {
        customer: customerId
      });

      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: validatedData.paymentMethodId
        }
      });
    }

    // Get price information for tax calculation
    const price = await stripe.prices.retrieve(validatedData.priceId);
    const taxInfo = calculateGermanTax(price.unit_amount || 0);

    // Create subscription
    const subscription = await createSubscription(
      customerId,
      validatedData.priceId,
      {
        couponId: validatedData.couponId,
        trialPeriodDays: validatedData.trialPeriodDays,
        metadata: {
          userId: user.id,
          taxRate: taxInfo.taxRate.toString(),
          netAmount: taxInfo.netAmount.toString(),
          taxAmount: taxInfo.taxAmount.toString()
        }
      }
    );

    // Store subscription in database
    const dbSubscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        priceId: validatedData.priceId,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        metadata: subscription.metadata as any
      }
    });

    // Get client secret for payment confirmation
    const latestInvoice = subscription.latest_invoice as any;
    const paymentIntent = latestInvoice?.payment_intent;

    securityLogger.info('subscription_creation_initiated', {
      userId: user.id,
      subscriptionId: subscription.id,
      priceId: validatedData.priceId,
      customerId,
      taxInfo
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        clientSecret: paymentIntent?.client_secret,
        currentPeriodEnd: (subscription as any).current_period_end,
        trialEnd: subscription.trial_end
      },
      taxInfo,
      dbSubscriptionId: dbSubscription.id
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    securityLogger.error('subscription_creation_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

// Get user subscriptions
export async function GET(request: NextRequest) {
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
      where: { email: session.user.email as string },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' }
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10 // Last 10 invoices
        }
      }
    }) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get detailed subscription information from Stripe
    const subscriptionsWithDetails = await Promise.all(
      user.subscriptions.map(async (sub: any) => {
        try {
          const stripeSubscription = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId, {
            expand: ['latest_invoice', 'default_payment_method']
          });

          const price = await stripe.prices.retrieve(sub.priceId, {
            expand: ['product']
          });

          const taxInfo = calculateGermanTax(price.unit_amount || 0);

          return {
            id: sub.id,
            stripeSubscriptionId: sub.stripeSubscriptionId,
            status: stripeSubscription.status,
            priceId: sub.priceId,
            productName: (price.product as any)?.name || 'Unknown Product',
            amount: price.unit_amount,
            currency: price.currency,
            interval: price.recurring?.interval,
            intervalCount: price.recurring?.interval_count,
            currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
            canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : null,
            trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
            taxInfo,
            paymentMethod: stripeSubscription.default_payment_method,
            latestInvoice: stripeSubscription.latest_invoice,
            failedPaymentCount: sub.failedPaymentCount || 0,
            lastFailedPaymentDate: sub.lastFailedPaymentDate,
            createdAt: sub.createdAt,
            updatedAt: sub.updatedAt
          };
        } catch (error) {
          securityLogger.error('subscription_retrieval_error', {
            subscriptionId: sub.stripeSubscriptionId,
            error: error instanceof Error ? error.message : 'Unknown error'
          });

          // Return basic info if Stripe call fails
          return {
            id: sub.id,
            stripeSubscriptionId: sub.stripeSubscriptionId,
            status: sub.status,
            priceId: sub.priceId,
            error: 'Failed to retrieve detailed information'
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      subscriptions: subscriptionsWithDetails,
      invoices: user.invoices,
      customer: {
        stripeCustomerId: user.stripeCustomerId,
        isPremium: user.isPremium,
        plan: user.plan
      }
    });

  } catch (error) {
    securityLogger.error('subscription_retrieval_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Subscription retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve subscriptions' },
      { status: 500 }
    );
  }
}

// Update subscription (cancel, reactivate, change plan)
export async function PATCH(request: NextRequest) {
  try {
    // Check if payments are enabled
    if (!FEATURE_FLAGS.paymentsEnabled) {
      return NextResponse.json(
        { error: 'Payments are currently disabled' },
        { status: 403 }
      );
    }
    
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
    const validatedData = updateSubscriptionSchema.parse(body);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { subscriptions: true }
    }) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the subscription
    const dbSubscription = user.subscriptions?.find(
      (sub: any) => sub.stripeSubscriptionId === validatedData.subscriptionId
    );

    if (!dbSubscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    let result;

    switch (validatedData.action) {
      case 'cancel':
        result = await cancelSubscription(
          validatedData.subscriptionId,
          validatedData.cancelAtPeriodEnd ?? true
        );

        // Update database
        await prisma.subscription.update({
          where: { id: dbSubscription.id },
          data: {
            status: result.status,
            cancelAtPeriodEnd: result.cancel_at_period_end,
            canceledAt: result.canceled_at ? new Date(result.canceled_at * 1000) : null
          }
        });

        // Update user premium status if cancelled immediately
        if (!result.cancel_at_period_end) {
          await prisma.user.update({
            where: { id: user.id },
            data: { isPremium: false }
          });
        }

        securityLogger.info('subscription_cancelled', {
          userId: user.id,
          subscriptionId: validatedData.subscriptionId,
          cancelAtPeriodEnd: validatedData.cancelAtPeriodEnd
        });
        break;

      case 'reactivate':
        result = await reactivateSubscription(validatedData.subscriptionId);

        // Update database
        await prisma.subscription.update({
          where: { id: dbSubscription.id },
          data: {
            status: result.status,
            cancelAtPeriodEnd: false,
            canceledAt: null
          }
        });

        // Update user premium status
        await prisma.user.update({
          where: { id: user.id },
          data: { isPremium: true }
        });

        securityLogger.info('subscription_reactivated', {
          userId: user.id,
          subscriptionId: validatedData.subscriptionId
        });
        break;

      case 'update_payment_method':
        if (!validatedData.paymentMethodId) {
          return NextResponse.json(
            { error: 'Payment method ID is required for this action' },
            { status: 400 }
          );
        }

        // Attach payment method to customer
        await stripe.paymentMethods.attach(validatedData.paymentMethodId, {
          customer: user.stripeCustomerId
        });

        // Update subscription's default payment method
        result = await stripe.subscriptions.update(validatedData.subscriptionId, {
          default_payment_method: validatedData.paymentMethodId
        });

        // Update customer's default payment method
        await stripe.customers.update(user.stripeCustomerId, {
          invoice_settings: {
            default_payment_method: validatedData.paymentMethodId
          }
        });

        securityLogger.info('subscription_payment_method_updated', {
          userId: user.id,
          subscriptionId: validatedData.subscriptionId,
          paymentMethodId: validatedData.paymentMethodId
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
      subscription: {
        id: result.id,
        status: result.status,
        cancelAtPeriodEnd: result.cancel_at_period_end,
        currentPeriodEnd: (result as any).current_period_end,
        canceledAt: result.canceled_at
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

    securityLogger.error('subscription_update_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Subscription update error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}