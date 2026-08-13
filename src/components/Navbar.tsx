'use client'

import Link from 'next/link'
import { ShoppingBag, Search, User, Menu, X, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CartDrawer } from './CartDrawer'

export function Navbar() {
  const items = useCartStore((state) => state.items)
  const [mounted, setMounted] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'About', href: '/about' },
  ]

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col bg-white border-b border-[#E8E8E8] shadow-sm">
      {/* 1. ANNOUNCEMENT BAR */}
      <div className="w-full bg-[#111111] text-white py-2 text-center overflow-hidden relative z-20 select-none">
        <div className="whitespace-nowrap flex marquee">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mx-4">
            FREE SHIPPING ON SELECTED ORDERS &bull; NEW BRACELETS JUST DROPPED &bull; HANDCRAFTED &bull; MADE TO KEEP &bull; FREE SHIPPING ON SELECTED ORDERS &bull; NEW BRACELETS JUST DROPPED &bull; HANDCRAFTED &bull; MADE TO KEEP
          </span>
        </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <div className="h-16 w-full flex items-center justify-between px-4 md:px-16 max-w-7xl mx-auto">
        {/* Mobile Hamburger (Left on mobile) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="md:hidden text-[#171717] hover:text-[#f72585] transition-colors p-2"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo / Branding (Center on mobile, left on desktop) */}
        <Link href="/" className="flex items-center gap-2 group relative z-50">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E8E8E8] shadow-sm transition-transform group-hover:scale-105">
            <img 
              src="/logo.jpg" 
              alt="ThreeKnots Logo" 
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#171717] group-hover:text-[#f72585] transition-colors font-sans">
            ThreeKnots
          </span>
        </Link>

        {/* Desktop Links (Center) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`text-xs font-bold uppercase tracking-widest relative py-2 transition-colors duration-200 ${
                  isActive ? 'text-[#f72585]' : 'text-[#666666] hover:text-[#171717]'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f72585] rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Action Icons (Right) */}
        <div className="flex items-center gap-2 md:gap-4 relative z-50">
          <button className="text-[#666666] hover:text-[#f72585] p-2 transition-colors">
            <Search className="h-5 w-5" />
          </button>
          
          <Link href="/wishlist" className="hidden md:block text-[#666666] hover:text-[#f72585] p-2 transition-colors">
            <Heart className="h-5 w-5" />
          </Link>
          
          <Link href="/login" className="hidden md:block text-[#666666] hover:text-[#f72585] p-2 transition-colors">
            <User className="h-5 w-5" />
          </Link>
          
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="text-[#171717] hover:text-[#f72585] p-2 transition-colors relative group"
          >
            <ShoppingBag className="h-5 w-5 group-hover:scale-105 transition-transform" />
            {mounted && itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#f72585] text-white w-4.5 h-4.5 flex items-center justify-center rounded-full text-[9px] font-bold shadow-sm">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[88px] bg-white border-b border-[#E8E8E8] shadow-lg py-6 px-6 flex flex-col gap-4 z-40 transition-all duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm font-bold uppercase tracking-wider ${
                pathname === link.href ? 'text-[#f72585]' : 'text-[#666666]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-[1px] bg-[#E8E8E8] my-2" />
          <Link 
            href="/wishlist" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-bold uppercase tracking-wider text-[#666666] flex items-center gap-2"
          >
            <Heart className="h-5 w-5 text-[#f72585]" /> Wishlist
          </Link>
          <Link 
            href="/login" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-bold uppercase tracking-wider text-[#666666] flex items-center gap-2"
          >
            <User className="h-5 w-5" /> Account
          </Link>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
