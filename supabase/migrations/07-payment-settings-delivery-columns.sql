-- Add missing delivery charge columns to payment_settings
ALTER TABLE public.payment_settings 
ADD COLUMN IF NOT EXISTS normal_delivery_charge numeric DEFAULT 100 NOT NULL,
ADD COLUMN IF NOT EXISTS free_delivery_threshold numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS fast_delivery_charge numeric DEFAULT 250 NOT NULL;
