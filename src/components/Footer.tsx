'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <span className="text-lg font-bold tracking-widest text-black">ThreeKnots</span>
            <p className="mt-4 text-sm text-gray-500">Premium handcrafted bracelets inspired by your favorite themes. Made to keep.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/shop" className="text-sm text-gray-500 hover:text-gray-900">All Products</Link></li>
              <li><Link href="/collections" className="text-sm text-gray-500 hover:text-gray-900">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/faq" className="text-sm text-gray-500 hover:text-gray-900">FAQ</Link></li>
              <li><Link href="/shipping" className="text-sm text-gray-500 hover:text-gray-900">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex items-center justify-between">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} ThreeKnots. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
