import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AccountPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/account')
  }

  // Fetch orders for this user
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-black text-black mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-brand-bg rounded-2xl p-6 border border-brand-rose/20">
              <h2 className="font-bold text-lg mb-4">Profile</h2>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-bold text-black mb-6">{user.email}</p>

              <form action="/auth/signout" method="post">
                <button 
                  type="submit"
                  className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-black text-black mb-6">Order History</h2>
            
            {!orders || orders.length === 0 ? (
              <div className="bg-brand-bg rounded-2xl p-12 text-center border border-brand-rose/20">
                <p className="text-gray-500 font-medium mb-6">You haven't placed any orders yet.</p>
                <Link 
                  href="/shop"
                  className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-brand-accent transition-colors shadow-sm"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Order #{order.order_number}</p>
                        <p className="font-bold text-black">{new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                      <div className="flex gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.payment_status === 'fully_paid' ? 'bg-green-100 text-green-700' : 
                          order.payment_status === 'verification_required' ? 'bg-yellow-100 text-yellow-700' :
                          order.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.payment_status === 'verification_required' ? 'Verification Required' : order.payment_status.replace('_', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.order_status === 'delivered' ? 'bg-blue-100 text-blue-700' : 
                          order.order_status === 'payment_confirmed' ? 'bg-green-100 text-green-700' :
                          order.order_status === 'verification_required' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.order_status === 'payment_confirmed' ? 'Pre-order Confirmed' : order.order_status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 text-sm font-medium text-gray-500 flex items-center justify-between">
                      <div className="flex-1 text-center">
                         <span className={order.order_status !== 'pending_payment' && order.order_status !== 'cancelled' ? 'text-brand-accent' : ''}>Payment Verification</span>
                         <span className="mx-2">→</span>
                      </div>
                      <div className="flex-1 text-center">
                         <span className={['payment_confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.order_status) ? 'text-brand-accent' : ''}>Confirmed</span>
                         <span className="mx-2">→</span>
                      </div>
                      <div className="flex-1 text-center">
                         <span className={['processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.order_status) ? 'text-brand-accent' : ''}>Processing</span>
                         <span className="mx-2">→</span>
                      </div>
                      <div className="flex-1 text-center">
                         <span className={order.order_status === 'delivered' ? 'text-brand-accent' : ''}>Delivered</span>
                      </div>
                    </div>

                    <div className="mb-4 text-center p-3 bg-gray-50 rounded-lg text-sm font-bold text-gray-700">
                      {order.order_status === 'verification_required' && "Payment details received. We're verifying your payment."}
                      {order.order_status === 'payment_confirmed' && "Payment verified. Your bracelet is reserved."}
                      {order.order_status === 'processing' && "Your pre-order is being prepared."}
                      {order.order_status === 'packed' && "Your pre-order is packed and ready to ship."}
                      {order.order_status === 'shipped' && "Your pre-order has been shipped."}
                      {order.order_status === 'out_for_delivery' && "Your pre-order is out for delivery."}
                      {order.order_status === 'delivered' && "Your pre-order has been delivered."}
                      {order.order_status === 'pending_payment' && "Awaiting payment."}
                      {order.order_status === 'cancelled' && "This order was cancelled."}
                    </div>

                    {order.payment_status === 'pending' && (
                       <div className="mb-4">
                          <Link href={`/checkout/payment/${order.order_number}`} className="text-sm font-bold text-brand-accent underline">Complete Payment to Confirm Pre-order</Link>
                       </div>
                    )}
                    {order.payment_status === 'failed' && (
                       <div className="mb-4">
                          <p className="text-sm font-bold text-red-600">Payment Verification Failed. Please contact ThreeKnots support.</p>
                       </div>
                    )}

                    <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                      <p className="font-bold text-black">Total</p>
                      <p className="font-black text-xl text-black">₹{order.total_amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
