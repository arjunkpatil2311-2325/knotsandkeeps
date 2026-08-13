'use client'

import { Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

interface WishlistButtonProps {
  productId: string;
}

export function WishlistButton({ productId }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('threeknots-wishlist') || '[]')
    setIsWishlisted(list.includes(productId))
  }, [productId])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const list = JSON.parse(localStorage.getItem('threeknots-wishlist') || '[]')
    let newList: string[]
    
    if (isWishlisted) {
      newList = list.filter((id: string) => id !== productId)
    } else {
      newList = [...list, productId]
    }
    
    localStorage.setItem('threeknots-wishlist', JSON.stringify(newList))
    setIsWishlisted(!isWishlisted)
  }

  return (
    <button 
      onClick={toggleWishlist}
      className="w-8 h-8 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all hover:scale-110"
    >
      <Heart 
        className={`w-4 h-4 transition-colors ${
          isWishlisted ? 'fill-[#f72585] text-[#f72585]' : 'text-[#666666] hover:text-[#f72585]'
        }`} 
      />
    </button>
  )
}
