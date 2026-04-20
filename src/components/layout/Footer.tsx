'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

const footerLinks = ['Work','Services','Process','Pricing','About','Contact']

export default function Footer() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('.footer-divider', {
      scrollTrigger: { trigger: ref.current, start: 'top 90%' },
      scaleX: 0, transformOrigin: 'left',
      duration: 1.0, ease: 'power3.out'
    })
    gsap.from('.footer-item', {
      scrollTrigger: { trigger: ref.current, start: 'top 90%' },
      y: 30, opacity: 0,
      stagger: 0.08, duration: 0.8, ease: 'power2.out', delay: 0.2
    })
  }, { scope: ref })

  return (
    <footer ref={ref} className="bg-black border-t border-white/10 px-[clamp(1.5rem,6vw,6rem)] pt-24 pb-12 relative z-[2]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
        <span className="footer-item font-display font-light tracking-[0.4em] text-white text-3xl">
          DARPAN
        </span>
        <nav className="footer-item flex flex-wrap gap-6 md:gap-12">
          {footerLinks.map(label => (
            <Link
              key={label}
              href={`/${label.toLowerCase()}`}
              className="font-body text-[0.75rem] tracking-[0.1em] uppercase text-accent-dim hover:text-white transition-colors duration-300"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="footer-divider h-[1px] bg-white/10 w-full mb-8 origin-left" />

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <a
          href="mailto:hello@darpan.studio"
          className="footer-item font-display text-[1rem] tracking-wide text-accent-dim hover:text-white transition-colors duration-300"
        >
          hello@darpan.studio
        </a>
        <span className="footer-item font-body text-[0.75rem] tracking-[0.1em] uppercase text-accent-dim">
          2026 Darpan. All rights reserved.
        </span>
      </div>
    </footer>
  )
}