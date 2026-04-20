'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePathname } from 'next/navigation'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useGSAP(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot  = dotRef.current!
    const ring = ringRef.current!

    // Performance optimization: use quickTo instead of creating tweens each frame
    const xDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" })
    const yDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" })
    
    // Ring follows slightly slower for cinematic lag
    const xRing = gsap.quickTo(ring, "x", { duration: 0.3, ease: "power3" })
    const yRing = gsap.quickTo(ring, "y", { duration: 0.3, ease: "power3" })

    const onMove = (e: MouseEvent) => {
      xDot(e.clientX)
      yDot(e.clientY)
      xRing(e.clientX)
      yRing(e.clientY)
    }

    // On hover interactive elements
    const onEnterInteractive = () => {
      gsap.to(ring, { width: 64, height: 64, borderColor: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.1)', duration: 0.4, ease: 'expo.out' })
      gsap.to(dot, { scale: 0, duration: 0.2 })
    }
    
    const onLeaveInteractive = () => {
      gsap.to(ring, { width: 32, height: 32, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'transparent', duration: 0.3, ease: 'power2.out' })
      gsap.to(dot, { scale: 1, duration: 0.2 })
    }

    // Attach listeners
    window.addEventListener('mousemove', onMove)

    const interactives = document.querySelectorAll('a, button, [role="button"]')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnterInteractive)
      el.addEventListener('mouseleave', onLeaveInteractive)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnterInteractive)
        el.removeEventListener('mouseleave', onLeaveInteractive)
      })
    }
  }, [pathname]) // Re-run when pathname changes to attach to new DOM nodes

  return (
    <>
      <div
        ref={dotRef}
        className="fixed w-[4px] h-[4px] bg-white rounded-full pointer-events-none z-[9999]
                   -translate-x-1/2 -translate-y-1/2 hidden md:block mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="fixed w-8 h-8 flex items-center justify-center border border-white/20 rounded-full pointer-events-none z-[9998]
                   -translate-x-1/2 -translate-y-1/2 hidden md:block mix-blend-difference backdrop-blur-[2px]"
      />
    </>
  )
}