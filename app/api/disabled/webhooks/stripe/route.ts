import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';

// Stripe Webhook-Handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature') as string;

    // Stripe Webhook-Secret aus den Umgebungsvariablen abrufen
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Stripe Webhook-Secret ist nicht konfiguriert');
      return NextResponse.json(
        { error: 'Webhook-Secret ist nicht konfiguriert' },
        { status: 500 }
      );
    }

    // Ereignis verifizieren
    let event;
    try {
      // Make sure we're using the correct method from the Stripe instance
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook-Signatur-Verifizierung fehlgeschlagen: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook-Signatur-Verifizierung fehlgeschlagen: ${err.message}` },
        { status: 400 }
      );
    }

    // Ereignis verarbeiten
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`Unbehandeltes Ereignis: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Fehler bei der Verarbeitung des Webhooks:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// Handler für abgeschlossene Checkout-Sitzungen
async function handleCheckoutSessionCompleted(session: any) {
  // Benutzer-ID aus den Metadaten abrufen
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error('Keine Benutzer-ID in den Metadaten gefunden');
    return;
  }

  // Abonnement-ID aus der Sitzung abrufen
  const subscriptionId = session.subscription;
  if (!subscriptionId) {
    console.error('Keine Abonnement-ID in der Sitzung gefunden');
    return;
  }

  // Abonnement von Stripe abrufen
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Abonnement in der Datenbank aktualisieren oder erstellen
  await prisma.subscription.upsert({
    where: {
      stripeSubscriptionId: subscriptionId,
    },
    update: {
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    },
    create: {
      userId,
      stripeSubscriptionId: subscriptionId,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    },
  });

  // Benutzer auf Premium-Status aktualisieren
  await prisma.user.update({
    where: { id: userId },
    data: { isPremium: true },
  } as any);
}

// Handler für bezahlte Rechnungen
async function handleInvoicePaid(invoice: any) {
  // Abonnement-ID aus der Rechnung abrufen
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) {
    console.error('Keine Abonnement-ID in der Rechnung gefunden');
    return;
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
    console.error(`Abonnement mit ID ${subscriptionId} nicht gefunden`);
    return;
  }

  // Abonnement aktualisieren
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: stripeSubscription.status,
      currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
    },
  });

  // Benutzer auf Premium-Status aktualisieren
  await prisma.user.update({
    where: { id: subscription.userId },
    data: { isPremium: true },
  } as any);
}

// Handler für fehlgeschlagene Rechnungszahlungen
async function handleInvoicePaymentFailed(invoice: any) {
  // Abonnement-ID aus der Rechnung abrufen
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) {
    console.error('Keine Abonnement-ID in der Rechnung gefunden');
    return;
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
    console.error(`Abonnement mit ID ${subscriptionId} nicht gefunden`);
    return;
  }

  // Abonnement aktualisieren
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: stripeSubscription.status,
    },
  });

  // Hier könnten weitere Aktionen wie das Senden einer Benachrichtigung erfolgen
}

// Handler für aktualisierte Abonnements
async function handleSubscriptionUpdated(subscription: any) {
  // Abonnement in der Datenbank suchen
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    console.error(`Abonnement mit ID ${subscription.id} nicht gefunden`);
    return;
  }

  // Abonnement aktualisieren
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  // Benutzer-Premium-Status aktualisieren, wenn das Abonnement aktiv ist
  if (subscription.status === 'active') {
    await prisma.user.update({
      where: { id: dbSubscription.userId },
      data: { isPremium: true },
    } as any);
  } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    await prisma.user.update({
      where: { id: dbSubscription.userId },
      data: { isPremium: false },
    } as any);
  }
}

// Handler für gelöschte Abonnements
async function handleSubscriptionDeleted(subscription: any) {
  // Abonnement in der Datenbank suchen
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    console.error(`Abonnement mit ID ${subscription.id} nicht gefunden`);
    return;
  }

  // Abonnement aktualisieren
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: 'canceled',
      cancelAtPeriodEnd: true,
    },
  });

  // Benutzer-Premium-Status aktualisieren
  await prisma.user.update({
    where: { id: dbSubscription.userId },
    data: { isPremium: false },
  } as any);
}