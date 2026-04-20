'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CtaStrip() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom', // Triggers exactly as the section touches the bottom of the screen
        end: 'center center',
        scrub: 1.5,
      }
    })

    // The white circle expands from the exact top-center edge, filling the entire black section
    tl.fromTo('.cta-circle-wipe', {
      scale: 0,
    }, {
      scale: 1,
      ease: 'power2.inOut'
    })

    // Float the inner content up directly into the white vastness
    gsap.fromTo('.cta-content', {
      y: 100,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 50%',
      }
    })

  }, { scope: containerRef })

  return (
    // Flawless full-bleed section. No box margins, no empty gaps. Connected directly to the top edge.
    <section ref={containerRef} className="relative h-screen w-full bg-black pointer-events-auto overflow-hidden flex flex-col justify-center items-center">
      
      {/* Massive White Circle expanding from the Top Center edge! */}
      <div className="cta-circle-wipe absolute top-0 left-1/2 w-[250vw] h-[250vw] md:w-[150vw] md:h-[150vw] -translate-x-1/2 -translate-y-1/2 bg-white rounded-full z-10 will-change-transform transform-gpu pointer-events-none" />

      {/* Subtle high-end noise overlay perfectly mapped to the white background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-5 mix-blend-multiply pointer-events-none z-20" />

      <div className="cta-content text-center max-w-[85rem] relative z-40 px-4 mt-12">
        <div className="flex justify-center mb-8">
          <div className="w-[1px] h-12 md:h-16 bg-black origin-top" />
        </div>
        
        <h2 className="font-display text-[clamp(4.5rem,10vw,11rem)] text-black uppercase tracking-tighter leading-[0.8] mb-8 md:mb-12">
          STOP LOSING <br/> YOUR VIEWERS.
        </h2>
        
        <p className="font-mono text-[10px] md:text-sm text-black/60 uppercase tracking-[0.2em] max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed font-bold">
          Build a telemetry system exactly tailored to your workflow.
        </p>
        <Link href="/contact" className="group relative inline-flex items-center justify-center px-10 py-5 md:px-14 md:py-6 overflow-hidden rounded-full border border-black text-black">
          <span className="relative z-10 font-mono text-[10px] tracking-[0.3em] uppercase transition-colors duration-500 group-hover:text-white">Start Sequence</span>
          <div className="absolute inset-0 bg-neutral-800 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" style={{ mixBlendMode: 'difference' }} />
        </Link>
      </div>

    </section>
  )
}