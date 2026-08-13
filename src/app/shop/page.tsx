import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ChevronDown, Maximize2, ShoppingBag, LayoutGrid } from 'lucide-react'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const supabase = await createClient()
  const { category: categorySlug } = await searchParams

  // Fetch all categories for the filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Build the products query
  let productsQuery = supabase
    .from('products')
    .select('*, product_images(url), category:category_id(name, slug)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (categorySlug) {
    // Find the category ID from the slug
    const selectedCategory = categories?.find(c => c.slug === categorySlug)
    if (selectedCategory) {
      productsQuery = productsQuery.eq('category_id', selectedCategory.id)
    }
  }

  const { data: products } = await productsQuery
  
  const currentCategory = categories?.find(c => c.slug === categorySlug)
  const title = currentCategory ? currentCategory.name : 'Shop'

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
             Home / <span className="text-[#6C2537]">{title}</span>
          </div>

          {/* Center Title */}
          <div className="relative z-10 w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
             <h1 className="text-5xl md:text-6xl font-black text-black tracking-tight text-center">{title}</h1>
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

       {/* Category Filters */}
       <div className="relative z-30 px-4 md:px-8 -mt-40 mb-12 flex justify-center">
         <div className="bg-white p-2 rounded-full shadow-lg border-2 border-black flex items-center gap-2 overflow-x-auto max-w-full custom-scrollbar">
           <Link 
             href="/shop" 
             className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${!categorySlug ? 'bg-neo-yellow text-black shadow-[2px_2px_0_0_#000] border-2 border-black' : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
           >
             <LayoutGrid className="w-4 h-4" />
             All Products
           </Link>
           {categories?.map(category => (
             <Link 
               key={category.id} 
               href={`/shop?category=${category.slug}`}
               className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${categorySlug === category.slug ? 'bg-neo-blue text-black shadow-[2px_2px_0_0_#000] border-2 border-black' : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
             >
               {category.name}
             </Link>
           ))}
         </div>
       </div>

       {/* Product Grid - overlaps the header */}
       <div className="relative z-20 px-4 md:px-8">
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
                        <p className="text-[#645A8A] font-bold mb-1 truncate text-[15px]">{product.category?.name || 'Uncategorized'}</p>
                        <p className="text-gray-400 font-bold text-[15px]">₹{product.price}</p>
                     </div>
                  </Link>
                );
             })}
          </div>

          {(!products || products.length === 0) && (
            <div className="py-20 text-center">
              <p className="text-xl font-bold text-gray-900">No products found in this category.</p>
              <Link href="/shop" className="inline-block mt-6 px-6 py-3 bg-black text-white font-bold rounded-full">
                View All Products
              </Link>
            </div>
          )}
       </div>
    </div>
  )
}
