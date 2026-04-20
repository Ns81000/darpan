'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const services = [
  { 
    id: '01',
    title: 'SHORT-FORM',
    desc: 'Reels, Shorts, TikToks engineered for maximum retention. We analyze the curve, cut the fat, and hook the viewer in the first 3 seconds.',
    color1: '#ff2a00',
    color2: '#ff8a00'
  },
  { 
    id: '02',
    title: 'LONG-FORM',
    desc: 'YouTube docs and narrative essays that keep viewers watching intro to outro. Deep pacing, advanced sound design, cinematic color grading.',
    color1: '#0055ff',
    color2: '#00e5ff'
  },
  { 
    id: '03',
    title: 'COMMERCIAL',
    desc: 'Ad cuts and brand content that converts viewers into believers. High-end mastering tailored specifically for modern brand storytelling.',
    color1: '#ffffff',
    color2: '#555555'
  },
]

export default function ServicesSnapshot() {
  const containerRef = useRef<HTMLElement>(null)
  
  useGSAP(() => {
    const panels = gsap.utils.toArray('.service-panel') as HTMLElement[]
    
    // Create a pinning timeline that tracks the entire sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${panels.length * 100}%`,
        pin: true,
        scrub: 1, // Reduced scrub delay for tighter control
        snap: {
          snapTo: 1 / (panels.length - 1),
          duration: 0.5,
          delay: 0, // Starts snapping immediately
          ease: 'power3.inOut',
          // @ts-ignore
          directional: true // Forces the snap to strictly go to the next/prev card even on tiny scrolls
        }
      }
    })

    // Stagger the panels sliding up from the bottom like a shutter
    panels.forEach((panel, i) => {
      if (i === 0) return // First panel is already there, but hidden under title, let's bring it up
      
      tl.fromTo(panel, {
        yPercent: 100
      }, {
        yPercent: 0,
        duration: 1,
        ease: 'power2.inOut',
      }, `-=0.2`) // slight overlap
      
      // Scale down previous panel for depth effect
      if (i > 0) {
        tl.to(panels[i - 1], {
          scale: 0.95,
          filter: 'blur(10px)',
          opacity: 0.5,
          duration: 1,
          ease: 'power2.inOut'
        }, `<`)
      }
    })

    // Parallax the abstract background elements inside the panels
    panels.forEach((panel) => {
      const bgs = panel.querySelectorAll('.abstract-orb')
      bgs.forEach((bg, index) => {
        gsap.fromTo(bg, {
          yPercent: index === 0 ? 30 : -30,
          scale: 1.2
        }, {
          yPercent: index === 0 ? -30 : 30,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        })
      })

      // Animate the HUD rings continuously
      gsap.to(panel.querySelectorAll('.abstract-ring'), {
        rotate: 360,
        duration: 40,
        repeat: -1,
        ease: 'none'
      })
      gsap.to(panel.querySelectorAll('.abstract-ring-reverse'), {
        rotate: -360,
        duration: 30,
        repeat: -1,
        ease: 'none'
      })
    })

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">

      <div className="absolute inset-0 w-full h-full pt-[10vh] px-4 md:px-12 pb-4">
        {services.map((svc, i) => (
          <div 
            key={svc.id} 
            className="service-panel absolute top-0 left-0 w-full h-full flex flex-col justify-end pb-[10vh] px-4 md:px-[10vw]"
            style={{ zIndex: i + 1 }} // stack them properly but keep lower than Nav
          >
            <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden rounded-3xl border border-white/20 bg-black shadow-[0_0_40px_rgba(255,255,255,0.08)] hover:shadow-[0_0_80px_rgba(255,255,255,0.15)] hover:border-white/40 transition-all duration-700 group">

              {/* Abstract Animated CSS Background */}
              <div className="absolute inset-0 w-full h-full bg-black overflow-hidden pointer-events-none">
                <div 
                  className="abstract-orb absolute top-[10%] left-[10%] w-[150vw] h-[150vw] md:w-[60vw] md:h-[60vw] rounded-full mix-blend-screen filter blur-[100px] md:blur-[130px] opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                  style={{ background: `radial-gradient(circle, ${svc.color1} 0%, transparent 70%)` }}
                />
                <div 
                  className="abstract-orb absolute bottom-[10%] right-[10%] w-[120vw] h-[120vw] md:w-[50vw] md:h-[50vw] rounded-full mix-blend-screen filter blur-[80px] md:blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"
                  style={{ background: `radial-gradient(circle, ${svc.color2} 0%, transparent 70%)` }}
                />
                {/* Deep vignette to keep text readable */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
              </div>

              {/* Noise Overlay */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

              {/* HUD / Telemetry Layers */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                {/* Giant Parallax Number */}
                <div className="giant-number absolute z-0 flex items-center justify-center transform-gpu">
                  <span 
                    className="font-display text-[60vw] md:text-[40vw] text-transparent leading-none select-none mix-blend-overlay opacity-30"
                    style={{ WebkitTextStroke: '2px rgba(255,255,255,0.4)' }}
                  >
                    {svc.id}
                  </span>
                </div>

                {/* Rotating Focus Rings */}
                <div className="abstract-ring absolute z-10 w-[200px] h-[200px] md:w-[400px] md:h-[400px] border-[1px] border-white/20 rounded-full border-dashed mix-blend-screen opacity-50" />
                <div className="abstract-ring-reverse absolute z-10 w-[160px] h-[160px] md:w-[320px] md:h-[320px] border-[1px] border-white/10 rounded-full border-dotted mix-blend-screen opacity-40" />
                
                {/* Crosshairs & Center Dot */}
                <div className="absolute z-10 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute z-10 h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                <div className="absolute z-20 w-[4px] h-[4px] bg-white rounded-full opacity-80 shadow-[0_0_15px_2px_rgba(255,255,255,1)]" />
              </div>
              
              {/* Content Box */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
                <div className="flex-1 max-w-3xl">
                  <div className="flex items-center gap-6 mb-4 md:mb-6 opacity-80">
                    <span className="font-mono text-xs tracking-widest text-white/60">[{svc.id}]</span>
                    <div className="h-[1px] flex-1 bg-white/20" />
                  </div>
                  <h3 className="font-display text-[clamp(2.5rem,6vw,6rem)] text-white uppercase leading-[0.85] tracking-tighter">
                    {svc.title}
                  </h3>
                </div>
                <div className="md:w-1/3 text-left md:text-right">
                  <p className="font-body text-sm md:text-base text-white/70 leading-relaxed font-light">
                    {svc.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}