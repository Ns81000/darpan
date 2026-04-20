'use client'

import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

const content = [
  { id: '01', title: 'NARRATIVE', desc: 'Dismantling chaos into a coherent pulse.', color: '#FF3366' },
  { id: '02', title: 'SPECTRUM', desc: 'Manipulating shadow to dictate mood.', color: '#00D1FF' },
  { id: '03', title: 'RESONANCE', desc: 'Layering atmosphere to construct sound.', color: '#AA00FF' },
  { id: '04', title: 'KINETIC', desc: 'Hyper-stimulating visual circuitry.', color: '#00FF9D' },
]

export default function AboutPage() {
  const containerRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const pinContainerRef = useRef<HTMLDivElement>(null)
  
  const [heroHover, setHeroHover] = useState(false)

  const { contextSafe } = useGSAP({ scope: containerRef })

  // 1. X-Ray Cursor Logic
  useEffect(() => {
    if (!cursorRef.current) return
    const xTo = gsap.quickTo(cursorRef.current, 'left', { duration: 0.15, ease: 'power3.out' })
    const yTo = gsap.quickTo(cursorRef.current, 'top', { duration: 0.15, ease: 'power3.out' })

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    window.addEventListener('mousemove', moveCursor)
    return () => {
      window.removeEventListener('mousemove', moveCursor)
    }
  }, [])

  useGSAP(() => {
    const q = gsap.utils.selector(containerRef)
    
    // Act 1: Hero Text Entry
    const heroTitle = new SplitText(q('.hero-main-txt'), { type: 'words,chars' })
    gsap.from(heroTitle.chars, {
      yPercent: 100,
      opacity: 0,
      stagger: 0.02,
      duration: 1.2,
      ease: 'expo.out',
      delay: 0.2
    })

    gsap.to(q('.hero-sub-txt'), {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power3.out',
      delay: 1.2
    })

    // Act 2: Continuous Immersive Scroll Frame
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinContainerRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1.5,
        snap: {
          snapTo: "labels",
          duration: { min: 0.3, max: 0.8 },
          delay: 0.0,
          ease: 'power2.inOut'
        }
      }
    })

    const introGroup = q('.intro-group')
    const glow = q('.freq-glow')[0]
    const panels = gsap.utils.toArray<HTMLElement>('.freq-panel')

    // Initial setup
    gsap.set('.freq-title', { opacity: 0, scale: 0.85, y: 80 })
    gsap.set('.freq-desc', { opacity: 0, y: 40 })
    
    tl.addLabel('step0')

    // Transition 0 -> 1
    tl.to(introGroup, { 
      scale: 1.5, 
      opacity: 0, 
      duration: 0.8, 
      ease: 'power3.in' 
    }, 'step0')
    
    tl.to(glow, { 
      opacity: 0.35, // Softened the opacity so the glow is atmospheric, not overwhelming
      scale: 1,
      backgroundColor: content[0].color,
      duration: 1, 
      ease: 'power2.inOut' 
    }, 'step0')

    tl.to(panels[0].querySelector('.freq-title'), { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 'step0+=0.3')
    tl.to(panels[0].querySelector('.freq-desc'), { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 'step0+=0.4')
    
    tl.to({}, { duration: 0.3 })
    tl.addLabel('step1')

    // Morph seamlessly through the states
    for (let i = 1; i < panels.length; i++) {
       const prevPanel = panels[i-1]
       const currPanel = panels[i]

       // Push out
       tl.to(prevPanel.querySelector('.freq-title'), { opacity: 0, scale: 1.15, y: -100, duration: 0.6, ease: 'power3.in' }, `step${i}`)
       tl.to(prevPanel.querySelector('.freq-desc'), { opacity: 0, y: -60, duration: 0.6, ease: 'power3.in' }, `step${i}`)

       // Color burn
       tl.to(glow, { backgroundColor: content[i].color, duration: 0.8, ease: 'sine.inOut' }, `step${i}+=0.2`)

       // Pull in
       tl.to(currPanel.querySelector('.freq-title'), { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power3.out' }, `step${i}+=0.4`)
       tl.to(currPanel.querySelector('.freq-desc'), { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, `step${i}+=0.5`)

       tl.to({}, { duration: 0.3 })
       tl.addLabel(`step${i+1}`)
    }

    return () => {
      heroTitle.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, { scope: containerRef })

  return (
    <main ref={containerRef} className="relative w-full text-white bg-[#030303] selection:bg-white selection:text-black">
      
      {/* Universal Noise */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* THE X-RAY CURSOR */}
      <div 
        ref={cursorRef} 
        className={`fixed w-6 h-6 bg-white rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${heroHover ? 'scale-[25]' : 'scale-0'}`}
      />

      <div className="relative z-10 w-full overflow-hidden">
        {/* --- ACT 1: HERO --- */}
        <section 
           className="relative w-full h-screen flex flex-col justify-center items-center px-6 md:px-16"
           onMouseEnter={() => setHeroHover(true)}
           onMouseLeave={() => setHeroHover(false)}
        >
          <div className="overflow-hidden">
            <h1 className="hero-main-txt font-display font-light text-white uppercase leading-[0.8] tracking-tighter mix-blend-difference text-center" style={{ fontSize: 'clamp(4.5rem, 14vw, 15rem)' }}>
              The Invisible
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="hero-main-txt font-display font-light text-white uppercase leading-[0.8] tracking-tighter mix-blend-difference text-center" style={{ fontSize: 'clamp(4.5rem, 14vw, 15rem)' }}>
              Architects.
            </h1>
          </div>
          <p className="hero-sub-txt font-mono text-white/50 tracking-[0.4em] uppercase text-xs md:text-sm mt-16 opacity-0 translate-y-4 mix-blend-difference pb-[10vh]">
            We Engineer Momentum
          </p>
          
          <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-50 mix-blend-difference">
            <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase">Enter The Construct</span>
            <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
          </div>
        </section>

        {/* --- ACT 2: CONTINUOUS IMMERSIVE SEQUENCE --- */}
        <section ref={pinContainerRef} className="relative w-full h-screen bg-[#030303] overflow-hidden flex items-center justify-center">
          
          {/* Light Grid */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
             <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_10%,transparent_80%)]" />
          </div>

          <div 
             className="freq-glow absolute top-1/2 left-1/2 w-[150vw] h-[150vw] md:w-[120vw] md:h-[120vw] -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none"
             style={{ 
               backgroundColor: '#030303',
               WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 65%)',
               maskImage: 'radial-gradient(circle at center, black 0%, transparent 65%)',
               transform: 'translate(-50%, -50%) scale(0.1)',
               filter: 'blur(60px)' // Heavily blurs the orb so it acts as volumetric light
             }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center w-full max-w-[1400px] mx-auto z-10 perspective-[1000px]">
             
             {/* Abstract Psychological Intro */}
             <div className="intro-group absolute flex flex-col items-center justify-center w-full pointer-events-none gap-8">
                <span className="font-mono tracking-[0.6em] text-[0.65rem] text-white/30 uppercase border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
                   Cognitive Override
                </span>
                <div className="flex flex-col items-center mix-blend-difference">
                   <h2 className="font-display font-light text-white text-[clamp(2rem,5vw,4.5rem)] uppercase tracking-tighter leading-[1.1]">
                      We do not just edit.
                   </h2>
                   <h2 className="font-display font-light text-white/60 text-[clamp(2rem,5vw,4.5rem)] uppercase tracking-tighter leading-[1.1] italic">
                      We perform surgery
                   </h2>
                   <h2 className="font-display font-light text-white text-[clamp(2rem,5vw,4.5rem)] uppercase tracking-tighter leading-[1.1]">
                      on the subconscious.
                   </h2>
                </div>
             </div>

             {/* Dynamic Frequencies with Crisp Pure Text (Removed mix-blend from here) */}
             {content.map((item, i) => (
                <div key={item.id} className="freq-panel absolute flex flex-col items-center justify-center w-full h-full pointer-events-none">
                   <div className="relative z-10 flex flex-col items-center px-4 w-full">
                      <h3 
                        className="freq-title font-display font-light text-white uppercase tracking-tighter m-0 drop-shadow-2xl" 
                        style={{ fontSize: 'clamp(3.5rem, 13vw, 15rem)', lineHeight: '0.85' }}
                      >
                        {item.title}
                      </h3>
                      <p className="freq-desc font-mono text-white/80 tracking-[0.3em] md:tracking-[0.5em] uppercase text-[0.65rem] md:text-sm mt-8 md:mt-12 font-bold max-w-xl text-center drop-shadow-lg">
                        {item.desc}
                      </p>
                   </div>
                </div>
             ))}

          </div>
        </section>

      </div>
    </main>
  )
}
