'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

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
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-[1400px] min-h-[90vh] bg-brand-cream rounded-[2rem] sm:rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(244,164,164,0.3)] border border-white/50 overflow-hidden flex flex-col relative">
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blush blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-soft-pink blur-[120px]" />
        </div>
        
        <div className="relative z-10 flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 flex flex-col pt-8 pb-16 px-4 sm:px-8 lg:px-16 relative">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
