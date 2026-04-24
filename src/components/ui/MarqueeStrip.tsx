'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

const ITEMS = ['Creators','Coaches','Brands','YouTube','Reels','Podcasts','Startups','International']
const CONTENT = ITEMS.map(i => `${i}  ·  `).join('')

export default function MarqueeStrip() {
  const ref   = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Tween | null>(null)

  useGSAP(() => {
    tlRef.current = gsap.to('.marquee-inner', {
      xPercent: -50, repeat: -1, duration: 22, ease: 'none',
    })

    const section = ref.current!
    
    const onEnter = () => gsap.to(tlRef.current, { timeScale: 0.25, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
    const onLeave = () => gsap.to(tlRef.current, { timeScale: 1, duration: 0.8, ease: 'power2.inOut', overwrite: 'auto' })

    section.addEventListener('mouseenter', onEnter, { passive: true })
    section.addEventListener('mouseleave', onLeave, { passive: true })

    return () => {
      section.removeEventListener('mouseenter', onEnter)
      section.removeEventListener('mouseleave', onLeave)
    }
  }, { scope: ref })

  const repeated = `${CONTENT}${CONTENT}${CONTENT}${CONTENT}`

  return (
    <div
      ref={ref}
      className="bg-bg-surface border-y border-accent-faint py-5 overflow-hidden"
    >
      <div className="marquee-inner flex whitespace-nowrap will-change-transform">
        <span className="font-body text-[clamp(0.75rem,1.2vw,0.9rem)] uppercase tracking-[0.15em] text-accent-dim">
          {repeated}
        </span>
      </div>
    </div>
  )
}