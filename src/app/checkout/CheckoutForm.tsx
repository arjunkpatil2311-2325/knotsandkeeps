'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { createOrder } from './actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ChevronRight, Lock } from 'lucide-react'

export function CheckoutForm({ settings }: { settings: any }) {
  const { items, getCartTotal, clearCart } = useCartStore()
  const router = useRouter()
  
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
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

  if (items.length === 0 && !isRedirecting && !isSubmitting) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-[3rem] p-12 text-center max-w-md w-full border border-brand-rose/20 shadow-sm">
          <div className="w-24 h-24 bg-brand-soft-pink/30 rounded-full mx-auto flex items-center justify-center mb-6">
            <span className="text-4xl">🛍️</span>
          </div>
          <h1 className="text-2xl font-black mb-2 text-black">Your cart is empty</h1>
          <p className="text-gray-500 font-medium mb-8">Let's find something beautiful for you.</p>
          <Link href="/shop" className="block w-full bg-black text-white px-8 py-4 rounded-full text-[15px] font-bold tracking-widest hover:bg-brand-accent hover:shadow-[0_10px_20px_-10px_rgba(224,122,122,0.6)] transition-all duration-300">
            CONTINUE SHOPPING
          </Link>
        </div>
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

      setIsRedirecting(true)
      router.push(`/checkout/payment/${result.orderNumber}`)
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setIsSubmitting(false)
      setIsRedirecting(false)
    }
  }

  const InputLabel = ({ children, required }: { children: React.ReactNode, required?: boolean }) => (
    <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2">
      {children} {required && <span className="text-brand-accent">*</span>}
    </label>
  )

  const Input = (props: any) => (
    <input 
      {...props} 
      className={`w-full bg-white border border-brand-rose/20 rounded-2xl p-4 text-[15px] font-medium text-black focus:outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 transition-all ${props.className || ''}`} 
    />
  )

  return (
    <div className="w-full pb-24">
      {/* Header */}
      <div className="bg-brand-soft-pink/30 rounded-[2rem] p-8 sm:p-12 mb-12 border border-white text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-black mb-4">Secure Checkout</h1>
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
          <Lock className="w-4 h-4 text-brand-accent" strokeWidth={2.5} />
          SSL Encrypted Connection
        </div>
      </div>
      
      <form action={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column - Forms */}
        <div className="flex-1 space-y-8">
          
          {/* Customer Details */}
          <section className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-brand-rose/10 relative overflow-hidden group hover:border-brand-soft-pink transition-colors duration-500">
            <div className="absolute top-0 left-0 w-2 h-full bg-brand-soft-pink" />
            <h2 className="text-2xl font-black mb-8 text-black flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-[15px] text-brand-accent">1</span>
              Customer Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputLabel required>Full Name</InputLabel>
                <Input required name="customer_name" type="text" placeholder="Jane Doe" />
              </div>
              <div>
                <InputLabel required>Email Address</InputLabel>
                <Input required name="customer_email" type="email" placeholder="jane@example.com" />
              </div>
              <div>
                <InputLabel required>Mobile Number</InputLabel>
                <Input required name="customer_phone" type="tel" pattern="[0-9]{10}" title="10 digit mobile number" placeholder="9876543210" />
              </div>
            </div>
          </section>

          {/* Shipping Details */}
          <section className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-brand-rose/10 relative overflow-hidden group hover:border-brand-soft-pink transition-colors duration-500">
            <div className="absolute top-0 left-0 w-2 h-full bg-brand-soft-pink" />
            <h2 className="text-2xl font-black mb-8 text-black flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-[15px] text-brand-accent">2</span>
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputLabel required>Address Line 1</InputLabel>
                <Input required name="shipping_address" type="text" placeholder="House/Flat No., Building Name" />
              </div>
              <div className="md:col-span-2">
                <InputLabel>Address Line 2 (Optional)</InputLabel>
                <Input name="shipping_address_2" type="text" placeholder="Street, Area, Landmark" />
              </div>
              <div>
                <InputLabel required>City</InputLabel>
                <Input required name="shipping_city" type="text" placeholder="Mumbai" />
              </div>
              <div>
                <InputLabel required>State</InputLabel>
                <Input required name="shipping_state" type="text" placeholder="Maharashtra" />
              </div>
              <div>
                <InputLabel required>Pincode</InputLabel>
                <Input required name="shipping_zip" type="text" pattern="[0-9]{6}" title="6 digit pincode" placeholder="400001" />
              </div>
              <div>
                <InputLabel required>Country</InputLabel>
                <Input required name="shipping_country" type="text" defaultValue="India" readOnly className="bg-brand-bg/50 text-gray-500 border-transparent cursor-not-allowed" />
              </div>
            </div>

            <div className="mt-8 flex items-center bg-brand-bg/50 p-4 rounded-2xl border border-brand-rose/10">
              <input 
                type="checkbox" 
                id="sameAsShipping" 
                checked={sameAsShipping} 
                onChange={(e) => setSameAsShipping(e.target.checked)}
                className="w-5 h-5 rounded-md border-gray-300 text-brand-accent focus:ring-brand-accent cursor-pointer" 
              />
              <label htmlFor="sameAsShipping" className="ml-3 block text-[15px] font-bold text-gray-900 cursor-pointer">
                Billing address is same as shipping
              </label>
            </div>
          </section>

          {/* Billing Details */}
          {!sameAsShipping && (
            <section className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-brand-rose/10 relative overflow-hidden group hover:border-brand-soft-pink transition-colors duration-500">
              <div className="absolute top-0 left-0 w-2 h-full bg-brand-soft-pink" />
              <h2 className="text-2xl font-black mb-8 text-black flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-[15px] text-brand-accent">3</span>
                Billing Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InputLabel required>Address Line 1</InputLabel>
                  <Input required={!sameAsShipping} name="billing_address" type="text" />
                </div>
                <div>
                  <InputLabel required>City</InputLabel>
                  <Input required={!sameAsShipping} name="billing_city" type="text" />
                </div>
                <div>
                  <InputLabel required>State</InputLabel>
                  <Input required={!sameAsShipping} name="billing_state" type="text" />
                </div>
                <div>
                  <InputLabel required>Pincode</InputLabel>
                  <Input required={!sameAsShipping} name="billing_zip" type="text" pattern="[0-9]{6}" />
                </div>
              </div>
            </section>
          )}

          {/* Delivery & Payment Options */}
          <section className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-brand-rose/10 relative overflow-hidden group hover:border-brand-soft-pink transition-colors duration-500">
            <div className="absolute top-0 left-0 w-2 h-full bg-brand-soft-pink" />
            <h2 className="text-2xl font-black mb-8 text-black flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-[15px] text-brand-accent">{sameAsShipping ? '3' : '4'}</span>
              Delivery & Payment
            </h2>
            
            <div className="mb-8">
              <InputLabel>Delivery Method</InputLabel>
              <div className="space-y-4 mt-4">
                <label className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${deliveryMethod === 'normal' ? 'border-brand-accent bg-brand-soft-pink/10 shadow-[0_4px_20px_-10px_rgba(224,122,122,0.3)]' : 'border-gray-100 hover:border-brand-rose/30 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryMethod === 'normal' ? 'border-brand-accent' : 'border-gray-300'}`}>
                        {deliveryMethod === 'normal' && <div className="w-3 h-3 rounded-full bg-brand-accent" />}
                      </div>
                      <div>
                        <span className="block font-black text-black">Standard Delivery</span>
                        <span className="block text-sm font-medium text-gray-500">7-9 business days</span>
                      </div>
                    </div>
                    <span className="text-lg font-black text-brand-accent">{subtotal >= 499 ? 'FREE' : '₹59'}</span>
                  </div>
                </label>
                
                <label className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${deliveryMethod === 'fast' ? 'border-brand-accent bg-brand-soft-pink/10 shadow-[0_4px_20px_-10px_rgba(224,122,122,0.3)]' : 'border-gray-100 hover:border-brand-rose/30 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryMethod === 'fast' ? 'border-brand-accent' : 'border-gray-300'}`}>
                        {deliveryMethod === 'fast' && <div className="w-3 h-3 rounded-full bg-brand-accent" />}
                      </div>
                      <div>
                        <span className="block font-black text-black">Express Delivery</span>
                        <span className="block text-sm font-medium text-gray-500">3-5 business days</span>
                      </div>
                    </div>
                    <span className="text-lg font-black text-black">₹99</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-brand-soft-pink/20 p-5 rounded-2xl border border-brand-rose/20 mb-6">
              <p className="text-[13px] font-bold text-gray-700 leading-relaxed text-center">
                <span className="bg-brand-accent text-white px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest mr-2 align-middle">PRE-ORDER</span>
                Your product will be meticulously prepared after payment confirmation.
              </p>
            </div>
            <input type="hidden" name="paymentMethod" value="prepaid" />
          </section>
          
        </div>

        {/* Right Column - Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-brand-rose/20 sticky top-24">
            <h2 className="text-xl font-black mb-6 text-black">Order Summary</h2>
            
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-brand-bg rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 border border-brand-rose/10">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-contain drop-shadow-sm" />
                    ) : (
                      <span className="text-[10px] font-bold text-brand-dusty">No Image</span>
                    )}
                    <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 py-1">
                    <p className="text-[15px] font-bold text-black line-clamp-2 leading-tight mb-2">{item.name}</p>
                    <p className="text-sm font-black text-brand-dusty">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-brand-bg rounded-3xl p-6 space-y-4 mb-6">
              <div className="flex justify-between text-[15px] font-bold text-gray-600">
                <span>Subtotal</span>
                <span className="text-black">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[15px] font-bold text-gray-600">
                <span>Delivery</span>
                <span className={deliveryCharge === 0 ? "text-brand-accent" : "text-black"}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-xl font-black text-black pt-4 border-t border-brand-rose/20 mt-4">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-brand-soft-pink/30 p-6 rounded-3xl border border-brand-rose/20 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">
                  Amount to Pay
                </span>
                <span className="text-2xl font-black text-brand-accent">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-bold rounded-2xl border border-red-200 flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isRedirecting}
              className="w-full bg-black text-white py-5 rounded-full text-[15px] font-bold tracking-widest hover:bg-brand-accent hover:shadow-[0_10px_20px_-10px_rgba(224,122,122,0.6)] transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2 group"
            >
              {isRedirecting ? (
                'TAKING YOU TO PAYMENT...'
              ) : isSubmitting ? (
                'CREATING YOUR PRE-ORDER...'
              ) : (
                <>
                  PLACE PRE-ORDER
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-2 mt-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <Lock className="w-3 h-3" />
              100% Secure Payment
            </div>
          </div>
        </div>
        
      </form>
    </div>
  )
}
