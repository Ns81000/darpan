'use client'

import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null)
  
  // Fluid Orbs
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const orb3Ref = useRef<HTMLDivElement>(null)
  const orb4Ref = useRef<HTMLDivElement>(null)

  const animatedRef = useRef(false)
  const splitRef = useRef<SplitType | null>(null)

  const { contextSafe } = useGSAP({ scope: sectionRef })

  const startAnimation = contextSafe(() => {
    if (animatedRef.current) return
    animatedRef.current = true

    // New elegant SplitType setup - scoped to prevent stale DOM nodes fetching
    const words = sectionRef.current ? Array.from(sectionRef.current.querySelectorAll('.hero-word')) : '.hero-word'
    const text = new SplitType(words as any, { types: 'chars' })
    splitRef.current = text

    const tl = gsap.timeline()

    // Initial state: letters are hidden below their mask (requires overflow hidden on the letters' wrapper)
    gsap.set(text.chars, { 
      y: '120%', 
      opacity: 0,
      rotateX: -45,
      transformOrigin: '50% 100%'
    })

    // Now that SplitType children are hidden, immediately unhide the parent containers to eliminate FOUC visually
    gsap.set('.hero-word', { opacity: 1 })

    gsap.set(['.hud-el', '.hero-float'], { opacity: 0, y: 20 })

    // Fluid liquid-obsidian background orbs
    gsap.to(orb1Ref.current, { rotate: 360, scale: 1.2, duration: 25, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to(orb2Ref.current, { rotate: -360, scale: 1.4, duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to(orb3Ref.current, { x: '10vw', y: '10vh', rotate: 180, scale: 1.5, duration: 18, repeat: -1, yoyo: true, ease: 'power2.inOut' })
    gsap.to(orb4Ref.current, { x: '-15vw', y: '-15vh', rotate: -180, scale: 1.8, duration: 22, repeat: -1, yoyo: true, ease: 'power1.inOut' })

    // Reset scroll trigger position forcibly for client routing
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();

    // 1. Elegant Mask Reveal Animation (Smooth & Controlled)
    tl.to(text.chars, {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      stagger: {
        amount: 1.2,
        from: 'start', // Left to right reveal
        ease: 'power3.out'
      },
      duration: 1.8,
      ease: 'expo.out',
      delay: 0.1
    })
    .set('.hero-text-row', { clipPath: 'none' }) // Clear the mask so parallax doesn't clip them later
    .to(['.hud-el', '.hero-float'], {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 1.5, 
      ease: 'power3.out',
      onComplete: () => {
        // init parallax ScrollTriggers safely after intro animation is completed
        // preventing them from measuring wrong window scroll offsets instantly.
        gsap.to('.hero-text-row', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          },
          y: (index) => (index + 1) * -50,
          opacity: 0,
          stagger: 0.05
        })

        gsap.to('.hero-float, .hud-el', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          },
          y: -100
        })
        ScrollTrigger.refresh()
      }
    }, '-=1.0')
  })

  useEffect(() => {
    let fallbackTimer: NodeJS.Timeout
    const transitionHandler = () => {
      clearTimeout(fallbackTimer)
      setTimeout(startAnimation, 100)
    }

    // @ts-ignore
    if (!window.__PRELOADER_COMPLETE__) {
      window.addEventListener('preloader:complete', startAnimation, { once: true })
    } else {
      const fallbackTimer = setTimeout(startAnimation, 300)
      return () => {
        clearTimeout(fallbackTimer)
        if (splitRef.current) splitRef.current.revert()
      }
    }

    return () => {
      window.removeEventListener('preloader:complete', startAnimation)
      if (splitRef.current) splitRef.current.revert()
    }
  }, [])

  // QuickTo instances for 60fps mouse parallax
  const xFloat = useRef<Function>()
  const yFloat = useRef<Function>()
  const xHud = useRef<Function>()
  const yHud = useRef<Function>()

  useGSAP(() => {
    xFloat.current = gsap.quickTo('.hero-float', 'x', { duration: 1.8, ease: 'power2.out' })
    yFloat.current = gsap.quickTo('.hero-float', 'y', { duration: 1.8, ease: 'power2.out' })
    xHud.current = gsap.quickTo('.hud-el', 'x', { duration: 0.5, ease: 'power4.out' })
    yHud.current = gsap.quickTo('.hud-el', 'y', { duration: 0.5, ease: 'power4.out' })
  }, { scope: sectionRef })

  // Deep Layered Parallax Physics
  const handleMouseMove = contextSafe((e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const dx = (clientX - cx) / cx
    const dy = (clientY - cy) / cy

    // Animate words directly since quickTo doesn't support dynamic functions like (i) => ...
    gsap.to('.hero-word', {
      x: (i) => (i + 1) * dx * -15,
      y: (i) => (i + 1) * dy * -8,
      duration: 1.2,
      ease: 'power3.out',
      overwrite: 'auto'
    })
    
    if (xFloat.current) xFloat.current(dx * 30)
    if (yFloat.current) yFloat.current(dy * 30)
    
    if (xHud.current) xHud.current(dx * -10)
    if (yHud.current) yHud.current(dy * -10)
  })

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-x-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* 
        Monochrome Fluid Background Layer
        Replaces the neon colors with incredibly deep, subtle obsidian/silver gradients locking the visual continuity with the pitch-black preloader.
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deep base color - true black */}
        <div className="absolute inset-0 bg-[#000000]" />
        
        {/* Dynamic Dark Orbs (Obsidian/Silver) */}
        <div 
          ref={orb1Ref} 
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen opacity-10 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)' }}
        />
        <div 
          ref={orb2Ref} 
          className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen opacity-5 blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgba(200,200,200,0.5) 0%, transparent 70%)' }}
        />
        <div 
          ref={orb3Ref} 
          className="absolute top-[20%] left-[30%] w-[50vw] h-[50vw] rounded-full mix-blend-screen opacity-5 blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
        />
        <div 
          ref={orb4Ref} 
          className="absolute bottom-[30%] left-[10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen opacity-[0.03] blur-[150px]"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
        />
        
        {/* High-end grain overlay to make the fluid look cinematic and textured */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* Cinematic Viewfinder HUD Overlays to completely fill outer empty edges */}
      <div className="absolute inset-4 md:inset-8 border-[1px] border-white/5 pointer-events-none z-10 flex flex-col justify-between p-4 mix-blend-difference">
        <div className="flex justify-between font-mono text-[9px] md:text-xs text-white/50 tracking-widest uppercase">
          <span className="hud-el opacity-0">REC ⦿ 00:00:24:12</span>
          <span className="hud-el opacity-0 hidden sm:block">ISO 800 // 24FPS</span>
        </div>
        
        <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 flex flex-col gap-6 font-mono text-[9px] text-white/40 hidden sm:flex">
          <span className="hud-el opacity-0 rotate-[-90deg] origin-left whitespace-nowrap tracking-widest">[ CH-1 ]</span>
          <span className="hud-el opacity-0 rotate-[-90deg] origin-left whitespace-nowrap tracking-widest">[ CH-2 ]</span>
        </div>

        <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 flex-col items-center gap-2 hidden sm:flex">
          <div className="w-[1px] h-10 bg-white/20 hud-el opacity-0" />
          <div className="w-[2px] h-4 bg-white/60 hud-el opacity-0" />
          <div className="w-[1px] h-10 bg-white/20 hud-el opacity-0" />
        </div>

        <div className="flex justify-between font-mono text-[9px] md:text-xs text-white/50 tracking-widest items-end uppercase">
          <span className="hud-el opacity-0">F 2.8 \\ 4K</span>
          <span className="hud-el opacity-0">DARPAN.STUDIOS</span>
        </div>
      </div>

      {/* Main Sprawling Kinetic Typography Grid - Eliminates Empty Space */}
      <div className="relative z-20 w-full min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-12 pt-32 lg:pt-40 pb-20 pointer-events-auto mix-blend-plus-lighter max-w-[1600px] mx-auto overflow-hidden">
        
        {/* ROW 1: Pulls Left */}
        <div className="hero-text-row w-full flex justify-start" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 150%, 0 150%)' }}>
          <h1 className="hero-word opacity-0 text-[clamp(2.5rem,10vw,11.5rem)] font-display uppercase leading-[0.85] tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            MASTERING
          </h1>
        </div>

        {/* ROW 2: Pulls Right */}
        <div className="hero-text-row w-full flex justify-end mt-1 md:mt-1" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 150%, 0 150%)' }}>
          <h1 className="hero-word opacity-0 text-[clamp(3rem,13vw,14.5rem)] font-display uppercase leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 pr-0 md:pr-12 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            THE
          </h1>
        </div>

        {/* ROW 3: Checks Center */}
        <div className="hero-text-row w-full flex justify-start md:justify-center mt-1 md:mt-2" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 150%, 0 150%)' }}>
          <h1 className="hero-word opacity-0 text-[clamp(2.5rem,12vw,13.5rem)] font-display uppercase leading-[0.85] tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            CINEMATIC
          </h1>
        </div>

        {/* ROW 4: Pulls Right */}
        <div className="hero-text-row w-full flex justify-end mt-1 md:mt-1" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 150%, 0 150%)' }}>
          <h1 className="hero-word opacity-0 text-[clamp(2.5rem,10vw,12rem)] font-display uppercase leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 italic drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            FRAME.
          </h1>
        </div>

        {/* Floating Subtext Blocks to fill negative horizontal/vertical space */}
        <div className="hero-float opacity-0 absolute top-[28%] right-[8%] md:right-[15%] max-w-[180px] md:max-w-[220px] text-right pointer-events-none hidden lg:block">
          <p className="font-mono text-[0.6rem] md:text-[0.65rem] text-white/50 uppercase tracking-[0.25em] leading-[2]">
            Precision cutting.<br/> Color grading.<br/> Visual fx.
          </p>
        </div>
        
        <div className="hero-float opacity-0 absolute bottom-[18%] left-[8%] md:left-[10%] max-w-[220px] md:max-w-[260px] pointer-events-none hidden sm:block">
          <p className="font-mono text-[0.6rem] md:text-[0.65rem] text-white/50 uppercase tracking-[0.25em] leading-[2] border-l border-white/20 pl-4 py-1">
            Building cinematic <br/> architectures tailored <br/> for modern screens.
          </p>
        </div>

      </div>
    </section>
  )
}