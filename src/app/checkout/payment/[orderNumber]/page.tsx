import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { PaymentForm } from './PaymentForm'

export default async function PaymentPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the order
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_number', orderNumber)
    .single()

  if (error || !order || order.user_id !== user.id) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 pb-32 text-center">
        <div className="bg-red-50 text-red-700 p-8 rounded-[2rem] border border-red-200">
           <h1 className="text-2xl font-black mb-4">Order Not Found</h1>
           <p className="font-medium text-[15px] leading-relaxed">
             We couldn't load your payment page. Your order may still have been created.<br/><br/>
             Please check <Link href="/account" className="underline font-bold hover:text-red-900">My Orders</Link> or contact ThreeKnots.
           </p>
        </div>
      </div>
    )
  }

  // If already paid/verification_required, don't let them pay again, redirect to confirmed page
  if (order.payment_status !== 'pending' && order.payment_status !== 'failed') {
    redirect(`/order-confirmed/${order.order_number}`)
  }

  // Fetch payment settings for QR code
  const { data: settings } = await supabase
    .from('payment_settings')
    .select('*')
    .single()

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 pb-32">
      <div className="bg-brand-soft-pink/30 rounded-[2rem] p-8 text-center mb-8 border border-white">
        <h1 className="text-3xl font-black tracking-tight text-black mb-2">Complete Your Pre-order</h1>
        <p className="text-gray-600 font-medium">Order #{order.order_number}</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-brand-rose/20 text-center">
        <h2 className="text-xl font-black mb-2">Pay to place your pre-order</h2>
        <p className="text-gray-500 mb-8">{settings?.payment_instructions || 'Scan the QR using your UPI app and complete the payment.'}</p>

        <div className="bg-brand-bg/50 inline-block p-4 rounded-3xl border border-brand-rose/20 mb-8 mx-auto shadow-sm">
          {settings?.qr_image_url ? (
             <img src={settings.qr_image_url} alt="Payment QR Code" className="w-64 h-64 object-contain rounded-xl mix-blend-multiply" />
          ) : (
            <div className="w-64 h-64 bg-white rounded-xl flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
               No QR Configured
            </div>
          )}
        </div>

        <div className="mb-8">
           <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Amount to Pay</p>
           <p className="text-4xl font-black text-brand-accent">₹{order.amount_remaining}</p>
        </div>

        <div className="border-t border-brand-rose/20 pt-8 mt-8">
           <PaymentForm orderId={order.id} orderNumber={order.order_number} />
        </div>
      </div>
    </div>
  )
}
