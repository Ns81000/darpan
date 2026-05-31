'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const stats = [
  { value: 500,  suffix: '+',  label: 'NARRATIVES ENGINEERED' },
  { value: 100,  suffix: '%',  label: 'FRAME SYNCHRONIZATION' },
  { value: 50,   suffix: 'M+', label: 'NEURAL IMPRESSIONS' },
]

export default function SocialProof() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    // Master timeline mapped directly to the scrollbar for an immersive 3D dive
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%', // Pin the screen for 1.5x its height
        pin: true,
        scrub: 1, // Smoothly lock animation progress to scroll wheel
      }
    })

    // STEP 1: Words split apart vertically like an opening shutter
    tl.to('.word-top', {
      yPercent: -150,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.inOut',
    }, 0)
    .to('.word-bottom', {
      yPercent: 150,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.inOut',
    }, 0)

    // STEP 2: The HUD grid elegantly scales in from the center void
    .fromTo('.telemetry-grid', {
      scale: 0.8,
      opacity: 0,
    }, {
      scale: 1,
      opacity: 1,
      duration: 1.5,
      ease: 'power3.out',
    }, '-=1.0') // Overlap the reveal

    // Cinematic decoding numbers linked to the scroll progress
    const cards = gsap.utils.toArray<HTMLElement>('.stat-card')
    cards.forEach((card) => {
      const targetElement = card.querySelector('.kinetic-stat') as HTMLElement
      const targetValue = parseInt(targetElement.dataset.target || '0', 10)
      const obj = { val: 0 }
      
      // Smooth deterministic counting tied to the scroll position without random flashes
      tl.to(obj, {
        val: targetValue,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          // Simply render the floor of the value for buttery smooth counting forwards AND backwards
          targetElement.textContent = Math.floor(obj.val).toString()
        },
      }, '-=1.5') // Animate simultaneously with the grid scale up
    })

  }, { scope: containerRef })

  return (
    <div className="relative w-full">
      <section 
        ref={containerRef} 
        className="relative h-screen w-full bg-black border-t border-white/5 overflow-hidden flex items-center justify-center font-sans tracking-tight"
      >
        
        {/* Immersive Background Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[20%] left-[20%] w-[30vw] h-[30vw] bg-white rounded-full mix-blend-screen blur-[150px]" />
          <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="absolute top-0 bottom-0 right-1/3 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        </div>

        {/* Layer 1: Immense Short Philosophical Text (Elegant parallax split) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 overflow-hidden">
        <h2 className="font-display text-[clamp(4rem,10vw,12rem)] text-white uppercase tracking-tighter leading-[0.85] text-center mix-blend-difference will-change-transform">
          <div className="word-top block transform-gpu">ARCHITECT</div>
          <div className="word-bottom block text-transparent transform-gpu" style={{ WebkitTextStroke: '2px rgba(255,255,255,1)' }}>PERCEPTION.</div>
        </h2>
      </div>

      {/* Layer 2: Telemetry Data Grid (Scales up from center) */}
      <div className="telemetry-grid relative z-10 w-full max-w-7xl px-4 md:px-12 flex flex-col gap-12 will-change-transform">
          <div className="flex items-center justify-center gap-4 text-white/50 mb-8">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="font-mono text-xs tracking-[0.4em] uppercase">System Telemetry // Metrics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border-y border-white/10 relative">
            {stats.map(({ value, suffix, label }, i) => (
              <div key={label} className="stat-card flex flex-col bg-black/80 backdrop-blur-md p-10 md:p-14 relative overflow-hidden group transition-all duration-500 hover:bg-black">
                
                <span className="font-mono text-[10px] text-white/30 tracking-[0.3em] mb-12 block">
                  [ PROTOCOL.0{i+1} ]
                </span>
                
                <div className="flex items-baseline gap-1 mt-auto">
                  <span 
                    className="kinetic-stat font-display text-[clamp(4rem,7vw,8rem)] text-white font-light tracking-tighter leading-none"
                    data-target={value}
                  >
                    0
                  </span>
                  <span className="font-display text-[clamp(2.5rem,4vw,5rem)] text-white/40 leading-none">{suffix}</span>
                </div>
                
                <span className="font-mono text-xs tracking-[0.2em] text-white/60 mt-4 uppercase border-t border-white/10 pt-4">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  )
}