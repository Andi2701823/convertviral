'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type SubscriptionStatus = 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing' | 'unpaid' | null;

interface Subscription {
  id: string;
  stripeSubscriptionId: string;
  status: SubscriptionStatus;
  priceId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export default function SubscriptionManager() {
  const { data: session } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Abonnementinformationen abrufen
  useEffect(() => {
    if (!session?.user) return;

    async function fetchSubscription() {
      try {
        const response = await fetch('/api/subscriptions');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ein Fehler ist aufgetreten.');
        }

        setSubscription(data.subscription);
      } catch (err: any) {
        setError(err.message || 'Ein Fehler ist aufgetreten.');
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [session]);

  // Abonnement kündigen
  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setCancelling(true);
    try {
      const response = await fetch(`/api/subscriptions/${subscription.stripeSubscriptionId}/cancel`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ein Fehler ist aufgetreten.');
      }

      // Abonnementdaten aktualisieren
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: true,
      });

      setCancelModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten.');
    } finally {
      setCancelling(false);
    }
  };

  // Abonnementkündigung rückgängig machen
  const handleReactivateSubscription = async () => {
    if (!subscription) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/subscriptions/${subscription.stripeSubscriptionId}/reactivate`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ein Fehler ist aufgetreten.');
      }

      // Abonnementdaten aktualisieren
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: false,
      });
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  // Zahlungsmethode aktualisieren
  const handleUpdatePaymentMethod = () => {
    router.push('/billing/payment-method');
  };

  // Plan upgraden
  const handleUpgradePlan = () => {
    router.push('/pricing');
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100 rounded-md mb-4">
          {error}
        </div>
        <button
          onClick={() => setLoading(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Kein aktives Abonnement</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Sie haben derzeit kein aktives Abonnement. Upgraden Sie auf einen Premium-Plan, um von allen Funktionen zu profitieren.
        </p>
        <button
          onClick={handleUpgradePlan}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Pläne anzeigen
        </button>
      </div>
    );
  }

  // Abonnementdetails formatieren
  const planName = subscription.priceId.includes('pro') ? 'Pro' : 'Business';
  const endDate = new Date(subscription.currentPeriodEnd).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Ihr Abonnement</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Plan</span>
          <span className="font-medium">{planName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Status</span>
          <span className="font-medium">
            {subscription.status === 'active' ? (
              <span className="text-green-600 dark:text-green-400">Aktiv</span>
            ) : subscription.status === 'canceled' ? (
              <span className="text-red-600 dark:text-red-400">Gekündigt</span>
            ) : subscription.status === 'past_due' ? (
              <span className="text-orange-600 dark:text-orange-400">Zahlung überfällig</span>
            ) : (
              subscription.status
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Nächste Abrechnung</span>
          <span className="font-medium">{endDate}</span>
        </div>
        {subscription.cancelAtPeriodEnd && (
          <div className="p-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 rounded-md">
            Ihr Abonnement endet am {endDate} und wird nicht automatisch verlängert.
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
          <button
            onClick={() => setCancelModalOpen(true)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors"
          >
            Abonnement kündigen
          </button>
        )}
        {subscription.cancelAtPeriodEnd && (
          <button
            onClick={handleReactivateSubscription}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Abonnement fortsetzen
          </button>
        )}
        <button
          onClick={handleUpdatePaymentMethod}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors"
        >
          Zahlungsmethode aktualisieren
        </button>
        <button
          onClick={handleUpgradePlan}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors"
        >
          Plan ändern
        </button>
      </div>

      {/* Kündigungsbestätigungsdialog */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Abonnement kündigen</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sind Sie sicher, dass Sie Ihr Abonnement kündigen möchten? Sie können die Dienste noch bis zum {endDate} nutzen.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors"
                disabled={cancelling}
              >
                Abbrechen
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
                disabled={cancelling}
              >
                {cancelling ? 'Wird gekündigt...' : 'Kündigen bestätigen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}