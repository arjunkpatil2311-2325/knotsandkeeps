'use client'

import { useCartStore } from '@/store/cart'

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
    alert("Added to cart!")
  }

  return (
    <form className="mt-6" onSubmit={handleAdd}>
      <div className="mt-10 flex sm:flex-col1">
        {isSoldOut ? (
          <button
            disabled
            className="max-w-xs flex-1 bg-gray-300 border border-transparent rounded-md py-4 px-8 flex items-center justify-center text-base font-medium text-gray-500 uppercase tracking-wider cursor-not-allowed sm:w-full"
          >
            Sold Out
          </button>
        ) : (
          <button
            type="submit"
            className="max-w-xs flex-1 bg-black border border-transparent rounded-md py-4 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black uppercase tracking-wider sm:w-full transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>
      
      {isLowStock && (
        <p className="mt-4 text-sm text-yellow-600 font-medium">
          Hurry, only {product.stock_quantity} left in stock!
        </p>
      )}
    </form>
  )
}
