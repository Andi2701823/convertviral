import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';
import { getRedisClient } from '@/lib/redis';
import { securityLogger } from '@/lib/security';
import { FEATURE_FLAGS } from '@/lib/featureFlags';

// Constants for retry logic
const MAX_WEBHOOK_RETRIES = 3;
const WEBHOOK_RETRY_DELAY_MS = 2000; // 2 seconds

// Stripe Webhook-Handler with enhanced error handling and retry logic
export async function POST(request: NextRequest) {
  // Check if payments are enabled
  if (!FEATURE_FLAGS.paymentsEnabled) {
    securityLogger.warn('webhook_payments_disabled', {
      message: 'Payments are currently disabled via feature flags'
    });
    return NextResponse.json(
      { error: 'Payments are currently disabled' },
      { status: 403 }
    );
  }
  
  let retryCount = 0;
  let lastError: Error | null = null;

  while (retryCount <= MAX_WEBHOOK_RETRIES) {
    try {
      // Validate Stripe configuration at runtime
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!stripeSecretKey) {
        const error = new Error('STRIPE_SECRET_KEY environment variable is not configured');
        securityLogger.error('stripe_configuration_error', {
          error: error.message
        });
        return NextResponse.json(
          { error: 'Stripe configuration is incomplete' },
          { status: 500 }
        );
      }
      
      if (!webhookSecret) {
        const error = new Error('Stripe Webhook-Secret ist nicht konfiguriert');
        securityLogger.error('webhook_configuration_error', {
          error: error.message
        });
        return NextResponse.json(
          { error: 'Webhook-Secret ist nicht konfiguriert' },
          { status: 500 }
        );
      }

      const body = await request.text();
      const signature = headers().get('stripe-signature') as string;

      // Ereignis verifizieren
      let event;
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        const error = new Error(`Webhook-Signatur-Verifizierung fehlgeschlagen: ${err.message}`);
        securityLogger.error('webhook_signature_verification_failed', {
          error: error.message
        });
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      // Generate a unique ID for this webhook event to prevent duplicate processing
      const eventId = event.id;
      const webhookProcessKey = `webhook:processed:${eventId}`;
      
      // Check if we've already processed this event
      const redis = await getRedisClient();
      const alreadyProcessed = await redis.get(webhookProcessKey);
      if (alreadyProcessed) {
        securityLogger.warn('webhook_duplicate_event', {
          eventId,
          eventType: event.type
        });
        return NextResponse.json({ received: true, status: 'already_processed' });
      }

      // Log the webhook event
      securityLogger.info('webhook_received', {
        eventId,
        eventType: event.type
      });

      // Process the event based on its type
      let result;
      switch (event.type) {
        case 'checkout.session.completed':
          result = await handleCheckoutSessionCompleted(event.data.object);
          break;

        case 'invoice.paid':
          result = await handleInvoicePaid(event.data.object);
          break;

        case 'invoice.payment_failed':
          result = await handleInvoicePaymentFailed(event.data.object);
          break;

        case 'customer.subscription.updated':
          result = await handleSubscriptionUpdated(event.data.object);
          break;

        case 'customer.subscription.deleted':
          result = await handleSubscriptionDeleted(event.data.object);
          break;

        case 'payment_intent.succeeded':
          result = await handlePaymentIntentSucceeded(event.data.object);
          break;

        case 'payment_intent.payment_failed':
          result = await handlePaymentIntentFailed(event.data.object);
          break;

        default:
          securityLogger.warn('webhook_unhandled_event', {
            eventId,
            eventType: event.type
          });
          result = { status: 'unhandled', eventType: event.type };
      }

      // Mark this webhook as processed (store for 24 hours)
      await redis.set(webhookProcessKey, JSON.stringify({
        processedAt: new Date().toISOString(),
        result
      }), { EX: 86400 }); // 24 hours

      securityLogger.info('webhook_processed_successfully', {
        eventId,
        eventType: event.type,
        result
      });

      return NextResponse.json({ received: true, result });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown webhook processing error');
      
      securityLogger.error('webhook_processing_error', {
        error: lastError.message,
        retryCount,
        willRetry: retryCount < MAX_WEBHOOK_RETRIES
      });

      // Retry logic
      if (retryCount < MAX_WEBHOOK_RETRIES) {
        retryCount++;
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, WEBHOOK_RETRY_DELAY_MS * Math.pow(2, retryCount)));
      } else {
        // Max retries reached, return error
        return NextResponse.json(
          { error: `Webhook processing failed after ${MAX_WEBHOOK_RETRIES} retries: ${lastError.message}` },
          { status: 500 }
        );
      }
    }
  }

  // This should never be reached due to the return statements in the loop
  return NextResponse.json(
    { error: 'Unexpected webhook processing error' },
    { status: 500 }
  );
}

