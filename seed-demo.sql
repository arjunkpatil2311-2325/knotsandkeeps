-- Knots and Keeps Demo Seed Data
-- Run this in your Supabase SQL Editor AFTER running the supabase-schema.sql

-- 1. Insert a demo category
insert into public.categories (id, name, slug, description)
values ('11111111-1111-1111-1111-111111111111', 'Anime Inspired', 'anime-inspired', 'Bracelets inspired by your favorite anime characters.')
on conflict (slug) do nothing;

-- 2. Insert demo products
insert into public.products (
  id, name, slug, short_description, description, price, compare_at_price, stock_quantity, status, category_id, is_featured, is_bestseller
) values 
(
  '22222222-2222-2222-2222-222222222221',
  'Rengoku Flame Bracelet',
  'rengoku-flame-bracelet',
  'Set your heart ablaze with this premium flame-colored bracelet.',
  'Handcrafted with premium red and orange beads, this bracelet is inspired by the Flame Hashira. Perfect for everyday wear and a subtle nod to your favorite anime.',
  799.00,
  999.00,
  15,
  'published',
  '11111111-1111-1111-1111-111111111111',
  true,
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Gojo Infinity Band',
  'gojo-infinity-band',
  'Minimalist blue and white design.',
  'A sleek, modern bracelet featuring striking blue beads contrasted with pure white accents. Limited edition.',
  899.00,
  null,
  0, -- Sold out demo
  'published',
  '11111111-1111-1111-1111-111111111111',
  true,
  false
),
(
  '22222222-2222-2222-2222-222222222223',
  'Custom Name Keep',
  'custom-name-keep',
  'Personalize your wristwear.',
  'Add any name or word up to 8 characters. Perfect for couples or best friends.',
  599.00,
  699.00,
  3, -- Low stock demo
  'published',
  null,
  false,
  true
);

-- (Note: Images require physical uploads to the Storage bucket first, so we omit inserting product_images directly here unless using external placeholder URLs)

-- Example to add external image placeholder if needed:
-- insert into public.product_images (product_id, url, is_primary) values 
-- ('22222222-2222-2222-2222-222222222221', 'https://via.placeholder.com/800x800.png?text=Rengoku+Flame', true);
