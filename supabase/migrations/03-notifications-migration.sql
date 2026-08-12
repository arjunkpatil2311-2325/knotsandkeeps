-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Admins can read all notifications
CREATE POLICY "Admins can view notifications" 
ON public.admin_notifications FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Admins can update notifications (to mark as read)
CREATE POLICY "Admins can update notifications" 
ON public.admin_notifications FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Only service_role can insert notifications (to prevent customers from spoofing)
-- (By default, if there is no INSERT policy, regular clients cannot insert. The service_role bypasses RLS)

-- Create index for faster sorting by date
CREATE INDEX IF NOT EXISTS admin_notifications_created_at_idx ON public.admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS admin_notifications_is_read_idx ON public.admin_notifications(is_read);
