import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { PrintButton } from './PrintButton'

export default async function InvoicePage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params
  const supabase = await createClient()

  // Note: For now, we are allowing anyone with the URL to view the invoice (similar to the order confirmation page)
  // In a real application, you would secure this with an auth check or a secure token.
  
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('order_number', orderNumber)
    .single()

  if (error || !order) {
    notFound()
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-sm rounded-lg border border-gray-200 print:shadow-none print:border-none print:max-w-none">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">KNOTS & KEEPS</h1>
            <p className="text-sm text-gray-500 mt-1">Premium handcrafted bracelets</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">INVOICE</h2>
            <p className="text-sm text-gray-600 mt-2 font-medium">#{order.order_number}</p>
            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Billed To</h3>
            <address className="not-italic text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-gray-900">{order.customer_name}</p>
              <p>{order.billing_address}</p>
              <p>{order.billing_city}, {order.billing_state} {order.billing_zip}</p>
              <p>{order.billing_country}</p>
              <p className="pt-2">{order.customer_email}</p>
              <p>{order.customer_phone}</p>
            </address>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Shipped To</h3>
            <address className="not-italic text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-gray-900">{order.customer_name}</p>
              <p>{order.shipping_address}</p>
              <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
              <p>{order.shipping_country}</p>
            </address>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-10">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold text-gray-900">Product</th>
                <th scope="col" className="px-4 py-3 font-semibold text-gray-900 text-center">Qty</th>
                <th scope="col" className="px-4 py-3 font-semibold text-gray-900 text-right">Price</th>
                <th scope="col" className="px-4 py-3 font-semibold text-gray-900 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.order_items.map((item: any) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 text-gray-900">{item.product_name}</td>
                  <td className="px-4 py-4 text-gray-700 text-center">{item.quantity}</td>
                  <td className="px-4 py-4 text-gray-700 text-right">₹{item.price.toFixed(2)}</td>
                  <td className="px-4 py-4 text-gray-900 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full sm:w-1/2 lg:w-1/3 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            {order.total_discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount</span>
                <span>- ₹{order.total_discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-3">
              <span>Delivery Charge</span>
              <span>₹{order.delivery_charge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-1">
              <span>Final Total</span>
              <span>₹{order.total_amount.toFixed(2)}</span>
            </div>
            
            <div className="pt-4 space-y-2 border-t border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Payment Method</span>
                <span className="capitalize">{order.payment_method}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Status</span>
                <span className="capitalize">{order.payment_status.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-medium">
                <span>Amount Paid</span>
                <span>₹{order.amount_paid.toFixed(2)}</span>
              </div>
              {order.amount_remaining > 0 && (
                <div className="flex justify-between text-red-700 font-bold">
                  <span>Balance Due</span>
                  <span>₹{order.amount_remaining.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Thank you for shopping with Knots & Keeps!</p>
          <p className="mt-1">If you have any questions about this invoice, please contact us.</p>
        </div>

      </div>

      <PrintButton />
    </div>
  )
}
