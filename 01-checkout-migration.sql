-- Knots & Keeps Checkout & Order Workflow Migration

-- 1. Create Order Sequence for KAK-1000 format
create sequence if not exists order_seq start 1001;

-- 2. Modify existing public.orders table
-- First, drop the existing check constraints on statuses if they exist
alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders drop constraint if exists orders_order_status_check;

-- Add new columns
alter table public.orders 
add column if not exists order_number text unique default 'KAK-' || nextval('order_seq')::text,
add column if not exists billing_address text,
add column if not exists billing_city text,
add column if not exists billing_state text,
add column if not exists billing_zip text,
add column if not exists billing_country text default 'India',
add column if not exists delivery_method text check (delivery_method in ('normal', 'fast')),
add column if not exists delivery_charge numeric(10,2) default 0,
add column if not exists payment_method text check (payment_method in ('prepaid', 'advance')),
add column if not exists amount_paid numeric(10,2) default 0,
add column if not exists amount_remaining numeric(10,2) default 0,
add column if not exists payment_transaction_id text,
add column if not exists tracking_number text,
add column if not exists courier_name text,
add column if not exists tracking_url text;

-- Re-apply expanded check constraints
alter table public.orders add constraint orders_payment_status_check 
  check (payment_status in ('pending', 'partially_paid', 'fully_paid', 'failed', 'refunded'));

alter table public.orders add constraint orders_order_status_check 
  check (order_status in ('pending_payment', 'payment_confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'));

-- Make shipping fields nullable in case they haven't been populated yet (to prevent constraint errors on existing rows)
alter table public.orders alter column shipping_address drop not null;
alter table public.orders alter column shipping_city drop not null;
alter table public.orders alter column shipping_state drop not null;
alter table public.orders alter column shipping_zip drop not null;

-- Set default order_status correctly for new checkout flow
alter table public.orders alter column order_status set default 'pending_payment';

-- 3. Invoices Table (Optional, can be generated on the fly, but good for record keeping)
create table if not exists public.invoices (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  invoice_number text unique not null,
  pdf_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.invoices enable row level security;
create policy "Admins can view all invoices." on public.invoices for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Users can view their own invoices." on public.invoices for select using (
  exists (select 1 from public.orders where id = invoices.order_id and user_id = auth.uid())
);
create policy "Only admins can insert invoices." on public.invoices for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 4. Order Status History Table (For tracking timeline)
create table if not exists public.order_status_history (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  status text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.order_status_history enable row level security;
create policy "Users can view their order history." on public.order_status_history for select using (
  exists (select 1 from public.orders where id = order_status_history.order_id and user_id = auth.uid())
);
create policy "Admins can view all order history." on public.order_status_history for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can insert order history." on public.order_status_history for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
-- Allow system to insert history during checkout
create policy "Anyone can insert order history (checkout)." on public.order_status_history for insert with check (true);