// Handler für abgeschlossene Checkout-Sitzungen
async function handleCheckoutSessionCompleted(session: any) {
  try {
    // Benutzer-ID aus den Metadaten abrufen
    const userId = session.metadata?.userId;
    if (!userId) {
      throw new Error('Keine Benutzer-ID in den Metadaten gefunden');
    }

    // Abonnement-ID aus der Sitzung abrufen
    const subscriptionId = session.subscription;
    if (!subscriptionId) {
      throw new Error('Keine Abonnement-ID in der Sitzung gefunden');
    }

    // Abonnement von Stripe abrufen
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Abonnement in der Datenbank aktualisieren oder erstellen
    const dbSubscription = await prisma.subscription.upsert({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
      update: {
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        metadata: subscription.metadata as any
      },
      create: {
        userId,
        stripeSubscriptionId: subscriptionId,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        metadata: subscription.metadata as any
      },
    });

    // Benutzer auf Premium-Status aktualisieren
    await prisma.user.update({
      where: { id: userId },
      data: { 
        isPremium: true,
        plan: subscription.items.data[0].price.id.includes('pro') ? 'pro' : 'business'
      },
    } as any);

    return { success: true, subscriptionId, userId, dbSubscriptionId: dbSubscription.id };
  } catch (error) {
    securityLogger.error('checkout_session_processing_error', {
      sessionId: session.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Handler für bezahlte Rechnungen mit verbesserter Fehlerbehandlung
async function handleInvoicePaid(invoice: any) {
  try {
    // Abonnement-ID aus der Rechnung abrufen
    const subscriptionId = invoice.subscription;
    if (!subscriptionId) {
      throw new Error('Keine Abonnement-ID in der Rechnung gefunden');
    }

    // Abonnement in der Datenbank suchen
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      select: {
        id: true,
        userId: true
      }
    });

    if (!subscription) {
      throw new Error(`Abonnement mit ID ${subscriptionId} nicht gefunden`);
    }

    // Abonnement aktualisieren
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: stripeSubscription.status,
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
        lastInvoiceDate: new Date(),
        lastInvoiceUrl: invoice.hosted_invoice_url || null,
      },
    });

    // Benutzer auf Premium-Status aktualisieren
    await prisma.user.update({
      where: { id: subscription.userId },
      data: { isPremium: true },
    } as any);

    // Store invoice information for reporting
    await prisma.invoice.create({
      data: {
        userId: subscription.userId,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status,
        invoiceUrl: invoice.hosted_invoice_url || null,
        invoicePdf: invoice.invoice_pdf || null,
        paidAt: invoice.status === 'paid' ? new Date(invoice.status_transitions.paid_at * 1000) : null,
        taxAmount: invoice.tax || 0,
        metadata: invoice.metadata as any
      }
    });

    return { success: true, invoiceId: invoice.id, subscriptionId, userId: subscription.userId };
  } catch (error) {
    securityLogger.error('invoice_paid_processing_error', {
      invoiceId: invoice.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Handler für fehlgeschlagene Rechnungszahlungen mit Wiederholungslogik
async function handleInvoicePaymentFailed(invoice: any) {
  try {
    // Abonnement-ID aus der Rechnung abrufen
    const subscriptionId = invoice.subscription;
    if (!subscriptionId) {
      throw new Error('Keine Abonnement-ID in der Rechnung gefunden');
    }

    // Abonnement in der Datenbank suchen
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      select: {
        id: true,
        userId: true,
        failedPaymentCount: true
      }
    });

    if (!subscription) {
      throw new Error(`Abonnement mit ID ${subscriptionId} nicht gefunden`);
    }

    // Abonnement aktualisieren und Fehlerzähler erhöhen
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    const failedPaymentCount = (subscription.failedPaymentCount || 0) + 1;
    
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: stripeSubscription.status,
        failedPaymentCount,
        lastFailedPaymentDate: new Date(),
      },
    });

    // Benutzer benachrichtigen (würde in einer realen Anwendung implementiert werden)
    // sendPaymentFailureEmail(subscription.userId, invoice.hosted_invoice_url);

    // Automatische Wiederholungslogik für fehlgeschlagene Zahlungen
    if (failedPaymentCount <= 3 && invoice.payment_intent) {
      // Wir versuchen, die Zahlung erneut durchzuführen, wenn weniger als 3 Fehlversuche vorliegen
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent);
        
        if (paymentIntent.status === 'requires_payment_method' || paymentIntent.status === 'requires_action') {
          // Hier würde in einer realen Anwendung eine E-Mail mit einem Link zur Aktualisierung der Zahlungsmethode gesendet werden
          
          // Für Testzwecke versuchen wir, die Zahlung erneut zu bestätigen
          if (failedPaymentCount < 2) { // Nur beim ersten Fehlschlag automatisch wiederholen
            await stripe.paymentIntents.confirm(paymentIntent.id);
            
            securityLogger.info('payment_retry_initiated', {
              paymentIntentId: paymentIntent.id,
              invoiceId: invoice.id,
              subscriptionId,
              attemptNumber: failedPaymentCount
            });
          }
        }
      } catch (retryError) {
        securityLogger.error('payment_retry_failed', {
          invoiceId: invoice.id,
          subscriptionId,
          error: retryError instanceof Error ? retryError.message : 'Unknown error'
        });
      }
    } else if (failedPaymentCount > 3) {
      // Nach 3 Fehlversuchen setzen wir das Abonnement auf "unpaid"
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'unpaid',
        },
      });

      // Benutzer-Premium-Status aktualisieren
      await prisma.user.update({
        where: { id: subscription.userId },
        data: { isPremium: false },
      } as any);

      securityLogger.warn('subscription_unpaid', {
        subscriptionId,
        userId: subscription.userId,
        failedPaymentCount
      });
    }

    return { 
      success: true, 
      invoiceId: invoice.id, 
      subscriptionId, 
      userId: subscription.userId,
      failedPaymentCount,
      status: failedPaymentCount > 3 ? 'unpaid' : 'payment_failed'
    };
  } catch (error) {
    securityLogger.error('invoice_payment_failed_processing_error', {
      invoiceId: invoice.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Handler für aktualisierte Abonnements
async function handleSubscriptionUpdated(subscription: any) {
  try {
    // Abonnement in der Datenbank suchen
    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!dbSubscription) {
      throw new Error(`Abonnement mit ID ${subscription.id} nicht gefunden`);
    }

    // Abonnement aktualisieren
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        metadata: subscription.metadata as any
      },
    });

    // Benutzer-Premium-Status aktualisieren, wenn das Abonnement aktiv ist
    if (subscription.status === 'active') {
      await prisma.user.update({
        where: { id: dbSubscription.userId },
        data: { 
          isPremium: true,
          plan: subscription.items.data[0].price.id.includes('pro') ? 'pro' : 'business'
        },
      } as any);
    } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
      await prisma.user.update({
        where: { id: dbSubscription.userId },
        data: { isPremium: false },
      } as any);
    }

    return { 
      success: true, 
      subscriptionId: subscription.id, 
      userId: dbSubscription.userId,
      status: subscription.status
    };
  } catch (error) {
    securityLogger.error('subscription_update_processing_error', {
      subscriptionId: subscription.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Handler für gelöschte Abonnements
async function handleSubscriptionDeleted(subscription: any) {
  try {
    // Abonnement in der Datenbank suchen
    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!dbSubscription) {
      throw new Error(`Abonnement mit ID ${subscription.id} nicht gefunden`);
    }

    // Abonnement aktualisieren
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: 'canceled',
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      },
    });

    // Benutzer-Premium-Status aktualisieren
    await prisma.user.update({
      where: { id: dbSubscription.userId },
      data: { isPremium: false },
    } as any);

    return { 
      success: true, 
      subscriptionId: subscription.id, 
      userId: dbSubscription.userId,
      status: 'canceled'
    };
  } catch (error) {
    securityLogger.error('subscription_deletion_processing_error', {
      subscriptionId: subscription.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Handler für erfolgreiche Zahlungsabsichten
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    // Wenn die Zahlungsabsicht mit einer Rechnung verknüpft ist, aktualisieren wir den Zahlungsstatus
    if (paymentIntent.invoice) {
      const invoice = await stripe.invoices.retrieve(paymentIntent.invoice);
      
      // Wenn die Rechnung mit einem Abonnement verknüpft ist, aktualisieren wir den Abonnementstatus
      if ((invoice as any).subscription) {
        const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription);
        
        // Abonnement in der Datenbank suchen
        const dbSubscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (dbSubscription) {
          // Abonnement aktualisieren
          await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
              status: subscription.status,
              currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
              failedPaymentCount: 0, // Zurücksetzen des Fehlerzählers
              lastSuccessfulPaymentDate: new Date(),
            },
          });

          // Benutzer-Premium-Status aktualisieren
          await prisma.user.update({
            where: { id: dbSubscription.userId },
            data: { isPremium: true },
          } as any);

          securityLogger.info('payment_succeeded', {
            paymentIntentId: paymentIntent.id,
            invoiceId: invoice.id,
            subscriptionId: subscription.id,
            userId: dbSubscription.userId,
            amount: paymentIntent.amount
          });

          return { 
            success: true, 
            paymentIntentId: paymentIntent.id, 
            invoiceId: invoice.id,
            subscriptionId: subscription.id,
            userId: dbSubscription.userId
          };
        }
      }
    }

    // Wenn keine spezifische Verarbeitung erforderlich ist, geben wir einfach Erfolg zurück
    return { 
      success: true, 
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: 'succeeded'
    };
  } catch (error) {
    securityLogger.error('payment_intent_success_processing_error', {
      paymentIntentId: paymentIntent.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Handler für fehlgeschlagene Zahlungsabsichten
async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    securityLogger.warn('payment_failed', {
      paymentIntentId: paymentIntent.id,
      error: paymentIntent.last_payment_error?.message || 'Unknown error',
      amount: paymentIntent.amount
    });

    // Wenn die Zahlungsabsicht mit einer Rechnung verknüpft ist, aktualisieren wir den Zahlungsstatus
    if (paymentIntent.invoice) {
      // Die Logik für fehlgeschlagene Rechnungen wird bereits in handleInvoicePaymentFailed behandelt
      // Hier könnten zusätzliche Aktionen erfolgen, die spezifisch für die Zahlungsabsicht sind
    }

    return { 
      success: true, 
      paymentIntentId: paymentIntent.id,
      status: 'failed',
      error: paymentIntent.last_payment_error?.message || 'Unknown error'
    };
  } catch (error) {
    securityLogger.error('payment_intent_failed_processing_error', {
      paymentIntentId: paymentIntent.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}