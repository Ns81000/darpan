'use client'

import { forwardRef, useRef, type ElementType, type ComponentPropsWithRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

type Props<T extends ElementType> = {
  className?: string
  as?: T
  shimmer?: boolean
  style?: React.CSSProperties
} & Omit<ComponentPropsWithRef<T>, 'as' | 'shimmer' | 'className' | 'style'>

const GlassCard = forwardRef<HTMLElement, Props<any>>(({
  className = '',
  as: Tag = 'div',
  shimmer = true,
  children,
  style,
  ...rest
}, forwardedRef) => {
  const localRef = useRef<HTMLElement>(null)
  
  useGSAP(() => {
    if (!shimmer) return
    const el = localRef.current!

    // GSAP shimmer: pseudo-element translateX sweep on hover
    el.addEventListener('mouseenter', () => {
      gsap.fromTo(el.querySelector('.shimmer-layer') as HTMLElement,
        { x: '-100%' },
        { x: '150%', duration: 0.7, ease: 'power2.inOut' }
      )
    })
  }, { scope: localRef })

  return (
    <Tag
      ref={(node: HTMLElement) => {
        localRef.current = node
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node
        }
      }}
      className={`glass glass-card rounded-2xl relative ${className}`}
      style={{ boxShadow: 'var(--shadow-glass)', ...style }}
      {...rest}
    >
      {/* Shimmer layer — animated via GSAP on mouseenter */}
      {shimmer && (
        <span
          className="shimmer-layer pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)',
            transform: 'translateX(-100%)',
          }}
        />
      )}
      {children}
    </Tag>
  )
})

export default GlassCard