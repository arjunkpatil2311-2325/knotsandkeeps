'use server'

import { createClient } from '@supabase/supabase-js'

export type AdminNotificationType = 
  | 'new_order'
  | 'payment_verification_required'
  | 'payment_verified'
  | 'payment_rejected'
  | 'order_processing'
  | 'order_packed'
  | 'order_shipped'
  | 'out_for_delivery'
  | 'delivered'

interface CreateAdminNotificationOptions {
  type: AdminNotificationType
  title: string
  message: string
  link_url?: string
}

export async function createAdminNotification(options: CreateAdminNotificationOptions) {
  try {
    // We MUST use the service role key to bypass RLS, because customers (unauthenticated or non-admin)
    // will be triggering these notifications (e.g., when they place an order).
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.from('admin_notifications').insert({
      type: options.type,
      title: options.title,
      message: options.message,
      link_url: options.link_url,
      is_read: false
    })

    if (error) {
      console.error('Failed to create admin notification in DB:', error)
    }
  } catch (error) {
    console.error('Error creating admin notification:', error)
  }
}
