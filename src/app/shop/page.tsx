import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ChevronDown, ShoppingBag } from 'lucide-react'

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
    <div className="w-full pb-32 bg-white">
       {/* 1. SHOP HERO - Compact Pink Header */}
       <div className="bg-brand-soft-pink/30 pt-16 pb-16 px-6 sm:px-12 relative overflow-hidden text-center border-b border-brand-rose/20">
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            {/* Breadcrumb */}
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
               <Link href="/" className="hover:text-black transition-colors">Home</Link>
               <span className="mx-2">/</span>
               <span className="text-black">{title}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-black tracking-tight mb-4">{title}</h1>
            
            {/* Supporting Text */}
            <p className="text-gray-500 font-medium text-sm sm:text-base max-w-lg mb-8">
               Discover handcrafted bracelets made to keep. Explore our collection of premium pieces.
            </p>

            {/* Category Filters */}
            <div className="w-full max-w-3xl overflow-x-auto custom-scrollbar pb-2">
              <div className="flex justify-center min-w-max gap-3 mx-auto px-4">
                <Link 
                  href="/shop" 
                  className={`px-5 py-2.5 rounded-full font-bold text-[13px] transition-all whitespace-nowrap border-2 ${!categorySlug ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'}`}
                >
                  ALL PRODUCTS
                </Link>
                {categories?.map(category => (
                  <Link 
                    key={category.id} 
                    href={`/shop?category=${category.slug}`}
                    className={`px-5 py-2.5 rounded-full font-bold text-[13px] transition-all whitespace-nowrap border-2 ${categorySlug === category.slug ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'}`}
                  >
                    {category.name.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          </div>
       </div>

       {/* Sub-header Controls (Sorting / Count) */}
       <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            {products?.length || 0} {products?.length === 1 ? 'Product' : 'Products'}
          </span>
          <button className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest hover:text-brand-accent transition-colors">
            Default sorting
            <ChevronDown className="w-4 h-4" />
          </button>
       </div>

       {/* 2. PRODUCT GRID */}
       <div className="px-4 md:px-8 pb-20 max-w-[1400px] mx-auto">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
               {products.map((product) => (
                 <Link href={`/product/${product.slug}`} key={product.id} className="group flex flex-col">
                    {/* Image Area */}
                    <div className="relative w-full aspect-[4/5] bg-gray-50 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden mb-4 sm:mb-5 border border-gray-100 flex items-center justify-center">
                       {product.product_images?.[0]?.url ? (
                         <img
                           src={product.product_images[0].url}
                           alt={product.name}
                           className="absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                         />
                       ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                           <span className="text-xl sm:text-2xl font-black opacity-20">THREEKNOTS</span>
                         </div>
                       )}

                       {/* Optional Preorder Badge if applicable */}
                       {product.status === 'preorder' && (
                         <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-brand-accent text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                           PRE-ORDER
                         </div>
                       )}
                    </div>

                    {/* Text Content */}
                    <div className="px-1">
                       <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 sm:mb-1.5 truncate">
                         {product.category?.name || 'Uncategorized'}
                       </p>
                       <h3 className="text-[13px] sm:text-[15px] font-black text-black leading-snug mb-1 sm:mb-1.5 line-clamp-2 group-hover:text-brand-accent transition-colors">
                         {product.name}
                       </h3>
                       <p className="text-[13px] sm:text-[15px] font-bold text-black">
                         ₹{product.price}
                       </p>
                    </div>
                 </Link>
               ))}
            </div>
          ) : (
            /* 5. EMPTY SHOP STATE */
            <div className="py-32 flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-brand-soft-pink/30 rounded-full flex items-center justify-center mb-6">
                 <ShoppingBag className="w-8 h-8 text-brand-accent opacity-50" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-3">New bracelets are coming soon.</h2>
              <p className="text-gray-500 font-medium max-w-md mx-auto mb-8 text-[15px]">
                Handcrafted pieces are on the way. Check back soon.
              </p>
              <Link href="/about" className="bg-black text-white px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-colors">
                EXPLORE OUR STORY
              </Link>
            </div>
          )}
       </div>
    </div>
  )
}
