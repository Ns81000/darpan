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
    let rect = el.getBoundingClientRect()

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' })

    const onEnter = () => {
      rect = el.getBoundingClientRect()
    }

    const onMove = (e: MouseEvent) => {
      xTo((e.clientX - rect.left - rect.width / 2) * 0.4)
      yTo((e.clientY - rect.top - rect.height / 2) * 0.4)
    }

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' })
    }

    el.addEventListener('mouseenter', onEnter, { passive: true })
    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave, { passive: true })

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, { scope: ref })

  const Tag = href ? Link : 'button'
  const buttonType = Tag === 'button' ? (type || 'button') : undefined

  return (
    <Tag
      ref={ref as never}
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
