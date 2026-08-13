'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCollection(formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string || 'active'
  const image = formData.get('image') as File | null

  const supabase = await createClient()

  let image_url = null

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop()
    const fileName = `collection-${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images') // Reusing the same bucket for simplicity
      .upload(fileName, image)

    if (!uploadError && uploadData) {
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      image_url = publicUrl
    } else {
      console.error('Error uploading collection image:', uploadError)
    }
  }

  const { error } = await supabase.from('collections').insert({
    name,
    slug,
    description,
    status,
    image_url
  })

  if (error) {
    console.error('Error creating collection:', error)
    throw new Error('Failed to create collection: ' + error.message)
  }

  revalidatePath('/admin/collections')
}

export async function deleteCollection(formData: FormData) {
  const id = formData.get('id') as string

  const supabase = await createClient()

  const { error } = await supabase.from('collections').delete().eq('id', id)

  if (error) {
    console.error('Error deleting collection:', error)
    throw new Error('Failed to delete collection: ' + error.message)
  }

  revalidatePath('/admin/collections')
}
