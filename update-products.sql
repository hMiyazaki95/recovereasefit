-- ====================================
-- UPDATE PRODUCTS WITH FITNESS GEAR DATA
-- Run this in Supabase SQL Editor to replace sample products
-- ====================================

-- Clear existing sample products
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;

-- Insert fitness/massage equipment products
-- Images are served locally from /images/products/
INSERT INTO products (name, description, price, image_url, stripe_price_id, stock_quantity) VALUES
  (
    'Textured Massage Roller',
    'Deep tissue foam roller with textured surface for targeted muscle recovery. Ideal for pre and post-workout use. Relieves muscle tension and improves flexibility.',
    6.90,
    '/images/products/massage-roller.jpg',
    'price_sample_1',
    120
  ),
  (
    'Colorful Massage Ball Set',
    'Set of 5 massage balls in different firmness levels. Perfect for trigger point therapy, plantar fasciitis relief, and deep tissue massage.',
    7.90,
    '/images/products/massage-balls.jpg',
    'price_sample_2',
    85
  ),
  (
    'Dual Peanut Massage Ball',
    'Double lacrosse ball design for spinal massage and neck relief. Ergonomic peanut shape targets hard-to-reach muscles along the spine.',
    8.90,
    '/images/products/peanut-ball.jpg',
    'price_sample_3',
    95
  ),
  (
    'Round Massage Ball Sets',
    'Multi-color therapy ball set with varying density levels. Great for hand, foot, and full-body myofascial release.',
    6.90,
    '/images/products/round-balls.jpg',
    'price_sample_4',
    110
  ),
  (
    'Professional Foam Roller',
    'High-density EVA foam roller for deep tissue massage. 18-inch length perfect for back, legs, and IT band recovery.',
    20.90,
    '/images/products/foam-roller.jpg',
    'price_sample_5',
    60
  ),
  (
    'Resistance Bands Set',
    'Set of 5 resistance bands with different tension levels. Includes carry bag, door anchor, and exercise guide. Perfect for home workouts.',
    12.90,
    '/images/products/resistance-bands.jpg',
    'price_sample_6',
    150
  ),
  (
    'Percussion Massage Gun',
    'Professional-grade deep tissue massage gun with 6 speed settings and 4 interchangeable heads. Quiet motor, long battery life.',
    89.90,
    '/images/products/massage-gun.jpg',
    'price_sample_7',
    40
  ),
  (
    'Yoga Mat Premium',
    'Extra thick 6mm non-slip yoga mat with alignment lines. Eco-friendly TPE material. Perfect for yoga, pilates, and floor exercises.',
    24.90,
    '/images/products/yoga-mat.jpg',
    'price_sample_8',
    70
  );

-- ====================================
-- DONE! Refresh your website to see the new products.
-- ====================================
