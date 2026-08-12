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
            className="fixed inset-0 bg-black/50 z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold tracking-wider">YOUR CART</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                  <ShoppingBag className="w-12 h-12 text-gray-300" />
                  <p>Your cart is empty.</p>
                  <button 
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-sm font-medium">₹{item.price}</p>
                          {item.compare_at_price && item.compare_at_price > item.price && (
                            <p className="text-xs text-gray-500 line-through">₹{item.compare_at_price}</p>
                          )}
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-gray-200 rounded">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1 text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                              disabled={item.quantity >= item.stock_quantity}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          {item.quantity >= item.stock_quantity && (
                            <span className="text-xs text-red-500 font-medium">Max stock</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Estimated Delivery</span>
                    <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}</span>
                  </div>
                  {deliveryCharge > 0 && (
                    <p className="text-xs text-gray-500">Add ₹{(499 - subtotal).toFixed(2)} more for FREE delivery.</p>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                    <span>Estimated Total</span>
                    <span>₹{(subtotal + deliveryCharge).toFixed(2)}</span>
                  </div>
                </div>
                
                <Link 
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full text-center bg-black text-white py-4 font-bold tracking-widest hover:bg-gray-900 transition-colors"
                >
                  PROCEED TO CHECKOUT
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
