import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { stripe, createCustomer, calculateGermanTax, stripeConfig } from '@/lib/stripe';
import { securityLogger } from '@/lib/security';
import { z } from 'zod';
import { FEATURE_FLAGS } from '@/lib/featureFlags';

// Validation schemas
const createCheckoutSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  mode: z.enum(['payment', 'subscription', 'setup']).default('subscription'),
  successUrl: z.string().url('Valid success URL is required'),
  cancelUrl: z.string().url('Valid cancel URL is required'),
  couponId: z.string().optional(),
  trialPeriodDays: z.number().min(0).max(365).optional(),
  allowPromotionCodes: z.boolean().default(true),
  billingAddressCollection: z.enum(['auto', 'required']).default('required'),
  taxIdCollection: z.object({
    enabled: z.boolean().default(true),
    required: z.enum(['if_supported', 'never']).default('if_supported')
  }).optional(),
  customerEmail: z.string().email().optional(),
  metadata: z.record(z.string()).optional(),
  locale: z.enum(['de', 'en', 'auto']).default('auto'),
  paymentMethodTypes: z.array(z.enum(['card', 'sepa_debit', 'giropay', 'sofort'])).default(['card', 'sepa_debit']),
  customFields: z.array(z.object({
    key: z.string(),
    label: z.object({
      type: z.literal('custom'),
      custom: z.string()
    }),
    type: z.enum(['dropdown', 'numeric', 'text']),
    optional: z.boolean().default(false)
  })).optional(),
  consentCollection: z.object({
    termsOfService: z.enum(['none', 'required']).default('required'),
    promotions: z.enum(['none', 'auto']).default('auto')
  }).optional()
});

const retrieveSessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required')
});

