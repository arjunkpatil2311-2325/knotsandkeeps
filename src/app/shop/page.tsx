import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ChevronDown, Maximize2, ShoppingBag } from 'lucide-react'

export default async function ShopPage() {
  const supabase = await createClient()

  // In a real app we'd parse searchParams for filters/sorting
  const { data: products } = await supabase
    .from('products')
    .select('*, product_images(url), category:category_id(name)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div className="w-full pb-32">
       {/* The Big Pink Header matching the yellow one in the reference */}
       <div className="bg-gradient-to-b from-[#FFA7C1] to-[#FFDDE6] rounded-[3rem] pt-20 pb-48 px-8 sm:px-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center">
          
          {/* The circular concentric decorative shapes in the center top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-white/20 blur-3xl pointer-events-none"></div>
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-96 h-96 rounded-full border border-white/40 pointer-events-none"></div>
          <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-white/20 pointer-events-none"></div>

          {/* Breadcrumb Left */}
          <div className="relative z-10 text-sm font-bold text-[#A53F58] mb-8 md:mb-0 w-full md:w-1/3 text-left">
             Home / <span className="text-[#6C2537]">Product</span>
          </div>

          {/* Center Title */}
          <div className="relative z-10 w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
             <h1 className="text-5xl md:text-6xl font-black text-black tracking-tight">Shop</h1>
          </div>

          {/* Right Controls */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 text-xs font-bold text-[#A53F58] w-full md:w-1/3 md:justify-end">
             <span>Showing 1-{products?.length || 0} of {products?.length || 0} results</span>
             <button className="bg-white/60 hover:bg-white backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-black transition-colors shadow-sm">
               Default sorting
               <ChevronDown className="w-4 h-4" />
             </button>
          </div>
       </div>

       {/* Product Grid - overlaps the header */}
       <div className="-mt-32 relative z-20 px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-[1400px] mx-auto">
             {products?.map((product, i) => {
                // Alternate pill colors for a playful look similar to the reference
                const pillColors = ['bg-[#FF7A9A]', 'bg-[#988DF2]', 'bg-[#4EC58C]', 'bg-[#FFA552]'];
                const pillColor = pillColors[i % pillColors.length];

                return (
                  <Link href={`/product/${product.slug}`} key={product.id} className="group bg-white rounded-[2.5rem] p-6 pb-8 shadow-md hover:shadow-2xl transition-all duration-300 relative border border-transparent">
                     
                     {/* Top Icons */}
                     <div className="w-full flex justify-between items-center mb-4 relative z-30 px-2 text-gray-800">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                           <Maximize2 className="w-[14px] h-[14px] stroke-[2.5]" />
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                           <ShoppingBag className="w-[14px] h-[14px] stroke-[2.5]" />
                        </div>
                     </div>

                     {/* Image Container */}
                     <div className="w-full h-52 relative flex items-center justify-center mb-8">
                        {/* The Colorful Pill */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-24 rounded-[2rem] ${pillColor}`}></div>
                        {/* The Sun Circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white opacity-40"></div>
                        
                        {/* Bracelet Image */}
                        {product.product_images?.[0]?.url ? (
                          <img
                            src={product.product_images[0].url}
                            alt={product.name}
                            className="relative z-20 h-44 object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)] group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6"
                          />
                        ) : (
                          <div className="relative z-20 text-[#8C3A4A] font-bold">No Image</div>
                        )}
                     </div>

                     {/* Content below image */}
                     <div className="text-center w-full z-20 px-4">
                        <p className="text-[#645A8A] font-bold mb-1 truncate text-[15px]">{product.category?.name || 'Premium Bracelet'}</p>
                        <p className="text-gray-400 font-bold text-[15px]">₹{product.price}</p>
                     </div>
                  </Link>
                );
             })}
          </div>

          {(!products || products.length === 0) && (
            <div className="py-20 text-center">
              <p className="text-xl font-bold text-gray-900">No products found</p>
            </div>
          )}
       </div>
    </div>
  )
}
