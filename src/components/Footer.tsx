'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ScrollReveal } from './ScrollReveal'

export function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-surface pt-16 md:pt-24 pb-32 md:pb-12 px-4 md:px-16 border-t-2 border-on-surface relative z-10">
      <ScrollReveal className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
        <div className="md:col-span-4 mb-12 md:mb-0 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-on-surface shadow-md">
              <img 
                src="/logo.jpg" 
                alt="ThreeKnots Logo" 
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div className="text-3xl font-headline-lg text-on-surface">ThreeKnots</div>
          </div>
          <p className="font-body-md text-on-surface-variant max-w-xs">Premium streetwear jewelry. Handcrafted to endure the journey.</p>
        </div>
        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <h4 className="font-label-caps text-xs tracking-widest font-bold mb-4">SHOP</h4>
            <Link href="/shop" className="font-body-md text-on-surface hover:text-secondary transition-colors">All Products</Link>
            <Link href="/collections" className="font-body-md text-on-surface hover:text-secondary transition-colors">Collections</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-label-caps text-xs tracking-widest font-bold mb-4">SUPPORT</h4>
            <Link href="/faq" className="font-label-caps text-xs text-on-surface-variant hover:text-secondary transition-colors">FAQ</Link>
            <Link href="/shipping" className="font-label-caps text-xs text-on-surface-variant hover:text-secondary transition-colors">Shipping & Returns</Link>
            <Link href="/contact" className="font-label-caps text-xs text-on-surface-variant hover:text-secondary transition-colors">Contact Us</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-label-caps text-xs tracking-widest font-bold mb-4">LEGAL</h4>
            <Link href="/privacy" className="font-label-caps text-xs text-on-surface-variant hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="font-label-caps text-xs text-on-surface-variant hover:text-secondary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </ScrollReveal>
      <div className="max-w-[1440px] mx-auto mt-24 pt-8 border-t-2 border-on-surface flex justify-between items-center">
        <span className="font-label-caps text-xs text-on-surface-variant">&copy; {new Date().getFullYear()} ThreeKnots. Made to keep.</span>
      </div>
    </footer>
  )
}
