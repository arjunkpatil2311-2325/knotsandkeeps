import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { updateProduct } from '../../actions'

export default async function EditProductPage({ 
  params,
  searchParams
}: { 
  params: { id: string }
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()

  // Ensure user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      product_images (id, url, is_primary, display_order)
    `)
    .eq('id', params.id)
    .single()

  if (!product) {
    redirect('/admin/products')
  }

  // Fetch real categories from Supabase
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-black tracking-tight">Edit Product</h1>
        <p className="mt-1 text-sm text-black font-bold">Update product details and inventory.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border-2 border-black text-black px-4 py-3 rounded-lg relative font-bold" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form action={updateProduct} className="space-y-8 divide-y-2 divide-black bg-white border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl p-6 sm:p-8">
        <input type="hidden" name="id" value={product.id} />
        
        <div className="space-y-8 divide-y-2 divide-black sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-xl leading-6 font-black text-black uppercase tracking-wider">Basic Information</h3>
            </div>
            
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
                <label htmlFor="name" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Product Name <span className="text-red-600">*</span></label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="text" name="name" id="name" defaultValue={product.name} required className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black placeholder-black/50 sm:max-w-xs" />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
                <label htmlFor="slug" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Slug (URL) <span className="text-red-600">*</span></label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="text" name="slug" id="slug" defaultValue={product.slug} required className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black placeholder-black/50 sm:max-w-xs" />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
                <label htmlFor="description" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Description</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea id="description" name="description" rows={5} defaultValue={product.description || ''} className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black placeholder-black/50" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-xl leading-6 font-black text-black uppercase tracking-wider">Pricing & Inventory</h3>
            </div>
            
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
                <label htmlFor="price" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Price (₹) <span className="text-red-600">*</span></label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="number" step="0.01" name="price" id="price" defaultValue={product.price} required className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black placeholder-black/50 sm:max-w-xs" />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
                <label htmlFor="compare_at_price" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Original Price (₹)</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="number" step="0.01" name="compare_at_price" id="compare_at_price" defaultValue={product.compare_at_price || ''} className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black placeholder-black/50 sm:max-w-xs" />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
                <label htmlFor="stock_quantity" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Stock Quantity <span className="text-red-600">*</span></label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="number" name="stock_quantity" id="stock_quantity" defaultValue={product.stock_quantity} required className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black placeholder-black/50 sm:max-w-xs" />
                </div>
              </div>
              
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
                <label htmlFor="sku" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">SKU</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="text" name="sku" id="sku" defaultValue={product.sku || ''} className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black placeholder-black/50 sm:max-w-xs" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-xl leading-6 font-black text-black uppercase tracking-wider">Images</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4 overflow-x-auto pb-4">
                {product.product_images?.map((img: any) => (
                  <div key={img.id} className="relative h-24 w-24 flex-shrink-0 border-2 border-black rounded-lg overflow-hidden">
                    <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
                <label htmlFor="images" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Upload New Images</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="file" name="images" id="images" multiple accept="image/*" className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-black file:text-sm file:font-bold file:bg-neo-blue file:text-black hover:file:bg-blue-400 file:shadow-[2px_2px_0_0_#000] file:active:translate-x-[2px] file:active:translate-y-[2px] file:active:shadow-none file:transition-all cursor-pointer sm:max-w-xs" />
                  <p className="mt-2 text-sm text-black font-bold">New images will be appended to existing ones.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-xl leading-6 font-black text-black uppercase tracking-wider">Organization & Visibility</h3>
            </div>
            <div className="space-y-6 sm:space-y-5">
              
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
                <label htmlFor="status" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Status</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <select id="status" name="status" defaultValue={product.status} className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black sm:max-w-xs">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
                <label htmlFor="category_id" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Category</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <select id="category_id" name="category_id" defaultValue={product.category_id || ''} className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black sm:max-w-xs">
                    <option value="">No Category</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
                <label className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Badges</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="show_on_homepage" name="show_on_homepage" type="checkbox" defaultChecked={product.show_on_homepage} className="focus:ring-0 h-5 w-5 text-black bg-white border-2 border-black rounded-sm" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="show_on_homepage" className="font-bold text-black">Show on Homepage</label>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="is_featured" name="is_featured" type="checkbox" defaultChecked={product.is_featured} className="focus:ring-0 h-5 w-5 text-black bg-white border-2 border-black rounded-sm" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="is_featured" className="font-bold text-black">Featured Product</label>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="is_bestseller" name="is_bestseller" type="checkbox" defaultChecked={product.is_bestseller} className="focus:ring-0 h-5 w-5 text-black bg-white border-2 border-black rounded-sm" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="is_bestseller" className="font-bold text-black">Bestseller</label>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="is_new_arrival" name="is_new_arrival" type="checkbox" defaultChecked={product.is_new_arrival} className="focus:ring-0 h-5 w-5 text-black bg-white border-2 border-black rounded-sm" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="is_new_arrival" className="font-bold text-black">New Arrival</label>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="pt-5 border-t-2 border-black mt-8">
          <div className="flex justify-end gap-3">
            <Link href="/admin/products" className="bg-white border-2 border-black text-black px-4 py-2.5 rounded-lg text-sm font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-neo-bg transition-all text-center">
              Cancel
            </Link>
            <button type="submit" className="bg-neo-yellow border-2 border-black text-black px-6 py-2.5 rounded-lg text-sm font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-yellow-400 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
