'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import GlassCard from '@/components/ui/GlassCard'

const team = [
  { name: 'Alex Reid', role: 'Lead Editor', skills: ['Premiere Pro', 'After Effects', 'Color Grading'] },
  { name: 'Samantha Chen', role: 'Post Producer', skills: ['VFX', 'Motion Graphics', 'DaVinci Resolve'] },
  { name: 'David Kim', role: 'Sound Designer', skills: ['Pro Tools', 'Logic Pro', 'Foley'] }
]

function TeamCard({ member }: { member: any }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const front = ref.current!.querySelector('.card-front') as HTMLElement
    const back = ref.current!.querySelector('.card-back') as HTMLElement

    gsap.set(back, { rotateY: 180, backfaceVisibility: 'hidden' })
    gsap.set(front, { backfaceVisibility: 'hidden' })

    const tl = gsap.timeline({ paused: true })
    tl
      .to(front, { rotateY: -180, duration: 0.7, ease: 'power2.inOut' })
      .to(back, { rotateY: 0, duration: 0.7, ease: 'power2.inOut' }, '<')

    ref.current!.addEventListener('mouseenter', () => tl.play())
    ref.current!.addEventListener('mouseleave', () => tl.reverse())

    ref.current!.addEventListener('click', () => {
      if (window.matchMedia('(pointer: coarse)').matches) {
        tl.reversed() ? tl.play() : tl.reverse()
      }
    })
  }, { scope: ref })

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[3/4] cursor-pointer"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      <GlassCard className="card-front absolute inset-0 overflow-hidden flex flex-col justify-end p-6">
        <div className="absolute inset-0 bg-bg-surface-2" /> 
        <div className="relative z-10 p-4">
          <p className="font-body text-[0.75rem] tracking-[0.2em] uppercase text-highlight mb-1">{member.role}</p>
          <h3 className="font-display font-light text-accent text-2xl">{member.name}</h3>
        </div>
      </GlassCard>

      <GlassCard className="card-back absolute inset-0 flex flex-col justify-center p-8 bg-bg-surface border border-accent-faint">
        <h3 className="font-display font-light text-accent text-3xl mb-2">{member.name}</h3>
        <p className="font-body text-highlight text-[0.875rem] uppercase tracking-wide mb-8">{member.role}</p>
        <ul className="space-y-3">
          {member.skills.map((s: string) => (
            <li key={s} className="flex items-center gap-3">
              <span className="w-5 h-[1px] bg-highlight inline-block" />
              <span className="font-body text-accent-dim text-[0.95rem]">{s}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  )
}

export default function AboutPage() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const split = new SplitText('.origin-body p', { type: 'lines' })
    gsap.from(split.lines, {
      scrollTrigger: { trigger: '.origin-body', start: 'top 75%' },
      opacity: 0, y: 24,
      stagger: 0.08, duration: 0.7, ease: 'power2.out'
    })

    gsap.from('.team-card', {
      scrollTrigger: { trigger: '.team-grid', start: 'top 75%' },
      y: 60, opacity: 0,
      stagger: 0.15, duration: 0.8, ease: 'back.out(1.5)'
    })

    return () => split.revert()
  }, { scope: ref })

  return (
    <main ref={ref} className="bg-bg-base pt-40 pb-24">
      <div className="px-[clamp(1.5rem,6vw,6rem)] max-w-[1200px] mx-auto text-center mb-32">
        <h1 className="font-display font-light text-accent" style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}>About Us</h1>
      </div>

      <div className="origin-body max-w-[800px] mx-auto px-[clamp(1.5rem,6vw,6rem)] text-center mb-40">
        <p className="font-body font-light text-[1.25rem] md:text-[1.5rem] leading-[1.8] text-accent-dim text-justify">
          We built Darpan because we were tired of generic post-production. Content has a voice, a rhythm, and a pulse. We focus on enhancing the narrative of creators and brands across the globe through precise, highly considered edits. Every frame is intentional. Let's create something brilliant.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,6vw,6rem)]">
        <h2 className="font-display font-light text-accent text-5xl mb-16 text-center">The Team</h2>
        <div className="team-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div className="team-card" key={member.name}>
              <TeamCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}