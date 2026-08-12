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
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          
          {/* Header Based on Status */}
          <div className="text-center mb-8">
            {isVerified ? (
              <>
                <div className="inline-flex rounded-full bg-green-100 p-4 mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
                <p className="text-gray-500">Your payment was verified. We are processing your order.</p>
              </>
            ) : isVerificationRequired ? (
              <>
                <div className="inline-flex rounded-full bg-blue-100 p-4 mb-4">
                  <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Verification Pending</h1>
                <p className="text-gray-500">Your order will be confirmed once we verify the payment.</p>
              </>
            ) : (
              <>
                <div className="inline-flex rounded-full bg-yellow-100 p-4 mb-4 animate-pulse">
                  <AlertCircle className="h-12 w-12 text-yellow-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Received!</h1>
                <p className="text-gray-500">Your order has been placed successfully.</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-4 rounded-xl mb-8 border border-gray-100">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Order No</p>
              <p className="font-bold text-gray-900">{order.order_number}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Date</p>
              <p className="font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Total</p>
              <p className="font-bold text-gray-900">₹{order.total_amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Type</p>
              <p className="font-bold text-gray-900 capitalize">{order.payment_method === 'advance' ? '50% Advance' : '100% Prepaid'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Items Summary */}
            <div>
              <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                {order.order_items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-gray-600">
                    <span>{item.quantity}x {item.product_name}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-dashed space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery ({order.delivery_method})</span>
                  <span>{order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2">
                  <span>Total Amount</span>
                  <span>₹{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right: Payment Details */}
            <div>
              <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Payment Details</h3>
              
              <div className="bg-gray-50 p-5 rounded-xl space-y-3">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Amount to Pay Now</span>
                  <span className="text-lg">₹{order.amount_remaining.toFixed(2)}</span>
                </div>
                
                {order.payment_method === 'advance' && (
                  <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-200">
                    <span>Remaining Balance Later</span>
                    <span>₹{(order.total_amount - order.amount_remaining).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Payment Instructions Section */}
              {isPending && (
                <div className="mt-6 border rounded-xl overflow-hidden">
                  <div className="bg-gray-900 text-white p-4 text-center font-medium">
                    Payment Instructions
                  </div>
                  <div className="p-6 text-center flex flex-col items-center">
                    {settings?.qr_image_url && (
                      <div className="mb-4">
                        <img src={settings.qr_image_url} alt="Payment QR" className="w-48 h-48 object-contain mx-auto border p-2 rounded-lg bg-white" />
                        <p className="text-xs text-gray-500 mt-2">Scan to pay ₹{order.amount_remaining.toFixed(2)}</p>
                      </div>
                    )}
                    
                    {settings?.payment_instructions && (
                      <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg w-full">
                        {settings.payment_instructions}
                      </div>
                    )}
                    
                    <p className="mt-6 text-sm text-gray-600 font-medium">Please complete the required payment using the QR code above. Your order will be confirmed after we verify your payment.</p>
                  </div>
                </div>
              )}
              
              {isVerificationRequired && (
                <div className="mt-6 border border-blue-200 bg-blue-50 rounded-xl p-6 text-center">
                  <p className="text-blue-800 font-medium mb-2">We are reviewing your payment.</p>
                  <p className="text-blue-600 text-sm">This usually takes a few minutes during business hours.</p>
                </div>
              )}

              {isVerified && (
                <div className="mt-6 border border-green-200 bg-green-50 rounded-xl p-6 text-center">
                  <p className="text-green-800 font-medium mb-2">Payment Verified Successfully</p>
                  <p className="text-green-600 text-sm">Amount Paid: ₹{order.amount_paid.toFixed(2)}</p>
                </div>
              )}

            </div>
          </div>
          
          {isVerified && (
            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={`/invoice/${order.order_number}`}
                target="_blank"
                className="px-8 py-3 bg-white border-2 border-black text-black rounded-md font-medium tracking-wider hover:bg-gray-50 transition-colors text-center flex items-center justify-center gap-2"
              >
                <Receipt className="w-5 h-5" /> PRINT INVOICE
              </Link>
              <Link href="/" className="px-8 py-3 bg-black text-white rounded-md font-medium tracking-wider hover:bg-gray-900 transition-colors text-center">
                CONTINUE SHOPPING
              </Link>
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
}
