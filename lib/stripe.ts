import Stripe from 'stripe';

// Validate Stripe secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    'Missing STRIPE_SECRET_KEY environment variable. Please check your .env.local file.'
  );
}

/**
 * Stripe client instance
 * IMPORTANT: This should only be used in server-side code
 * Never expose this in client-side code
 */
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

/**
 * Get Stripe publishable key for client-side
 */
export const getStripePublishableKey = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable.'
    );
  }

  return publishableKey;
};
