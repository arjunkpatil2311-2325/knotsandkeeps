-- 1. Alter Check Constraints to support manual payment states

-- We need to drop the old constraints first, which requires knowing their names.
-- Since Supabase names them automatically, we usually just drop and recreate using a DO block,
-- or we can just alter the check constraint directly.
-- A safer approach in Supabase is to drop the constraint by querying its name, but for simplicity
-- we will drop the standard naming or use a PL/pgSQL block to ensure it's removed.

DO $$
DECLARE
  conname_var text;
BEGIN
  -- Find constraint for payment_status
  SELECT conname INTO conname_var
  FROM pg_constraint
  WHERE conrelid = 'public.orders'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) LIKE '%payment_status%';
  
  IF conname_var IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.orders DROP CONSTRAINT ' || conname_var;
  END IF;

  -- Find constraint for order_status
  SELECT conname INTO conname_var
  FROM pg_constraint
  WHERE conrelid = 'public.orders'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) LIKE '%order_status%';
  
  IF conname_var IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.orders DROP CONSTRAINT ' || conname_var;
  END IF;
END $$;

-- 2. Add the new constraints with verification states
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_status_check CHECK (
  payment_status IN ('pending', 'verification_required', 'partially_paid', 'fully_paid', 'refunded', 'failed')
);

ALTER TABLE public.orders ADD CONSTRAINT orders_order_status_check CHECK (
  order_status IN ('pending_payment', 'verification_required', 'payment_confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')
);

-- 3. Create payment_settings table
CREATE TABLE IF NOT EXISTS public.payment_settings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  payment_instructions text,
  qr_image_url text,
  is_100_percent_enabled boolean DEFAULT true NOT NULL,
  is_50_percent_enabled boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Insert default settings row if it doesn't exist
INSERT INTO public.payment_settings (id, payment_instructions, is_100_percent_enabled, is_50_percent_enabled)
SELECT '00000000-0000-0000-0000-000000000000', 'Please scan the QR code to make your payment.', true, true
WHERE NOT EXISTS (SELECT 1 FROM public.payment_settings);

-- 5. Set RLS on payment_settings
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payment settings viewable by everyone." 
  ON public.payment_settings FOR SELECT USING (true);

CREATE POLICY "Only admins can update payment settings." 
  ON public.payment_settings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can insert payment settings." 
  ON public.payment_settings FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
