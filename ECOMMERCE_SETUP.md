# E-Commerce Setup Guide

This guide will help you set up and deploy the e-commerce functionality built into this Next.js application.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Stripe Setup](#stripe-setup)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Testing Locally](#testing-locally)
7. [Deployment](#deployment)
8. [Security Checklist](#security-checklist)

## Prerequisites

Before you begin, make sure you have:

- Node.js 18+ installed
- A [Supabase](https://supabase.com) account (free tier is fine)
- A [Stripe](https://stripe.com) account (use test mode for development)
- Git installed on your machine

## Supabase Setup

### 1. Create a New Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Choose a name for your project
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Plan**: Free tier works great for starting

### 2. Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **IMPORTANT**: Never commit the `service_role` key to Git or expose it client-side!

### 3. Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) file in this repository
3. Copy and paste ALL the SQL commands from sections 1-4 into the SQL Editor
4. Click **Run** to execute the commands
5. Verify the tables were created under **Table Editor**

### 4. (Optional) Add Sample Products

If you want to test with sample data, run the SQL from section 5 in `DATABASE_SCHEMA.md`.

⚠️ **Note**: You'll need to replace `price_xxxxx` with actual Stripe Price IDs after setting up Stripe (see below).

## Stripe Setup

### 1. Create a Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Sign up for a new account
3. **Make sure you're in Test Mode** (toggle in the top right)

### 2. Get Your API Keys

1. Go to **Developers** → **API Keys**
2. Copy the following:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (click "Reveal") → `STRIPE_SECRET_KEY`

### 3. Create Products in Stripe (Optional but Recommended)

For real products, you should create them in Stripe:

1. Go to **Products** in your Stripe Dashboard
2. Click **Add Product**
3. Fill in the details:
   - Name, description, images
   - **Pricing**: Set to "Standard pricing" with your price
4. After creating, copy the **Price ID** (starts with `price_`)
5. Update your Supabase products table with this `stripe_price_id`

### 4. Set Up Webhooks

This is crucial for confirming payments:

1. Go to **Developers** → **Webhooks**
2. Click **Add Endpoint**
3. For local testing:
   - Use the Stripe CLI (see Testing Locally section)
4. For production:
   - Endpoint URL: `https://your-domain.com/api/webhook/stripe`
   - Events to send: Select `checkout.session.completed`
5. After creating, copy the **Signing Secret** → `STRIPE_WEBHOOK_SECRET`

## Environment Variables

1. Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in all the values you collected:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL (update for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **NEVER commit `.env.local` to Git!** It's already in `.gitignore`.

## Database Setup

Run the SQL commands from [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) in this order:

1. **Create Tables** (Section 1)
2. **Enable RLS** (Section 2)
3. **Create Policies** (Section 3)
4. **Create Functions & Triggers** (Section 4)
5. **Seed Data** (Section 5 - Optional)
6. **Setup Storage** (Section 6 - Optional)

## Testing Locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000/shop](http://localhost:3000/shop) to see your store!

### 3. Test Stripe Webhooks Locally

Install the Stripe CLI:

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (using Scoop)
scoop install stripe

# Linux
# Download from https://github.com/stripe/stripe-cli/releases
```

Forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

This will give you a webhook secret starting with `whsec_`. Add it to your `.env.local`.

### 4. Test a Purchase

Use Stripe test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date, any CVC, and any ZIP code.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub:

```bash
git add .
git commit -m "Add e-commerce functionality"
git push origin main
```

2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add all environment variables from `.env.local`
5. Deploy!

### Update Stripe Webhook

After deployment:

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Update your webhook endpoint to: `https://your-domain.vercel.app/api/webhook/stripe`
3. Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables
4. Redeploy your app

### Update Environment Variables

In Vercel:

1. Go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` to your production URL
3. Redeploy

## Security Checklist

Before going live, make sure:

- ✅ All environment variables are set correctly
- ✅ RLS policies are enabled on all Supabase tables
- ✅ `SUPABASE_SERVICE_ROLE_KEY` is NEVER exposed client-side
- ✅ `STRIPE_SECRET_KEY` is NEVER exposed client-side
- ✅ `.env.local` is in `.gitignore`
- ✅ Stripe webhook signature is verified in `/api/webhook/stripe`
- ✅ Input validation using Zod is in place
- ✅ You're using Stripe's test mode until ready to accept real payments
- ✅ Products have valid `stripe_price_id` values
- ✅ Stock quantities are properly managed

## Switching to Production Mode

When ready to accept real payments:

1. Switch Stripe to **Live Mode** in the dashboard
2. Create new products in live mode
3. Generate new API keys from live mode
4. Update environment variables with live keys
5. Update webhook endpoint in live mode
6. Test thoroughly before announcing!

## Troubleshooting

### Products not showing up?

- Check that you've run the SQL schema
- Verify RLS policies are set up correctly
- Make sure `NEXT_PUBLIC_SUPABASE_URL` is correct

### Checkout not working?

- Verify all Stripe keys are correct
- Check browser console for errors
- Make sure products have valid data

### Webhook not firing?

- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check that the webhook endpoint is reachable
- Look at Stripe Dashboard → Webhooks → Logs

### Stock not updating after purchase?

- Check webhook is working
- Verify service role key has proper permissions
- Look at Vercel/server logs for errors

## Support

For issues related to:

- **Supabase**: [Supabase Docs](https://supabase.com/docs)
- **Stripe**: [Stripe Docs](https://stripe.com/docs)
- **Next.js**: [Next.js Docs](https://nextjs.org/docs)

## Next Steps

- Add user authentication with Supabase Auth
- Implement order history page
- Add email notifications with Resend or SendGrid
- Set up product reviews and ratings
- Add filtering and search functionality
- Implement admin dashboard for managing products

Happy selling! 🎉
