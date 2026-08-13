'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  const supabase = await createClient()

  const { error } = await supabase.from('categories').insert({
    name,
    slug,
    description
  })

  if (error) {
    console.error('Error creating category:', error)
    throw new Error('Failed to create category: ' + error.message)
  }

  revalidatePath('/admin/categories')
}

export async function deleteCategory(formData: FormData) {
  const id = formData.get('id') as string

  const supabase = await createClient()

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    throw new Error('Failed to delete category: ' + error.message)
  }

  revalidatePath('/admin/categories')
}
