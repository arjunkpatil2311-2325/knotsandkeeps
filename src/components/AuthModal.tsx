'use client'

import { useAuthStore } from '@/store/auth'
import { LoginForm } from './LoginForm'
import { X } from 'lucide-react'
import { useEffect } from 'react'

export function AuthModal() {
  const { isAuthModalOpen, redirectTo, closeAuthModal } = useAuthStore()

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isAuthModalOpen])

  if (!isAuthModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={closeAuthModal}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button 
          onClick={closeAuthModal}
          className="absolute top-6 right-6 text-black/40 hover:text-black z-20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <LoginForm next={redirectTo} />
        </div>

        {/* Maybe Later Option */}
        <div className="text-center mt-4">
          <button 
            onClick={closeAuthModal}
            className="text-xs font-black text-[#666666] hover:text-black uppercase tracking-widest transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
