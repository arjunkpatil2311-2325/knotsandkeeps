'use client'

import { useState } from 'react'
import { login, signup } from '@/app/login/actions'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAction = async (action: 'login' | 'signup') => {
    setLoading(true)
    setError(null)
    
    try {
      const result = action === 'login' 
        ? await login({ email, password }) 
        : await signup({ email, password })
        
      if (result?.error) {
        setError(result.error)
      } else {
        // Success redirect happens inside the server action, but fallback just in case:
        router.push('/admin')
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form 
      className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
      onSubmit={(e) => { e.preventDefault(); handleAction('login') }}
    >
      <label className="text-md font-medium" htmlFor="email">
        Email
      </label>
      <input
        className="rounded-md px-4 py-2 bg-inherit border mb-4 focus:ring-black focus:border-black"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <label className="text-md font-medium" htmlFor="password">
        Password
      </label>
      <input
        className="rounded-md px-4 py-2 bg-inherit border mb-6 focus:ring-black focus:border-black"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />
      
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white rounded-md px-4 py-3 text-foreground mb-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400 font-medium flex justify-center items-center"
      >
        {loading ? (
           <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
           "Sign In"
        )}
      </button>
      
      <button
        type="button"
        disabled={loading}
        onClick={() => handleAction('signup')}
        className="border border-black text-black rounded-md px-4 py-3 text-foreground mb-2 hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
      >
        Sign Up
      </button>
      
      {error && (
        <p className="mt-4 p-4 bg-red-100 text-red-700 text-sm text-center rounded-md border border-red-200">
          {error}
        </p>
      )}
    </form>
  )
}