// Create checkout session
export async function POST(request: NextRequest) {
  // Check if payments are enabled
  if (!FEATURE_FLAGS.paymentsEnabled) {
    securityLogger.warn('checkout_payments_disabled', {
      message: 'Payments are currently disabled via feature flags'
    });
    return NextResponse.json(
      { error: 'Payments are currently disabled' },
      { status: 403 }
    );
  }
  
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = createCheckoutSchema.parse(body);

    // Get session for user context (optional for checkout)
    const session = await getServerSession(authOptions);
    let user = null;
    let customerId = null;

    if (session?.user) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email as string }
      }) as any;

      if (user) {
        customerId = user.stripeCustomerId;

        // Create Stripe customer if doesn't exist
        if (!customerId) {
          const customer = await createCustomer({
            email: user.email,
            name: user.name || undefined,
            metadata: {
              userId: user.id,
              source: 'checkout_session'
            }
          });

          customerId = customer.id;

          // Update user with Stripe customer ID
          await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customerId }
          });
        }
      }
    }

    // Get price information for tax calculation
    const price = await stripe.prices.retrieve(validatedData.priceId, {
      expand: ['product']
    });

    const taxInfo = calculateGermanTax(price.unit_amount || 0);
    const product = price.product as any;

    // Build checkout session parameters
    const checkoutParams: any = {
      mode: validatedData.mode,
      success_url: validatedData.successUrl,
      cancel_url: validatedData.cancelUrl,
      billing_address_collection: validatedData.billingAddressCollection,
      allow_promotion_codes: validatedData.allowPromotionCodes,
      payment_method_types: validatedData.paymentMethodTypes,
      locale: validatedData.locale === 'auto' ? undefined : validatedData.locale,
      
      // German tax configuration
      automatic_tax: {
        enabled: true
      },
      
      // Tax ID collection for German businesses
      tax_id_collection: validatedData.taxIdCollection || {
        enabled: true,
        required: 'if_supported'
      },
      
      // Consent collection for GDPR compliance
      consent_collection: validatedData.consentCollection || {
        terms_of_service: 'required',
        promotions: 'auto'
      },
      
      // Customer information
      customer: customerId,
      customer_email: !customerId ? (validatedData.customerEmail || session?.user?.email) : undefined,
      
      // Metadata
      metadata: {
        userId: user?.id || 'anonymous',
        priceId: validatedData.priceId,
        productName: product?.name || 'Unknown Product',
        taxRate: taxInfo.taxRate.toString(),
        netAmount: taxInfo.netAmount.toString(),
        taxAmount: taxInfo.taxAmount.toString(),
        grossAmount: taxInfo.grossAmount.toString(),
        ...validatedData.metadata
      },
      
      // Custom fields for additional information
      custom_fields: validatedData.customFields,
      
      // Phone number collection for German compliance
      phone_number_collection: {
        enabled: true
      }
    };

    // Configure line items based on mode
    if (validatedData.mode === 'subscription') {
      checkoutParams.line_items = [{
        price: validatedData.priceId,
        quantity: 1
      }];
      
      // Add trial period if specified
      if (validatedData.trialPeriodDays) {
        checkoutParams.subscription_data = {
          trial_period_days: validatedData.trialPeriodDays,
          metadata: checkoutParams.metadata
        };
      }
      
      // Add coupon if specified
      if (validatedData.couponId) {
        if (checkoutParams.subscription_data) {
          checkoutParams.subscription_data.coupon = validatedData.couponId;
        } else {
          checkoutParams.subscription_data = {
            coupon: validatedData.couponId,
            metadata: checkoutParams.metadata
          };
        }
      }
    } else if (validatedData.mode === 'payment') {
      checkoutParams.line_items = [{
        price: validatedData.priceId,
        quantity: 1
      }];
      
      // Add coupon for one-time payments
      if (validatedData.couponId) {
        checkoutParams.discounts = [{
          coupon: validatedData.couponId
        }];
      }
      
      checkoutParams.payment_intent_data = {
        metadata: checkoutParams.metadata
      };
    }

    // Create the checkout session
    const checkoutSession = await stripe.checkout.sessions.create(checkoutParams);

    // Store checkout session in database for tracking
    const dbCheckoutSession = await prisma.checkoutSession.create({
      data: {
        userId: user?.id,
        stripeSessionId: checkoutSession.id,
        mode: validatedData.mode,
        status: 'open',
        priceId: validatedData.priceId,
        amount: price.unit_amount,
        currency: price.currency,
        successUrl: validatedData.successUrl,
        cancelUrl: validatedData.cancelUrl,
        metadata: checkoutParams.metadata as any
      }
    });

    securityLogger.info('checkout_session_created', {
      userId: user?.id || 'anonymous',
      sessionId: checkoutSession.id,
      mode: validatedData.mode,
      priceId: validatedData.priceId,
      amount: price.unit_amount,
      currency: price.currency,
      customerId,
      taxInfo
    });

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      mode: checkoutSession.mode,
      customer: checkoutSession.customer,
      paymentStatus: checkoutSession.payment_status,
      taxInfo,
      product: {
        id: product?.id,
        name: product?.name,
        description: product?.description
      },
      price: {
        id: price.id,
        unitAmount: price.unit_amount,
        currency: price.currency,
        recurring: price.recurring
      },
      dbSessionId: dbCheckoutSession.id
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    securityLogger.error('checkout_session_creation_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Retrieve checkout session
export async function GET(request: NextRequest) {
  // Check if payments are enabled
  if (!FEATURE_FLAGS.paymentsEnabled) {
    securityLogger.warn('checkout_get_payments_disabled', {
      message: 'Payments are currently disabled via feature flags'
    });
    return NextResponse.json(
      { error: 'Payments are currently disabled' },
      { status: 403 }
    );
  }
  
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Validate session ID
    const validatedData = retrieveSessionSchema.parse({ sessionId });

    // Get session for user context (optional)
    const session = await getServerSession(authOptions);
    let user = null;

    if (session?.user) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email as string }
      }) as any;
    }

    // Retrieve checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      validatedData.sessionId,
      {
        expand: [
          'line_items',
          'line_items.data.price.product',
          'payment_intent',
          'subscription',
          'customer'
        ]
      }
    );

    // Get database record
    const dbSession = await prisma.checkoutSession.findFirst({
      where: {
        stripeSessionId: validatedData.sessionId,
        ...(user ? { userId: user.id } : {})
      }
    });

    // Calculate tax information from line items
    let taxInfo = null;
    if (checkoutSession.line_items?.data?.[0]) {
      const lineItem = checkoutSession.line_items.data[0];
      const amount = lineItem.amount_total || 0;
      taxInfo = calculateGermanTax(amount);
    }

    // Format response
    const formattedSession = {
      id: checkoutSession.id,
      mode: checkoutSession.mode,
      status: checkoutSession.status,
      paymentStatus: checkoutSession.payment_status,
      customer: checkoutSession.customer,
      customerEmail: checkoutSession.customer_details?.email,
      customerName: checkoutSession.customer_details?.name,
      customerPhone: checkoutSession.customer_details?.phone,
      billingAddress: checkoutSession.customer_details?.address,
      taxIds: checkoutSession.customer_details?.tax_ids,
      amountSubtotal: checkoutSession.amount_subtotal,
      amountTotal: checkoutSession.amount_total,
      currency: checkoutSession.currency,
      paymentIntent: checkoutSession.payment_intent,
      subscription: checkoutSession.subscription,
      successUrl: checkoutSession.success_url,
      cancelUrl: checkoutSession.cancel_url,
      created: checkoutSession.created,
      expiresAt: checkoutSession.expires_at,
      metadata: checkoutSession.metadata,
      lineItems: checkoutSession.line_items?.data?.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        amountSubtotal: item.amount_subtotal,
        amountTotal: item.amount_total,
        amountDiscount: item.amount_discount,
        currency: item.currency,
        price: {
          id: item.price?.id,
          unitAmount: item.price?.unit_amount,
          currency: item.price?.currency,
          recurring: item.price?.recurring,
          product: {
            id: (item.price?.product as any)?.id,
            name: (item.price?.product as any)?.name,
            description: (item.price?.product as any)?.description
          }
        }
      })) || [],
      taxInfo,
      // Database-specific fields
      dbId: dbSession?.id,
      dbCreatedAt: dbSession?.createdAt,
      dbUpdatedAt: dbSession?.updatedAt
    };

    securityLogger.info('checkout_session_retrieved', {
      userId: user?.id || 'anonymous',
      sessionId: validatedData.sessionId,
      status: checkoutSession.status,
      paymentStatus: checkoutSession.payment_status
    });

    return NextResponse.json({
      success: true,
      session: formattedSession
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    securityLogger.error('checkout_session_retrieval_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Checkout session retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve checkout session' },
      { status: 500 }
    );
  }
}

