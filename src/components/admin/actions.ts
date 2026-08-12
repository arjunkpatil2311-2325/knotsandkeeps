'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markNotificationAsRead(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('admin_notifications')
    .update({ is_read: true })
    .eq('id', id)

  if (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient()

  const { error } = await supabase
    .from('admin_notifications')
    .update({ is_read: true })
    .eq('is_read', false)

  if (error) {
    console.error('Failed to mark all notifications as read:', error)
  }
}
