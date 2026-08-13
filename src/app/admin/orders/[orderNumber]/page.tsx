import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Package, Truck, Receipt, Trash2 } from 'lucide-react'
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
  async function deleteOrder() {
    'use server'
    const supabaseServer = await createClient()
    
    // Delete children first to avoid foreign key constraint errors
    await supabaseServer.from('order_status_history').delete().eq('order_id', order.id)
    await supabaseServer.from('order_items').delete().eq('order_id', order.id)
    // Delete order
    await supabaseServer.from('orders').delete().eq('id', order.id)

    revalidatePath('/admin/orders')
    redirect('/admin/orders')
  }

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
        <Link href="/admin/orders" className="text-black bg-white border-2 border-black p-2 rounded-lg shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
          <ArrowLeft className="w-5 h-5 font-bold" />
        </Link>
        <h1 className="text-3xl font-black text-black tracking-tight">Order {order.order_number}</h1>
        <span className="px-3 py-1 bg-white text-black border-2 border-black text-sm font-bold rounded-lg ml-auto shadow-[2px_2px_0_0_#000]">
          {new Date(order.created_at).toLocaleString()}
        </span>
        <div className="ml-2 flex items-center gap-2">
          <Link 
            href={`/invoice/${order.order_number}`}
            target="_blank" 
            className="inline-flex items-center gap-2 bg-neo-blue border-2 border-black text-black px-4 py-1.5 rounded-lg text-sm font-bold shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Receipt className="w-4 h-4" /> View Invoice
          </Link>
          <form action={deleteOrder}>
            <button type="submit" className="inline-flex items-center gap-2 bg-neo-pink border-2 border-black text-black px-4 py-1.5 rounded-lg text-sm font-bold shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              <Trash2 className="w-4 h-4" /> Delete Order
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Items & Status) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl p-6 text-black">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-black uppercase tracking-wider"><Package className="w-5 h-5"/> Items</h2>
            <div className="space-y-4">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex justify-between py-2 border-b-2 border-black last:border-0">
                  <div>
                    <p className="font-bold text-black">{item.product_name}</p>
                    <p className="text-sm text-black font-bold">₹{item.price} x {item.quantity}</p>
                  </div>
                  <p className="font-black text-black">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t-2 border-black text-sm space-y-2">
              <div className="flex justify-between font-bold text-black">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-black">
                <span>Delivery ({order.delivery_method})</span>
                <span>₹{order.delivery_charge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-xl pt-2 text-black">
                <span>Total</span>
                <span>₹{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl p-6 text-black">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-black uppercase tracking-wider"><Truck className="w-5 h-5"/> Order Status & Tracking</h2>
            
            {order.payment_status === 'pending' ? (
              <div className="mb-6 p-4 bg-neo-yellow border-2 border-black rounded-xl text-black font-bold shadow-[2px_2px_0_0_#000]">
                Please verify the payment before updating order status.
              </div>
            ) : (
              <form action={updateOrderStatus} className="flex items-end gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-black text-black mb-1">Update Status</label>
                  <select name="status" defaultValue={order.order_status} className="w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold focus:ring-0 focus:border-black text-black">
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
                <button type="submit" className="bg-neo-yellow border-2 border-black text-black px-4 py-2 rounded-lg font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Save</button>
              </form>
            )}

            <form action={updateTracking} className="space-y-4 pt-4 border-t-2 border-black">
              <h3 className="font-black text-sm text-black uppercase tracking-wider">Shipping Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-black font-bold mb-1">Courier Name</label>
                  <input name="courier_name" defaultValue={order.courier_name || ''} className="w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold focus:ring-0 focus:border-black text-black" placeholder="e.g. Bluedart" />
                </div>
                <div>
                  <label className="block text-xs text-black font-bold mb-1">Tracking Number</label>
                  <input name="tracking_number" defaultValue={order.tracking_number || ''} className="w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold focus:ring-0 focus:border-black text-black" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-black font-bold mb-1">Tracking URL</label>
                  <input name="tracking_url" defaultValue={order.tracking_url || ''} className="w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold focus:ring-0 focus:border-black text-black" />
                </div>
              </div>
              <button type="submit" className="bg-white border-2 border-black text-black px-4 py-2 rounded-lg font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Update Tracking</button>
            </form>

          </div>
        </div>

        {/* Right Column (Customer & Payment) */}
        <div className="space-y-6">
          
          <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl p-6 text-black">
            <h2 className="text-lg font-black mb-4 text-black uppercase tracking-wider">Customer Details</h2>
            <div className="space-y-3 text-sm font-bold">
              <p><span>Name:</span> <span className="font-black">{order.customer_name}</span></p>
              <p><span>Email:</span> <span className="font-black">{order.customer_email}</span></p>
              <p><span>Phone:</span> <span className="font-black">{order.customer_phone}</span></p>
            </div>
            <div className="mt-4 pt-4 border-t-2 border-black space-y-3 text-sm">
              <p className="font-black mb-1 text-black uppercase tracking-wider">Shipping Address</p>
              <p className="font-bold leading-relaxed">
                {order.shipping_address}<br/>
                {order.shipping_city}, {order.shipping_state} {order.shipping_zip}<br/>
                {order.shipping_country}
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl p-6 text-black">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-black uppercase tracking-wider"><Receipt className="w-5 h-5"/> Payment</h2>
            
            <div className="space-y-3 text-sm font-bold">
              <p className="flex justify-between"><span>Method:</span> <span className="font-black capitalize">{order.payment_method}</span></p>
              <p className="flex justify-between"><span>Status:</span> 
                <span className={`font-black ${order.payment_status === 'fully_paid' ? 'text-green-600' : order.payment_status === 'verification_required' ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                  {order.payment_status.replace('_', ' ')}
                </span>
              </p>
              <p className="flex justify-between pt-3 border-t-2 border-black"><span>Paid:</span> <span className="font-black text-green-600">₹{order.amount_paid.toFixed(2)}</span></p>
              
              {order.payment_status === 'pending' && (
                <div className="mt-4 p-5 border-2 border-black bg-neo-yellow rounded-xl shadow-[4px_4px_0_0_#000]">
                  <p className="font-black text-black mb-2 text-center uppercase tracking-wider">PAYMENT PENDING</p>
                  <p className="text-xs text-black font-bold text-center mb-5">
                    Verify transaction in your bank before confirming.
                  </p>
                  <div className="flex gap-3">
                    <form action={verifyPayment} className="flex-1">
                      <button type="submit" className="w-full bg-neo-green border-2 border-black text-black py-2 rounded-lg text-sm font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Confirm Payment</button>
                    </form>
                    <form action={rejectPayment} className="flex-1">
                      <button type="submit" className="w-full bg-neo-pink border-2 border-black text-black py-2 rounded-lg text-sm font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Reject</button>
                    </form>
                  </div>
                </div>
              )}

              {order.amount_remaining > 0 && order.payment_status === 'partially_paid' && (
                <div className="mt-4 p-5 border-2 border-black bg-neo-blue rounded-xl shadow-[4px_4px_0_0_#000]">
                  <p className="font-black text-black mb-4 text-center uppercase tracking-wider">PARTIALLY PAID</p>
                  <div className="flex justify-between mb-2 text-sm font-bold">
                    <span>Paid:</span>
                    <span className="font-black text-green-600">₹{order.amount_paid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-5 text-sm font-bold">
                    <span>Remaining:</span>
                    <span className="font-black text-red-600">₹{order.amount_remaining.toFixed(2)}</span>
                  </div>
                  <form action={verifyRemainingPayment}>
                    <button type="submit" className="w-full bg-white border-2 border-black text-black py-2.5 rounded-lg text-sm font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                      Confirm Remaining Payment
                    </button>
                  </form>
                  <p className="text-[10px] text-black font-bold mt-3 text-center uppercase tracking-wider">Click only after manually collecting the balance.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
