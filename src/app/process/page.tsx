'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitReveal from '@/components/ui/SplitReveal'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const steps = [
  { num: '01', color: '#FF3366', title: 'Ingestion & Audit', desc: 'Secure transfer, ingest, and cataloging of your raw material. We build the structural foundation of the editing project before touching a single cut.' },
  { num: '02', color: '#00D1FF', title: 'Narrative Assembly', desc: 'Sifting through the chaotic raw data to forge a coherent storyline. Pacing is established, the psychological hook is secured, and momentum is balanced.' },
  { num: '03', color: '#AA00FF', title: 'Sensory Expansion', desc: 'Advanced VFX, kinetic typography, and precise motion design layered over the primary narrative spine to hyper-stimulate viewer visual circuitry.' },
  { num: '04', color: '#00FF9D', title: 'Auditory Physics', desc: 'Deep-level Foley, sound design, and frequency mixing. We construct a multi-dimensional soundscape that subconsciously grips the audience.' },
  { num: '05', color: '#FFB800', title: 'Final Telemetry', desc: 'Stringent pre-flight quality control, precise color grading to your brand palette, and algorithmic multi-format encoding. Ready for global distribution.' }
]

export default function ProcessPage() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const panels = gsap.utils.toArray('.process-panel') as HTMLElement[]
    
    // Initial setup for the stack
    gsap.set(panels, { zIndex: i => i })
    gsap.set(panels.slice(1), { yPercent: 100 }) // Hide all but first below screen
    
    // Ambient continuous animation for the background number
    panels.forEach(panel => {
       gsap.to(panel.querySelector('.bg-number'), {
          xPercent: -5,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
       })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${panels.length * 100}%`,
        scrub: 1.5, // 1.5 provides that ultra-smooth heavy dampening for mouse wheels
        pin: true,
        anticipatePin: 1,
        snap: {
          snapTo: 1 / (panels.length - 1), // Perfectly lock into each card to ensure "single scroll to next"
          duration: { min: 0.3, max: 0.8 },
          delay: 0.0,
          ease: 'power2.inOut'
        }
      }
    })

    panels.forEach((panel, i) => {
      const content = panel.querySelector('.panel-content')
      const bgNum = panel.querySelector('.bg-number')

      if (i !== 0) {
        // Draw the curtain: Next panel slides up over the current one
        // Using explicit 1s duration ensures timeline blocks map perfectly to our snap points
        tl.to(panel, {
          yPercent: 0,
          ease: 'none',
          duration: 1
        }, i - 1)
        
        // Content floats up nicely
        gsap.set(content, { yPercent: 30, opacity: 0 })
        tl.to(content, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, i - 1 + 0.2) 
        
        // Massive background number drops in smoothly
        gsap.set(bgNum, { yPercent: 40 })
        tl.to(bgNum, {
          yPercent: 0,
          duration: 1,
          ease: 'power1.out'
        }, i - 1)
      }

      // Push the current panel's content out nicely as the next one covers it
      if (i !== panels.length - 1) {
        tl.to(content, {
          yPercent: -30,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.in'
        }, i) // Start right as the next one (i) begins sliding up
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, { scope: containerRef })

  return (
    <main ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#050505] text-white">
      {steps.map((step, i) => (
        <section 
           key={i} 
           className="process-panel absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-[#050505] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
        >
          {/* Vibrant structural gradient to make it pop! */}
          <div className="absolute inset-0 pointer-events-none opacity-50 mix-blend-screen"
               style={{ background: `radial-gradient(circle at top right, ${step.color}30, transparent 60%)` }}
          />

          {/* Deep soft radial gradient to anchor the pure black */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.03),transparent_60%)] pointer-events-none" />

          {/* Massive Parallax Number: Pushed to bottom to avoid cutting into the Navbar */}
          <div 
            className="bg-number absolute bottom-0 translate-y-[10%] md:translate-y-[15%] right-[-5%] font-display font-black text-[60vw] md:text-[50vw] leading-[0.8] select-none pointer-events-none tracking-tighter opacity-30"
            style={{ 
              color: 'transparent',
              WebkitTextStroke: `1px ${step.color}` // Outlines the number with the vibrant step color
            }}
          >
            {step.num}
          </div>
          
          {/* Foreground Content */}
          <div className="panel-content relative z-10 w-full max-w-screen-xl px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-16 md:gap-24">
            
            {/* Left side: Typography */}
            <div className="flex-1 w-full">
              <div 
                 className="font-mono text-xs md:text-sm uppercase tracking-[0.4em] mb-8 flex items-center gap-4"
                 style={{ color: step.color }}
              >
                <span className="w-12 h-[1px]" style={{ backgroundColor: step.color }} />
                PHASE // {step.num}
              </div>
              
              <h2 className="font-display font-light text-[clamp(2.8rem,5vw,5rem)] md:text-[clamp(3.5rem,6vw,6rem)] leading-[0.95] tracking-tight text-white m-0">
                {step.title.split(' ').map((word, wIdx) => (
                  <span key={wIdx} className="block text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 pb-2">
                    {word}
                  </span>
                ))}
              </h2>
            </div>

            {/* Right side: Description & Detail element */}
            <div className="flex-1 w-full flex flex-col gap-10 md:pt-16">
              <p className="font-body text-lg md:text-2xl font-light text-white/60 leading-[1.7] max-w-lg m-0">
                {step.desc}
              </p>
              
              {/* Cyber/Architectural horizontal rule with dynamic color glow */}
              <div className="w-full max-w-xs h-[1px] bg-white/10 relative overflow-hidden group">
                <div 
                  className="absolute top-0 left-0 h-full w-[25%] group-hover:w-full transition-all duration-700 ease-out" 
                  style={{ backgroundColor: step.color }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-1.5 h-1.5 transition-all duration-700 ease-out group-hover:left-[calc(100%-6px)]"
                  style={{ backgroundColor: step.color, boxShadow: `0 0 10px ${step.color}` }}
                />
              </div>
            </div>

          </div>
        </section>
      ))}
    </main>
  )
}
