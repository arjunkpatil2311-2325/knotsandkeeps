import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle, Clock, Copy, Receipt, Loader2, AlertCircle } from 'lucide-react'

export default async function OrderStatusPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        product_name,
        price,
        quantity
      )
    `)
    .eq('order_number', orderNumber)
    .single()

  if (error || !order) {
    redirect('/')
  }

  const { data: settings } = await supabase.from('payment_settings').select('*').single()

  const isPending = order.payment_status === 'pending'
  const isVerificationRequired = order.payment_status === 'verification_required'
  const isVerified = order.payment_status === 'fully_paid' || order.payment_status === 'partially_paid'

  return (
    <div className="w-full pb-24">
      
      {/* Header Based on Status */}
      <div className={`bg-brand-soft-pink/30 rounded-[2rem] sm:rounded-[3rem] p-12 md:p-16 mb-12 border ${isVerified ? 'border-brand-accent/30' : 'border-white'} text-center shadow-sm relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-soft-pink via-brand-accent to-brand-soft-pink opacity-50" />
        
        {isVerified ? (
          <>
            <div className="inline-flex rounded-full bg-white p-4 mb-6 shadow-sm border border-brand-rose/20">
              <CheckCircle className="h-16 w-16 text-brand-accent" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-black mb-4 tracking-tight">Pre-order Confirmed! 🎉</h1>
            <p className="text-lg text-gray-600 font-medium">Your payment has been verified and your bracelet is now reserved.</p>
          </>
        ) : isVerificationRequired ? (
          <>
            <div className="inline-flex rounded-full bg-white p-4 mb-6 shadow-sm border border-brand-rose/20">
              <span className="text-4xl">🟡</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-black mb-4 tracking-tight">Payment submitted</h1>
            <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
              We've received your payment details.<br/>
              Your payment is now being manually verified. Once your payment is confirmed, your pre-order will be reserved and moved to processing.
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex rounded-full bg-white p-4 mb-6 shadow-sm border border-brand-rose/20 animate-pulse">
              <AlertCircle className="h-16 w-16 text-black" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-black mb-4 tracking-tight">Order Received!</h1>
            <p className="text-lg text-gray-600 font-medium">Please complete your payment to place the pre-order.</p>
          </>
        )}
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(244,164,164,0.3)] border border-brand-rose/20 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-brand-bg rounded-3xl p-6 md:p-8 mb-12 border border-brand-rose/10">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Order No</p>
            <p className="font-black text-black text-lg">{order.order_number}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date</p>
            <p className="font-black text-black text-lg">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total</p>
            <p className="font-black text-brand-accent text-lg">₹{order.total_amount.toFixed(2)}</p>
          </div>
          {isVerificationRequired && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">UTR</p>
              <p className="font-black text-black text-lg">{order.payment_transaction_id}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Items Summary */}
          <div>
            <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-soft-pink/30 flex items-center justify-center text-[15px] text-brand-accent">🛒</span>
              Order Summary
            </h3>
            
            <div className="space-y-4">
              {order.order_items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm border border-gray-100">{item.quantity}</div>
                    <span className="font-bold text-gray-700 line-clamp-1">{item.product_name}</span>
                  </div>
                  <span className="font-black text-black">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-brand-rose/20 space-y-4">
              <div className="flex justify-between font-bold text-gray-500 text-[15px]">
                <span>Subtotal</span>
                <span className="text-black">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-500 text-[15px]">
                <span>Delivery ({order.delivery_method})</span>
                <span className={order.delivery_charge === 0 ? "text-brand-accent" : "text-black"}>
                  {order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-black text-xl pt-4 border-t border-brand-rose/10 mt-4 text-black">
                <span>Total Amount</span>
                <span>₹{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right: Payment Details */}
          <div>
            <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-soft-pink/30 flex items-center justify-center text-[15px] text-brand-accent">💳</span>
              Payment Details
            </h3>
            
            <div className="bg-brand-soft-pink/30 p-8 rounded-3xl border border-brand-rose/20 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Total Amount</span>
                <span className="text-2xl font-black text-brand-accent">₹{order.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Instructions Section */}
            {isPending && (
              <div className="mt-8 border-2 border-black rounded-3xl overflow-hidden shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)]">
                <div className="bg-black text-white p-4 text-center font-bold tracking-widest text-[13px] uppercase">
                  Action Required
                </div>
                <div className="p-8 text-center bg-white flex flex-col items-center">
                  <p className="text-gray-600 font-bold mb-6">You haven't completed the payment step yet.</p>
                  <Link 
                    href={`/checkout/payment/${order.order_number}`}
                    className="px-8 py-4 bg-brand-accent text-white rounded-full text-[13px] font-bold tracking-widest hover:shadow-lg transition-all"
                  >
                    PAY NOW TO COMPLETE PRE-ORDER
                  </Link>
                </div>
              </div>
            )}
            
            {isVerificationRequired && (
              <div className="mt-8 border border-black/10 bg-brand-bg rounded-3xl p-8 text-center shadow-sm">
                <p className="text-black font-black text-xl mb-4">You don't need to stay on this page.</p>
                <p className="text-gray-600 font-medium">
                  You can safely leave and check your order status anytime from My Orders.
                </p>
              </div>
            )}

            {isVerified && (
              <div className="mt-8 border border-brand-accent/20 bg-brand-soft-pink/10 rounded-3xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-brand-accent/20">
                  <CheckCircle className="w-8 h-8 text-brand-accent" strokeWidth={2.5} />
                </div>
                <p className="text-black font-black text-xl mb-2">Payment Verified</p>
                <p className="text-brand-accent font-bold">Amount Paid: ₹{order.amount_paid.toFixed(2)}</p>
              </div>
            )}

          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-brand-rose/20 flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            href={`/account`}
            className="px-8 py-4 bg-white border-2 border-black text-black rounded-full text-[13px] font-bold tracking-widest hover:bg-gray-50 transition-colors text-center flex items-center justify-center gap-3 shadow-sm"
          >
            VIEW MY ORDER
          </Link>
          <Link href="/shop" className="px-10 py-4 bg-black text-white rounded-full text-[13px] font-bold tracking-widest hover:bg-brand-accent hover:shadow-[0_10px_20px_-10px_rgba(224,122,122,0.6)] transition-all duration-300 text-center flex items-center justify-center">
            CONTINUE SHOPPING
          </Link>
        </div>
        
      </div>
    </div>
  )
}
