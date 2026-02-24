# RecoverEaseFit — Full Deployment Guide

Complete step-by-step record of everything done to build and deploy recovereasefit.com.

---

## Stack Overview

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe (Checkout Sessions + Webhooks) |
| Hosting | Vercel |
| Domain | Namecheap → recovereasefit.com |
| Supplier | AliExpress (manual orders) + CJ Dropshipping (sourcing) |

---

## 1. Business Model

- **Type:** Dropshipping store (recovery & fitness products)
- **Niche:** Massage balls, foam rollers, resistance bands
- **Target markets:** UK, Canada, Australia
- **Payment processor:** Stripe (1.5% + 20p per UK transaction — cheapest option)
- **Supplier:** AliExpress for product sourcing, CJ Dropshipping for fulfillment

### How Orders Work
```
Customer buys on recovereasefit.com → Stripe processes payment
        ↓
You receive notification
        ↓
You manually order from AliExpress/CJ Dropshipping
        ↓
Enter customer's shipping address at checkout
        ↓
Supplier ships directly to customer
        ↓
You keep the profit margin
```

---

## 2. Product Selection

### Products Listed
| Product | AliExpress Link | Cost | Selling Price |
|---|---|---|---|
| Rubber Fascia Massage Ball | https://www.aliexpress.com/item/1005006723246205.html | ~£2.44 | £14.99 |
| Hollow Foam Massage Roller | https://www.aliexpress.com/item/1005007038407012.html | ~£2.30 | £16.99 |
| 7Pcs TPE Resistance Bands Set | https://www.aliexpress.com/item/1005007539844578.html | ~£3.01 | £19.99 |

### Product Selection Criteria
- 4.5+ star rating
- 1,000+ sold (proven demand)
- Lightweight (cheap shipping)
- 5-10x markup potential

---

## 3. Supplier Setup — CJ Dropshipping

1. Created account at **cjdropshipping.com**
2. Completed user questionnaire:
   - Platform: Others (custom Next.js store)
   - Orders per day: 0 (just starting)
   - Categories: Sports & Outdoors, Health & Beauty
3. Submitted sourcing requests for all 3 products:
   - Pasted AliExpress URL in sourcing form
   - Set sourcing purpose: "To Get a Better Price"
   - Target prices: ~$2.50–$5.00 USD
   - Description: "For dropshipping to UK, Canada, Australia. Single piece per order. Prefer UK warehouse if available."
4. CJ responded within 24 hours with matched products

---

## 4. Stripe Setup

1. Created account at **stripe.com**
2. Filled in business details:
   - Business name: `RecoverEaseFit`
   - Business website: `https://recovereasefit.com`
   - Business type: Individual / Sole trader
   - Description: "We sell recovery and fitness products including massage balls, foam rollers, and resistance bands through one-time online orders. Products are shipped directly from suppliers to customers."
3. Selected payment types:
   - ✅ Non-recurring payments
   - ✅ Invoices
   - ✅ Fraud protection
4. Selected integration: **Prebuilt checkout form**
5. Got API keys from **dashboard.stripe.com/test/apikeys**:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`
6. Created webhook at **dashboard.stripe.com/webhooks**:
   - Endpoint URL: `https://recovereasefit.com/api/webhook/stripe`
   - Event: `checkout.session.completed`
   - Got webhook signing secret: `whsec_...`

---

## 5. Supabase Database Setup

1. Created project at **supabase.com**
2. Got credentials from **Settings → API**:
   - Project URL
   - Anon key
   - Service role key
3. Opened **SQL Editor** and ran the following SQL:

