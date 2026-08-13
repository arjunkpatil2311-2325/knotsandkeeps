'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  if (!name || !slug) {
    redirect(`/admin/categories?error=${encodeURIComponent('Name and slug are required.')}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.from('categories').insert({
    name,
    slug,
    description
  })

  if (error) {
    console.error('Error creating category:', error)
    redirect(`/admin/categories?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/categories')
  redirect(`/admin/categories?success=${encodeURIComponent('Category created successfully.')}`)
}

export async function updateCategory(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  if (!id || !name || !slug) {
    redirect(`/admin/categories/edit/${id}?error=${encodeURIComponent('Name and slug are required.')}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.from('categories').update({
    name,
    slug,
    description
  }).eq('id', id)

  if (error) {
    console.error('Error updating category:', error)
    redirect(`/admin/categories/edit/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/categories')
  revalidatePath('/shop')
  redirect(`/admin/categories?success=${encodeURIComponent('Category updated successfully.')}`)
}

export async function deleteCategory(formData: FormData) {
  const id = formData.get('id') as string

  const supabase = await createClient()

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    redirect(`/admin/categories?error=${encodeURIComponent('Failed to delete category: ' + error.message)}`)
  }

  revalidatePath('/admin/categories')
  revalidatePath('/shop')
  redirect(`/admin/categories?success=${encodeURIComponent('Category deleted successfully.')}`)
}
