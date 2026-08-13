'use client'

import { useCartStore } from '@/store/cart'
import { ShoppingBag } from 'lucide-react'

interface AddToCartProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_at_price: number | null;
    image_url?: string;
    stock_quantity: number;
  };
}

export default function AddToCartButton({ product }: AddToCartProps) {
  const { addItem } = useCartStore()

  const isSoldOut = product.stock_quantity === 0
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    addItem({
      ...product,
      quantity: 1
    })
    // Optionally open the cart drawer here
    const cartButton = document.querySelector('button[onClick*="setIsCartOpen"]') as HTMLButtonElement
    if (cartButton) cartButton.click()
  }

  return (
    <form className="mt-8" onSubmit={handleAdd}>
      <div className="flex sm:flex-col1">
        {isSoldOut ? (
          <button
            disabled
            className="w-full bg-gray-200 border border-transparent rounded-full py-4 px-8 flex items-center justify-center gap-2 text-[15px] font-bold text-gray-400 uppercase tracking-widest cursor-not-allowed shadow-inner"
          >
            Sold Out
          </button>
        ) : (
          <button
            type="submit"
            className="w-full bg-black border border-transparent rounded-full py-4 px-8 flex items-center justify-center gap-3 text-[15px] font-bold text-white hover:bg-brand-accent hover:shadow-[0_10px_20px_-10px_rgba(224,122,122,0.6)] uppercase tracking-widest transition-all duration-300"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={2.5} />
            Add to Cart
          </button>
        )}
      </div>
      
      {isLowStock && (
        <p className="mt-4 text-sm text-brand-accent font-bold text-center">
          Hurry, only {product.stock_quantity} left in stock!
        </p>
      )}
    </form>
  )
}
