-- Knots and Keeps Supabase Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profile RLS
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- 2. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories RLS
alter table public.categories enable row level security;
create policy "Categories are viewable by everyone." on public.categories for select using (true);
create policy "Only admins can insert categories." on public.categories for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can update categories." on public.categories for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can delete categories." on public.categories for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 3. COLLECTIONS TABLE
create table if not exists public.collections (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Collections RLS
alter table public.collections enable row level security;
create policy "Collections are viewable by everyone." on public.collections for select using (true);
create policy "Only admins can insert collections." on public.collections for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can update collections." on public.collections for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can delete collections." on public.collections for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 4. PRODUCTS TABLE
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  short_description text,
  description text,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  stock_quantity integer not null default 0,
  sku text,
  category_id uuid references public.categories(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  character_theme text,
  tags text[], -- Array of strings
  specifications jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean default false,
  is_bestseller boolean default false,
  is_new_arrival boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Computed discount percentage (for easy querying)
alter table public.products add column discount_percentage integer generated always as (
  case 
    when compare_at_price > price then round(((compare_at_price - price) / compare_at_price) * 100)
    else 0 
  end
) stored;

-- Products RLS
alter table public.products enable row level security;
create policy "Published products are viewable by everyone." on public.products for select using (status = 'published');
create policy "Admins can view all products." on public.products for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can insert products." on public.products for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can update products." on public.products for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can delete products." on public.products for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 5. PRODUCT IMAGES TABLE
create table if not exists public.product_images (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  url text not null,
  is_primary boolean default false,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Product Images RLS
alter table public.product_images enable row level security;
create policy "Product images are viewable by everyone." on public.product_images for select using (
  exists (select 1 from public.products where id = product_images.product_id and status = 'published') 
  or 
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can insert product images." on public.product_images for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can update product images." on public.product_images for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can delete product images." on public.product_images for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);


-- 6. ORDERS TABLE
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null, -- Optional if guest checkout
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address text not null,
  shipping_city text not null,
  shipping_state text not null,
  shipping_zip text not null,
  shipping_country text not null default 'India',
  subtotal numeric(10,2) not null,
  total_discount numeric(10,2) default 0,
  total_amount numeric(10,2) not null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  order_status text not null default 'pending' check (order_status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders RLS
alter table public.orders enable row level security;
create policy "Users can view their own orders." on public.orders for select using (auth.uid() = user_id);
create policy "Admins can view all orders." on public.orders for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Anyone can insert orders (checkout)." on public.orders for insert with check (true);
create policy "Only admins can update orders." on public.orders for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 7. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null, -- Snapshotted at time of purchase
  price numeric(10,2) not null, -- Snapshotted price
  quantity integer not null check (quantity > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items RLS
alter table public.order_items enable row level security;
create policy "Users can view their own order items." on public.order_items for select using (
  exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
);
create policy "Admins can view all order items." on public.order_items for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Anyone can insert order items (checkout)." on public.order_items for insert with check (true);

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;

-- Storage RLS (Product Images)
create policy "Product images are publicly accessible." on storage.objects for select using (bucket_id = 'product-images');
create policy "Only admins can upload images." on storage.objects for insert with check (
  bucket_id = 'product-images' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can update images." on storage.objects for update using (
  bucket_id = 'product-images' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can delete images." on storage.objects for delete using (
  bucket_id = 'product-images' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- FUNCTION TO HANDLE NEW USER SIGNUPS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- TRIGGER FOR NEW USER SIGNUPS
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- FUNCTION TO AUTO UPDATE updated_at COLUMN
create or replace function public.set_current_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure set_current_timestamp_updated_at();
create trigger set_products_updated_at before update on public.products for each row execute procedure set_current_timestamp_updated_at();
create trigger set_orders_updated_at before update on public.orders for each row execute procedure set_current_timestamp_updated_at();