### Create Tables
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  stripe_price_id TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  supplier_url TEXT,
  supplier_cost DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  stripe_checkout_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(10, 2) NOT NULL CHECK (price_at_time >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enable Row Level Security
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Service role can insert orders" ON orders FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can update orders" ON orders FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can insert order items" ON order_items FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
```

### Add supplier columns
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_cost DECIMAL(10, 2);
```

### Insert 3 Products
```sql
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;

INSERT INTO products (name, description, price, image_url, stripe_price_id, stock_quantity, supplier_url, supplier_cost) VALUES
(
  'Rubber Fascia Massage Ball',
  'Portable physiotherapy lacrosse massage ball for yoga, fitness, and muscle relaxation. Perfect for trigger point therapy and pain relief.',
  14.99,
  'https://ae-pic-a1.aliexpress-media.com/kf/S2fa40b0eed6b4025b9714ccd3974851eH.jpg',
  'price_pending',
  50,
  'https://www.aliexpress.com/item/1005006723246205.html',
  3.00
),
(
  'Hollow Foam Massage Roller',
  'High-density foam roller for deep tissue muscle relaxation, yoga, pilates and post-workout recovery.',
  16.99,
  'https://ae-pic-a1.aliexpress-media.com/kf/S5f7552c9257b459ea2f78a7de1c7e6401.jpg',
  'price_pending',
  50,
  'https://www.aliexpress.com/item/1005007038407012.html',
  2.30
),
(
  '7Pcs TPE Resistance Bands Set',
  'Stackable resistance bands set for strength training, fitness, workout and stretching. Includes 7 bands with different tension levels.',
  19.99,
  'https://ae-pic-a1.aliexpress-media.com/kf/S19aee994b29d4beeac7517d3aa7edaceD.png',
  'price_pending',
  50,
  'https://www.aliexpress.com/item/1005007539844578.html',
  3.01
);
```

### Set stock quantity
```sql
UPDATE products SET stock_quantity = 50;
```

---

## 6. Environment Variables

Created `.env.local` in project root (never committed to Git):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://recovereasefit.com
```

---

## 7. GitHub Setup

1. Installed GitHub CLI: `brew install gh`
2. Logged in: `gh auth login`
   - Selected: GitHub.com → HTTPS → Login with web browser
3. Created repo and pushed:
   ```bash
   gh repo create recovereasefit --private --source=. --remote=origin --push
   ```
4. Repo URL: https://github.com/hMiyazaki95/recovereasefit

---

## 8. Vercel Deployment

1. Created account at **vercel.com** using GitHub login
2. Clicked **"Add New Project"** → imported `recovereasefit` repo
3. Added all environment variables under **Settings → Environment Variables**:

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Mark as Sensitive |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe dashboard |
| `STRIPE_SECRET_KEY` | Mark as Sensitive |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook settings |
| `NEXT_PUBLIC_APP_URL` | https://recovereasefit.com |

4. Clicked **Deploy**

### Build Errors Fixed During Deployment

**Error 1:** `react/no-unescaped-entities`
- Fix: Added `.eslintrc.json` with `"react/no-unescaped-entities": "off"`
- Also added `eslint: { ignoreDuringBuilds: true }` to `next.config.mjs`

**Error 2:** `useSearchParams() should be wrapped in a suspense boundary`
- Fix: Wrapped `SuccessPage` content in `<Suspense>` boundary in `app/success/page.tsx`

**Error 3:** `Missing STRIPE_SECRET_KEY environment variable`
- Fix: Added all environment variables in Vercel Settings → Environment Variables

---

## 9. Domain Connection (Namecheap → Vercel)

1. Bought domain **recovereasefit.com** on Namecheap
2. In Vercel → project → **Settings → Domains** → added `recovereasefit.com`
3. Vercel provided DNS records:

| Type | Host | Value |
|---|---|---|
| A | @ | 216.198.79.1 |
| CNAME | www | cname.vercel-dns.com |

4. In Namecheap → **Domain List → Manage → Advanced DNS** → added both records
5. Waited ~15 minutes for DNS propagation
6. Vercel showed **"Valid Configuration"** ✅

---

## 10. Post-Deployment Checklist

- [x] Site live at https://recovereasefit.com
- [x] 3 products displaying from Supabase
- [x] Stripe checkout working (test mode)
- [x] Webhook receiving events
- [ ] Update contact info in `app/page.tsx` (currently placeholder address/phone)
- [ ] Add reviews section under product images
- [ ] Set up email: support@recovereasefit.com
- [ ] Switch Stripe from test mode to live mode when ready
- [ ] Submit remaining 2 CJ sourcing requests (foam roller, resistance bands)
- [ ] Update `stripe_price_id` in Supabase once Stripe products are created

---

## 11. How to Add New Products

1. Find product on AliExpress
2. Run in **Supabase → SQL Editor**:
```sql
INSERT INTO products (name, description, price, image_url, stripe_price_id, stock_quantity, supplier_url, supplier_cost)
VALUES (
  'Product Name',
  'Product description here.',
  19.99,
  'https://image-url-here.jpg',
  'price_pending',
  50,
  'https://www.aliexpress.com/item/XXXXXXXXXX.html',
  3.00
);
```
3. Submit sourcing request to CJ Dropshipping for the product

---

## 12. How to Process an Order (Manual Dropshipping)

1. Receive Stripe payment notification by email
2. Go to the AliExpress product link stored in `supplier_url`
3. Add to cart → proceed to checkout
4. Enter **customer's shipping address** (not yours)
5. Pay with your card (your cost = `supplier_cost`)
6. AliExpress ships directly to customer
7. Update order status in Supabase to `shipped`

---

## 13. Important URLs

| Service | URL |
|---|---|
| Live site | https://recovereasefit.com |
| Vercel dashboard | https://vercel.com/dashboard |
| Supabase dashboard | https://supabase.com/dashboard |
| Stripe dashboard | https://dashboard.stripe.com |
| GitHub repo | https://github.com/hMiyazaki95/recovereasefit |
| CJ Dropshipping | https://cjdropshipping.com |
