import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import PaymentMethodForm from '@/components/PaymentMethodForm';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Zahlungsmethode aktualisieren - ConvertViral',
  description: 'Aktualisieren Sie Ihre Zahlungsmethode für Ihr ConvertViral-Abonnement.',
};

export default async function PaymentMethodPage() {
  // Benutzer-Session abrufen
  const session = await getServerSession(authOptions);
  
  // Wenn kein Benutzer angemeldet ist, zur Anmeldeseite weiterleiten
  if (!session?.user) {
    redirect('/login?redirect=billing/payment-method');
  }

  // Benutzer aus der Datenbank abrufen
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  }) as any;

  // Wenn kein Benutzer gefunden wurde, kein Abonnement vorhanden ist oder keine Stripe-Kunden-ID existiert
  if (!user || !(user as any).subscriptions || (user as any).subscriptions.length === 0 || !(user as any).stripeCustomerId) {
    redirect('/pricing');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Zahlungsmethode aktualisieren</h1>
        <p className="text-gray-600">
          Aktualisieren Sie die Zahlungsmethode für Ihr Abonnement.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Aktuelle Zahlungsinformationen</h2>
        <p className="text-gray-600 mb-4">
          Aus Sicherheitsgründen zeigen wir Ihre aktuellen Zahlungsinformationen nicht an. 
          Geben Sie unten Ihre neuen Zahlungsinformationen ein, um Ihre Zahlungsmethode zu aktualisieren.
        </p>
      </div>

      <PaymentMethodForm customerId={(user as any).stripeCustomerId as string} />
    </div>
  );
}