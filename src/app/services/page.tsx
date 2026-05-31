'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitReveal from '@/components/ui/SplitReveal'
import Image from 'next/image'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const services = [
  { 
    id: '01', 
    title: 'Short-form Retention', 
    descriptor: 'Reels, Shorts, TikToks engineered for maximum retention and algorithm dominance.', 
    deliverables: ['Hook Engineering', 'Dynamic Captioning', 'Pacing & Flow', 'Color Grading'], 
    turnaround: '24-48 hours',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1600&q=80'
  },
  { 
    id: '02', 
    title: 'Long-form Narrative', 
    descriptor: 'YouTube essays and documentaries that keep viewers watching intro to outro.', 
    deliverables: ['Story Structure', 'B-roll Integration', 'Sound Design', 'Motion Graphics'], 
    turnaround: '3-5 days',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80'
  },
  { 
    id: '03', 
    title: 'Commercial & Brand', 
    descriptor: 'High-end ad cuts and brand content that converts casual viewers into reliable customers.', 
    deliverables: ['Cinematic Pacing', 'Advanced VFX', 'Audio Mixing', 'Broadcast Ready'], 
    turnaround: '5-7 days',
    image: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&w=1600&q=80'
  }
]

export default function ServicesPage() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    // Reveal hero subtitle
    gsap.fromTo('.hero-subtitle', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power3.out' }
    )
    
    // Smooth magnetic scrolling arrow
    gsap.to('.scroll-indicator', {
      y: 15,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      duration: 1.5
    })

    // Setup Sticky Stacking Cards
    const containers = gsap.utils.toArray<HTMLElement>('.service-container')
    
    containers.forEach((container, i) => {
      const innerCard = container.querySelector('.card-inner')
      
      // Animate background image for subtle parallax independently of stacking
      const img = container.querySelector('.card-bg-image')
      gsap.fromTo(img, 
        { scale: 1 }, 
        {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      )

      if (i === containers.length - 1) return; // Last card doesn't shrink
      
      const nextContainer = containers[i + 1];
      
      // The push-down & shrink effect
      gsap.to(innerCard, {
        scale: 0.9,
        y: '-5vh',
        opacity: 0.2, // Darkens significantly like it's falling into shadow
        filter: 'blur(4px)',
        ease: 'none',
        scrollTrigger: {
          trigger: nextContainer,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        }
      })
    })

    // Sub-elements entrance animation when card comes fully into view
    containers.forEach((container) => {
      const texts = container.querySelectorAll('.stagger-reveal')
      const lines = container.querySelectorAll('.list-item')
      
      gsap.from(texts, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 60%',
        }
      })

      gsap.from(lines, {
        x: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 50%',
        }
      })
    })
    
  }, { scope: containerRef })

  return (
    <main ref={containerRef} className="bg-[#080808] text-white min-h-screen selection:bg-white selection:text-black">
      
      {/* Hero Section */}
      <section className="h-[90vh] w-full flex flex-col justify-center items-center px-4 relative z-10 pt-20">
        <SplitReveal as="h1" className="font-display text-[clamp(4rem,10vw,12rem)] text-center leading-[0.8] uppercase tracking-tighter mix-blend-difference mb-6">
          System <br/> Capabilities
        </SplitReveal>
        
        <p className="hero-subtitle font-mono text-[10px] md:text-sm uppercase tracking-[0.3em] text-white/50 max-w-xl text-center leading-relaxed font-bold">
          Precision engineered telemetry. We don&apos;t just edit videos. We build retention systems that monopolize human attention.
        </p>

        {/* Scroll down indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em]">Initiate sequence</span>
          <div className="scroll-indicator w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* Stacking Cards Deck Section */}
      <section className="relative w-full pb-32 z-20">
        {services.map((service, index) => (
          <div 
            key={service.id} 
            // Position sticky ensures it stays at top under navbar while the next ones scroll over it
            className="service-container sticky top-0 h-screen w-full pt-[12vh] pb-[4vh] px-[max(1rem,4vw)] flex items-center justify-center will-change-transform"
            style={{ zIndex: index * 10 }}
          >
            {/* The Inner Card that gets manipulated (scaled/blurred) by GSAP */}
            <div className="card-inner relative w-full h-full max-w-[1600px] rounded-[2.5vw] overflow-hidden bg-[#080808] shadow-[0_0_40px_rgba(255,255,255,0.06),0_30px_60px_rgba(0,0,0,0.8)] border border-white/20 will-change-transform transform-gpu group transition-shadow duration-700 hover:shadow-[0_0_60px_rgba(255,255,255,0.1),0_30px_60px_rgba(0,0,0,0.8)]">
              
              {/* Background Img */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <Image 
                  src={service.image} 
                  alt={service.title} 
                  fill 
                  className="card-bg-image object-cover opacity-[0.35] mix-blend-luminosity transform-gpu" 
                  priority={index === 0}
                />
                {/* Gradients to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 border-[1px] border-white/20 shadow-[inset_0_0_30px_rgba(255,255,255,0.05)] rounded-[2.5vw] pointer-events-none" />
              </div>

              {/* Foreground Content */}
              <div className="relative z-10 w-full h-full p-[clamp(2rem,6vw,6rem)] flex flex-col justify-between pointer-events-none">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-8">
                  <div className="max-w-3xl">
                    <span className="stagger-reveal font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-highlight mb-6 block border-l border-highlight/30 pl-4 py-1">
                      Capability // {service.id}
                    </span>
                    <h2 className="stagger-reveal font-display text-[clamp(3.5rem,7vw,7rem)] leading-[0.85] uppercase tracking-tighter text-white drop-shadow-2xl">
                      {service.title}
                    </h2>
                  </div>
                  <span className="stagger-reveal font-display text-[clamp(6rem,12vw,15rem)] leading-none text-white/5 font-bold mix-blend-screen hidden md:block">
                    {service.id}
                  </span>
                </div>

                {/* Footer Details */}
                <div className="flex flex-col xl:flex-row items-end justify-between gap-12 mt-auto">
                  <p className="stagger-reveal font-mono text-[11px] md:text-[13px] tracking-[0.1em] text-white/70 max-w-lg leading-loose uppercase">
                    {service.descriptor}
                  </p>

                  {/* Specs Card */}
                  <div className="w-full xl:w-auto shrink-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-8 md:p-10 pointer-events-auto">
                    <div className="flex items-center justify-between mb-8 gap-12">
                      <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Specs & Output</h4>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] font-bold">
                        ETA: {service.turnaround}
                      </span>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
                      {service.deliverables.map((item, idx) => (
                        <li key={idx} className="list-item flex items-center gap-4 group cursor-default">
                          <div className="w-2 h-2 rounded-full border border-white/30 group-hover:border-highlight transition-colors duration-300 relative">
                            <div className="absolute inset-0 bg-highlight scale-0 group-hover:scale-100 rounded-full transition-transform duration-300" />
                          </div>
                          <span className="font-mono text-xs tracking-[0.1em] text-white/80 uppercase group-hover:text-white transition-colors duration-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </section>

    </main>
  )
}