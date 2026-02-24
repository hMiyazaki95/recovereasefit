import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { getServiceSupabase } from '@/lib/supabase';
import { sendFulfilmentEmail } from '@/lib/email';

/**
 * Stripe Webhook Handler
 * This endpoint receives webhook events from Stripe to confirm payments
 * IMPORTANT: This must be configured in your Stripe Dashboard
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      {
        error: 'Invalid signature',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await handleCheckoutSessionCompleted(session);
    } catch (error) {
      console.error('Error handling checkout session:', error);
      return NextResponse.json(
        {
          error: 'Failed to process checkout session',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

/**
 * Handle successful checkout session
 * Creates order and order items in Supabase
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const supabase = getServiceSupabase();

  // Extract metadata
  const items = JSON.parse(session.metadata?.items || '[]');
  const totalAmount = parseFloat(session.metadata?.totalAmount || '0');

  // Use customer email as user_id (in production, use proper auth)
  const userId = session.customer_email || session.customer_details?.email || 'guest';

  // Create order in Supabase
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status: 'paid',
      total_amount: totalAmount,
      stripe_checkout_id: session.id,
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(`Failed to create order: ${orderError?.message}`);
  }

  // Fetch products for order items
  const productIds = items.map((item: any) => item.product_id);
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds);

  if (fetchError || !products) {
    throw new Error(`Failed to fetch products: ${fetchError?.message}`);
  }

  // Create order items
  const orderItems = items.map((item: any) => {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) {
      throw new Error(`Product not found: ${item.product_id}`);
    }

    return {
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: product.price,
    };
  });

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    throw new Error(`Failed to create order items: ${itemsError.message}`);
  }

  // Update product stock quantities
  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) continue;

    const newStock = product.stock_quantity - item.quantity;

    const { error: updateError } = await supabase
      .from('products')
      .update({ stock_quantity: Math.max(0, newStock) })
      .eq('id', item.product_id);

    if (updateError) {
      console.error(`Failed to update stock for ${item.product_id}:`, updateError);
    }
  }

  // Build fulfilment record
  const token = crypto.randomUUID();
  // shipping_details is present at runtime but not in all SDK type versions
  const sessionAny = session as any;
  const shipping = sessionAny.shipping_details?.address;
  const customerName =
    sessionAny.shipping_details?.name ||
    session.customer_details?.name ||
    'Customer';
  const customerEmail =
    session.customer_details?.email || userId;
  const customerPhone = session.customer_details?.phone || '';

  const fulfilmentItems = items.map((item: any) => {
    const product = products.find((p) => p.id === item.product_id);
    return {
      product_id: item.product_id,
      name: product?.name || item.product_id,
      quantity: item.quantity,
      price: product?.price || 0,
      cj_variant_id: product?.cj_variant_id || null,
    };
  });

  const { error: fulfilError } = await supabase
    .from('order_fulfillments')
    .insert({
      order_id: order.id,
      token,
      status: 'pending',
      customer_email: customerEmail,
      customer_name: customerName,
      customer_phone: customerPhone,
      shipping_address: shipping
        ? {
            line1: shipping.line1,
            line2: shipping.line2,
            city: shipping.city,
            state: shipping.state,
            postal_code: shipping.postal_code,
            country: shipping.country,
          }
        : null,
      items: fulfilmentItems,
      total_amount: totalAmount,
    });

  if (fulfilError) {
    console.error('Failed to create fulfilment record:', fulfilError.message);
  } else {
    // Send confirmation email to owner
    try {
      await sendFulfilmentEmail({
        orderId: order.id,
        token,
        customerEmail,
        customerName,
        customerPhone,
        shippingAddress: shipping
          ? {
              line1: shipping.line1 ?? undefined,
              line2: shipping.line2 ?? undefined,
              city: shipping.city ?? undefined,
              state: shipping.state ?? undefined,
              postal_code: shipping.postal_code ?? undefined,
              country: shipping.country ?? undefined,
            }
          : {},
        items: fulfilmentItems,
        totalAmount,
      });
    } catch (emailErr) {
      console.error('Failed to send fulfilment email:', emailErr);
    }
  }

  console.log(`Order ${order.id} created successfully for ${userId}`);
}
