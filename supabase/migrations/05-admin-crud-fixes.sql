-- Knots & Keeps Admin CRUD Fixes
-- 1. Add missing DELETE policies for Orders to allow admins to delete orders

CREATE POLICY "Only admins can delete orders." ON public.orders FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Only admins can delete order items." ON public.order_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Only admins can delete order history." ON public.order_status_history FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
