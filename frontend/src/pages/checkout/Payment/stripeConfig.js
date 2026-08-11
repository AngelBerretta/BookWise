import { loadStripe } from '@stripe/stripe-js';

export const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const stripePromise = PUBLISHABLE_KEY
  ? loadStripe(PUBLISHABLE_KEY, {
      developerTools: { assistant: { enabled: false } },
    })
  : null;

// Stripe Elements corre dentro de un iframe y no puede leer nuestras
// variables CSS (--accent, --bg, etc.) — le pasamos los mismos colores
// "a mano", en claro y oscuro, para que no desentone con el resto de la app.
export const getStripeAppearance = () => {
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;

  return prefersDark
    ? {
        theme: 'night',
        variables: {
          colorPrimary: '***REMOVED***b7c8de',
          colorBackground: '***REMOVED***161820',
          colorText: '***REMOVED***f0ede6',
          colorDanger: '***REMOVED***ffb4ab',
          borderRadius: '8px',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }
    : {
        theme: 'stripe',
        variables: {
          colorPrimary: '***REMOVED***041627',
          colorBackground: '***REMOVED***fbf9f4',
          colorText: '***REMOVED***041627',
          colorDanger: '***REMOVED***ba1a1a',
          borderRadius: '8px',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      };
};