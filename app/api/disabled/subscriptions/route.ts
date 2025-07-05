import { NextRequest, NextResponse } from 'next/server';
import { stripe, stripeConfig } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Erstellt ein neues Abonnement für den Benutzer
export async function POST(request: NextRequest) {
  try {
    // Authentifizierung überprüfen
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Anfrage-Body parsen
    const body = await request.json();
    const { priceId, paymentMethodId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID ist erforderlich' },
        { status: 400 }
      );
    }

    // Benutzer aus der Datenbank abrufen
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  }) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    // Stripe-Kunden-ID abrufen oder erstellen
  let customerId = (user as any).stripeCustomerId;

  if (!customerId) {
    // Neuen Stripe-Kunden erstellen
    const customer = await stripe.customers.create({
      email: user.email as string,
      name: user.name || undefined,
      metadata: {
        userId: user.id,
      },
      address: {
        country: stripeConfig.country,
      },
      preferred_locales: ['de'],
    });

    customerId = customer.id;

    // Benutzer mit Stripe-Kunden-ID aktualisieren
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    } as any);
  }

    // Wenn eine Zahlungsmethode angegeben wurde, diese dem Kunden hinzufügen
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Als Standardzahlungsmethode festlegen
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // Abonnement erstellen
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      automatic_tax: { enabled: true },
    });

    // Abonnement in der Datenbank speichern
    await (prisma as any).subscription.create({
      data: {
        userId: user.id,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        quantity: subscription.items.data[0].quantity || 1,
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        stripeSubscriptionId: subscription.id,
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
    });
  } catch (error) {
    console.error('Fehler beim Erstellen des Abonnements:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// Ruft Informationen zum Abonnement des Benutzers ab
export async function GET(request: NextRequest) {
  try {
    // Authentifizierung überprüfen
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Benutzer abrufen
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  }) as any;
  
  // Abonnements separat abrufen
  const subscriptions = await (prisma as any).subscription.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 1,
  });
  
  // Abonnements zum Benutzer hinzufügen
  user.subscriptions = subscriptions;

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    // Wenn kein Abonnement vorhanden ist
    if (!(user as any).subscriptions || (user as any).subscriptions.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    const subscription = (user as any).subscriptions[0];

    // Aktuelle Informationen von Stripe abrufen
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        status: stripeSubscription.status,
        priceId: subscription.priceId,
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      },
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Abonnements:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}