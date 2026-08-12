import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
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
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5
  
  // Sort images so primary is first
  const images = [...(product.product_images || [])].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
               {images.length > 0 ? (
                 <img src={images[0].url} alt={product.name} className="w-full h-full object-cover object-center" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-400">No Image available</div>
               )}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <div className="flex items-center">
                <p className="text-3xl text-gray-900">₹{product.price}</p>
                {product.compare_at_price && (
                   <p className="ml-4 text-xl text-gray-500 line-through">₹{product.compare_at_price}</p>
                )}
                {product.discount_percentage > 0 && (
                  <span className="ml-4 bg-red-100 text-red-800 text-sm font-semibold px-2.5 py-0.5 rounded uppercase tracking-wide">
                    {product.discount_percentage}% OFF
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description || product.short_description || "Premium handcrafted bracelet."}</p>
              </div>
            </div>

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

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">Additional details</h2>
              <div className="border-t divide-y divide-gray-200">
                <div className="py-4">
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Features</h3>
                  <ul className="mt-4 pl-4 list-disc text-sm text-gray-600 space-y-2">
                    <li>Handcrafted with care</li>
                    <li>Premium quality materials</li>
                    <li>Adjustable size (fits most)</li>
                    {product.character_theme && <li>Theme: {product.character_theme}</li>}
                  </ul>
                </div>
                <div className="py-4">
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Shipping</h3>
                  <p className="mt-4 text-sm text-gray-600">
                    Free shipping on orders over ₹1000. Ships within 2-3 business days.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
