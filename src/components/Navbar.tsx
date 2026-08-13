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
    <header className="sticky top-0 z-50 w-full pt-4 px-4 sm:px-8 lg:px-12 bg-transparent">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
          <div className="flex gap-[2px]">
            <div className="w-1.5 h-1.5 rounded-full bg-black group-hover:bg-brand-accent transition-colors" />
            <div className="w-1.5 h-1.5 rounded-full bg-black group-hover:bg-brand-accent transition-colors" />
            <div className="w-1.5 h-1.5 rounded-full bg-black group-hover:bg-brand-accent transition-colors" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black group-hover:text-brand-accent transition-colors">
            threeknots
          </span>
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-[15px] font-bold text-black hover:text-brand-accent transition-colors">Home</Link>
          <Link href="/shop" className="text-[15px] font-bold text-gray-500 hover:text-brand-accent transition-colors">Shop</Link>
          <Link href="/collections" className="text-[15px] font-bold text-gray-500 hover:text-brand-accent transition-colors">Collections</Link>
          <Link href="/about" className="text-[15px] font-bold text-gray-500 hover:text-brand-accent transition-colors">About</Link>
        </nav>

        <div className="flex items-center space-x-6">
          <button className="text-black hover:text-brand-accent transition-colors"><Search className="h-[18px] w-[18px]" strokeWidth={2.5} /></button>
          <Link href="/login" className="text-black hover:text-brand-accent transition-colors"><User className="h-[18px] w-[18px]" strokeWidth={2.5} /></Link>
          <button onClick={() => setIsCartOpen(true)} className="text-black hover:text-brand-accent transition-colors relative inline-block group">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2.5} />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-brand-soft-pink text-black text-[10px] font-bold shadow-sm transition-transform group-hover:scale-110">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
