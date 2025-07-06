import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { stripe, generateInvoice, calculateGermanTax } from '@/lib/stripe';
import { securityLogger } from '@/lib/security';
import { z } from 'zod';
import { FEATURE_FLAGS } from '@/lib/featureFlags';

// Validation schemas
const createInvoiceSchema = z.object({
  customerId: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    amount: z.number().min(1, 'Amount must be positive'),
    quantity: z.number().min(1, 'Quantity must be positive').default(1),
    taxRate: z.enum(['standard', 'reduced']).default('standard')
  })).min(1, 'At least one item is required'),
  dueDate: z.string().optional(), // ISO date string
  metadata: z.record(z.string()).optional(),
  autoAdvanceEnabled: z.boolean().default(true),
  collectionMethod: z.enum(['charge_automatically', 'send_invoice']).default('charge_automatically')
});

const invoiceQuerySchema = z.object({
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).optional(),
  starting_after: z.string().optional(),
  ending_before: z.string().optional(),
  status: z.enum(['draft', 'open', 'paid', 'void', 'uncollectible']).optional(),
  subscription: z.string().optional(),
  created: z.object({
    gte: z.number().optional(),
    lte: z.number().optional()
  }).optional()
});

// Create new invoice
export async function POST(request: NextRequest) {
  // Check if payments are enabled
  if (!FEATURE_FLAGS.paymentsEnabled) {
    securityLogger.warn('invoices_post_disabled', {
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
    const validatedData = createInvoiceSchema.parse(body);

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

    const customerId = validatedData.customerId || user.stripeCustomerId;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Calculate totals and taxes for each item
    const invoiceItems = validatedData.items.map(item => {
      const totalAmount = item.amount * item.quantity;
      const taxInfo = calculateGermanTax(totalAmount, item.taxRate === 'standard');
      
      return {
        ...item,
        totalAmount,
        taxInfo
      };
    });

    // Calculate invoice totals
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.taxInfo.netAmount, 0);
    const totalTax = invoiceItems.reduce((sum, item) => sum + item.taxInfo.taxAmount, 0);
    const total = subtotal + totalTax;

    // Create invoice using German-compliant function
    const invoice = await generateInvoice(
      customerId,
      invoiceItems.map(item => ({
        description: item.description,
        amount: item.totalAmount,
        quantity: item.quantity
      })),
      {
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        metadata: {
          userId: user.id,
          createdBy: 'api',
          subtotal: subtotal.toString(),
          totalTax: totalTax.toString(),
          total: total.toString(),
          ...validatedData.metadata
        },
        autoAdvance: validatedData.autoAdvanceEnabled
      }
    );

    // Store invoice in database
    const dbInvoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        stripeInvoiceId: invoice.id,
        status: invoice.status,
        amountDue: invoice.amount_due,
        amountPaid: invoice.amount_paid,
        subtotal: invoice.subtotal,
        total: invoice.total,
        tax: (invoice as any).tax || 0,
        currency: invoice.currency,
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
        paidAt: invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : null,
        metadata: invoice.metadata as any
      }
    });

    securityLogger.info('invoice_created', {
      userId: user.id,
      invoiceId: invoice.id,
      customerId,
      total: invoice.total,
      currency: invoice.currency,
      itemCount: validatedData.items.length
    });

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        number: invoice.number,
        status: invoice.status,
        amountDue: invoice.amount_due,
        amountPaid: invoice.amount_paid,
        subtotal: invoice.subtotal,
        total: invoice.total,
        tax: (invoice as any).tax,
        currency: invoice.currency,
        created: invoice.created,
        dueDate: invoice.due_date,
        hostedInvoiceUrl: invoice.hosted_invoice_url,
        invoicePdf: invoice.invoice_pdf,
        paymentIntent: (invoice as any).payment_intent,
        items: invoiceItems,
        taxBreakdown: {
          subtotal,
          totalTax,
          total
        }
      },
      dbInvoiceId: dbInvoice.id
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    securityLogger.error('invoice_creation_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Invoice creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

// Get user invoices
export async function GET(request: NextRequest) {
  // Check if payments are enabled
  if (!FEATURE_FLAGS.paymentsEnabled) {
    securityLogger.warn('invoices_get_disabled', {
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

    // Parse query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    // Validate query parameters
    const validatedQuery = invoiceQuerySchema.parse(queryParams);

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
        invoices: [],
        hasMore: false,
        totalCount: 0
      });
    }

    // Build Stripe query parameters
    const stripeParams: any = {
      customer: user.stripeCustomerId,
      limit: validatedQuery.limit || 20,
      expand: ['data.payment_intent', 'data.subscription']
    };

    if (validatedQuery.starting_after) {
      stripeParams.starting_after = validatedQuery.starting_after;
    }

    if (validatedQuery.ending_before) {
      stripeParams.ending_before = validatedQuery.ending_before;
    }

    if (validatedQuery.status) {
      stripeParams.status = validatedQuery.status;
    }

    if (validatedQuery.subscription) {
      stripeParams.subscription = validatedQuery.subscription;
    }

    if (validatedQuery.created) {
      stripeParams.created = validatedQuery.created;
    }

    // Get invoices from Stripe
    const stripeInvoices = await stripe.invoices.list(stripeParams);

    // Get corresponding database records
    const dbInvoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
        stripeInvoiceId: {
          in: stripeInvoices.data.map(inv => inv.id)
        }
      }
    });

    // Create a map for quick lookup
    const dbInvoiceMap = new Map(dbInvoices.map((inv: any) => [inv.stripeInvoiceId, inv]));

    // Format invoices for response
    const formattedInvoices = stripeInvoices.data.map(invoice => {
      const dbInvoice = dbInvoiceMap.get(invoice.id);
      
      // Calculate tax breakdown
      const taxBreakdown = {
        subtotal: invoice.subtotal || 0,
        tax: (invoice as any).tax || 0,
        total: invoice.total || 0,
        taxRate: (invoice as any).tax && invoice.subtotal ? 
          (((invoice as any).tax / invoice.subtotal) * 100).toFixed(2) + '%' : '0%'
      };

      return {
        id: invoice.id,
        number: invoice.number,
        status: invoice.status,
        amountDue: invoice.amount_due,
        amountPaid: invoice.amount_paid,
        amountRemaining: invoice.amount_remaining,
        subtotal: invoice.subtotal,
        total: invoice.total,
        tax: (invoice as any).tax,
        currency: invoice.currency,
        created: invoice.created,
        dueDate: invoice.due_date,
        paidAt: invoice.status_transitions?.paid_at,
        voidedAt: invoice.status_transitions?.voided_at,
        finalizedAt: invoice.status_transitions?.finalized_at,
        hostedInvoiceUrl: invoice.hosted_invoice_url,
        invoicePdf: invoice.invoice_pdf,
        paymentIntent: (invoice as any).payment_intent,
        subscription: (invoice as any).subscription,
        description: invoice.description,
        footer: invoice.footer,
        metadata: invoice.metadata,
        taxBreakdown,
        lines: invoice.lines?.data?.map(line => ({
          id: line.id,
          description: line.description,
          amount: line.amount,
          quantity: line.quantity,
          unitAmount: (line as any).unit_amount,
          currency: line.currency,
          type: (line as any).type,
          period: line.period,
          proration: (line as any).proration,
          taxAmounts: (line as any).tax_amounts,
          taxRates: (line as any).tax_rates
        })) || [],
        // Database-specific fields
        dbId: (dbInvoice as any)?.id,
        dbCreatedAt: (dbInvoice as any)?.createdAt,
        dbUpdatedAt: (dbInvoice as any)?.updatedAt,
        failedPaymentCount: (dbInvoice as any)?.failedPaymentCount || 0,
        lastFailedPaymentDate: (dbInvoice as any)?.lastFailedPaymentDate
      };
    });

    // Get total count for pagination
    const totalCountResponse = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 1
    });

    return NextResponse.json({
      success: true,
      invoices: formattedInvoices,
      hasMore: stripeInvoices.has_more,
      totalCount: totalCountResponse.data.length > 0 ? 'unknown' : 0, // Stripe doesn't provide total count
      pagination: {
        limit: validatedQuery.limit || 20,
        startingAfter: validatedQuery.starting_after,
        endingBefore: validatedQuery.ending_before
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    securityLogger.error('invoice_retrieval_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Invoice retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve invoices' },
      { status: 500 }
    );
  }
}

