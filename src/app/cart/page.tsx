'use client'

import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore()

  const subtotal = getCartTotal()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added any premium bracelets yet.</p>
        <Link href="/shop" className="inline-block bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
          Explore Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
            <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    {item.image_url ? (
                       <img src={item.image_url} alt={item.name} className="w-24 h-24 rounded-md object-center object-cover sm:w-32 sm:h-32" />
                    ) : (
                       <div className="w-24 h-24 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-400 sm:w-32 sm:h-32">No Image</div>
                    )}
                  </div>

                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link href={`/product/${item.slug}`} className="font-medium text-gray-700 hover:text-gray-800">
                              {item.name}
                            </Link>
                          </h3>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">₹{item.price}</p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="flex items-center border border-gray-300 rounded-md max-w-max">
                           <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-gray-600 hover:text-black">
                             <Minus className="w-4 h-4" />
                           </button>
                           <span className="px-4 py-2 text-sm font-medium">{item.quantity}</span>
                           <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-gray-600 hover:text-black" disabled={item.quantity >= item.stock_quantity}>
                             <Plus className="w-4 h-4" />
                           </button>
                        </div>

                        <div className="absolute top-0 right-0">
                          <button type="button" onClick={() => removeItem(item.id)} className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Remove</span>
                            <Trash2 className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section aria-labelledby="summary-heading" className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">₹{subtotal}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping estimate</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900">Calculated at checkout</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">₹{subtotal}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link href="/checkout" className="w-full bg-black border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black flex justify-center transition-colors">
                Proceed to Checkout
              </Link>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}
