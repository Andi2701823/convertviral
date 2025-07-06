import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { stripe, calculateGermanTax } from '@/lib/stripe';
import { securityLogger } from '@/lib/security';
import { z } from 'zod';
import { FEATURE_FLAGS } from '@/lib/featureFlags';

// Validation schema for query parameters
const dashboardQuerySchema = z.object({
  includeInvoices: z.string().transform(val => val === 'true').default('true'),
  includePaymentMethods: z.string().transform(val => val === 'true').default('true'),
  includeUsage: z.string().transform(val => val === 'true').default('true'),
  invoiceLimit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(50)).default('10'),
  period: z.enum(['current', 'last_30_days', 'last_90_days', 'year_to_date']).default('current')
});

// Get comprehensive billing dashboard data
export async function GET(request: NextRequest) {
  try {
    // Check if payments are enabled
    if (!FEATURE_FLAGS.paymentsEnabled) {
      return NextResponse.json(
        { error: 'Payment functionality is currently disabled' },
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

    // Parse query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const validatedQuery = dashboardQuerySchema.parse(queryParams);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' }
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: validatedQuery.invoiceLimit
        }
      }
    }) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize dashboard data
    const dashboardData: any = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium: user.isPremium,
        plan: user.plan,
        stripeCustomerId: user.stripeCustomerId,
        createdAt: user.createdAt
      },
      subscriptions: [],
      invoices: [],
      paymentMethods: [],
      usage: null,
      billing: {
        nextBillingDate: null,
        currentPeriodEnd: null,
        amountDue: 0,
        currency: 'eur',
        taxRate: '19%',
        billingAddress: null,
        taxId: null
      },
      summary: {
        totalSpent: 0,
        totalInvoices: 0,
        activeSubscriptions: 0,
        failedPayments: 0,
        nextPaymentAmount: 0,
        currentMonthSpending: 0
      }
    };

    // If user has no Stripe customer ID, return basic data
    if (!user.stripeCustomerId) {
      return NextResponse.json({
        success: true,
        dashboard: dashboardData
      });
    }

    // Get customer details from Stripe
    const customer = await stripe.customers.retrieve(user.stripeCustomerId, {
      expand: ['tax_ids', 'invoice_settings.default_payment_method']
    }) as any;

    // Update billing information
    dashboardData.billing.billingAddress = customer.address;
    dashboardData.billing.taxId = customer.tax_ids?.data?.[0]?.value || null;

    // Get active subscriptions with detailed information
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'all',
      expand: ['data.latest_invoice', 'data.default_payment_method', 'data.items.data.price.product']
    });

    // Process subscriptions
    for (const stripeSub of stripeSubscriptions.data) {
      const dbSub = user.subscriptions?.find((s: any) => s.stripeSubscriptionId === stripeSub.id);
      
      // Get price and tax information
      const price = stripeSub.items.data[0]?.price;
      const taxInfo = price ? calculateGermanTax(price.unit_amount || 0) : null;
      
      const subscriptionData = {
        id: stripeSub.id,
        dbId: dbSub?.id,
        status: stripeSub.status,
        priceId: price?.id,
        productName: (price?.product as any)?.name || 'Unknown Product',
        amount: price?.unit_amount,
        currency: price?.currency,
        interval: price?.recurring?.interval,
        intervalCount: price?.recurring?.interval_count,
        currentPeriodStart: new Date((stripeSub as any).current_period_start * 1000),
        currentPeriodEnd: new Date((stripeSub as any).current_period_end * 1000),
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
        canceledAt: stripeSub.canceled_at ? new Date(stripeSub.canceled_at * 1000) : null,
        trialEnd: stripeSub.trial_end ? new Date(stripeSub.trial_end * 1000) : null,
        defaultPaymentMethod: stripeSub.default_payment_method,
        latestInvoice: stripeSub.latest_invoice,
        taxInfo,
        createdAt: new Date(stripeSub.created * 1000),
        metadata: stripeSub.metadata
      };
      
      dashboardData.subscriptions.push(subscriptionData);
      
      // Update summary for active subscriptions
      if (stripeSub.status === 'active' || stripeSub.status === 'trialing') {
        dashboardData.summary.activeSubscriptions++;
        dashboardData.summary.nextPaymentAmount += price?.unit_amount || 0;
        
        // Set next billing date
        if (!dashboardData.billing.nextBillingDate || 
            (stripeSub as any).current_period_end < dashboardData.billing.nextBillingDate) {
          dashboardData.billing.nextBillingDate = new Date((stripeSub as any).current_period_end * 1000);
          dashboardData.billing.currentPeriodEnd = new Date((stripeSub as any).current_period_end * 1000);
        }
      }
    }

    // Get invoices if requested
    if (validatedQuery.includeInvoices) {
      const stripeInvoices = await stripe.invoices.list({
        customer: user.stripeCustomerId,
        limit: validatedQuery.invoiceLimit,
        expand: ['data.payment_intent', 'data.subscription']
      });

      for (const stripeInv of stripeInvoices.data) {
        const dbInv = user.invoices?.find((i: any) => i.stripeInvoiceId === stripeInv.id);
        
        const invoiceData = {
          id: stripeInv.id,
          dbId: dbInv?.id,
          number: stripeInv.number,
          status: stripeInv.status,
          amountDue: stripeInv.amount_due,
          amountPaid: stripeInv.amount_paid,
          subtotal: stripeInv.subtotal,
          total: stripeInv.total,
          tax: (stripeInv as any).tax,
          currency: stripeInv.currency,
          created: new Date(stripeInv.created * 1000),
          dueDate: stripeInv.due_date ? new Date(stripeInv.due_date * 1000) : null,
          paidAt: stripeInv.status_transitions?.paid_at ? new Date(stripeInv.status_transitions.paid_at * 1000) : null,
          hostedInvoiceUrl: stripeInv.hosted_invoice_url,
          invoicePdf: stripeInv.invoice_pdf,
          subscription: (stripeInv as any).subscription,
          paymentIntent: (stripeInv as any).payment_intent,
          attemptCount: stripeInv.attempt_count,
          nextPaymentAttempt: stripeInv.next_payment_attempt ? new Date(stripeInv.next_payment_attempt * 1000) : null,
          taxBreakdown: {
            subtotal: stripeInv.subtotal || 0,
            tax: (stripeInv as any).tax || 0,
            total: stripeInv.total || 0,
            taxRate: (stripeInv as any).tax && stripeInv.subtotal ? 
              (((stripeInv as any).tax / stripeInv.subtotal) * 100).toFixed(2) + '%' : '0%'
          }
        };
        
        dashboardData.invoices.push(invoiceData);
        
        // Update summary
        dashboardData.summary.totalInvoices++;
        if (stripeInv.status === 'paid') {
          dashboardData.summary.totalSpent += stripeInv.amount_paid || 0;
        }
        if (stripeInv.status === 'open' && stripeInv.attempt_count > 1) {
          dashboardData.summary.failedPayments++;
        }
        
        // Calculate current month spending
        const invoiceDate = new Date(stripeInv.created * 1000);
        const currentMonth = new Date();
        if (invoiceDate.getMonth() === currentMonth.getMonth() && 
            invoiceDate.getFullYear() === currentMonth.getFullYear() &&
            stripeInv.status === 'paid') {
          dashboardData.summary.currentMonthSpending += stripeInv.amount_paid || 0;
        }
      }
    }

    // Get payment methods if requested
    if (validatedQuery.includePaymentMethods) {
      const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method;
      
      // Get card payment methods
      const cardPaymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card'
      });
      
      // Get SEPA debit payment methods
      const sepaPaymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'sepa_debit'
      });
      
      const allPaymentMethods = [...cardPaymentMethods.data, ...sepaPaymentMethods.data];
      
      dashboardData.paymentMethods = allPaymentMethods.map(pm => ({
        id: pm.id,
        type: pm.type,
        card: pm.card ? {
          brand: pm.card.brand,
          last4: pm.card.last4,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year,
          country: pm.card.country,
          funding: pm.card.funding
        } : null,
        sepaDebit: pm.sepa_debit ? {
          last4: pm.sepa_debit.last4,
          country: pm.sepa_debit.country,
          bankCode: pm.sepa_debit.bank_code
        } : null,
        billingDetails: pm.billing_details,
        created: new Date(pm.created * 1000),
        isDefault: pm.id === defaultPaymentMethodId
      }));
    }

    // Get usage data if requested
    if (validatedQuery.includeUsage) {
      // Calculate usage based on conversion history
      const usageData = await prisma.conversionHistory.aggregate({
        where: {
          userId: user.id,
          createdAt: {
            gte: getStartDateForPeriod(validatedQuery.period)
          }
        },
        _count: {
          id: true
        },
        _sum: {
          fileSize: true
        }
      });
      
      dashboardData.usage = {
        period: validatedQuery.period,
        conversions: usageData._count.id || 0,
        totalFileSize: usageData._sum.fileSize || 0,
        // Add plan limits based on user's subscription
        limits: getPlanLimits(user.plan),
        usagePercentage: calculateUsagePercentage(usageData._count.id || 0, user.plan)
      };
    }

    // Calculate amounts due
    const openInvoices = dashboardData.invoices.filter((inv: any) => inv.status === 'open');
    dashboardData.billing.amountDue = openInvoices.reduce((sum: number, inv: any) => sum + (inv.amountDue || 0), 0);

    securityLogger.info('billing_dashboard_accessed', {
      userId: user.id,
      includeInvoices: validatedQuery.includeInvoices,
      includePaymentMethods: validatedQuery.includePaymentMethods,
      includeUsage: validatedQuery.includeUsage
    });

    return NextResponse.json({
      success: true,
      dashboard: dashboardData
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    securityLogger.error('billing_dashboard_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Billing dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve billing dashboard' },
      { status: 500 }
    );
  }
}

