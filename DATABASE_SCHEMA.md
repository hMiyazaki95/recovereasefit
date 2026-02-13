# Supabase Database Schema

This document outlines the database schema for the e-commerce application. Copy and paste these SQL statements into your Supabase SQL Editor.

## 1. Create Tables

```sql
-- Products table (publicly readable, admin-only write)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  stripe_price_id TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table (private, user-specific access)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  stripe_checkout_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table (junction table)
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(10, 2) NOT NULL CHECK (price_at_time >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

## 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
```

## 3. Create RLS Policies

```sql
-- Products: Anyone can read, only authenticated users with admin role can write
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Orders: Users can only see their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Service role can insert orders"
  ON orders FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can update orders"
  ON orders FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Order items: Users can view items from their own orders
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Service role can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
```

## 4. Create Functions and Triggers

```sql
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders table
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 5. Seed Sample Data (Optional)

```sql
-- Insert sample products
INSERT INTO products (name, description, price, image_url, stripe_price_id, stock_quantity) VALUES
  ('Premium Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 199.99, 'https://via.placeholder.com/400x400?text=Headphones', 'price_xxxxx', 50),
  ('Smart Watch Pro', 'Advanced smartwatch with health tracking features', 299.99, 'https://via.placeholder.com/400x400?text=Watch', 'price_xxxxx', 30),
  ('Laptop Stand', 'Ergonomic aluminum laptop stand for better posture', 49.99, 'https://via.placeholder.com/400x400?text=Stand', 'price_xxxxx', 100),
  ('USB-C Hub', '7-in-1 USB-C hub with multiple ports and card readers', 79.99, 'https://via.placeholder.com/400x400?text=Hub', 'price_xxxxx', 75);
```

## 6. Setup Supabase Storage (For Product Images)

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `product-images`
3. Set it to Public
4. Create a policy to allow public reads:

```sql
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND auth.jwt() ->> 'role' = 'admin'
  );
```

## Notes

- Replace `price_xxxxx` in the sample data with actual Stripe Price IDs after creating products in your Stripe Dashboard
- The `admin` role check in RLS policies assumes you'll set custom claims in your JWT. For development, you may want to adjust these policies
- Always test your RLS policies before going to production
- Consider adding additional indexes based on your query patterns
