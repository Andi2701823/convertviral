import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import SubscriptionManager from '@/components/SubscriptionManager';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Abonnementverwaltung - ConvertViral',
  description: 'Verwalten Sie Ihr ConvertViral-Abonnement und Ihre Zahlungsinformationen.',
};

export default async function BillingPage() {
  // Benutzer-Session abrufen
  const session = await getServerSession(authOptions);
  
  // Wenn kein Benutzer angemeldet ist, zur Anmeldeseite weiterleiten
  if (!session?.user) {
    redirect('/login?redirect=billing');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Abonnementverwaltung</h1>
        <p className="text-gray-600">
          Verwalten Sie Ihr Abonnement und Ihre Zahlungsinformationen.
        </p>
      </div>

      <div className="space-y-8">
        <SubscriptionManager />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Rechnungen</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Sehen Sie Ihre Rechnungshistorie ein und laden Sie Rechnungen herunter.
          </p>
          <Link 
            href="/billing/invoices" 
            className="inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors"
          >
            Rechnungen anzeigen
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Hilfe & Support</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Haben Sie Fragen zu Ihrem Abonnement oder Ihrer Rechnung? Unser Support-Team hilft Ihnen gerne weiter.
          </p>
          <Link 
            href="/contact?subject=billing" 
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Support kontaktieren
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Häufig gestellte Fragen</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Wie kann ich mein Abonnement kündigen?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sie können Ihr Abonnement jederzeit über die Schaltfläche "Abonnement kündigen" oben auf dieser Seite kündigen. 
                Ihr Abonnement bleibt bis zum Ende der aktuellen Abrechnungsperiode aktiv.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Wann wird mir mein Abonnement in Rechnung gestellt?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ihr Abonnement wird automatisch am Ende jeder Abrechnungsperiode verlängert und in Rechnung gestellt, 
                es sei denn, Sie kündigen es vorher.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Kann ich meinen Plan ändern?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ja, Sie können jederzeit zwischen den Pro- und Business-Plänen wechseln. 
                Besuchen Sie dazu die <Link href="/pricing" className="text-blue-600 hover:underline">Preisseite</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}