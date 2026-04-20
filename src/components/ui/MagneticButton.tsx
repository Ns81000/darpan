'use client'

import { useRef, type PropsWithChildren } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

interface Props extends PropsWithChildren {
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export default function MagneticButton({ href, onClick, className, children, type }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const el = ref.current!

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      gsap.to(el, {
        x: (e.clientX - rect.left - rect.width  / 2) * 0.4,
        y: (e.clientY - rect.top  - rect.height / 2) * 0.4,
        duration: 0.4, ease: 'power2.out'
      })
    }

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, { scope: ref })

  const Tag = href ? Link : 'button'
  const buttonType = Tag === 'button' ? (type || 'button') : undefined

  return (
    <Tag
      ref={ref as any}
      href={href as string}
      onClick={onClick}
      className={className}
      type={buttonType}
      data-magnetic
    >
      {children}
    </Tag>
  )
}