'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Stripe Promise initialisieren
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  clientSecret: string;
}

// Das eigentliche Zahlungsformular
function PaymentForm({ clientSecret }: PaymentFormProps) {
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

    // Zahlungsmethode aktualisieren
    const { error: submitError } = await elements.submit();
    
    if (submitError) {
      setError(submitError.message || 'Ein Fehler ist aufgetreten.');
      setProcessing(false);
      return;
    }

    // Zahlungsmethode bestätigen
    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?payment_method_updated=true`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setError(error.message || 'Ein Fehler ist aufgetreten.');
      setProcessing(false);
    } else if (setupIntent && setupIntent.status === 'succeeded') {
      setSucceeded(true);
      setProcessing(false);
      
      // Kurze Verzögerung, dann zur Dashboard-Seite weiterleiten
      setTimeout(() => {
        router.push('/dashboard?payment_method_updated=true');
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Zahlungsmethode aktualisieren
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
          Zahlungsmethode erfolgreich aktualisiert! Sie werden weitergeleitet...
        </div>
      ) : (
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {processing ? 'Verarbeitung...' : 'Zahlungsmethode aktualisieren'}
        </button>
      )}
    </form>
  );
}

interface PaymentMethodFormProps {
  customerId: string;
}

// Wrapper-Komponente, die das Zahlungsformular mit Stripe Elements einrichtet
export default function PaymentMethodForm({ customerId }: PaymentMethodFormProps) {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setError('Kunden-ID nicht gefunden. Bitte kontaktieren Sie den Support.');
      setLoading(false);
      return;
    }

    // Setup Intent erstellen
    async function createSetupIntent() {
      try {
        const response = await fetch('/api/payment-methods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId }),
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

    createSetupIntent();
  }, [customerId]);

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
          onClick={() => router.push('/dashboard')}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Zurück zum Dashboard
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
        <PaymentForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
}