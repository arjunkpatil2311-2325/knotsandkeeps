import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ArrowRight, Layers } from 'lucide-react'

export const metadata = {
  title: 'Collections | ThreeKnots',
  description: 'Explore our handcrafted bracelet collections.',
}

export default async function CollectionsPage() {
  const supabase = await createClient()

  // Fetch collections
  const { data: collections } = await supabase
    .from('collections')
    .select('*, products:collection_products(product:products(*, product_images(url)))')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tight">Curated Collections</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          Discover our themed collections of handcrafted bracelets, designed for every moment and style.
        </p>
      </div>

      <div className="space-y-24">
        {collections && collections.length > 0 ? (
          collections.map((collection) => {
            // Flatten the nested products structure
            const products = collection.products
              ?.map((cp: any) => cp.product)
              .filter((p: any) => p && p.status === 'published') || []

            if (products.length === 0) return null;

            return (
              <section key={collection.id} className="relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-black tracking-tight flex items-center gap-3">
                      <Layers className="w-8 h-8 text-brand-accent" />
                      {collection.name}
                    </h2>
                    {collection.description && (
                      <p className="text-gray-600 mt-2 font-medium max-w-2xl">{collection.description}</p>
                    )}
                  </div>
                  <Link 
                    href={`/shop?collection=${collection.id}`} 
                    className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-black text-sm font-bold rounded-full hover:border-brand-accent hover:text-brand-accent transition-colors shadow-sm whitespace-nowrap"
                  >
                    View All in {collection.name} <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 4).map((product: any) => (
                    <Link href={`/product/${product.slug}`} key={product.id} className="group block bg-white rounded-3xl p-4 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(244,164,164,0.3)] transition-all duration-300 border border-gray-100 hover:border-brand-soft-pink hover:-translate-y-2">
                      <div className="aspect-square w-full rounded-2xl overflow-hidden bg-brand-bg relative mb-6">
                        {product.product_images?.[0]?.url ? (
                          <img
                            src={product.product_images[0].url}
                            alt={product.name}
                            className="h-full w-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-brand-dusty font-bold">No Image</div>
                        )}
                        
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.discount_percentage > 0 && (
                            <div className="bg-brand-accent text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                              {product.discount_percentage}% OFF
                            </div>
                          )}
                        </div>
                        
                        {product.stock_quantity === 0 && (
                           <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                             <span className="bg-black text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest">Sold Out</span>
                           </div>
                        )}
                      </div>
                      
                      <div className="px-2">
                        <h3 className="text-lg font-bold text-black group-hover:text-brand-accent transition-colors truncate">
                          {product.name}
                        </h3>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-black text-black">₹{product.price}</p>
                            {product.compare_at_price && (
                              <p className="text-sm font-bold text-brand-dusty line-through">₹{product.compare_at_price}</p>
                            )}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white text-black transition-colors shrink-0">
                            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Layers className="w-12 h-12 text-brand-dusty mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black">No collections found</h2>
            <p className="text-gray-500 mt-2 font-medium">Check back later for curated selections.</p>
            <div className="mt-8">
              <Link href="/shop" className="inline-flex justify-center items-center px-8 py-4 bg-black text-white text-[15px] font-bold rounded-full hover:bg-brand-accent transition-colors shadow-lg">
                Shop All Bracelets
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
