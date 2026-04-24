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
    <footer ref={ref} className="bg-black border-t border-white/10 relative z-[2] w-full px-[clamp(1.5rem,6vw,6rem)] py-8 md:py-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-4 md:gap-8">
          <span className="footer-item font-display font-light tracking-[0.4em] text-white/90 text-2xl uppercase">
            DARPAN
          </span>
          <a
            href="mailto:hello@darpan.studio"
            className="footer-item font-mono text-[10px] md:text-xs tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300 uppercase"
          >
            hello@darpan.studio
          </a>
        </div>

        <nav className="footer-item flex flex-wrap justify-center lg:justify-end gap-x-8 gap-y-4">
          {footerLinks.map(label => (
            <Link
              key={label}
              href={`/${label.toLowerCase()}`}
              className="font-body text-[0.75rem] tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors duration-300"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="footer-divider h-[1px] bg-white/10 w-full mb-6 origin-left" />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <span className="footer-item font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
          &copy; 2026 Darpan Studio. All rights reserved.
        </span>
        <span className="footer-item font-mono text-[10px] tracking-[0.2em] uppercase text-white/20 hidden md:block">
          System Operational
        </span>
      </div>
    </footer>
  )
}