// Update checkout session (limited operations)
export async function PATCH(request: NextRequest) {
  // Check if payments are enabled
  if (!FEATURE_FLAGS.paymentsEnabled) {
    securityLogger.warn('checkout_patch_payments_disabled', {
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

    // Parse request body
    const body = await request.json();
    const { sessionId, action, ...actionData } = body;

    if (!sessionId || !action) {
      return NextResponse.json(
        { error: 'Session ID and action are required' },
        { status: 400 }
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

    // Verify session belongs to user
    const dbSession = await prisma.checkoutSession.findFirst({
      where: {
        stripeSessionId: sessionId,
        userId: user.id
      }
    });

    if (!dbSession) {
      return NextResponse.json(
        { error: 'Checkout session not found' },
        { status: 404 }
      );
    }

    let result;

    switch (action) {
      case 'expire':
        result = await stripe.checkout.sessions.expire(sessionId);
        
        // Update database
        await prisma.checkoutSession.update({
          where: { id: dbSession.id },
          data: { status: 'expired' }
        });
        
        securityLogger.info('checkout_session_expired', {
          userId: user.id,
          sessionId
        });
        break;

      case 'update_metadata':
        // Note: Stripe doesn't allow updating checkout sessions after creation
        // This would update our database record only
        await prisma.checkoutSession.update({
          where: { id: dbSession.id },
          data: {
            metadata: {
              ...dbSession.metadata as any,
              ...actionData.metadata
            }
          }
        });
        
        result = { success: true, action: 'metadata_updated' };
        
        securityLogger.info('checkout_session_metadata_updated', {
          userId: user.id,
          sessionId
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
      result,
      action
    });

  } catch (error) {
    securityLogger.error('checkout_session_update_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Checkout session update error:', error);
    return NextResponse.json(
      { error: 'Failed to update checkout session' },
      { status: 500 }
    );
  }
}