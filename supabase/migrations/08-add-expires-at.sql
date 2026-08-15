-- Add expires_at column to orders table for temporary stock reservation
ALTER TABLE orders ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
