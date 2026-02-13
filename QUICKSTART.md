# Quick Start Guide - E-Commerce Store

Get your e-commerce store running in 5 minutes!

## 1. Install Dependencies

Already done! ✅ (Supabase, Stripe, Zod, Lucide React are installed)

## 2. Set Up Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

You'll need to fill in these values:

```env
# Supabase (from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here

# Stripe (from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

## 3. Set Up Supabase Database

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Copy and paste the SQL from [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md)
5. Run all sections (1-6)

## 4. Set Up Stripe

1. Create a free account at [Stripe](https://stripe.com)
2. Make sure you're in **Test Mode**
3. Get your API keys from Developers → API Keys
4. For webhooks, use Stripe CLI locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or download from https://stripe.com/docs/stripe-cli

# Forward webhooks to your local dev server
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

## 5. Run the Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000/shop](http://localhost:3000/shop)

## 6. Test a Purchase

Use Stripe test card:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## Files You Need to Configure

1. **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - SQL commands for Supabase
2. **[.env.local](#2-set-up-environment-variables)** - Your API keys
3. **[ECOMMERCE_SETUP.md](./ECOMMERCE_SETUP.md)** - Full detailed guide

## Routes Created

- `/shop` - Product listing page
- `/shop/products/[id]` - Individual product page
- `/shop/cart` - Shopping cart
- `/shop/success` - Order confirmation
- `/api/checkout` - Create Stripe session
- `/api/webhook/stripe` - Handle payment confirmations

## Common Issues

### Products not showing?
→ Make sure you ran the SQL schema and added sample products

### Checkout not working?
→ Verify your Stripe keys are correct in `.env.local`

### Webhook errors?
→ Make sure Stripe CLI is running with `stripe listen`

## Need Help?

📖 Read the full guide: [ECOMMERCE_SETUP.md](./ECOMMERCE_SETUP.md)

🐛 Something broken? Check:
1. Browser console for errors
2. Terminal for server errors
3. Supabase logs
4. Stripe Dashboard → Webhooks → Logs

## Architecture Overview

```
User → Product Page → Add to Cart → Cart Page → Checkout
                                                    ↓
                                            Stripe Checkout
                                                    ↓
                                            Payment Success
                                                    ↓
                                        Webhook → Update Order
                                                    ↓
                                            Success Page
```

Happy building! 🚀
