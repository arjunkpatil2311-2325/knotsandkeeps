import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ArrowRight, ShoppingBag, Search, User } from 'lucide-react'

// Note: In a real app we'd extract the Navbar and Footer to components and use Route Groups 
// to only apply them to the storefront and not the /admin routes. For this scaffold, I'll add them here.

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold tracking-widest text-black">
              KNOTS & KEEPS
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black">Home</Link>
            <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-black">Shop</Link>
            <Link href="/collections" className="text-sm font-medium text-gray-700 hover:text-black">Collections</Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-black">About</Link>
          </nav>
          <div className="flex items-center space-x-5">
            <button className="text-gray-500 hover:text-black"><Search className="h-5 w-5" /></button>
            <Link href="/login" className="text-gray-500 hover:text-black"><User className="h-5 w-5" /></Link>
            <button className="text-gray-500 hover:text-black relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">0</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <span className="text-lg font-bold tracking-widest text-black">KNOTS & KEEPS</span>
            <p className="mt-4 text-sm text-gray-500">Premium handcrafted bracelets inspired by your favorite themes. Made to keep.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/shop" className="text-sm text-gray-500 hover:text-gray-900">All Products</Link></li>
              <li><Link href="/collections" className="text-sm text-gray-500 hover:text-gray-900">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/faq" className="text-sm text-gray-500 hover:text-gray-900">FAQ</Link></li>
              <li><Link href="/shipping" className="text-sm text-gray-500 hover:text-gray-900">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex items-center justify-between">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Knots and Keeps. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


export default async function Home() {
  const supabase = await createClient()

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, product_images(url)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .limit(4)

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#FAFAFA] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left z-10">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              Made to Keep.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Premium handcrafted bracelets inspired by anime, themes, and your unique style. Wear your story.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link href="/shop" className="inline-flex justify-center items-center px-8 py-4 bg-black text-white text-sm font-semibold tracking-wide uppercase hover:bg-gray-800 transition-colors">
                Shop Now
              </Link>
              <Link href="/collections" className="inline-flex justify-center items-center px-8 py-4 border border-black text-black text-sm font-semibold tracking-wide uppercase hover:bg-gray-50 transition-colors">
                Explore Collections
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
            <div className="aspect-square bg-gray-200 rounded-full w-3/4 max-w-md mx-auto relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-300 flex items-center justify-center text-gray-400">
                  [Hero Image Placeholder]
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Pieces</h2>
            <p className="text-gray-500 mt-2">Handpicked favorites for your collection.</p>
          </div>
          <Link href="/shop" className="hidden sm:flex items-center text-sm font-semibold text-black hover:text-gray-600">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {featuredProducts?.map((product) => (
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
        </div>
      </section>
    </>
  )
}
