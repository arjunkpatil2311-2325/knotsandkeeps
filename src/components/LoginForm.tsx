'use client'

import { useState } from 'react'
import { login, signup } from '@/app/login/actions'
import { createClient } from '@/utils/supabase/client'

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(initialError || null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleAction = async (action: 'login' | 'signup') => {
    setLoading(true)
    setError(null)
    
    try {
      const result = action === 'login' 
        ? await login({ email, password }, next) 
        : await signup({ email, password }, next)
        
      if (result?.error) {
        setError(result.error)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const redirectToUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next || '/account')}`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectToUrl,
        },
      })
      if (error) {
        throw error
      }
    } catch (err: any) {
      setError(err.message || "Failed to initialize Google Sign In")
      setLoading(false)
    }
  }

  const isCheckout = next?.includes('checkout')
  const title = isCheckout ? "Sign in to place your order" : "Sign in to continue"
  const subtitle = isCheckout 
    ? "Sign in with Google to securely save your order and track it anytime." 
    : "Create an account or sign in with Google to manage your orders and account."

  return (
    <div className="w-full bg-white border-2 border-black rounded-[2rem] p-8 shadow-[6px_6px_0_0_#000] tracking-tight">
      <div className="text-center mb-8">
        <h1 className="text-xl font-black text-black uppercase tracking-wider">{title}</h1>
        <p className="text-sm text-[#666666] font-bold mt-2 leading-relaxed">{subtitle}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-2 border-black text-black font-bold text-sm text-center rounded-xl">
          {error}
        </div>
      )}

      {/* Google Login Button */}
      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 bg-[#fdfbf7] hover:bg-gray-50 text-black border-2 border-black font-black py-4 px-6 rounded-full shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 mb-6 uppercase tracking-wider text-xs"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.09 14.975 0 12 0 7.354 0 3.373 2.76 1.493 6.773l3.773 2.992z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.275c0-.825-.074-1.62-.21-2.385H12v4.51h6.46a5.522 5.522 0 0 1-2.4 3.623l3.722 2.883c2.177-2.003 3.708-4.95 3.708-8.63z"
          />
          <path
            fill="#FBBC05"
            d="M5.266 14.235L1.493 17.227A11.966 11.966 0 0 0 12 24c2.975 0 5.642-1.09 7.728-2.909l-3.722-2.883a7.124 7.124 0 0 1-4.006 1.137 7.077 7.077 0 0 1-6.734-4.855l-.01.01z"
          />
          <path
            fill="#34A853"
            d="M1.493 6.773A11.97 11.97 0 0 0 0 12c0 1.91.448 3.713 1.24 5.33l4.026-3.1a7.1 7.1 0 0 1-.007-4.46L1.493 6.773z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black/10"></div>
        </div>
        <span className="relative px-3 bg-white text-xs font-bold text-[#666666] uppercase tracking-widest z-10">Or use email</span>
      </div>

      <form 
        onSubmit={(e) => { e.preventDefault(); handleAction(mode) }}
        className="space-y-4"
      >
        <div>
          <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#fdfbf7] border-2 border-black rounded-2xl p-4 text-[15px] font-bold text-black focus:outline-none focus:ring-4 focus:ring-[#f72585]/10 focus:border-[#f72585] transition-all placeholder-black/35"
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#fdfbf7] border-2 border-black rounded-2xl p-4 text-[15px] font-bold text-black focus:outline-none focus:ring-4 focus:ring-[#f72585]/10 focus:border-[#f72585] transition-all placeholder-black/35"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white hover:bg-gray-900 font-bold py-4 px-6 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150 flex items-center justify-center uppercase tracking-wider text-xs"
        >
          {loading ? (
             <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
             mode === 'login' ? "Sign In" : "Create Account"
          )}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-xs font-black text-[#f72585] hover:text-[#ff1493] uppercase tracking-wider"
          >
            {mode === 'login' ? "Need an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </form>
    </div>
  )
}