// Update invoice (finalize, pay, void, etc.)
export async function PATCH(request: NextRequest) {
  // Check if payments are enabled
  if (!FEATURE_FLAGS.paymentsEnabled) {
    securityLogger.warn('invoices_patch_disabled', {
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
    const { invoiceId, action, ...actionData } = body;

    if (!invoiceId || !action) {
      return NextResponse.json(
        { error: 'Invoice ID and action are required' },
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

    // Verify invoice belongs to user
    const dbInvoice = await prisma.invoice.findFirst({
      where: {
        stripeInvoiceId: invoiceId,
        userId: user.id
      }
    });

    if (!dbInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    let result;

    switch (action) {
      case 'finalize':
        result = await stripe.invoices.finalizeInvoice(invoiceId, {
          auto_advance: actionData.autoAdvance
        });
        break;

      case 'pay':
        result = await stripe.invoices.pay(invoiceId, {
          payment_method: actionData.paymentMethodId,
          source: actionData.source
        });
        break;

      case 'void':
        result = await stripe.invoices.voidInvoice(invoiceId);
        break;

      case 'mark_uncollectible':
        result = await stripe.invoices.markUncollectible(invoiceId);
        break;

      case 'send':
        result = await stripe.invoices.sendInvoice(invoiceId);
        break;

      case 'update':
        result = await stripe.invoices.update(invoiceId, {
          description: actionData.description,
          footer: actionData.footer,
          metadata: actionData.metadata,
          due_date: actionData.dueDate ? Math.floor(new Date(actionData.dueDate).getTime() / 1000) : undefined
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update database record
    await prisma.invoice.update({
      where: { id: dbInvoice.id },
      data: {
        status: result.status,
        amountPaid: result.amount_paid,
        amountDue: result.amount_due,
        paidAt: result.status_transitions?.paid_at ? new Date(result.status_transitions.paid_at * 1000) : null,
        metadata: result.metadata as any
      }
    });

    securityLogger.info('invoice_updated', {
      userId: user.id,
      invoiceId,
      action,
      newStatus: result.status
    });

    return NextResponse.json({
      success: true,
      invoice: {
        id: result.id,
        status: result.status,
        amountDue: result.amount_due,
        amountPaid: result.amount_paid,
        total: result.total,
        hostedInvoiceUrl: result.hosted_invoice_url,
        invoicePdf: result.invoice_pdf
      },
      action
    });

  } catch (error) {
    securityLogger.error('invoice_update_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Invoice update error:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

// Delete/void invoice
export async function DELETE(request: NextRequest) {
  // Check if payments are enabled
  if (!FEATURE_FLAGS.paymentsEnabled) {
    securityLogger.warn('invoices_delete_disabled', {
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

    // Get invoice ID from URL
    const url = new URL(request.url);
    const invoiceId = url.searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
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

    // Verify invoice belongs to user
    const dbInvoice = await prisma.invoice.findFirst({
      where: {
        stripeInvoiceId: invoiceId,
        userId: user.id
      }
    });

    if (!dbInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Get invoice from Stripe to check status
    const stripeInvoice = await stripe.invoices.retrieve(invoiceId);

    if (stripeInvoice.status === 'paid') {
      return NextResponse.json(
        { error: 'Cannot delete a paid invoice' },
        { status: 400 }
      );
    }

    let result;

    if (stripeInvoice.status === 'draft') {
      // Delete draft invoice
      result = await stripe.invoices.del(invoiceId);
    } else {
      // Void finalized invoice
      result = await stripe.invoices.voidInvoice(invoiceId);
    }

    // Update database record
    await prisma.invoice.update({
      where: { id: dbInvoice.id },
      data: {
        status: (result as any).status || 'deleted'
      }
    });

    securityLogger.info('invoice_deleted', {
      userId: user.id,
      invoiceId,
      previousStatus: stripeInvoice.status
    });

    return NextResponse.json({
      success: true,
      deletedInvoiceId: invoiceId,
      action: stripeInvoice.status === 'draft' ? 'deleted' : 'voided'
    });

  } catch (error) {
    securityLogger.error('invoice_deletion_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Invoice deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}