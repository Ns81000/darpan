'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import GlassCard from '@/components/ui/GlassCard'

const services = [
  { title: 'Short-form', descriptor: 'Reels, Shorts, TikToks engineered for retention.', deliverables: ['Hook editing', 'Captioning', 'Color grading'], turnaround: '24-48 hours' },
  { title: 'Long-form', descriptor: 'YouTube videos and essays that keep viewers watching intro to outro.', deliverables: ['Pacing', 'Sound design', 'B-roll integration'], turnaround: '3-5 days' },
  { title: 'Brand & Commercial', descriptor: 'Ad cuts and brand content that converts viewers.', deliverables: ['Story structure', 'Color grading', 'VFX & Motion'], turnaround: '5-7 days' }
]

function ServiceBlock({ service, index }: { service: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const isEven = index % 2 !== 0
    const split = new SplitText(headingRef.current!, { type: 'chars' })

    gsap.from(split.chars, {
      scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      opacity: 0, x: isEven ? -20 : 20,
      stagger: 0.03, duration: 0.6, ease: 'power3.out',
    })

    gsap.from(visualRef.current, {
      scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      clipPath: isEven ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)',
      duration: 1.0, ease: 'expo.out',
    })

    gsap.from(bodyRef.current!.querySelectorAll('p, li'), {
      scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      x: isEven ? -40 : 40, opacity: 0,
      stagger: 0.08, duration: 0.7, ease: 'power2.out',
    })

    return () => split.revert()
  }, { scope: ref })

  const isEven = index % 2 !== 0

  return (
    <div ref={ref} className={`flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} gap-12 items-center py-[clamp(4rem,8vw,8rem)] border-b border-accent-faint`}>
      <div className="flex-1">
        <h2 ref={headingRef} className="font-display font-light text-accent mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
          {service.title}
        </h2>
        <div ref={bodyRef} className="font-body text-accent-dim leading-[1.7]">
          <p className="text-[1rem] mb-6">{service.descriptor}</p>
          <ul className="space-y-2">
            {service.deliverables.map((d: string) => (
              <li key={d} className="flex items-center gap-3">
                <span className="w-4 h-[1px] bg-highlight inline-block" />
                <span className="text-[0.9375rem]">{d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.8125rem] tracking-[0.1em] uppercase text-highlight">
            Turnaround: {service.turnaround}
          </p>
        </div>
      </div>

      <GlassCard ref={visualRef} className="flex-1 aspect-[4/3] flex items-center justify-center bg-bg-surface-2 w-full">
        <span className="font-display font-light text-accent-dim text-[4rem] opacity-30">
          {String(index + 1).padStart(2, '0')}
        </span>
      </GlassCard>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <main className="bg-bg-base px-[clamp(1.5rem,6vw,6rem)] pt-40 pb-20">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-display font-light text-accent mb-8" style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}>
          Services
        </h1>
        {services.map((service, index) => (
          <ServiceBlock key={service.title} service={service} index={index} />
        ))}
      </div>
    </main>
  )
}