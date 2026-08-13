'use client'

import Link from 'next/link'
import { ShoppingBag, Search, User } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CartDrawer } from './CartDrawer'

export function Navbar() {
  const items = useCartStore((state) => state.items)
  const [mounted, setMounted] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold tracking-widest text-black">
                ThreeKnots
              </span>
            </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black">Home</Link>
            <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-black">Shop</Link>
            <Link href="/collections" className="text-sm font-medium text-gray-700 hover:text-black">Collections</Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-black">About</Link>
          </nav>
          <div className="flex items-center space-x-5">
            <button className="text-gray-500 hover:text-black"><Search className="h-5 w-5" /></button>
            <Link href="/login" className="text-gray-500 hover:text-black"><User className="h-5 w-5" /></Link>
            <button onClick={() => setIsCartOpen(true)} className="text-gray-500 hover:text-black relative inline-block">
              <ShoppingBag className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
