'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(data: { email: string; password: string }, next?: string) {
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error("Login Error:", error.message)
    return { error: error.message }
  }

  // Fetch profile role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  revalidatePath('/', 'layout')

  if (profile?.role === 'admin') {
    redirect('/admin')
  } else {
    redirect(next || '/account')
  }
}

export async function signup(data: { email: string; password: string }, next?: string) {
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error("Signup Error:", error.message)
    return { error: error.message }
  }

  // Since signUp might take a brief moment or require email confirmation, 
  // let's try to query role or default to customer
  let role = 'customer'
  if (authData.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()
    if (profile?.role) {
      role = profile.role
    }
  }

  revalidatePath('/', 'layout')

  if (role === 'admin') {
    redirect('/admin')
  } else {
    redirect(next || '/account')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
