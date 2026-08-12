'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const short_description = formData.get('short_description') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const compare_at_price = formData.get('compare_at_price') ? parseFloat(formData.get('compare_at_price') as string) : null
  const stock_quantity = parseInt(formData.get('stock_quantity') as string)
  const sku = formData.get('sku') as string
  const status = formData.get('status') as string || 'draft'
  
  const is_featured = formData.get('is_featured') === 'on'
  const is_bestseller = formData.get('is_bestseller') === 'on'
  const is_new_arrival = formData.get('is_new_arrival') === 'on'

  // Tags can be comma separated
  const tagsString = formData.get('tags') as string
  const tags = tagsString ? tagsString.split(',').map(t => t.trim()) : []

  // 1. Insert product
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      name,
      slug,
      short_description,
      description,
      price,
      compare_at_price,
      stock_quantity,
      sku,
      status,
      is_featured,
      is_bestseller,
      is_new_arrival,
      tags
    })
    .select()
    .single()

  if (productError) {
    console.error('Error creating product:', productError)
    throw new Error('Failed to create product: ' + productError.message)
  }

  // 2. Handle image uploads
  const images = formData.getAll('images') as File[]
  
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      if (image.size === 0) continue

      const fileExt = image.name.split('.').pop()
      const fileName = `${product.id}-${Date.now()}-${i}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, image)

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        // Insert into product_images
        await supabase.from('product_images').insert({
          product_id: product.id,
          url: publicUrl,
          is_primary: i === 0, // First image is primary
          display_order: i
        })
      }
    }
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()

  const { error } = await supabase.from('products').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting product:', error)
    throw new Error('Failed to delete product')
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
}
