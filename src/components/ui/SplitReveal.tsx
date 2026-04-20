'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

interface SplitRevealProps {
  children: React.ReactNode
  as?: any
  className?: string
  style?: React.CSSProperties
  delay?: number
}

export default function SplitReveal({ children, as: Tag = 'div', className, style, delay = 0 }: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!ref.current) return
    const split = new SplitText(ref.current, { type: 'chars' })
    gsap.from(split.chars, {
      opacity: 0, 
      y: 40,
      stagger: 0.04, 
      duration: 0.8, 
      ease: 'power3.out', 
      delay 
    })
    return () => split.revert()
  }, { scope: ref })

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}