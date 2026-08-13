'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="mt-20 px-4 sm:px-8 lg:px-12 pb-8">
      <div className="bg-brand-soft-pink/30 rounded-3xl p-8 sm:p-12 border border-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex gap-[2px]">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent group-hover:bg-black transition-colors" />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent group-hover:bg-black transition-colors" />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent group-hover:bg-black transition-colors" />
              </div>
              <span className="text-xl font-bold tracking-tight text-black group-hover:text-brand-accent transition-colors">
                threeknots
              </span>
            </Link>
            <p className="text-sm font-medium text-gray-600">Premium handcrafted bracelets. Made to keep.</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-black tracking-widest uppercase mb-6">Shop</h3>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-brand-accent transition-colors">All Products</Link></li>
              <li><Link href="/collections" className="text-sm font-medium text-gray-600 hover:text-brand-accent transition-colors">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-black tracking-widest uppercase mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-brand-accent transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="text-sm font-medium text-gray-600 hover:text-brand-accent transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-brand-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-black tracking-widest uppercase mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-sm font-medium text-gray-600 hover:text-brand-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm font-medium text-gray-600 hover:text-brand-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-brand-rose/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-gray-500">&copy; {new Date().getFullYear()} ThreeKnots. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
