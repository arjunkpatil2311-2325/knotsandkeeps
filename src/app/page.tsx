import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react'
import { QuickAddButton } from '@/components/QuickAddButton'
import { WishlistButton } from '@/components/WishlistButton'

export default async function Home() {
  const supabase = await createClient()

  // 1. Fetch hero product (prioritize is_featured, fallback to show_on_homepage)
  let { data: heroProduct } = await supabase
    .from('products')
    .select('*, product_images(url)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .limit(1)
    .maybeSingle()

  if (!heroProduct) {
    const { data: fallbackHero } = await supabase
      .from('products')
      .select('*, product_images(url)')
      .eq('status', 'published')
      .eq('show_on_homepage', true)
      .limit(1)
      .maybeSingle()
    heroProduct = fallbackHero
  }

  // 2. Fetch floating products for hero collage (prioritize is_featured, fallback to show_on_homepage)
  let { data: floatingProducts } = await supabase
    .from('products')
    .select('*, product_images(url)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .limit(3)

  if (!floatingProducts || floatingProducts.length < 2) {
    const { data: fallbackFloating } = await supabase
      .from('products')
      .select('*, product_images(url)')
      .eq('status', 'published')
      .eq('show_on_homepage', true)
      .limit(3)
    floatingProducts = fallbackFloating
  }

  // 3. Fetch new arrivals
  const { data: newArrivals } = await supabase
    .from('products')
    .select('*, product_images(url)')
    .eq('status', 'published')
    .eq('is_new_arrival', true)
    .order('created_at', { ascending: false })
    .limit(4)

  // 4. Fetch best sellers
  const { data: bestSellers } = await supabase
    .from('products')
    .select('*, product_images(url)')
    .eq('status', 'published')
    .eq('is_bestseller', true)
    .limit(3)

  // 5. Fetch all homepage products for the main section
  const { data: homepageProducts } = await supabase
    .from('products')
    .select('*, product_images(url)')
    .eq('status', 'published')
    .eq('show_on_homepage', true)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-[#f7f7f7] min-h-screen text-[#171717]">
      {/* 3. HERO SECTION */}
      <section className="relative w-full pt-16 md:pt-24 pb-16 px-4 md:px-16 overflow-hidden bg-gradient-to-b from-[#ffeef1] to-[#f7f7f7]">
        {/* Subtle accent shape behind it */}
        <div className="absolute right-0 top-1/4 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-[#f4c2c2]/40 rounded-full mix-blend-multiply filter blur-3xl opacity-65 pointer-events-none"></div>

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 slide-up">
            <span className="text-[#f72585] text-xs font-bold tracking-[0.25em] uppercase">
              THREEKNOTS
            </span>
            <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tight leading-[1.05] text-[#111111]">
              BRACELETS<br/>MADE TO KEEP
            </h1>
            <p className="text-base md:text-lg text-[#666666] max-w-md">
              Handcrafted bracelets inspired by the stories, characters and things you love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/shop" className="bg-[#f72585] hover:bg-[#ff1493] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group text-sm tracking-wider">
                SHOP BRACELETS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/collections" className="bg-white hover:bg-gray-50 border border-[#E8E8E8] text-[#171717] font-bold py-4 px-8 rounded-full shadow-sm transition-all text-sm tracking-wider text-center">
                EXPLORE COLLECTIONS
              </Link>
            </div>
            <p className="text-[11px] font-bold tracking-widest text-[#666666] uppercase pt-2">
              &mdash; LOVED BY BRACELET COLLECTORS &mdash;
            </p>
          </div>

          {/* Right Column: Hero Product Collage */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[480px] w-full">
            {/* Soft shadow / glow canvas */}
            <div className="absolute w-[280px] md:w-[420px] aspect-square bg-[#ffeef1] rounded-full filter blur-[80px] opacity-40"></div>
            
            {/* Main Center Image */}
            <div className="relative w-[280px] md:w-[380px] aspect-[4/5] bg-white rounded-[2rem] shadow-xl border border-white flex items-center justify-center p-8 transition-transform hover:scale-[1.01] duration-500 z-10 select-none">
              {heroProduct && heroProduct.product_images?.[0]?.url ? (
                <img 
                  src={heroProduct.product_images[0].url} 
                  alt={heroProduct.name} 
                  className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_20px_25px_rgba(0,0,0,0.12)]"
                />
              ) : (
                <div className="text-5xl text-[#ffeef1] font-black tracking-widest">TK</div>
              )}
            </div>

            {/* Floating Product Cards (Desktop only) */}
            {floatingProducts && floatingProducts.length > 0 && (
              <div className="absolute inset-0 pointer-events-none hidden md:block">
                {/* Floating Card 1: Top Left */}
                {floatingProducts[0] && (
                  <Link href={`/product/${floatingProducts[0].slug}`} className="absolute top-[8%] left-[2%] bg-white p-3 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3 z-20 hover:scale-105 pointer-events-auto transition-transform duration-300">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                      <img src={floatingProducts[0].product_images?.[0]?.url} alt="" className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight max-w-[90px] truncate text-[#171717]">{floatingProducts[0].name}</h4>
                      <p className="text-[10px] font-black text-[#f72585] mt-0.5">₹{floatingProducts[0].price}</p>
                    </div>
                  </Link>
                )}

                {/* Floating Card 2: Bottom Right */}
                {floatingProducts[1] && (
                  <Link href={`/product/${floatingProducts[1].slug}`} className="absolute bottom-[8%] right-[2%] bg-white p-3 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3 z-20 hover:scale-105 pointer-events-auto transition-transform duration-300">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                      <img src={floatingProducts[1].product_images?.[0]?.url} alt="" className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight max-w-[90px] truncate text-[#171717]">{floatingProducts[1].name}</h4>
                      <p className="text-[10px] font-black text-[#f72585] mt-0.5">₹{floatingProducts[1].price}</p>
                    </div>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. TRUST / FEATURES STRIP */}
      <section className="bg-white border-y border-[#E8E8E8] py-8 px-4 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <Truck className="w-6 h-6 text-[#f72585] flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Handcrafted</h4>
              <p className="text-[11px] text-[#666666] mt-0.5">Made with care, one piece at a time.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <ShieldCheck className="w-6 h-6 text-[#f72585] flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Premium Quality</h4>
              <p className="text-[11px] text-[#666666] mt-0.5">Made to be worn and kept.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <RotateCcw className="w-6 h-6 text-[#f72585] flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Secure Checkout</h4>
              <p className="text-[11px] text-[#666666] mt-0.5">Safe and secure payments.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <Star className="w-6 h-6 text-[#f72585] flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Easy Support</h4>
              <p className="text-[11px] text-[#666666] mt-0.5">We're here when you need us.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUR BRACELETS */}
      <section className="py-20 px-4 md:px-16 bg-[#f7f7f7]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-[#111111]">OUR BRACELETS</h2>
              <p className="text-xs md:text-sm text-[#666666] mt-1">Discover handcrafted designs added to the homepage.</p>
            </div>
            <Link href="/shop" className="text-xs font-bold text-[#f72585] hover:underline flex items-center gap-1 uppercase tracking-wider">
              View All Bracelets <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {homepageProducts && homepageProducts.length > 0 ? (
              homepageProducts.map((product, index) => {
                const hasImage = product.product_images?.[0]?.url
                return (
                  <div 
                    key={product.id} 
                    className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#E8E8E8] hover:-translate-y-1 relative flex flex-col slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-[#f7f7f7] rounded-2xl overflow-hidden mb-4">
                      {hasImage ? (
                        <img 
                          src={product.product_images[0].url} 
                          alt={product.name} 
                          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xs">NO IMAGE</div>
                      )}
                      
                      <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <WishlistButton productId={product.id} />
                      </div>

                      {product.discount_percentage > 0 && (
                        <span className="absolute top-3 left-3 bg-[#f72585] text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-20">
                          -{product.discount_percentage}%
                        </span>
                      )}

                      {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                          <span className="bg-[#111111] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">SOLD OUT</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/product/${product.slug}`} className="block">
                          <h3 className="text-sm font-bold text-[#171717] truncate hover:text-[#f72585] transition-colors leading-snug">{product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-1 mt-1 text-amber-400">
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] text-[#666666] font-semibold ml-1">(5.0)</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#111111]">₹{product.price}</span>
                          {product.compare_at_price && (
                            <span className="text-xs text-[#666666] line-through">₹{product.compare_at_price}</span>
                          )}
                        </div>
                        <QuickAddButton product={product} layout="icon" />
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full py-12 text-center border border-dashed border-[#E8E8E8] rounded-3xl bg-white">
                <p className="font-sans font-semibold text-[#666666]">Select "Show on Homepage" inside the admin panel to display bracelets here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="py-20 px-4 md:px-16 bg-white border-t border-[#E8E8E8]">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-[#111111]">NEW ARRIVALS</h2>
                <p className="text-xs md:text-sm text-[#666666] mt-1">Fresh pieces added to the shop.</p>
              </div>
              <Link href="/shop" className="text-xs font-bold text-[#f72585] hover:underline flex items-center gap-1 uppercase tracking-wider">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product, index) => {
                const hasImage = product.product_images?.[0]?.url
                return (
                  <div 
                    key={product.id} 
                    className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#E8E8E8] hover:-translate-y-1 relative flex flex-col slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-[#f7f7f7] rounded-2xl overflow-hidden mb-4">
                      {hasImage ? (
                        <img 
                          src={product.product_images[0].url} 
                          alt={product.name} 
                          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xs">NO IMAGE</div>
                      )}
                      
                      {/* Wishlist Button Overlay */}
                      <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <WishlistButton productId={product.id} />
                      </div>

                      {/* Hot Pink Discount Badge */}
                      {product.discount_percentage > 0 && (
                        <span className="absolute top-3 left-3 bg-[#f72585] text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-20">
                          -{product.discount_percentage}%
                        </span>
                      )}

                      {/* Sold Out Overlay */}
                      {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                          <span className="bg-[#111111] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">SOLD OUT</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/product/${product.slug}`} className="block">
                          <h3 className="text-sm font-bold text-[#171717] truncate hover:text-[#f72585] transition-colors leading-snug">{product.name}</h3>
                        </Link>
                        {/* Static Reviews mapping visually */}
                        <div className="flex items-center gap-1 mt-1 text-amber-400">
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] text-[#666666] font-semibold ml-1">(5.0)</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#111111]">₹{product.price}</span>
                          {product.compare_at_price && (
                            <span className="text-xs text-[#666666] line-through">₹{product.compare_at_price}</span>
                          )}
                        </div>
                        
                        {/* Quick Add Button Client Wrapper */}
                        <QuickAddButton product={product} layout="icon" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. BEST SELLERS */}
      {bestSellers && bestSellers.length > 0 && (
        <section className="py-20 px-4 md:px-16 bg-[#f7f7f7] border-t border-[#E8E8E8]">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-[#111111]">BEST SELLERS</h2>
                <p className="text-xs md:text-sm text-[#666666] mt-1">Our most loved creations, worn by many.</p>
              </div>
              <Link href="/shop" className="text-xs font-bold text-[#f72585] hover:underline flex items-center gap-1 uppercase tracking-wider">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {bestSellers.map((product) => (
                <div key={product.id} className="bg-white rounded-[2rem] p-6 border border-[#E8E8E8] shadow-sm flex gap-4 md:gap-6 hover:shadow-md transition-all relative group">
                  <Link href={`/product/${product.slug}`} className="w-28 h-28 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                    {product.product_images?.[0]?.url ? (
                      <img src={product.product_images[0].url} alt={product.name} className="w-24 h-24 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out" />
                    ) : (
                      <div className="text-gray-300 font-bold text-[10px]">NO IMAGE</div>
                    )}
                  </Link>
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <span className="inline-block bg-[#ffeef1] text-[9px] font-bold text-[#f72585] px-2.5 py-0.5 rounded-full mb-1">
                        BESTSELLER
                      </span>
                      <Link href={`/product/${product.slug}`} className="block">
                        <h3 className="text-sm font-bold text-[#171717] line-clamp-1 hover:text-[#f72585] transition-colors leading-tight">{product.name}</h3>
                      </Link>
                      <p className="text-xs font-black text-[#111111] mt-1">₹{product.price}</p>
                    </div>
                    {/* Full layout Quick Add Button */}
                    <QuickAddButton product={product} layout="full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. PROMOTIONAL BANNERS */}
      <section className="py-20 px-4 md:px-16 bg-white border-t border-[#E8E8E8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Promo: ThreeKnots New Drop */}
          <div className="bg-gradient-to-r from-[#ffeef1] to-[#fde5e8] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-[340px] border border-[#E8E8E8] group hover:shadow-md transition-shadow">
            <div className="z-10">
              <span className="text-[#f72585] font-bold text-xs tracking-widest uppercase">NEW DROP</span>
              <h3 className="text-3.5xl font-sans font-black mt-2 leading-none text-[#111111]">FIND YOUR<br/>NEXT KNOT</h3>
              <p className="text-gray-600 text-sm mt-3 max-w-xs font-medium">Elevate your daily wear with limited-run bracelets crafted to carry your personal style story.</p>
            </div>
            <Link href="/shop" className="bg-[#111111] hover:bg-[#f72585] text-white text-xs font-bold py-3.5 px-6 rounded-full w-fit z-10 transition-colors shadow-sm uppercase tracking-wider">
              SHOP NEW ARRIVALS &rarr;
            </Link>
            
            {/* Secondary Product Visual inside background */}
            {newArrivals?.[0]?.product_images?.[0]?.url && (
              <div className="absolute right-[-10%] bottom-[-5%] w-44 h-44 opacity-20 group-hover:opacity-30 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none">
                <img src={newArrivals[0].product_images[0].url} alt="" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          {/* Right Promo: Brand Story */}
          <div className="bg-[#111111] text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-[340px] border border-[#111111] group hover:shadow-md transition-shadow">
            <div className="z-10">
              <span className="text-[#f72585] font-bold text-xs tracking-widest uppercase">MADE TO KEEP</span>
              <h3 className="text-3.5xl font-sans font-black mt-2 leading-none">Bracelets inspired<br/>by the things you love.</h3>
              <p className="text-gray-300 text-sm mt-3 max-w-xs font-medium">Anime, pop culture characters, and personal stories designed to merge seamlessly with minimalist style.</p>
            </div>
            <Link href="/about" className="bg-[#f72585] hover:bg-[#ff1493] text-white text-xs font-bold py-3.5 px-6 rounded-full w-fit z-10 transition-colors shadow-sm uppercase tracking-wider">
              OUR STORY &rarr;
            </Link>
            
            {/* Secondary Product Visual inside background */}
            {newArrivals?.[1]?.product_images?.[0]?.url && (
              <div className="absolute right-[-10%] bottom-[-5%] w-44 h-44 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none">
                <img src={newArrivals[1].product_images[0].url} alt="" className="w-full h-full object-contain invert" />
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 9. BOTTOM TRUST STRIP */}
      <section className="bg-[#f7f7f7] border-y border-[#E8E8E8] py-8 px-4 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Handcrafted</h4>
            <p className="text-[10px] text-[#666666] mt-0.5 uppercase tracking-widest font-semibold">100% Care</p>
          </div>
          <div className="flex flex-col items-center border-l border-[#E8E8E8]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Premium Quality</h4>
            <p className="text-[10px] text-[#666666] mt-0.5 uppercase tracking-widest font-semibold">Made to Keep</p>
          </div>
          <div className="flex flex-col items-center border-l border-[#E8E8E8]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Secure Checkout</h4>
            <p className="text-[10px] text-[#666666] mt-0.5 uppercase tracking-widest font-semibold">Safe checkout</p>
          </div>
          <div className="flex flex-col items-center border-l border-[#E8E8E8]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Easy Support</h4>
            <p className="text-[10px] text-[#666666] mt-0.5 uppercase tracking-widest font-semibold">Always Here</p>
          </div>
        </div>
      </section>
    </div>
  )
}
