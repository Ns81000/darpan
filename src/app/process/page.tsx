'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import GlassCard from '@/components/ui/GlassCard'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(DrawSVGPlugin)
}

const steps = [
  { num: '01', title: 'Discovery', body: 'We start by deeply understanding your brand voice, goals, and visual identity.' },
  { num: '02', title: 'Asset Handover', body: 'You share the raw footage and any required assets via our secure portal.' },
  { num: '03', title: 'First Cut', body: 'Our editors craft the initial story, establishing the pacing and structural flow.' },
  { num: '04', title: 'Refinement', body: 'We apply color grading, sound design, and VFX to elevate the final product.' },
  { num: '05', title: 'Delivery', body: 'Final polished assets are delivered, optimized for every required platform.' }
]

export default function ProcessPage() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.to('.timeline-line', {
      drawSVG: '100%', ease: 'none',
      scrollTrigger: {
        trigger: '.timeline-section',
        start: 'top 65%', end: 'bottom 60%', scrub: 1.5
      }
    })

    document.querySelectorAll('.step-dot').forEach(dot => {
      gsap.to(dot, {
        scale: 1.8,
        boxShadow: '0 0 24px rgba(255, 255, 255, 0.8)',
        backgroundColor: '#FFFFFF',
        duration: 0.4, ease: 'back.out(2)',
        scrollTrigger: {
          trigger: dot,
          start: 'top 65%',
          toggleActions: 'play none none reverse'
        }
      })
    })

    document.querySelectorAll('.step-card').forEach((card, i) => {
      const heading = card.querySelector('h3')!
      const split = new SplitText(heading, { type: 'chars' })

      gsap.from(split.chars, {
        scrollTrigger: { trigger: card, start: 'top 80%' },
        opacity: 0, y: 20, stagger: 0.03, duration: 0.5, ease: 'power2.out'
      })
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 80%' },
        opacity: 0, x: i % 2 === 0 ? -60 : 60,
        duration: 0.9, ease: 'power3.out'
      })

      return () => split.revert()
    })
  }, { scope: sectionRef })

  return (
    <main className="bg-bg-base pt-40 pb-20">
      <div className="px-[clamp(1.5rem,6vw,6rem)] max-w-[1200px] mx-auto text-center mb-24 relative z-10">
        <h1 className="font-display font-light text-accent uppercase tracking-tighter drop-shadow-2xl" style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}>
          The Process
        </h1>
        <p className="font-body text-accent-dim mt-6 max-w-[600px] mx-auto text-[1.125rem]">
          A seamless workflow designed for scale, precision, and cinematic collaboration.
        </p>
      </div>

      <section ref={sectionRef} className="timeline-section relative px-[clamp(1.5rem,6vw,6rem)] max-w-[1000px] mx-auto py-12">
        <svg className="absolute left-[1.5rem] md:left-1/2 md:-translate-x-1/2 top-0 h-full w-[2px] overflow-visible">
          <line
            className="timeline-line hidden-wire"
            x1="1" y1="0" x2="1" y2="100%"
            stroke="rgba(255,255,255,0.1)" strokeWidth="2"
          />
          <line
            className="timeline-line"
            x1="1" y1="0" x2="1" y2="100%"
            stroke="#FFFFFF" strokeWidth="2"
            strokeDasharray="9999" strokeDashoffset="9999"
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' }}
          />
        </svg>

        <div className="flex flex-col gap-24 relative pl-8 md:pl-0 z-10">
          {steps.map((step, i) => (
            <div key={step.num} className={`relative flex items-center ${i % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
              <div className="step-dot absolute -left-[2.25rem] md:left-1/2 md:-translate-x-[calc(50%+0.5px)] w-3 h-3 rounded-full bg-black border border-white/40 z-20 transition-colors" />

              <GlassCard className={`step-card p-10 w-full md:max-w-[420px] ${i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                <span className="font-display text-[0.875rem] tracking-[0.3em] text-white opacity-60 uppercase mb-4 block">
                  {step.num}
                </span>
                <h3 className="font-display font-light text-accent text-2xl mb-4">{step.title}</h3>
                <p className="font-body text-accent-dim leading-[1.7]">{step.body}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}