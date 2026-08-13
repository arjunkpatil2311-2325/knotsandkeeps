'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDiscount(formData: FormData) {
  const code = formData.get('code') as string
  const type = formData.get('type') as string
  const value = parseFloat(formData.get('value') as string)
  const min_order_amount = formData.get('min_order_amount') ? parseFloat(formData.get('min_order_amount') as string) : 0
  const is_active = formData.get('is_active') === 'on'

  const supabase = await createClient()

  const { error } = await supabase.from('discounts').insert({
    code: code.toUpperCase(),
    type,
    value,
    min_order_amount,
    is_active
  })

  if (error) {
    console.error('Error creating discount:', error)
    throw new Error('Failed to create discount: ' + error.message)
  }

  revalidatePath('/admin/discounts')
}

export async function deleteDiscount(formData: FormData) {
  const id = formData.get('id') as string

  const supabase = await createClient()

  const { error } = await supabase.from('discounts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting discount:', error)
    throw new Error('Failed to delete discount: ' + error.message)
  }

  revalidatePath('/admin/discounts')
}
