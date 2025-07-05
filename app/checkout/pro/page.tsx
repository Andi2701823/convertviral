import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import SubscriptionCheckout from '@/components/SubscriptionCheckout';

export const metadata: Metadata = {
  title: 'Pro Abonnement - ConvertViral',
  description: 'Abonnieren Sie den Pro-Plan für unbegrenzte Konvertierungen und erweiterte Funktionen.',
};

export default async function ProCheckoutPage() {
  // Benutzer-Session abrufen
  const session = await getServerSession(authOptions);
  
  // Wenn kein Benutzer angemeldet ist, zur Anmeldeseite weiterleiten
  if (!session?.user) {
    redirect('/login?redirect=checkout/pro');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Pro Abonnement</h1>
        <p className="text-gray-600">
          Genießen Sie unbegrenzte Konvertierungen, alle Dateiformate und vieles mehr.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Zusammenfassung</h2>
        <div className="flex justify-between py-2 border-b">
          <span>Plan</span>
          <span className="font-medium">Pro</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span>Preis</span>
          <span className="font-medium">€9.99/Monat</span>
        </div>
        <div className="flex justify-between py-2">
          <span>Enthält</span>
          <span className="font-medium">Alle Pro-Funktionen</span>
        </div>
      </div>

      <SubscriptionCheckout planType="pro" />
    </div>
  );
}