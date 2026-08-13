import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  // Fetch all orders to aggregate customer data
  const { data: orders, error } = await supabase
    .from('orders')
    .select('customer_name, customer_email, customer_phone, total_amount, created_at, order_number')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching orders for customers:", error)
  }

  // Aggregate customer data by email
  const customersMap = new Map<string, any>()

  if (orders) {
    orders.forEach(order => {
      if (!customersMap.has(order.customer_email)) {
        customersMap.set(order.customer_email, {
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          total_spent: 0,
          order_count: 0,
          last_order_date: order.created_at,
          last_order_number: order.order_number
        })
      }
      
      const customer = customersMap.get(order.customer_email)
      customer.total_spent += order.total_amount
      customer.order_count += 1
      
      // Since orders are sorted descending, the first one encountered per email is the latest
      if (new Date(order.created_at) > new Date(customer.last_order_date)) {
        customer.last_order_date = order.created_at
        customer.last_order_number = order.order_number
      }
    })
  }

  const customers = Array.from(customersMap.values())

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-black font-bold">View all customers who have placed an order.</p>
        </div>
      </div>

      <div className="bg-transparent md:bg-white md:shadow-[4px_4px_0_0_#000] overflow-hidden md:rounded-xl md:border-2 border-black">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full block md:table border-collapse">
            <thead className="bg-neo-purple border-y-2 border-black hidden md:table-header-group">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Last Order</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group space-y-4 md:space-y-0 divide-y-0 md:divide-y-2 md:divide-black">
              {customers.length > 0 ? (
                customers.map((customer, index) => (
                  <tr key={index} className="block md:table-row hover:bg-neo-bg transition-colors bg-white border-2 border-black md:border-0 rounded-xl md:rounded-none p-4 md:p-0 shadow-[4px_4px_0_0_#000] md:shadow-none">
                    <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm font-black text-black border-b-2 border-dashed border-gray-300 md:border-none pb-4 md:pb-4">
                      <span className="md:hidden font-bold uppercase text-xs text-gray-500">Customer</span>
                      <span>{customer.name}</span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-black font-bold mt-2 md:mt-0">
                      <span className="md:hidden font-bold uppercase text-xs text-gray-500">Contact</span>
                      <div className="text-right md:text-left">
                        <p>{customer.email}</p>
                        {customer.phone && <p className="text-gray-600">{customer.phone}</p>}
                      </div>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-black font-black">
                      <span className="md:hidden font-bold uppercase text-xs text-gray-500">Total Spent</span>
                      <span>₹{customer.total_spent.toFixed(2)}</span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-black font-bold">
                      <span className="md:hidden font-bold uppercase text-xs text-gray-500">Orders</span>
                      <span className="bg-neo-yellow px-2 py-1 rounded border-2 border-black font-black">{customer.order_count}</span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                      <span className="md:hidden font-bold uppercase text-xs text-gray-500">Last Order</span>
                      <div className="text-right md:text-left">
                        <p className="font-bold text-black">{new Date(customer.last_order_date).toLocaleDateString()}</p>
                        <Link href={`/admin/orders/${customer.last_order_number}`} className="text-xs text-blue-600 font-bold hover:underline">
                          #{customer.last_order_number}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="block md:table-row">
                  <td colSpan={5} className="block md:table-cell px-6 py-12 text-center text-black text-sm font-black uppercase bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] md:border-none md:shadow-none md:bg-transparent">
                    No customers found.
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
