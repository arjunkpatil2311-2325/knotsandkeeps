import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCartButton'
import { releaseExpiredReservations } from '@/utils/cleanup'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  // Lazily cleanup expired stock reservations
  await releaseExpiredReservations()
  
  const { data: product } = await supabase
    .from('products')
    .select('*, product_images(url, is_primary)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!product) {
    notFound()
  }

  const isSoldOut = product.stock_quantity === 0
  
  // Sort images so primary is first
  const images = [...(product.product_images || [])].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))

  return (
    <div className="w-full">
      {/* Top Breadcrumb */}
      <div className="mb-8 flex items-center justify-between">
        <nav className="text-sm font-bold text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-black">Product Details</h1>
      </div>

      {/* Main Container */}
      <div className="bg-brand-soft-pink/20 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 border border-white shadow-sm relative overflow-hidden">
        
        {/* Decorative background for the product image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-square rounded-full border border-white/50 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[480px] aspect-square rounded-full border border-white pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* LEFT: Info */}
          <div className="flex-1 w-full text-center lg:text-left space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-black leading-tight">
              {product.name}
            </h2>
            <p className="text-gray-600 font-medium max-w-md mx-auto lg:mx-0">
              {product.description || product.short_description || "Handcrafted with premium materials, this piece is made to match your story and style."}
            </p>
            
            <div className="hidden lg:block pt-4">
              <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4">Features</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-accent" />
                  <span className="text-sm font-medium text-gray-700">Handcrafted with care</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-accent" />
                  <span className="text-sm font-medium text-gray-700">Adjustable fit</span>
                </li>
                {product.character_theme && (
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-accent" />
                    <span className="text-sm font-medium text-gray-700">Theme: {product.character_theme}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* CENTER: Image */}
          <div className="flex-[1.5] w-full flex justify-center items-center relative">
            <div className="w-full max-w-[400px] aspect-square rounded-full bg-gradient-to-tr from-brand-blush to-brand-cream shadow-[inset_0_0_40px_rgba(255,255,255,0.6)] flex items-center justify-center p-8 relative">
              {images.length > 0 ? (
                <img 
                  src={images[0].url} 
                  alt={product.name} 
                  className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
                />
              ) : (
                <span className="text-brand-dusty font-bold">No Image</span>
              )}

              {/* Mobile Price Overlay */}
              <div className="lg:hidden absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white">
                <p className="text-xl font-black text-brand-accent">₹{product.price}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Price & Actions */}
          <div className="flex-1 w-full bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white shadow-sm text-center lg:text-left">
            <div className="hidden lg:block mb-8">
              <div className="flex items-center gap-4">
                <p className="text-4xl font-black text-black">₹{product.price}</p>
                {product.compare_at_price && (
                  <p className="text-xl font-bold text-gray-400 line-through">₹{product.compare_at_price}</p>
                )}
              </div>
              {product.discount_percentage > 0 && (
                <div className="mt-3 inline-block bg-brand-accent text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  {product.discount_percentage}% OFF
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Availability</h3>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className={`w-3 h-3 rounded-full ${isSoldOut ? 'bg-gray-400' : 'bg-brand-accent shadow-[0_0_10px_rgba(224,122,122,0.8)]'}`} />
                  <span className="text-sm font-bold text-black">
                    {isSoldOut ? 'Out of Stock' : `${product.stock_quantity} in stock`}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-rose/20">
                <AddToCartButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    compare_at_price: product.compare_at_price,
                    stock_quantity: product.stock_quantity,
                    image_url: images.length > 0 ? images[0].url : undefined
                  }} 
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Thumbnails if multiple images exist */}
      {images.length > 1 && (
        <div className="mt-8 flex justify-center gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="w-20 h-20 rounded-2xl bg-brand-bg border-2 border-transparent hover:border-brand-accent cursor-pointer transition-colors overflow-hidden p-2">
              <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
