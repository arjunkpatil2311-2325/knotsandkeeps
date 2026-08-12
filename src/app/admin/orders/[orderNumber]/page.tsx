import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Package, Truck, Receipt } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('order_number', orderNumber)
    .single()

  if (error || !order) {
    redirect('/admin/orders')
  }

  // Server Actions for Updates
  async function updateOrderStatus(formData: FormData) {
    'use server'
    const status = formData.get('status') as string
    const supabaseServer = await createClient()
    await supabaseServer.from('orders').update({ order_status: status }).eq('id', order.id)
    await supabaseServer.from('order_status_history').insert({
      order_id: order.id,
      status: status,
      notes: 'Updated via admin panel'
    })
    
    const { createAdminNotification } = await import('@/lib/notifications/admin')
    await createAdminNotification({
      type: status as any,
      title: `Order ${status.replace('_', ' ')}`,
      message: `Order ${order.order_number} status updated to ${status}`,
      link_url: `/admin/orders/${order.order_number}`
    })

    const { sendOrderStatusUpdateEmail } = await import('@/lib/notifications/email')
    
    const { data: fullOrder } = await supabaseServer
      .from('orders')
      .select(`*, order_items(*)`)
      .eq('id', order.id)
      .single()
      
    if (fullOrder) {
      await sendOrderStatusUpdateEmail(fullOrder, status, 'Updated via admin panel')
    }

    revalidatePath(`/admin/orders/${order.order_number}`)
  }

  async function updateTracking(formData: FormData) {
    'use server'
    const courier_name = formData.get('courier_name') as string
    const tracking_number = formData.get('tracking_number') as string
    const tracking_url = formData.get('tracking_url') as string
    const supabaseServer = await createClient()
    await supabaseServer.from('orders').update({ courier_name, tracking_number, tracking_url }).eq('id', order.id)
    revalidatePath(`/admin/orders/${order.order_number}`)
  }



  async function verifyPayment() {
    'use server'
    const supabaseServer = await createClient()
    const amount_paid = order.payment_method === 'advance' ? Math.round(order.total_amount / 2) : order.total_amount
    const amount_remaining = order.total_amount - amount_paid
    const payment_status = order.payment_method === 'advance' ? 'partially_paid' : 'fully_paid'
    
    await supabaseServer.from('orders').update({
      payment_status,
      amount_paid,
      amount_remaining,
      order_status: 'payment_confirmed'
    }).eq('id', order.id)

    await supabaseServer.from('order_status_history').insert({
      order_id: order.id,
      status: 'payment_confirmed',
      notes: 'Payment verified by admin'
    })

    const { createAdminNotification } = await import('@/lib/notifications/admin')
    await createAdminNotification({
      type: 'payment_verified',
      title: 'Payment Verified',
      message: `Payment verified for order ${order.order_number}`,
      link_url: `/admin/orders/${order.order_number}`
    })

    const { sendOrderConfirmedEmail } = await import('@/lib/notifications/email')
    
    const { data: fullOrder } = await supabaseServer
      .from('orders')
      .select(`*, order_items(*)`)
      .eq('id', order.id)
      .single()
      
    if (fullOrder) {
      await sendOrderConfirmedEmail(fullOrder)
    }

    revalidatePath(`/admin/orders/${order.order_number}`)
  }

  async function verifyRemainingPayment() {
    'use server'
    const supabaseServer = await createClient()
    const amount_paid = order.total_amount
    const amount_remaining = 0
    const payment_status = 'fully_paid'
    
    await supabaseServer.from('orders').update({
      payment_status,
      amount_paid,
      amount_remaining
    }).eq('id', order.id)

    await supabaseServer.from('order_status_history').insert({
      order_id: order.id,
      status: 'payment_confirmed',
      notes: 'Remaining payment verified by admin'
    })

    const { createAdminNotification } = await import('@/lib/notifications/admin')
    await createAdminNotification({
      type: 'payment_verified',
      title: 'Remaining Payment Verified',
      message: `Remaining payment verified for order ${order.order_number}`,
      link_url: `/admin/orders/${order.order_number}`
    })

    revalidatePath(`/admin/orders/${order.order_number}`)
  }

  async function rejectPayment() {
    'use server'
    const supabaseServer = await createClient()
    await supabaseServer.from('orders').update({
      payment_status: 'pending',
      order_status: 'pending_payment'
    }).eq('id', order.id)

    await supabaseServer.from('order_status_history').insert({
      order_id: order.id,
      status: 'pending_payment',
      notes: 'Payment verification rejected by admin'
    })

    const { createAdminNotification } = await import('@/lib/notifications/admin')
    await createAdminNotification({
      type: 'payment_rejected',
      title: 'Payment Rejected',
      message: `Payment verification rejected for order ${order.order_number}`,
      link_url: `/admin/orders/${order.order_number}`
    })

    revalidatePath(`/admin/orders/${order.order_number}`)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <Link href="/admin/orders" className="text-gray-500 hover:text-black">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Order {order.order_number}</h1>
        <span className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-full ml-auto">
          {new Date(order.created_at).toLocaleString()}
        </span>
        <Link 
          href={`/invoice/${order.order_number}`}
          target="_blank" 
          className="ml-2 inline-flex items-center gap-1 bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 font-medium"
        >
          <Receipt className="w-4 h-4" /> View Invoice
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Items & Status) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><Package className="w-5 h-5"/> Items</h2>
            <div className="space-y-4">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 text-sm space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery ({order.delivery_method})</span>
                <span>₹{order.delivery_charge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span>₹{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><Truck className="w-5 h-5"/> Order Status & Tracking</h2>
            
            {order.payment_status === 'pending' ? (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm font-medium">
                Please verify the payment before updating order status.
              </div>
            ) : (
              <form action={updateOrderStatus} className="flex items-end gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                  <select name="status" defaultValue={order.order_status} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black">
                    <option value="pending_payment">Pending Payment</option>
                    <option value="payment_confirmed">Payment Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">Save</button>
              </form>
            )}

            <form action={updateTracking} className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-medium text-sm">Shipping Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Courier Name</label>
                  <input name="courier_name" defaultValue={order.courier_name || ''} className="w-full border-gray-300 rounded shadow-sm p-2 border text-sm" placeholder="e.g. Bluedart" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tracking Number</label>
                  <input name="tracking_number" defaultValue={order.tracking_number || ''} className="w-full border-gray-300 rounded shadow-sm p-2 border text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Tracking URL</label>
                  <input name="tracking_url" defaultValue={order.tracking_url || ''} className="w-full border-gray-300 rounded shadow-sm p-2 border text-sm" />
                </div>
              </div>
              <button type="submit" className="bg-gray-100 text-gray-800 px-4 py-2 rounded text-sm font-medium hover:bg-gray-200">Update Tracking</button>
            </form>

          </div>
        </div>

        {/* Right Column (Customer & Payment) */}
        <div className="space-y-6">
          
          <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Customer Details</h2>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500">Name:</span> {order.customer_name}</p>
              <p><span className="text-gray-500">Email:</span> {order.customer_email}</p>
              <p><span className="text-gray-500">Phone:</span> {order.customer_phone}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-sm">
              <p className="font-medium mb-1">Shipping Address</p>
              <p className="text-gray-600">
                {order.shipping_address}<br/>
                {order.shipping_city}, {order.shipping_state} {order.shipping_zip}<br/>
                {order.shipping_country}
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><Receipt className="w-5 h-5"/> Payment</h2>
            
            <div className="space-y-3 text-sm">
              <p className="flex justify-between"><span className="text-gray-500">Method:</span> <span className="font-medium capitalize">{order.payment_method}</span></p>
              <p className="flex justify-between"><span className="text-gray-500">Status:</span> 
                <span className={`font-medium ${order.payment_status === 'fully_paid' ? 'text-green-600' : order.payment_status === 'verification_required' ? 'text-orange-600 animate-pulse' : 'text-blue-600'}`}>
                  {order.payment_status.replace('_', ' ')}
                </span>
              </p>
              <p className="flex justify-between pt-2 border-t"><span className="text-gray-500">Paid:</span> <span className="font-bold text-green-700">₹{order.amount_paid.toFixed(2)}</span></p>
              
              {order.payment_status === 'pending' && (
                <div className="mt-4 p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <p className="font-medium text-orange-900 mb-3 text-center">PAYMENT PENDING</p>
                  <p className="text-xs text-orange-800 text-center mb-4">
                    Verify transaction in your bank before confirming.
                  </p>
                  <div className="flex gap-2">
                    <form action={verifyPayment} className="flex-1">
                      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded text-sm font-medium hover:bg-green-700">Confirm Payment</button>
                    </form>
                    <form action={rejectPayment} className="flex-1">
                      <button type="submit" className="w-full bg-red-600 text-white py-2 rounded text-sm font-medium hover:bg-red-700">Reject</button>
                    </form>
                  </div>
                </div>
              )}

              {order.amount_remaining > 0 && order.payment_status === 'partially_paid' && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 mb-3 text-center">PARTIALLY PAID</p>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-blue-800">Paid:</span>
                    <span className="font-bold text-green-700">₹{order.amount_paid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-sm">
                    <span className="text-blue-800">Remaining:</span>
                    <span className="font-bold text-red-700">₹{order.amount_remaining.toFixed(2)}</span>
                  </div>
                  <form action={verifyRemainingPayment}>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700">
                      Confirm Remaining Payment
                    </button>
                  </form>
                  <p className="text-[10px] text-blue-600 mt-2 text-center">Click only after manually collecting the balance.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
