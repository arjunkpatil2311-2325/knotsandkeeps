-- Knots & Keeps Homepage Visibility Fix
-- Ensures the show_on_homepage column exists and sets it to true for existing products so they aren't hidden by default.

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS show_on_homepage boolean DEFAULT false;

-- Update existing products to be eligible for homepage display so they don't disappear.
UPDATE public.products 
SET show_on_homepage = true 
WHERE show_on_homepage = false;

-- Force PostgREST to reload the schema cache so the API recognizes the new column immediately
NOTIFY pgrst, 'reload schema';
