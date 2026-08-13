import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Filter, ChevronDown, ArrowRight } from 'lucide-react'

export default async function ShopPage() {
  const supabase = await createClient()

  // In a real app we'd parse searchParams for filters/sorting
  const { data: products } = await supabase
    .from('products')
    .select('*, product_images(url)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div className="w-full">
      {/* Header Area */}
      <div className="bg-brand-soft-pink/30 rounded-[2rem] p-8 sm:p-12 mb-12 border border-white text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black mb-4">Shop</h1>
        <p className="text-gray-600 font-medium">Find the bracelet that feels like you.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-brand-rose/20 sticky top-24 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6">Categories</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="flex items-center justify-between text-sm font-bold text-brand-accent">
                  <span>All Bracelets</span>
                  <span className="bg-brand-blush text-brand-accent px-2 py-0.5 rounded-full text-[10px]">
                    {products?.length || 0}
                  </span>
                </Link>
              </li>
              <li><Link href="#" className="text-sm font-medium text-gray-500 hover:text-brand-accent transition-colors">Anime Inspired</Link></li>
              <li><Link href="#" className="text-sm font-medium text-gray-500 hover:text-brand-accent transition-colors">Custom Names</Link></li>
              <li><Link href="#" className="text-sm font-medium text-gray-500 hover:text-brand-accent transition-colors">Minimalist</Link></li>
            </ul>
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          {/* Mobile Filter & Sort Bar */}
          <div className="flex items-center justify-between mb-8 bg-white rounded-2xl p-4 border border-brand-rose/20 shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              Showing <span className="text-black">1-{products?.length || 0}</span> results
            </p>
            
            <div className="flex items-center gap-4">
              <button type="button" className="lg:hidden flex items-center gap-2 text-sm font-bold text-black hover:text-brand-accent transition-colors">
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <div className="h-4 w-px bg-gray-200 lg:hidden" />
              <button type="button" className="flex items-center gap-2 text-sm font-bold text-black hover:text-brand-accent transition-colors">
                Default sorting
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products?.map((product) => (
              <Link href={`/product/${product.slug}`} key={product.id} className="group block bg-white rounded-3xl p-4 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(244,164,164,0.3)] transition-all duration-300 border border-brand-rose/10 hover:border-brand-soft-pink hover:-translate-y-2">
                {/* Image Container */}
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-brand-bg relative mb-6 flex items-center justify-center">
                  {/* Decorative background shapes mimicking the reference design */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-brand-blush to-brand-cream opacity-50 z-0"></div>
                  
                  {product.product_images?.[0]?.url ? (
                    <img
                      src={product.product_images[0].url}
                      alt={product.name}
                      className="relative z-10 h-[80%] w-[80%] object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="relative z-10 text-brand-dusty font-bold">No Image</div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
                    {product.discount_percentage > 0 && (
                      <div className="bg-brand-accent text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                        {product.discount_percentage}% OFF
                      </div>
                    )}
                  </div>
                  
                  {product.stock_quantity === 0 && (
                     <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-30">
                       <span className="bg-black text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest">Sold Out</span>
                     </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="px-2 text-center pb-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{product.category?.name || 'Bracelet'}</p>
                  <h3 className="text-lg font-bold text-black group-hover:text-brand-accent transition-colors mb-3">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-lg font-black text-black">₹{product.price}</p>
                    {product.compare_at_price && (
                      <p className="text-sm font-bold text-brand-dusty line-through">₹{product.compare_at_price}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            
            {(!products || products.length === 0) && (
              <div className="col-span-full py-16 text-center">
                <div className="inline-block bg-white border border-brand-rose/20 rounded-3xl px-8 py-12 shadow-sm">
                  <p className="text-lg font-bold text-gray-900 mb-2">No products found</p>
                  <p className="text-gray-500">Check back later for new arrivals.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
