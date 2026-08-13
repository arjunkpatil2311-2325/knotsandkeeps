'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const subtotal = getCartTotal()
  const deliveryCharge = subtotal >= 499 ? 0 : 59 // Just an estimate for the drawer

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-2 right-2 bottom-2 w-[calc(100%-16px)] max-w-md bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(244,164,164,0.4)] z-[101] flex flex-col border border-brand-rose/20 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-brand-rose/10 bg-brand-bg">
              <h2 className="text-xl font-black text-black">Your Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-brand-rose/10 hover:text-brand-accent rounded-full transition-colors text-black">
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 rounded-full bg-brand-blush/30 flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-brand-accent" strokeWidth={2} />
                  </div>
                  <p className="text-lg font-bold text-black mb-2">Your cart is empty</p>
                  <p className="text-gray-500 font-medium mb-8">Looks like you haven't added any pieces yet.</p>
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-black text-white text-[15px] font-bold rounded-full hover:bg-brand-accent transition-colors shadow-sm"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-24 bg-brand-bg rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 border border-transparent group-hover:border-brand-rose/20 transition-colors">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <span className="text-xs font-bold text-brand-dusty">No Image</span>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-black group-hover:text-brand-accent transition-colors line-clamp-1">{item.name}</h3>
                          <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                            <X className="w-4 h-4" strokeWidth={2.5} />
                          </button>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-sm font-black text-black">₹{item.price}</p>
                          {item.compare_at_price && item.compare_at_price > item.price && (
                            <p className="text-xs font-bold text-gray-400 line-through">₹{item.compare_at_price}</p>
                          )}
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center bg-brand-bg rounded-full border border-brand-rose/10">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:text-brand-accent text-black transition-colors rounded-l-full"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" strokeWidth={2.5} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:text-brand-accent text-black transition-colors rounded-r-full"
                              disabled={item.quantity >= item.stock_quantity}
                            >
                              <Plus className="w-3 h-3" strokeWidth={2.5} />
                            </button>
                          </div>
                          {item.quantity >= item.stock_quantity && (
                            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-accent">Max stock</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-rose/10 p-6 bg-brand-bg">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm font-bold text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-black">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-600">
                    <span>Estimated Delivery</span>
                    <span className="text-brand-accent">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}</span>
                  </div>
                  {deliveryCharge > 0 && (
                    <div className="w-full bg-brand-soft-pink/30 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div className="bg-brand-accent h-full" style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }} />
                    </div>
                  )}
                  {deliveryCharge > 0 && (
                    <p className="text-xs font-bold text-gray-500 text-center pt-1">Add <span className="text-brand-accent">₹{(499 - subtotal).toFixed(2)}</span> more for FREE delivery</p>
                  )}
                  <div className="flex justify-between font-black text-xl pt-4 mt-4 border-t border-brand-rose/20">
                    <span>Total</span>
                    <span>₹{(subtotal + deliveryCharge).toFixed(2)}</span>
                  </div>
                </div>
                
                <Link 
                  href="/checkout"
                  onClick={onClose}
                  className="w-full flex items-center justify-center bg-black text-white py-4 rounded-full text-[15px] font-bold hover:bg-brand-accent hover:shadow-[0_10px_20px_-10px_rgba(224,122,122,0.6)] uppercase tracking-widest transition-all duration-300"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
