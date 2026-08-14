'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { MobileNavbar } from '@/components/MobileNavbar'
import { Footer } from '@/components/Footer'
import { AuthModal } from '@/components/AuthModal'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return (
      <>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </>
    )
  }

  // Customer Site Layout
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col relative min-h-screen pt-[96px]">
        {children}
      </main>
      <Footer />
      <MobileNavbar />
      <AuthModal />
    </>
  )
}
