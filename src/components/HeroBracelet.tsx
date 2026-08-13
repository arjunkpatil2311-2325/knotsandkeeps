'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface HeroBraceletProps {
  product: {
    name: string
    price: number
    slug: string
    product_images: { url: string }[]
  } | null
}

export function HeroBracelet({ product }: HeroBraceletProps) {
  if (!product || !product.product_images?.[0]?.url) {
    return (
      <div className="w-full aspect-square rounded-[3rem] bg-brand-blush/30 border-2 border-white flex items-center justify-center text-brand-accent font-bold">
        New pieces arriving soon.
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center">
      {/* Background glowing circle */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-brand-blush to-brand-cream border border-white shadow-[inset_0_0_50px_rgba(255,255,255,0.5)] z-0"
      />
      
      {/* Orbiting element (optional decorative) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[90%] h-[90%] rounded-full border border-brand-rose/20 border-dashed z-0"
      />

      {/* Floating Bracelet */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: [0, -15, 0], opacity: 1 }}
        transition={{ 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.8 }
        }}
        className="relative z-10 w-[85%] h-[85%] rounded-[2rem] overflow-hidden bg-white/50 backdrop-blur-sm shadow-xl flex items-center justify-center p-4 border border-white/40"
      >
        <img
          src={product.product_images[0].url}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </motion.div>

      {/* Product Info Tag */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white flex items-center gap-4 z-20 whitespace-nowrap"
      >
        <div>
          <p className="text-sm font-bold text-black">{product.name}</p>
          <p className="text-xs font-bold text-brand-accent">₹{product.price}</p>
        </div>
        <Link 
          href={`/product/${product.slug}`}
          className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-brand-accent transition-colors"
        >
          View
        </Link>
      </motion.div>
    </div>
  )
}
