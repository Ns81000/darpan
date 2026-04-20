'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const timecodeRef  = useRef<HTMLSpanElement>(null)
  const brandRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (containerRef.current) containerRef.current.style.display = 'none'
        window.dispatchEvent(new Event('preloader:complete'))
      }
    })

    // Fluid orbs background animation
    gsap.to('.fluid-orb-1', {
      x: '20vw', y: '20vh', duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1
    })
    gsap.to('.fluid-orb-2', {
      x: '-20vw', y: '-10vh', duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1
    })

    // Timecode counter format: HH:MM:SS:FF
    const dummy = { frame: 0 }
    tl.to(dummy, {
      frame: 100,
      duration: 3,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (!timecodeRef.current) return;
        const f = Math.floor(dummy.frame);
        const seconds = Math.floor(f / 24).toString().padStart(2, '0');
        const frames = (f % 24).toString().padStart(2, '0');
        timecodeRef.current.innerText = `00:00:${seconds}:${frames}`;
      }
    })
    
    // Brand soft cinematic reveal
    .fromTo('.brand-char', 
      { opacity: 0, y: 40, filter: 'blur(20px)', scale: 0.95 }, 
      { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 1.5, stagger: 0.15, ease: 'power3.out' },
      '-=2.5'
    )
    
    // Smooth cinematic exit
    .to('.preloader-content', { opacity: 0, scale: 1.05, filter: 'blur(10px)', duration: 0.8, ease: 'power2.inOut' }, '+=0.2')
    .to(containerRef.current, { 
      yPercent: -100, 
      duration: 1.2, 
      ease: 'expo.inOut' 
    }, '-=0.4')
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Fluid Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="fluid-orb-1 absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-white/5 blur-[120px] mix-blend-screen" />
        <div className="fluid-orb-2 absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-white/5 blur-[100px] mix-blend-screen" />
      </div>

      {/* Grid overlay for a subtle technical feel */}
      <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Content */}
      <div className="preloader-content relative flex flex-col items-center justify-center w-full h-full">
        
        {/* REC Indicator */}
        <div className="absolute top-8 left-8 font-mono text-[0.75rem] tracking-[0.2em] text-white/50">
          REC <span className="animate-pulse text-white/80">●</span>
        </div>
        
        {/* Timecode (Neutral color instead of purple) */}
        <div className="absolute justify-center bottom-8 font-mono text-[0.875rem] tracking-[0.3em] text-white/40">
          <span ref={timecodeRef}>00:00:00:00</span>
        </div>

        {/* Brand Cinematic Text */}
        <div ref={brandRef} className="relative flex items-center justify-center gap-2 overflow-hidden px-4">
          {['D', 'A', 'R', 'P', 'A', 'N'].map((char, i) => (
            <span key={i} className="brand-char font-display font-light text-[clamp(2.5rem,7vw,7rem)] tracking-widest text-white/90 leading-none">
              {char}
            </span>
          ))}
        </div>
        
        {/* Elegant crosshair */ }
        <div className="absolute w-[1px] h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute h-[1px] w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  )
}