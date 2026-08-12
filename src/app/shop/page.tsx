import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Filter } from 'lucide-react'

export default async function ShopPage() {
  const supabase = await createClient()

  // In a real app we'd parse searchParams for filters/sorting
  const { data: products } = await supabase
    .from('products')
    .select('*, product_images(url)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Shop All</h1>

        <div className="flex items-center">
          <div className="relative inline-block text-left">
            <div>
              <button type="button" className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                Sort
              </button>
            </div>
          </div>
          <button type="button" className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
            <span className="sr-only">Filters</span>
            <Filter className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <section aria-labelledby="products-heading" className="pt-6 pb-24">
        <h2 id="products-heading" className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters - desktop */}
          <form className="hidden lg:block">
            <h3 className="sr-only">Categories</h3>
            <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              <li><a href="#" className="hover:text-gray-600">All Bracelets</a></li>
              <li><a href="#" className="hover:text-gray-600">Anime Inspired</a></li>
              <li><a href="#" className="hover:text-gray-600">Custom Names</a></li>
              <li><a href="#" className="hover:text-gray-600">Minimalist</a></li>
            </ul>
          </form>

          {/* Product grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
              {products?.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100 relative">
                    {product.product_images?.[0]?.url ? (
                      <img
                        src={product.product_images[0].url}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-200">No Image</div>
                    )}
                    
                    {product.discount_percentage > 0 && (
                       <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
                         {product.discount_percentage}% OFF
                       </div>
                    )}
                    {product.stock_quantity === 0 && (
                       <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                         <span className="bg-black text-white text-sm font-bold px-4 py-2 uppercase tracking-widest">Sold Out</span>
                       </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        <Link href={`/product/${product.slug}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.category?.name || 'Bracelet'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                      {product.compare_at_price && (
                        <p className="text-xs text-gray-500 line-through">₹{product.compare_at_price}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {(!products || products.length === 0) && (
                <div className="col-span-full py-12 text-center text-gray-500">
                  No products available right now.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
