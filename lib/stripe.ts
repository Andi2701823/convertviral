import Stripe from 'stripe';
import { securityLogger } from './security';

// Lazy initialization of Stripe client to handle build-time scenarios
let _stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  if (_stripe) {
    return _stripe;
  }
  
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!secretKey) {
    // During build time or when env vars are missing
    if (process.env.NODE_ENV === 'production') {
      throw new Error('STRIPE_SECRET_KEY environment variable is required for production');
    }
    
    // For development, create a placeholder that will work for build but fail at runtime
    console.warn('STRIPE_SECRET_KEY not found. Using placeholder for development.');
    _stripe = new Stripe('sk_test_placeholder_for_build', {
      apiVersion: '2025-06-30.basil',
      typescript: true
    });
  } else {
    _stripe = new Stripe(secretKey, {
      apiVersion: '2025-06-30.basil',
      typescript: true
    });
  }
  
  return _stripe;
}

// Export a proxy object that lazily initializes the Stripe client
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    const client = getStripeClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

// Deutschland-spezifische Konfiguration
export const stripeConfig = {
  country: 'DE',
  currency: 'eur',
  paymentMethods: ['card', 'sepa_debit', 'sofort', 'giropay', 'klarna'],
  taxRates: {
    germany: process.env.STRIPE_GERMANY_TAX_RATE_ID || 'txr_1234567890', // 19% MwSt
    reducedGermany: process.env.STRIPE_GERMANY_REDUCED_TAX_RATE_ID || 'txr_0987654321', // 7% MwSt
  },
  vatSettings: {
    standardRate: 0.19, // 19%
    reducedRate: 0.07,  // 7%
    exemptRate: 0.00,   // 0%
  }
};

// German tax calculation helper
export function calculateGermanTax(amount: number, isReduced: boolean = false): {
  netAmount: number;
  taxAmount: number;
  grossAmount: number;
  taxRate: number;
} {
  const taxRate = isReduced ? stripeConfig.vatSettings.reducedRate : stripeConfig.vatSettings.standardRate;
  const netAmount = Math.round(amount / (1 + taxRate));
  const taxAmount = amount - netAmount;
  
  return {
    netAmount,
    taxAmount,
    grossAmount: amount,
    taxRate
  };
}

// Enhanced subscription creation with German tax handling
export async function createSubscription(
  customerId: string, 
  priceId: string, 
  options: {
    couponId?: string;
    trialPeriodDays?: number;
    metadata?: Record<string, string>;
    automaticTax?: boolean;
  } = {}
) {
  try {
    const subscriptionData: Stripe.SubscriptionCreateParams = {
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { 
        save_default_payment_method: 'on_subscription',
        payment_method_types: stripeConfig.paymentMethods as Stripe.SubscriptionCreateParams.PaymentSettings.PaymentMethodType[]
      },
      expand: ['latest_invoice.payment_intent'],
      automatic_tax: { enabled: options.automaticTax ?? true },
      collection_method: 'charge_automatically',
      metadata: {
        country: 'DE',
        tax_type: 'vat',
        ...options.metadata
      }
    };

    // Add coupon if provided
    if (options.couponId) {
      subscriptionData.discounts = [{ coupon: options.couponId }];
    }

    // Add trial period if provided
    if (options.trialPeriodDays) {
      subscriptionData.trial_period_days = options.trialPeriodDays;
    }

    const subscription = await stripe.subscriptions.create(subscriptionData);
    
    securityLogger.info('subscription_created', {
      customerId,
      subscriptionId: subscription.id,
      priceId,
      country: 'DE'
    });

    return subscription;
  } catch (error) {
    securityLogger.error('subscription_creation_failed', {
      customerId,
      priceId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Create customer with German-specific settings
export async function createCustomer({
  email,
  name,
  address,
  taxId,
  metadata = {}
}: {
  email: string;
  name?: string;
  address?: Stripe.AddressParam;
  taxId?: string;
  metadata?: Record<string, string>;
}) {
  try {
    const customerData: Stripe.CustomerCreateParams = {
      email,
      name,
      address: address || {
        country: 'DE'
      },
      metadata: {
        country: 'DE',
        tax_exempt: 'none',
        ...metadata
      },
      tax: {
        validate_location: 'immediately'
      }
    };

    // Add German tax ID if provided
    if (taxId) {
      customerData.tax_id_data = [{
        type: 'eu_vat',
        value: taxId
      }];
    }

    const customer = await stripe.customers.create(customerData);
    
    securityLogger.info('customer_created', {
      customerId: customer.id,
      email,
      country: 'DE'
    });

    return customer;
  } catch (error) {
    securityLogger.error('customer_creation_failed', {
      email,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Enhanced invoice generation with German requirements
export async function generateInvoice(
  customerId: string,
  items: Array<{
    description: string;
    amount: number;
    quantity?: number;
    taxRateId?: string;
  }>,
  options: {
    dueDate?: Date;
    metadata?: Record<string, string>;
    autoAdvance?: boolean;
  } = {}
) {
  try {
    const invoiceItems = items.map(item => ({
      customer: customerId,
      amount: item.amount,
      currency: stripeConfig.currency,
      description: item.description,
      quantity: item.quantity || 1,
      tax_rates: item.taxRateId ? [item.taxRateId] : [stripeConfig.taxRates.germany]
    }));

    // Create invoice items
    for (const item of invoiceItems) {
      await stripe.invoiceItems.create(item);
    }

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: 'charge_automatically',
      auto_advance: options.autoAdvance ?? true,
      due_date: options.dueDate ? Math.floor(options.dueDate.getTime() / 1000) : undefined,
      metadata: {
        country: 'DE',
        invoice_type: 'standard',
        ...options.metadata
      }
    });

    securityLogger.info('invoice_generated', {
      customerId,
      invoiceId: invoice.id,
      amount: invoice.amount_due
    });

    return invoice;
  } catch (error) {
    securityLogger.error('invoice_generation_failed', {
      customerId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Payment retry logic
export async function retryFailedPayment(
  paymentIntentId: string,
  maxRetries: number = 3
): Promise<Stripe.PaymentIntent> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      
      securityLogger.info('payment_retry_success', {
        paymentIntentId,
        attempt,
        status: paymentIntent.status
      });
      
      return paymentIntent;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      securityLogger.warn('payment_retry_failed', {
        paymentIntentId,
        attempt,
        error: lastError.message
      });
      
      if (attempt < maxRetries) {
        // Exponential backoff: wait 2^attempt seconds
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError || new Error('Payment retry failed');
}

// Subscription management helpers
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd,
      metadata: {
        cancellation_date: new Date().toISOString(),
        cancelled_by: 'customer'
      }
    });

    securityLogger.info('subscription_cancelled', {
      subscriptionId,
      cancelAtPeriodEnd,
      currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : undefined
    });

    return subscription;
  } catch (error) {
    securityLogger.error('subscription_cancellation_failed', {
      subscriptionId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

export async function reactivateSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
      metadata: {
        reactivation_date: new Date().toISOString()
      }
    });

    securityLogger.info('subscription_reactivated', {
      subscriptionId
    });

    return subscription;
  } catch (error) {
    securityLogger.error('subscription_reactivation_failed', {
      subscriptionId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}