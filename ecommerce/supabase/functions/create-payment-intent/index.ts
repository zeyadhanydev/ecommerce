import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, userId, cartItems } = await req.json();

    // Validate the input
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    if (!Deno.env.get('STRIPE_SECRET_KEY')) {
      throw new Error('Stripe secret key is not configured');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: userId || 'guest',
        itemCount: cartItems?.length || 0,
      },
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to create payment intent' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
