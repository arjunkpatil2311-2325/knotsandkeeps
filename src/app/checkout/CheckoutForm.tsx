'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { createOrder } from './actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function CheckoutForm({ settings }: { settings: any }) {
  const { items, getCartTotal, clearCart } = useCartStore()
  const router = useRouter()
  
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [deliveryMethod, setDeliveryMethod] = useState<'normal' | 'fast'>('normal')
  
  // Default to prepaid if available, otherwise advance
  const [paymentMethod, setPaymentMethod] = useState<'prepaid' | 'advance'>(
    settings?.is_100_percent_enabled ? 'prepaid' : 'advance'
  )
  
  const [sameAsShipping, setSameAsShipping] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/shop" className="bg-black text-white px-6 py-3 rounded text-sm font-medium tracking-wider">
          RETURN TO SHOP
        </Link>
      </div>
    )
  }

  const subtotal = getCartTotal()
  
  let deliveryCharge = 0
  if (deliveryMethod === 'fast') {
    deliveryCharge = 99
  } else if (subtotal < 499) {
    deliveryCharge = 59
  }

  const discount = 0 
  const total = subtotal + deliveryCharge - discount
  
  const amountToPay = paymentMethod === 'advance' ? Math.round(total / 2) : total

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    
    formData.append('cartItems', JSON.stringify(items.map(i => ({ id: i.id, quantity: i.quantity }))))
    formData.append('deliveryMethod', deliveryMethod)
    formData.append('paymentMethod', paymentMethod)
    formData.append('sameAsShipping', sameAsShipping.toString())
    
    try {
      const result = await createOrder(formData)
      
      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      clearCart()
      router.push(`/order-confirmed/${result.orderNumber}`)
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <form action={handleSubmit} className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column - Forms */}
          <div className="flex-1 space-y-10">
            
            {/* Customer Details */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">1. Customer Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input required name="customer_name" type="text" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input required name="customer_email" type="email" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input required name="customer_phone" type="tel" pattern="[0-9]{10}" title="10 digit mobile number" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black" placeholder="9876543210" />
                </div>
              </div>
            </section>

            {/* Shipping Details */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">2. Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                  <input required name="shipping_address" type="text" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <input name="shipping_address_2" type="text" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input required name="shipping_city" type="text" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input required name="shipping_state" type="text" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input required name="shipping_zip" type="text" pattern="[0-9]{6}" title="6 digit pincode" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input required name="shipping_country" type="text" defaultValue="India" readOnly className="w-full border-gray-300 rounded-md shadow-sm p-2 border bg-gray-50 text-gray-500" />
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <input 
                  type="checkbox" 
                  id="sameAsShipping" 
                  checked={sameAsShipping} 
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" 
                />
                <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-900">
                  Billing address is same as shipping address
                </label>
              </div>
            </section>

            {/* Billing Details */}
            {!sameAsShipping && (
              <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">3. Billing Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                    <input required={!sameAsShipping} name="billing_address" type="text" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input required={!sameAsShipping} name="billing_city" type="text" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input required={!sameAsShipping} name="billing_state" type="text" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input required={!sameAsShipping} name="billing_zip" type="text" pattern="[0-9]{6}" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-black focus:border-black" />
                  </div>
                </div>
              </section>
            )}

            {/* Delivery & Payment Options */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Delivery Method</h2>
              <div className="space-y-3">
                <label className={`block border p-4 rounded-md cursor-pointer transition-colors ${deliveryMethod === 'normal' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input type="radio" name="delivery" checked={deliveryMethod === 'normal'} onChange={() => setDeliveryMethod('normal')} className="h-4 w-4 text-black focus:ring-black" />
                      <span className="ml-3 font-medium">Normal Delivery (7-9 days)</span>
                    </div>
                    <span className="font-bold">{subtotal >= 499 ? 'FREE' : '₹59'}</span>
                  </div>
                </label>
                <label className={`block border p-4 rounded-md cursor-pointer transition-colors ${deliveryMethod === 'fast' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input type="radio" name="delivery" checked={deliveryMethod === 'fast'} onChange={() => setDeliveryMethod('fast')} className="h-4 w-4 text-black focus:ring-black" />
                      <span className="ml-3 font-medium">Fast Delivery (3-5 days)</span>
                    </div>
                    <span className="font-bold">₹99</span>
                  </div>
                </label>
              </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Payment Options</h2>
              <div className="space-y-3">
                {settings?.is_100_percent_enabled && (
                  <label className={`block border p-4 rounded-md cursor-pointer transition-colors ${paymentMethod === 'prepaid' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center">
                      <input type="radio" name="payment" checked={paymentMethod === 'prepaid'} onChange={() => setPaymentMethod('prepaid')} className="h-4 w-4 text-black focus:ring-black" />
                      <span className="ml-3 font-medium">100% Full Payment</span>
                    </div>
                    <p className="ml-7 mt-1 text-sm text-gray-500">Pay the full amount securely using our verified payment method.</p>
                  </label>
                )}
                {settings?.is_50_percent_enabled && (
                  <label className={`block border p-4 rounded-md cursor-pointer transition-colors ${paymentMethod === 'advance' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center">
                      <input type="radio" name="payment" checked={paymentMethod === 'advance'} onChange={() => setPaymentMethod('advance')} className="h-4 w-4 text-black focus:ring-black" />
                      <span className="ml-3 font-medium">50% Advance Payment</span>
                    </div>
                    <p className="ml-7 mt-1 text-sm text-gray-500">Pay 50% now to confirm order. The remaining 50% link will be sent later.</p>
                  </label>
                )}
              </div>
            </section>
            
          </div>

          {/* Right Column - Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 relative">
                      {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded" />}
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                
                <div className="bg-blue-50 p-3 rounded text-sm mt-4 border border-blue-100">
                  <div className="flex justify-between font-bold text-blue-900 mb-1">
                    <span>{paymentMethod === 'advance' ? 'To Pay Now (50%)' : 'Amount to Pay'}</span>
                    <span>₹{amountToPay.toFixed(2)}</span>
                  </div>
                  {paymentMethod === 'advance' && (
                    <div className="flex justify-between text-blue-700">
                      <span>Remaining Balance</span>
                      <span>₹{(total - amountToPay).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-black text-white py-4 rounded font-bold tracking-widest hover:bg-gray-900 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? 'PROCESSING...' : `PLACE ORDER & PAY ₹${amountToPay.toFixed(2)}`}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                You will be taken to the payment instructions page.
              </p>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  )
}
