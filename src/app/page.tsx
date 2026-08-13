import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ArrowRight } from 'lucide-react'
import { HeroBracelet } from '@/components/HeroBracelet'

export default async function Home() {
  const supabase = await createClient()

  // Fetch a hero product (first published product)
  const { data: heroProduct } = await supabase
    .from('products')
    .select('*, product_images(url)')
    .eq('status', 'published')
    .limit(1)
    .single()

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, product_images(url)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .limit(4)

  // Fetch new arrivals (latest created)
  const { data: newArrivals } = await supabase
    .from('products')
    .select('*, product_images(url)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full pt-12 pb-24 overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-brand-blush/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Text */}
          <div className="lg:w-1/2 text-center lg:text-left z-10 space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black leading-[1.1]">
              Made to Keep.
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0 font-medium">
              Handcrafted bracelets made to match your story, your style, and your moments.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <Link href="/shop" className="inline-flex justify-center items-center px-8 py-4 bg-black text-white text-[15px] font-bold rounded-full hover:bg-brand-accent transition-colors shadow-lg shadow-brand-accent/20">
                Shop Now
              </Link>
              <Link href="/collections" className="inline-flex justify-center items-center px-8 py-4 bg-white border border-gray-200 text-black text-[15px] font-bold rounded-full hover:border-brand-accent hover:text-brand-accent transition-colors shadow-sm">
                Explore Collections
              </Link>
            </div>
          </div>

          {/* Right Floating Bracelet */}
          <div className="lg:w-1/2 w-full mt-8 lg:mt-0 relative z-10">
            <HeroBracelet product={heroProduct} />
          </div>
        </div>
      </section>

      {/* Featured Pieces */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-black tracking-tight">Featured Pieces</h2>
              <p className="text-gray-500 mt-2 font-medium">Handpicked favorites for your collection.</p>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center text-sm font-bold text-black hover:text-brand-accent transition-colors">
              View All <ArrowRight className="ml-2 h-4 w-4" strokeWidth={3} />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-black tracking-tight">New Arrivals</h2>
              <p className="text-gray-500 mt-2 font-medium">Fresh pieces added to the shop.</p>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center text-sm font-bold text-black hover:text-brand-accent transition-colors">
              View All <ArrowRight className="ml-2 h-4 w-4" strokeWidth={3} />
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </section>
      )}
    </>
  )
}

function ProductGrid({ products }: { products: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <Link href={`/product/${product.slug}`} key={product.id} className="group block bg-white rounded-3xl p-4 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(244,164,164,0.3)] transition-all duration-300 border border-gray-100 hover:border-brand-soft-pink hover:-translate-y-2">
          {/* Image Container */}
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
            
            {/* Badges */}
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
          
          {/* Content */}
          <div className="px-2">
            <h3 className="text-lg font-bold text-black group-hover:text-brand-accent transition-colors">
              {product.name}
            </h3>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-lg font-black text-black">₹{product.price}</p>
                {product.compare_at_price && (
                  <p className="text-sm font-bold text-brand-dusty line-through">₹{product.compare_at_price}</p>
                )}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white text-black transition-colors">
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
