'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitReveal from '@/components/ui/SplitReveal'
import { projects } from '@/lib/data/work'
import Image from 'next/image'

function WorkCard({ project, onHover, onLeave }: { project: any; onHover: (color: string) => void; onLeave: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useGSAP(() => {
    const overlay = ref.current!.querySelector('.work-overlay')
    const img = ref.current!.querySelector('img')

    tlRef.current = gsap.timeline({ paused: true })
    tlRef.current
      .to(overlay, { opacity: 1, duration: 0.35 })
      .to(img, { scale: 1.05, duration: 0.6, ease: 'power2.out' }, '<')
  }, { scope: ref })

  const handleEnter = () => {
    tlRef.current?.play()
    onHover(project.color || '#111111')
  }

  const handleLeave = () => {
    tlRef.current?.reverse()
    onLeave()
  }

  return (
    <div
      ref={ref}
      className="flex-shrink-0 w-[clamp(280px,35vw,480px)] rounded-sm overflow-hidden cursor-pointer group"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image src={project.thumb} alt={project.title} fill className="object-cover" />
        <div className="work-overlay absolute inset-0 opacity-0 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <span className="text-white text-5xl font-light opacity-80 group-hover:scale-110 transition-transform duration-500">&#9655;</span>
        </div>
      </div>
      <div className="pt-6">
        <span className="font-body text-[0.75rem] tracking-[0.2em] uppercase text-accent-dim">
          {project.category}
        </span>
        <h3 className="font-display font-light text-accent text-3xl mt-2 tracking-tight group-hover:text-highlight transition-colors duration-300">
          {project.title}
        </h3>
      </div>
    </div>
  )
}

function FilterBar({ active, onChange }: { active: string; onChange: (f: string) => void }) {
  const filters = ['all', 'Commercial', 'Short-form', 'Long-form', 'Podcast']
  return (
    <div className="px-[clamp(1.5rem,6vw,6rem)] py-6 flex gap-4 flex-wrap border-b border-white/10 relative z-10">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`font-body text-[0.8125rem] tracking-[0.1em] px-5 py-2 uppercase transition-all duration-300 ${
            active === f
              ? 'text-white border-b-2 border-white'
              : 'text-accent-dim hover:text-white border-b-2 border-transparent'
          }`}
        >
          {f === 'all' ? 'All' : f}
        </button>
      ))}
    </div>
  )
}

export default function WorkPage() {
  const [filter, setFilter] = useState('all')
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    if (isMobile) return

    const track = trackRef.current!
    
    // Quick timeout to let DOM settle if using dynamic images
    setTimeout(() => {
      const totalW = track.scrollWidth - window.innerWidth
      if (totalW <= 0) return

      const st = ScrollTrigger.create({
        id: 'work-horizontal',
        trigger: sectionRef.current!,
        pin: true, 
        anticipatePin: 1, 
        scrub: 1.2,
        end: () => `+=${totalW}`,
        invalidateOnRefresh: true,
        animation: gsap.to(track, { x: -totalW, ease: 'none' })
      })
    }, 100)

    return () => {
      ScrollTrigger.getById('work-horizontal')?.kill()
    }
  }, { scope: sectionRef, dependencies: [filter] })

  const handleHover = (color: string) => {
    gsap.to(glowRef.current, { 
      backgroundColor: color, 
      opacity: 0.4, 
      duration: 0.8, 
      ease: 'power2.out' 
    })
  }

  const handleLeave = () => {
    gsap.to(glowRef.current, { 
      opacity: 0, 
      duration: 0.6, 
      ease: 'power2.inOut' 
    })
  }

  const filteredProjects = projects.filter((p) => filter === 'all' || p.category === filter)

  return (
    <main className="bg-bg-base relative min-h-screen selection:bg-white selection:text-black">
      
      {/* Ambilight glow background */}
      <div 
        ref={glowRef} 
        className="fixed inset-0 z-0 opacity-0 pointer-events-none mix-blend-screen"
        style={{ filter: 'blur(100px)' }}
      />

      <section className="px-[clamp(1.5rem,6vw,6rem)] pt-40 pb-10 relative z-10">
        <SplitReveal
          as="h1"
          className="font-display font-light text-accent leading-[0.9] uppercase tracking-tighter drop-shadow-2xl"
          style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
          delay={0.5}
        >
          Selected Works
        </SplitReveal>
        <p className="font-body text-accent-dim mt-6 text-[1.125rem] max-w-md">
          A cinematic showcase of our high-impact editing. Hover to ignite the ambilight.
        </p>
      </section>

      <FilterBar active={filter} onChange={setFilter} />

      <section ref={sectionRef} className="overflow-hidden md:h-screen flex items-center relative z-10 py-12 md:py-0 pt-20 md:pt-0">
        <div
          ref={trackRef}
          className="flex flex-col md:flex-row gap-12 px-[clamp(1.5rem,6vw,6rem)] will-change-transform"
        >
          {filteredProjects.map((p) => (
            <WorkCard 
              key={p.id} 
              project={p} 
              onHover={handleHover} 
              onLeave={handleLeave} 
            />
          ))}
        </div>
      </section>
    </main>
  )
}