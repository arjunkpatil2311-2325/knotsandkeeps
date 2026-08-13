import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LayoutWrapper } from '@/components/LayoutWrapper'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'ThreeKnots | Made to Keep',
  description: 'Premium handcrafted anime and pop-culture inspired bracelets.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen flex flex-col bg-background text-[#171717] font-sans antialiased`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
