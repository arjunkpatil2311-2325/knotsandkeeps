import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { LayoutDashboard, Package, ShoppingBag, FolderTree, Layers, Tag, Users, Settings, LogOut } from 'lucide-react'
import { AdminNotifications } from '@/components/admin/AdminNotifications'
import { createClient } from '@/utils/supabase/server'
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="h-full flex flex-col">
          <div className="p-6">
            <Link href="/admin" className="text-xl font-bold tracking-tight text-gray-900">
              KNOTS & KEEPS
            </Link>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-semibold">Admin Panel</p>
          </div>
          
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <Link href="/admin" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100">
              <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500" />
              Dashboard
            </Link>
            <Link href="/admin/products" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              <Package className="mr-3 h-5 w-5 text-gray-400" />
              Products
            </Link>
            <Link href="/admin/orders" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              <ShoppingBag className="mr-3 h-5 w-5 text-gray-400" />
              Orders
            </Link>
            <Link href="/admin/categories" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              <FolderTree className="mr-3 h-5 w-5 text-gray-400" />
              Categories
            </Link>
            <Link href="/admin/collections" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              <Layers className="mr-3 h-5 w-5 text-gray-400" />
              Collections
            </Link>
            <Link href="/admin/discounts" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              <Tag className="mr-3 h-5 w-5 text-gray-400" />
              Discounts
            </Link>
            <Link href="/admin/customers" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              <Users className="mr-3 h-5 w-5 text-gray-400" />
              Customers
            </Link>
            <Link href="/admin/settings" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              <Settings className="mr-3 h-5 w-5 text-gray-400" />
              Settings
            </Link>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <form action={logout}>
              <button className="flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50">
                <LogOut className="mr-3 h-5 w-5 text-red-500" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 shrink-0">
            <div className="px-4 py-4 flex justify-between items-center md:justify-end">
              <Link href="/admin" className="text-lg font-bold md:hidden">K&K Admin</Link>
              
              <div className="flex items-center space-x-4">
                <AdminNotifications initialNotifications={notifications || []} />
                <form action={logout} className="md:hidden">
                  <button className="text-sm font-medium text-red-600">Sign out</button>
                </form>
              </div>
            </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
