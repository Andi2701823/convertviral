import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Reaktiviert ein zuvor gekündigtes Abonnement
export async function POST(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  try {
    // Authentifizierung überprüfen
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { subscriptionId } = params;

    // Abonnement in der Datenbank suchen
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      include: { 
        user: {
          select: {
            email: true
          }
        } 
      },
    });

    // Überprüfen, ob das Abonnement existiert und dem Benutzer gehört
    if (!subscription || (subscription.user as any).email !== session.user.email) {
      return NextResponse.json(
        { error: 'Abonnement nicht gefunden oder nicht autorisiert' },
        { status: 404 }
      );
    }

    // Überprüfen, ob das Abonnement gekündigt wurde
    if (!subscription.cancelAtPeriodEnd) {
      return NextResponse.json(
        { error: 'Abonnement ist nicht gekündigt' },
        { status: 400 }
      );
    }

    // Abonnement bei Stripe reaktivieren
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    // Abonnement in der Datenbank aktualisieren
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: false },
    });

    return NextResponse.json({
      message: 'Abonnement erfolgreich reaktiviert',
      cancelAtPeriodEnd: false,
    });
  } catch (error) {
    console.error('Fehler beim Reaktivieren des Abonnements:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}