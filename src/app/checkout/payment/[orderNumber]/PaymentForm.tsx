'use client'

import { useState, useEffect } from 'react'
import { submitPaymentVerification, cancelPreorder } from './actions'

import { useCartStore } from '@/store/cart'

export function PaymentForm({ orderId, orderNumber }: { orderId: string, orderNumber: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCancelled, setIsCancelled] = useState(false)
  const { clearCart } = useCartStore()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    
    const utr = formData.get('utr') as string
    if (!utr || utr.trim() === '') {
      setError("Please enter a valid UTR / Transaction ID")
      setIsSubmitting(false)
      return
    }

    try {
      const result = await submitPaymentVerification(orderId, orderNumber, utr.trim())
      if (result?.error) {
        setError(result.error)
        setIsSubmitting(false)
      }
      // Success redirects automatically via server action
    } catch (err: any) {
      setError(err.message || "Failed to submit")
      setIsSubmitting(false)
    }
  }

  async function handleCancel() {
    if (!window.confirm("Cancel this pre-order?\n\nYour payment has not been submitted yet. Cancelling will release the reserved stock.")) {
      return
    }
    
    setIsCancelling(true)
    setError(null)
    
    try {
      const result = await cancelPreorder(orderId, orderNumber)
      if (result?.error) {
        setError(result.error)
        setIsCancelling(false)
      } else {
        setIsCancelled(true)
      }
    } catch (err: any) {
      setError(err.message || "Failed to cancel")
      setIsCancelling(false)
    }
  }

  if (isCancelled) {
    return (
      <div className="max-w-sm mx-auto text-center">
        <h3 className="text-xl font-black text-black mb-4">Pre-order cancelled</h3>
        <p className="text-gray-600 font-medium mb-8">
          Your reserved stock has been released. No payment was confirmed.
        </p>
        <a 
          href="/shop"
          className="block w-full bg-black text-white py-4 rounded-full text-[13px] font-bold tracking-widest hover:bg-brand-accent transition-all duration-300 uppercase"
        >
          Continue Shopping
        </a>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="max-w-sm mx-auto text-left">
      <h3 className="text-[15px] font-black text-black mb-4 text-center">Payment completed?</h3>
      
      <div className="mb-6">
        <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2">
          UPI Transaction ID / UTR <span className="text-brand-accent">*</span>
        </label>
        <input 
          required
          name="utr" 
          type="text" 
          placeholder="Enter your UTR / transaction ID"
          className="w-full bg-brand-bg/50 border border-brand-rose/20 rounded-2xl p-4 text-[15px] font-medium text-black focus:outline-none focus:border-brand-accent focus:bg-white transition-all text-center tracking-widest" 
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-bold rounded-2xl border border-red-200 text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isCancelling}
        className="w-full bg-black text-white py-4 rounded-full text-[13px] font-bold tracking-widest hover:bg-brand-accent transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed uppercase mb-4"
      >
        {isSubmitting ? 'Submitting...' : "I've Paid — Submit for Verification"}
      </button>
      
      <button
        type="button"
        onClick={handleCancel}
        disabled={isSubmitting || isCancelling}
        className="w-full bg-transparent text-gray-500 py-2 rounded-full text-[13px] font-bold hover:text-red-600 transition-colors disabled:opacity-50"
      >
        Cancel this pre-order
      </button>
    </form>
  )
}
