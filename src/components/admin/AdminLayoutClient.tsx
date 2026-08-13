'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/login/actions'
import { LayoutDashboard, Package, ShoppingBag, FolderTree, Layers, Tag, Users, Settings, LogOut, Menu, X } from 'lucide-react'
import { AdminNotifications } from '@/components/admin/AdminNotifications'

interface AdminLayoutClientProps {
  children: React.ReactNode
  notifications: any[]
}

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Collections', href: '/admin/collections', icon: Layers },
  { name: 'Discounts', href: '/admin/discounts', icon: Tag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminLayoutClient({ children, notifications }: AdminLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-neo-bg text-black overflow-hidden relative">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-white border-r-4 border-black flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between border-b-2 border-black">
          <div>
            <Link href="/admin" className="text-xl font-black tracking-widest text-black flex items-center group">
              <span className="bg-neo-pink px-2 py-1 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">ThreeKnots</span>
            </Link>
            <p className="text-xs text-black uppercase tracking-wider mt-1 font-bold">Admin Panel</p>
          </div>
          <button 
            className="md:hidden text-black bg-white border-2 border-black p-1 rounded-md shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5 font-bold" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-3 overflow-y-auto custom-scrollbar font-bold">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/admin')
            return (
              <Link 
                key={item.name}
                href={item.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-3 text-sm rounded-xl transition-all duration-200 border-2 ${
                  isActive 
                    ? 'bg-neo-yellow text-black border-black shadow-[4px_4px_0_0_#000]' 
                    : 'bg-white text-black border-transparent hover:border-black hover:shadow-[4px_4px_0_0_#000]'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-black' : 'text-black'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t-4 border-black bg-white">
          <form action={logout}>
            <button className="flex w-full items-center px-3 py-3 text-sm font-bold rounded-xl text-black bg-white border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0_0_#000] hover:bg-red-400 transition-all duration-200">
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Navbar */}
        <header className="bg-white border-b-4 border-black shrink-0 sticky top-0 z-30">
          <div className="px-4 py-4 flex justify-between items-center md:justify-end">
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-black bg-white border-2 border-black p-1 mr-4 rounded-md shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                <Menu className="w-6 h-6 font-bold" />
              </button>
              <Link href="/admin" className="text-xl font-black text-black tracking-tight">K&K</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] p-1">
                <AdminNotifications initialNotifications={notifications} />
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  )
}
