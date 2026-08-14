'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasReducedMotion, setHasReducedMotion] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setHasReducedMotion(mediaQuery.matches)

    if (mediaQuery.matches) {
      setIsVisible(true) // Immediately show if reduced motion is preferred
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once it's visible, we don't need to observe it anymore
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.15, // Trigger when 15% of the element is visible
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  // Base transition classes
  const baseClasses = hasReducedMotion 
    ? 'opacity-100 translate-y-0' 
    : 'transition-all duration-700 ease-out'
    
  const visibilityClasses = isVisible || hasReducedMotion
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-[25px]'

  return (
    <div 
      ref={ref} 
      className={`${baseClasses} ${visibilityClasses} ${className}`}
      style={!hasReducedMotion ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
