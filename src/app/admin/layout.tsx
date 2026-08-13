import { createClient } from '@/utils/supabase/server'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Fetch unread and recent notifications
  const { data: notifications } = await supabase
    .from('admin_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <AdminLayoutClient notifications={notifications || []}>
      {children}
    </AdminLayoutClient>
  )
}
