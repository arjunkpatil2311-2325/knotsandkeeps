import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Eye } from 'lucide-react'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error: urlError } = await searchParams
  const supabase = await createClient()

  // Fetch orders sorted by newest first
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, total_amount, payment_status, order_status, created_at, delivery_method')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending_payment': return 'bg-neo-yellow text-black border-2 border-black shadow-[2px_2px_0_0_#000]'
      case 'payment_confirmed': return 'bg-neo-blue text-black border-2 border-black shadow-[2px_2px_0_0_#000]'
      case 'processing': return 'bg-neo-purple text-black border-2 border-black shadow-[2px_2px_0_0_#000]'
      case 'packed': return 'bg-neo-pink text-black border-2 border-black shadow-[2px_2px_0_0_#000]'
      case 'shipped': return 'bg-neo-blue text-black border-2 border-black shadow-[2px_2px_0_0_#000]'
      case 'out_for_delivery': return 'bg-neo-yellow text-black border-2 border-black shadow-[2px_2px_0_0_#000]'
      case 'delivered': return 'bg-neo-green text-black border-2 border-black shadow-[2px_2px_0_0_#000]'
      case 'cancelled': return 'bg-red-500 text-white border-2 border-black shadow-[2px_2px_0_0_#000]'
      default: return 'bg-white text-black border-2 border-black shadow-[2px_2px_0_0_#000]'
    }
  }

  const awaitingVerificationCount = orders?.filter(o => o.payment_status === 'verification_required').length || 0

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-black text-black tracking-tight">Orders</h1>
        {awaitingVerificationCount > 0 && (
           <div className="bg-neo-pink text-black border-2 border-black shadow-[2px_2px_0_0_#000] px-4 py-2 rounded-xl font-black animate-pulse text-sm">
             Payments Awaiting Verification: {awaitingVerificationCount}
           </div>
        )}
      </div>

      {urlError && (
        <div className="mb-6 bg-red-100 border-2 border-black text-black px-4 py-3 rounded-lg relative font-bold" role="alert">
          <span className="block sm:inline">{urlError}</span>
        </div>
      )}

      <div className="bg-transparent md:bg-white md:shadow-[4px_4px_0_0_#000] overflow-hidden md:rounded-xl md:border-2 border-black">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full block md:table border-collapse">
            <thead className="bg-neo-blue border-y-2 border-black hidden md:table-header-group">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-black text-black uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group space-y-4 md:space-y-0 divide-y-0 md:divide-y-2 md:divide-black">
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="block md:table-row hover:bg-neo-bg transition-colors bg-white border-2 border-black md:border-0 rounded-xl md:rounded-none p-4 md:p-0 shadow-[4px_4px_0_0_#000] md:shadow-none">
                    <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm font-black text-black border-b-2 border-dashed border-gray-300 md:border-none pb-4 md:pb-4">
                      <span className="md:hidden font-bold uppercase text-xs text-gray-500">Order</span>
                      <span>{order.order_number}</span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-black font-bold mt-2 md:mt-0">
                      <span className="md:hidden font-bold uppercase text-xs text-gray-500">Date</span>
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-black font-bold">
                      <span className="md:hidden font-bold uppercase text-xs text-gray-500">Customer</span>
                      <span>{order.customer_name}</span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-black font-black">
                      <span className="md:hidden font-bold uppercase text-xs text-gray-500">Total</span>
                      <span>₹{order.total_amount.toFixed(2)}</span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                      <span className="md:hidden font-bold uppercase text-xs text-gray-500">Payment</span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-lg border-2 ${
                        order.payment_status === 'fully_paid' ? 'bg-neo-green text-black border-black shadow-[2px_2px_0_0_#000]' :
                        order.payment_status === 'partially_paid' ? 'bg-neo-blue text-black border-black shadow-[2px_2px_0_0_#000]' :
                        order.payment_status === 'verification_required' ? 'bg-neo-pink text-black border-black shadow-[2px_2px_0_0_#000] animate-pulse' :
                        'bg-neo-yellow text-black border-black shadow-[2px_2px_0_0_#000]'
                      }`}>
                        {order.payment_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                      <span className="md:hidden font-bold uppercase text-xs text-gray-500">Status</span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-lg ${getStatusColor(order.order_status)}`}>
                        {order.order_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="block md:table-cell px-0 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-t-2 border-dashed border-gray-300 md:border-none mt-2 md:mt-0">
                      <Link href={`/admin/orders/${order.order_number}`} className="w-full md:w-auto flex justify-center items-center text-black bg-neo-yellow py-2 px-4 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-yellow-400 transition-all font-bold text-xs uppercase">
                        <Eye className="w-4 h-4 mr-2 md:hidden" />
                        <span className="md:hidden">View Details</span>
                        <Eye className="w-5 h-5 hidden md:block" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="block md:table-row">
                  <td colSpan={7} className="block md:table-cell px-6 py-12 text-center text-black text-sm font-black uppercase bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] md:border-none md:shadow-none md:bg-transparent">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