// Helper function to get start date for different periods
function getStartDateForPeriod(period: string): Date {
  const now = new Date();
  
  switch (period) {
    case 'current':
      return new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
    case 'last_30_days':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'last_90_days':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case 'year_to_date':
      return new Date(now.getFullYear(), 0, 1); // Start of current year
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

// Helper function to get plan limits
function getPlanLimits(plan: string) {
  switch (plan) {
    case 'free':
      return {
        conversionsPerMonth: 10,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        batchConversions: false,
        prioritySupport: false
      };
    case 'premium':
      return {
        conversionsPerMonth: 1000,
        maxFileSize: 100 * 1024 * 1024, // 100MB
        batchConversions: true,
        prioritySupport: true
      };
    case 'enterprise':
      return {
        conversionsPerMonth: -1, // Unlimited
        maxFileSize: 1024 * 1024 * 1024, // 1GB
        batchConversions: true,
        prioritySupport: true
      };
    default:
      return {
        conversionsPerMonth: 10,
        maxFileSize: 10 * 1024 * 1024,
        batchConversions: false,
        prioritySupport: false
      };
  }
}

// Helper function to calculate usage percentage
function calculateUsagePercentage(usage: number, plan: string): number {
  const limits = getPlanLimits(plan);
  
  if (limits.conversionsPerMonth === -1) {
    return 0; // Unlimited plan
  }
  
  return Math.min(100, (usage / limits.conversionsPerMonth) * 100);
}

// Get billing summary for quick overview
export async function POST(request: NextRequest) {
  try {
    // Check if payments are enabled
    if (!FEATURE_FLAGS.paymentsEnabled) {
      return NextResponse.json(
        { error: 'Payment functionality is currently disabled' },
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

    // Quick summary without detailed data
    const summary = {
      hasActiveSubscription: false,
      nextBillingDate: null,
      nextBillingAmount: 0,
      currency: 'eur',
      plan: user.plan,
      isPremium: user.isPremium,
      hasPaymentMethod: false,
      pendingInvoices: 0,
      pendingAmount: 0
    };

    if (user.stripeCustomerId) {
      // Get active subscriptions
      const activeSubscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
        limit: 1
      });

      if (activeSubscriptions.data.length > 0) {
        const subscription = activeSubscriptions.data[0];
        summary.hasActiveSubscription = true;
        (summary as any).nextBillingDate = new Date((subscription as any).current_period_end * 1000);
        
        // Get price for billing amount
        const price = subscription.items.data[0]?.price;
        if (price) {
          const taxInfo = calculateGermanTax(price.unit_amount || 0);
          summary.nextBillingAmount = taxInfo.grossAmount;
        }
      }

      // Check for payment methods
      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card',
        limit: 1
      });
      summary.hasPaymentMethod = paymentMethods.data.length > 0;

      // Check for pending invoices
      const pendingInvoices = await stripe.invoices.list({
        customer: user.stripeCustomerId,
        status: 'open',
        limit: 10
      });
      
      summary.pendingInvoices = pendingInvoices.data.length;
      summary.pendingAmount = pendingInvoices.data.reduce(
        (sum, inv) => sum + (inv.amount_due || 0), 0
      );
    }

    return NextResponse.json({
      success: true,
      summary
    });

  } catch (error) {
    securityLogger.error('billing_summary_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Billing summary error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve billing summary' },
      { status: 500 }
    );
  }
}