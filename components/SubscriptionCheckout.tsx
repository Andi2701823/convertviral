'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { stripeConfig } from '@/lib/stripe';

// Stripe Promise initialisieren
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Preise für die verschiedenen Abonnements
const PRICE_IDS = {
  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  business: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
};

type PlanType = 'pro' | 'business';

interface CheckoutFormProps {
  clientSecret: string;
  planType: PlanType;
}

// Das eigentliche Checkout-Formular
function CheckoutForm({ clientSecret, planType }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    // Zahlung bestätigen
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?payment_success=true`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setError(error.message || 'Ein Fehler ist aufgetreten.');
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setSucceeded(true);
      setProcessing(false);
      
      // Kurze Verzögerung, dann zur Dashboard-Seite weiterleiten
      setTimeout(() => {
        router.push('/dashboard?payment_success=true');
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {planType === 'pro' ? 'Pro' : 'Business'} Abonnement
      </h2>
      
      <div className="mb-6">
        <PaymentElement />
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {succeeded ? (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Zahlung erfolgreich! Sie werden weitergeleitet...
        </div>
      ) : (
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {processing ? 'Verarbeitung...' : 'Jetzt abonnieren'}
        </button>
      )}
      
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Durch die Bestätigung stimmen Sie unseren{' '}
        <a href="/terms" className="text-blue-600 hover:underline">
          Nutzungsbedingungen
        </a>{' '}
        und{' '}
        <a href="/privacy" className="text-blue-600 hover:underline">
          Datenschutzrichtlinien
        </a>{' '}
        zu.
      </p>
    </form>
  );
}

interface SubscriptionCheckoutProps {
  planType: PlanType;
}

// Wrapper-Komponente, die das Checkout-Formular mit Stripe Elements einrichtet
export default function SubscriptionCheckout({ planType }: SubscriptionCheckoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wenn kein Benutzer angemeldet ist, zur Anmeldeseite weiterleiten
    if (!session?.user) {
      router.push('/login?redirect=pricing');
      return;
    }

    // Preis-ID basierend auf dem ausgewählten Plan abrufen
    const priceId = planType === 'pro' ? PRICE_IDS.pro : PRICE_IDS.business;
    
    if (!priceId) {
      setError('Preis-ID nicht konfiguriert. Bitte kontaktieren Sie den Support.');
      setLoading(false);
      return;
    }

    // Abonnement erstellen und Client-Secret abrufen
    async function createSubscription() {
      try {
        const response = await fetch('/api/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priceId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ein Fehler ist aufgetreten.');
        }

        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || 'Ein Fehler ist aufgetreten.');
      } finally {
        setLoading(false);
      }
    }

    createSubscription();
  }, [session, router, planType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
        <button
          onClick={() => router.push('/pricing')}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Zurück zur Preisübersicht
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#3B82F6', // Tailwind blue-500
    },
  };

  const options: any = {
    clientSecret,
    appearance,
    locale: 'de',
  };

  return (
    <div className="py-8">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm clientSecret={clientSecret} planType={planType} />
      </Elements>
    </div>
  );
}