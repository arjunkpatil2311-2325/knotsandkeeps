'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Store, Sparkles, User, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useEffect, useState } from 'react'
import { CartDrawer } from './CartDrawer'

export function MobileNavbar() {
  const pathname = usePathname()
  const items = useCartStore((state) => state.items)
  const [mounted, setMounted] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Don't show in admin area
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop', href: '/shop', icon: Store },
    { name: 'Collections', href: '/collections', icon: Sparkles },
    { name: 'Account', href: '/login', icon: User },
  ]

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe pt-2 bg-transparent pointer-events-none">
        <div className="bg-[#FFF0F3] border border-black/10 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)] rounded-3xl mx-auto max-w-md flex justify-between items-center p-2 px-4 pointer-events-auto mb-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-white shadow-sm text-brand-accent' 
                    : 'text-gray-500 hover:text-black hover:bg-white/50'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
          
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all text-gray-500 hover:text-black hover:bg-white/50 relative group"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-1" strokeWidth={2} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-soft-pink text-black text-[9px] font-bold shadow-sm">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </button>
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
