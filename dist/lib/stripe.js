"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeConfig = exports.stripe = void 0;
exports.calculateGermanTax = calculateGermanTax;
exports.createSubscription = createSubscription;
exports.createCustomer = createCustomer;
exports.generateInvoice = generateInvoice;
exports.retryFailedPayment = retryFailedPayment;
exports.cancelSubscription = cancelSubscription;
exports.reactivateSubscription = reactivateSubscription;
const stripe_1 = __importDefault(require("stripe"));
const security_1 = require("./security");
// Lazy initialization of Stripe client to handle build-time scenarios
let _stripe = null;
function getStripeClient() {
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
        _stripe = new stripe_1.default('sk_test_placeholder_for_build', {
            apiVersion: '2025-06-30.basil',
            typescript: true
        });
    }
    else {
        _stripe = new stripe_1.default(secretKey, {
            apiVersion: '2025-06-30.basil',
            typescript: true
        });
    }
    return _stripe;
}
// Export a proxy object that lazily initializes the Stripe client
exports.stripe = new Proxy({}, {
    get(target, prop) {
        const client = getStripeClient();
        const value = client[prop];
        return typeof value === 'function' ? value.bind(client) : value;
    }
});
// Deutschland-spezifische Konfiguration
exports.stripeConfig = {
    country: 'DE',
    currency: 'eur',
    paymentMethods: ['card', 'sepa_debit', 'sofort', 'giropay', 'klarna'],
    taxRates: {
        germany: process.env.STRIPE_GERMANY_TAX_RATE_ID || 'txr_1234567890', // 19% MwSt
        reducedGermany: process.env.STRIPE_GERMANY_REDUCED_TAX_RATE_ID || 'txr_0987654321', // 7% MwSt
    },
    vatSettings: {
        standardRate: 0.19, // 19%
        reducedRate: 0.07, // 7%
        exemptRate: 0.00, // 0%
    }
};
// German tax calculation helper
function calculateGermanTax(amount, isReduced = false) {
    const taxRate = isReduced ? exports.stripeConfig.vatSettings.reducedRate : exports.stripeConfig.vatSettings.standardRate;
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
async function createSubscription(customerId, priceId, options = {}) {
    try {
        const subscriptionData = {
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            payment_settings: {
                save_default_payment_method: 'on_subscription',
                payment_method_types: exports.stripeConfig.paymentMethods
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
        const subscription = await exports.stripe.subscriptions.create(subscriptionData);
        security_1.securityLogger.info('subscription_created', {
            customerId,
            subscriptionId: subscription.id,
            priceId,
            country: 'DE'
        });
        return subscription;
    }
    catch (error) {
        security_1.securityLogger.error('subscription_creation_failed', {
            customerId,
            priceId,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
    }
}
// Create customer with German-specific settings
async function createCustomer({ email, name, address, taxId, metadata = {} }) {
    try {
        const customerData = {
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
        const customer = await exports.stripe.customers.create(customerData);
        security_1.securityLogger.info('customer_created', {
            customerId: customer.id,
            email,
            country: 'DE'
        });
        return customer;
    }
    catch (error) {
        security_1.securityLogger.error('customer_creation_failed', {
            email,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
    }
}
// Enhanced invoice generation with German requirements
async function generateInvoice(customerId, items, options = {}) {
    try {
        const invoiceItems = items.map(item => ({
            customer: customerId,
            amount: item.amount,
            currency: exports.stripeConfig.currency,
            description: item.description,
            quantity: item.quantity || 1,
            tax_rates: item.taxRateId ? [item.taxRateId] : [exports.stripeConfig.taxRates.germany]
        }));
        // Create invoice items
        for (const item of invoiceItems) {
            await exports.stripe.invoiceItems.create(item);
        }
        // Create invoice
        const invoice = await exports.stripe.invoices.create({
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
        security_1.securityLogger.info('invoice_generated', {
            customerId,
            invoiceId: invoice.id,
            amount: invoice.amount_due
        });
        return invoice;
    }
    catch (error) {
        security_1.securityLogger.error('invoice_generation_failed', {
            customerId,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
    }
}
// Payment retry logic
async function retryFailedPayment(paymentIntentId, maxRetries = 3) {
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const paymentIntent = await exports.stripe.paymentIntents.confirm(paymentIntentId);
            security_1.securityLogger.info('payment_retry_success', {
                paymentIntentId,
                attempt,
                status: paymentIntent.status
            });
            return paymentIntent;
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
            security_1.securityLogger.warn('payment_retry_failed', {
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
async function cancelSubscription(subscriptionId, cancelAtPeriodEnd = true) {
    try {
        const subscription = await exports.stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: cancelAtPeriodEnd,
            metadata: {
                cancellation_date: new Date().toISOString(),
                cancelled_by: 'customer'
            }
        });
        security_1.securityLogger.info('subscription_cancelled', {
            subscriptionId,
            cancelAtPeriodEnd,
            currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : undefined
        });
        return subscription;
    }
    catch (error) {
        security_1.securityLogger.error('subscription_cancellation_failed', {
            subscriptionId,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
    }
}
async function reactivateSubscription(subscriptionId) {
    try {
        const subscription = await exports.stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: false,
            metadata: {
                reactivation_date: new Date().toISOString()
            }
        });
        security_1.securityLogger.info('subscription_reactivated', {
            subscriptionId
        });
        return subscription;
    }
    catch (error) {
        security_1.securityLogger.error('subscription_reactivation_failed', {
            subscriptionId,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
    }
}
