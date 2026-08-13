'use client'

import { useCartStore } from '@/store/cart'
import { ShoppingBag } from 'lucide-react'
import { useState } from 'react'

interface QuickAddButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_at_price: number | null;
    product_images?: { url: string }[];
    stock_quantity: number;
  };
  layout?: 'icon' | 'full';
}

export function QuickAddButton({ product, layout = 'icon' }: QuickAddButtonProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock_quantity === 0) return

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compare_at_price: product.compare_at_price,
      image_url: product.product_images?.[0]?.url,
      quantity: 1,
      stock_quantity: product.stock_quantity,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (layout === 'full') {
    return (
      <button 
        onClick={handleAdd}
        disabled={product.stock_quantity === 0}
        className={`w-full font-sans font-bold py-3 px-4 rounded-xl text-center text-xs tracking-wider transition-all shadow-sm ${
          product.stock_quantity === 0 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : added
              ? 'bg-[#ffeef1] text-[#f72585] border border-[#f72585]'
              : 'bg-[#111111] text-white hover:bg-[#f72585] border border-[#111111] hover:border-[#f72585]'
        }`}
      >
        {product.stock_quantity === 0 ? 'SOLD OUT' : added ? 'ADDED!' : 'QUICK ADD'}
      </button>
    )
  }

  return (
    <button 
      onClick={handleAdd}
      disabled={product.stock_quantity === 0}
      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
        product.stock_quantity === 0
          ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
          : added
            ? 'bg-[#f72585] border-[#f72585] text-white'
            : 'bg-gray-50 border-gray-100 text-[#171717] hover:bg-[#111111] hover:text-white hover:border-[#111111]'
      }`}
    >
      <ShoppingBag className="w-4 h-4" />
    </button>
  )
}
