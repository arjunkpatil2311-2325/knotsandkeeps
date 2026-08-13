'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string || ''
  const slug = formData.get('slug') as string || ''
  const short_description = formData.get('short_description') as string || null
  const description = formData.get('description') as string || null
  
  const priceRaw = formData.get('price') as string
  const price = priceRaw ? parseFloat(priceRaw) : 0
  
  const compareAtRaw = formData.get('compare_at_price') as string
  const compare_at_price = compareAtRaw ? parseFloat(compareAtRaw) : null
  
  const stockRaw = formData.get('stock_quantity') as string
  const stock_quantity = stockRaw ? parseInt(stockRaw) : 0
  
  const sku = formData.get('sku') as string || null
  const status = formData.get('status') as string || 'draft'
  const category_id = formData.get('category_id') as string || null
  
  const is_featured = formData.get('is_featured') === 'on'
  const is_bestseller = formData.get('is_bestseller') === 'on'
  const is_new_arrival = formData.get('is_new_arrival') === 'on'
  const show_on_homepage = formData.get('show_on_homepage') === 'on'

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
      category_id,
      is_featured,
      is_bestseller,
      is_new_arrival,
      show_on_homepage,
      tags
    })
    .select()
    .single()

  if (productError) {
    console.error('Error creating product:', productError)
    redirect(`/admin/products/create?error=${encodeURIComponent(productError.message || 'Unknown error')}`)
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

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        // Clean up the product if image upload fails
        await supabase.from('products').delete().eq('id', product.id)
        redirect(`/admin/products/create?error=${encodeURIComponent('Image upload failed: ' + uploadError.message)}`)
      }

      if (uploadData) {
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
    redirect(`/admin/products?error=${encodeURIComponent(error.message || 'Failed to delete product')}`)
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
}

export async function updateProduct(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string || ''
  const slug = formData.get('slug') as string || ''
  const short_description = formData.get('short_description') as string || null
  const description = formData.get('description') as string || null
  
  const priceRaw = formData.get('price') as string
  const price = priceRaw ? parseFloat(priceRaw) : 0
  
  const compareAtRaw = formData.get('compare_at_price') as string
  const compare_at_price = compareAtRaw ? parseFloat(compareAtRaw) : null
  
  const stockRaw = formData.get('stock_quantity') as string
  const stock_quantity = stockRaw ? parseInt(stockRaw) : 0
  
  const sku = formData.get('sku') as string || null
  const status = formData.get('status') as string || 'draft'
  const category_id = formData.get('category_id') as string || null
  
  const is_featured = formData.get('is_featured') === 'on'
  const is_bestseller = formData.get('is_bestseller') === 'on'
  const is_new_arrival = formData.get('is_new_arrival') === 'on'
  const show_on_homepage = formData.get('show_on_homepage') === 'on'

  const updatePayload: any = {
    name,
    slug,
    short_description,
    description,
    price,
    compare_at_price,
    stock_quantity,
    sku,
    status,
    category_id,
    is_featured,
    is_bestseller,
    is_new_arrival,
    show_on_homepage
  }

  if (formData.has('tags')) {
    const tagsString = formData.get('tags') as string
    updatePayload.tags = tagsString ? tagsString.split(',').map(t => t.trim()) : []
  }

  const { error: updateError } = await supabase
    .from('products')
    .update(updatePayload)
    .eq('id', id)

  if (updateError) {
    console.error('Error updating product:', updateError)
    redirect(`/admin/products/edit/${id}?error=${encodeURIComponent(updateError.message || 'Failed to update product')}`)
  }

  // Handle new image uploads
  const images = formData.getAll('images') as File[]
  
  if (images && images.length > 0) {
    // Get existing max display_order
    const { data: existingImages } = await supabase.from('product_images').select('display_order').eq('product_id', id).order('display_order', { ascending: false }).limit(1)
    let nextOrder = existingImages && existingImages.length > 0 ? existingImages[0].display_order + 1 : 0

    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      if (image.size === 0) continue

      const fileExt = image.name.split('.').pop()
      const fileName = `${id}-${Date.now()}-${i}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, image)

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        await supabase.from('product_images').insert({
          product_id: id,
          url: publicUrl,
          is_primary: nextOrder === 0 && i === 0,
          display_order: nextOrder + i
        })
      }
    }
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
} 
