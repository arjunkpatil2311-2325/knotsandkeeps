import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'


export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch real data
  const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { count: activeProducts } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published')
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true })
  const { data: revenueData } = await supabase.from('orders').select('amount_paid')
  const totalRevenue = revenueData?.reduce((acc, order) => acc + (Number(order.amount_paid) || 0), 0) || 0
  const { count: paymentPending } = await supabase.from('orders').select('*', { count: 'exact', head: true }).in('payment_status', ['pending', 'partially_paid'])

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, total_amount, payment_status, order_status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: lowStockProducts } = await supabase
    .from('products')
    .select('id, name, stock_quantity')
    .lte('stock_quantity', 5)
    .order('stock_quantity', { ascending: true })
    .limit(5)

  const stats = [
    { name: 'Total Products', value: totalProducts || 0, color: 'bg-neo-yellow' },
    { name: 'Active Products', value: activeProducts || 0, color: 'bg-neo-green' },
    { name: 'Total Orders', value: totalOrders || 0, color: 'bg-neo-pink' },
    { name: 'Revenue', value: `₹${totalRevenue.toFixed(2)}`, color: 'bg-neo-purple' },
    { name: 'Payment Pending', value: paymentPending || 0, color: 'bg-orange-400' },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-black tracking-tight">Dashboard</h1>
      
      {/* Quick Actions */}
      <div className="flex gap-4 flex-wrap">
        <Link href="/admin/products/create" className="px-4 py-2 bg-neo-yellow text-black font-bold border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">Add Product</Link>
        <Link href="/admin/orders" className="px-4 py-2 bg-neo-green text-black font-bold border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">View Orders</Link>
        <Link href="/admin/collections" className="px-4 py-2 bg-neo-pink text-black font-bold border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">Collections</Link>
        <Link href="/admin/discounts" className="px-4 py-2 bg-neo-purple text-black font-bold border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">Discounts</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
        {stats.map((item) => (
          <div key={item.name} className="bg-white border-2 border-black overflow-hidden shadow-[4px_4px_0_0_#000] rounded-xl relative flex flex-col hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all duration-200">
            <div className={`h-4 w-full border-b-2 border-black ${item.color}`}></div>
            <div className="px-4 py-5 sm:p-6 flex-1">
              <dt className="text-sm font-bold text-black truncate uppercase tracking-wider">{item.name}</dt>
              <dd className="mt-2 text-2xl sm:text-3xl font-black text-black">{item.value}</dd>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-black text-black mb-4 tracking-tight">Recent Orders</h2>
          <div className="bg-white overflow-hidden rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000]">
            <ul role="list" className="divide-y-2 divide-black">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <li key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <Link href={`/admin/orders/${order.order_number}`} className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-black">{order.order_number}</p>
                        <p className="text-sm text-gray-700">{order.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.total_amount}</p>
                        <p className="text-xs uppercase font-bold px-2 py-1 bg-gray-200 rounded border border-black inline-block mt-1">{order.payment_status}</p>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-6 py-8 text-sm text-black text-center font-bold">
                  No recent orders found.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-black mb-4 tracking-tight">Low Stock Alerts</h2>
          <div className="bg-white overflow-hidden rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000]">
            <ul role="list" className="divide-y-2 divide-black">
              {lowStockProducts && lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <li key={product.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <Link href={`/admin/products`} className="flex-1 font-bold text-black truncate pr-4">
                      {product.name}
                    </Link>
                    <div className="flex-shrink-0 flex items-center">
                      <span className={`px-2 py-1 text-xs font-bold uppercase border-2 border-black rounded ${product.stock_quantity === 0 ? 'bg-red-400' : 'bg-neo-yellow'}`}>
                        {product.stock_quantity} left
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-8 text-sm text-black text-center font-bold">
                  All products are well stocked!
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
