import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rechnungen - ConvertViral',
  description: 'Sehen Sie Ihre Rechnungshistorie ein und laden Sie Rechnungen herunter.',
};

interface Invoice {
  id: string;
  number: string;
  date: Date;
  amount: number;
  status: string;
  url: string | null;
}

export default async function InvoicesPage() {
  // Benutzer-Session abrufen
  const session = await getServerSession(authOptions);
  
  // Wenn kein Benutzer angemeldet ist, zur Anmeldeseite weiterleiten
  if (!session?.user) {
    redirect('/login?redirect=billing/invoices');
  }

  // Benutzer aus der Datenbank abrufen
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string }
  }) as any;

  if (!user || !(user as any).stripeCustomerId) {
    redirect('/pricing');
  }

  // Rechnungen von Stripe abrufen
  const stripeInvoices = await stripe.invoices.list({
    customer: (user as any).stripeCustomerId,
    limit: 100,
  });

  // Rechnungen formatieren
  const invoices: Invoice[] = stripeInvoices.data.map((invoice) => ({
    id: invoice.id || '',
    number: invoice.number || invoice.id || '',
    date: new Date(invoice.created * 1000),
    amount: invoice.total / 100, // Umrechnung von Cent in Euro
    status: invoice.status || 'unknown',
    url: invoice.hosted_invoice_url || null,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rechnungen</h1>
        <p className="text-gray-600">
          Sehen Sie Ihre Rechnungshistorie ein und laden Sie Rechnungen herunter.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rechnungsnummer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Datum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Betrag
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {invoice.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {invoice.date.toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {invoice.amount.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        invoice.status === 'open' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        invoice.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {invoice.status === 'paid' ? 'Bezahlt' :
                         invoice.status === 'open' ? 'Offen' :
                         invoice.status === 'draft' ? 'Entwurf' :
                         invoice.status === 'void' ? 'Storniert' :
                         invoice.status === 'uncollectible' ? 'Nicht einziehbar' :
                         'Unbekannt'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {invoice.url ? (
                        <a
                          href={invoice.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Anzeigen
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600">Nicht verfügbar</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sie haben noch keine Rechnungen.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Abonnement auswählen
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/billing"
          className="inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors"
        >
          Zurück zur Abonnementverwaltung
        </Link>
      </div>
    </div>
  );
}