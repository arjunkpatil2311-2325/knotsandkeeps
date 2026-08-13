-- Knots & Keeps Discounts and Delivery Settings Migration

-- 1. Create discounts table
CREATE TABLE IF NOT EXISTS public.discounts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value numeric(10,2) NOT NULL CHECK (value > 0),
  min_order_amount numeric(10,2) DEFAULT 0,
  start_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  end_date timestamp with time zone,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Discounts RLS
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;

-- Anyone can read active discounts (for checkout validation)
CREATE POLICY "Active discounts are viewable by everyone." 
  ON public.discounts FOR SELECT USING (is_active = true);

-- Admins can do anything
CREATE POLICY "Admins can view all discounts." 
  ON public.discounts FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Only admins can insert discounts." 
  ON public.discounts FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Only admins can update discounts." 
  ON public.discounts FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Only admins can delete discounts." 
  ON public.discounts FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger for updated_at
CREATE TRIGGER set_discounts_updated_at 
  BEFORE UPDATE ON public.discounts 
  FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();

-- 2. Extend payment_settings for Delivery Pricing
ALTER TABLE public.payment_settings 
ADD COLUMN IF NOT EXISTS normal_delivery_charge numeric(10,2) DEFAULT 59.00,
ADD COLUMN IF NOT EXISTS free_delivery_threshold numeric(10,2) DEFAULT 499.00,
ADD COLUMN IF NOT EXISTS fast_delivery_charge numeric(10,2) DEFAULT 99.00;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS show_on_homepage boolean DEFAULT false; 
