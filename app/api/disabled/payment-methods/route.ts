import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Erstellt ein Setup Intent für eine neue Zahlungsmethode
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
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Kunden-ID ist erforderlich' },
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

    // Überprüfen, ob die Kunden-ID zum Benutzer gehört
    if ((user as any).stripeCustomerId !== customerId) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 403 }
      );
    }

    // Setup Intent erstellen
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session', // Ermöglicht zukünftige Abbuchungen ohne Benutzerinteraktion
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
    });
  } catch (error) {
    console.error('Fehler beim Erstellen des Setup Intents:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// Ruft die Zahlungsmethoden eines Benutzers ab
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

    // Benutzer aus der Datenbank abrufen
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  }) as any;

    if (!user || !(user as any).stripeCustomerId) {
      return NextResponse.json(
        { error: 'Benutzer hat keine Kunden-ID' },
        { status: 404 }
      );
    }

    // Stripe-Kunden-ID abrufen
    const customerId = (user as any).stripeCustomerId;

    // Wenn keine Stripe-Kunden-ID vorhanden ist, Fehler zurückgeben
    if (!customerId) {
      return NextResponse.json(
        { error: 'Kein Stripe-Kundenkonto gefunden' },
        { status: 400 }
      );
    }

    // Zahlungsmethoden von Stripe abrufen
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    // Standard-Zahlungsmethode markieren
    const defaultPaymentMethodId = (user as any).defaultPaymentMethodId;

    return NextResponse.json({
      paymentMethods: paymentMethods.data.map((pm) => ({
        id: pm.id,
        brand: pm.card?.brand,
        last4: pm.card?.last4,
        expMonth: pm.card?.exp_month,
        expYear: pm.card?.exp_year,
        isDefault: pm.id === (user as any).defaultPaymentMethodId,
      })),
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Zahlungsmethoden:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}