'use client'

import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitReveal from '@/components/ui/SplitReveal'
import { projects } from '@/lib/data/work'
import Image from 'next/image'
import { FastAverageColor } from 'fast-average-color'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function WorkPage() {
  const containerRef = useRef<HTMLElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLDivElement>(null)
  
  const [, setActiveProject] = useState<number | null>(null)
  const [bgColor, setBgColor] = useState<string>('#0a0a0a')
  const [dominantColors, setDominantColors] = useState<Record<number, string>>({})

  const { contextSafe } = useGSAP({ scope: containerRef })

  // Extract dominant colors asynchronously
  useEffect(() => {
    const fac = new FastAverageColor()
    projects.forEach(p => {
      fac.getColorAsync(p.thumb, { algorithm: 'dominant', crossOrigin: 'anonymous' })
        .then(color => {
          // Darken the dominant color slightly for better contrast on text
          setDominantColors(prev => ({ ...prev, [p.id]: color.hex }))
        })
        .catch(err => {
          console.warn('Failed to extract color for:', p.thumb, err)
        })
    })
    return () => fac.destroy()
  }, [])

  // Floating Image Cursor Logic
  useEffect(() => {
    if (!floatingRef.current) return
    
    // Use x/y instead of left/top for compositor-only animation (huge performance boost)
    gsap.set(floatingRef.current, { xPercent: -50, yPercent: -50 })
    const xTo = gsap.quickTo(floatingRef.current, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(floatingRef.current, 'y', { duration: 0.6, ease: 'power3.out' })

    const moveImage = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    window.addEventListener('mousemove', moveImage, { passive: true })
    return () => window.removeEventListener('mousemove', moveImage)
  }, [])

  // Reveal animations for rows (appear all at once)
  useGSAP(() => {
    const rows = gsap.utils.toArray('.work-row');
    gsap.fromTo(rows, 
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0,
        delay: 0,
        overwrite: 'auto'
      }
    )
  }, { scope: containerRef })

  const handleEnter = contextSafe((index: number, color: string) => {
    setActiveProject(index)
    setBgColor(color)

    // Reveal floating container
    gsap.to(floatingRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
      rotate: Math.random() * 10 - 5, // Slight random rotation for organic feel
      overwrite: 'auto'
    })

    // Shift internal images container like a slot machine vertical slide
    gsap.to(imagesRef.current, {
      yPercent: -100 * index,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto'
    })
  })

  const handleLeave = contextSafe(() => {
    setActiveProject(null)
    setBgColor('#0a0a0a')

    // Hide floating container
    gsap.to(floatingRef.current, {
      scale: 0.4,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      rotate: 0,
      overwrite: 'auto'
    })
  })

  return (
    <main 
      ref={containerRef}
      className="relative min-h-screen text-white pt-32 pb-20 bg-[#080808] overflow-hidden"
    >
      
      {/* Darkened Tint Overlay for extracted colors so the white text never fades entirely */}
      <div 
        className="fixed inset-0 pointer-events-none transition-colors duration-1000 ease-in-out opacity-[0.25] z-0" 
        style={{ backgroundColor: bgColor }} 
      />

      {/* Custom Floating Image Container (Desktop Only, hidden on mobile via CSS) */}
      <div 
        ref={floatingRef}
        className="hidden md:block fixed top-0 left-0 w-[480px] h-[270px] pointer-events-none z-50 overflow-hidden rounded-xl shadow-2xl border border-white/10 scale-0 opacity-0"
      >
        <div ref={imagesRef} className="w-full h-full relative will-change-transform">
          {projects.map((p) => (
            <div key={p.id} className="relative w-full h-[270px]">
              <Image src={p.thumb} alt={p.title} fill className="object-cover" priority />
            </div>
          ))}
        </div>
      </div>

      {/* Ambilight radial glow background fixed */}
      <div className="fixed inset-0 z-0 pointer-events-none mix-blend-screen opacity-[0.35] transition-colors duration-1000" style={{ backgroundColor: bgColor, filter: 'blur(160px)' }} />

      {/* Vignette to ensure text readability around edges and headers */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

      <section className="px-[clamp(1.5rem,6vw,6rem)] relative z-10">
        <div className="mb-20 overflow-hidden">
          <SplitReveal as="h1" className="font-display font-light uppercase tracking-tighter text-[clamp(4.5rem,12vw,12rem)] leading-[0.8] text-white mix-blend-difference">
            Selected Works
          </SplitReveal>
        </div>

        <div 
          className="border-t border-white/20 mt-12 relative z-20"
          onMouseLeave={handleLeave}
        >
          {projects.map((p, i) => {
            // Use dynamically extracted dominant color if available, fallback to the hardcoded brand color
            const projectColor = dominantColors[p.id] || p.color

            return (
              <div 
                key={p.id}
                className="work-row group relative border-b border-white/20 py-10 md:py-16 flex flex-col md:flex-row md:items-center justify-between cursor-pointer overflow-hidden transition-all duration-500 hover:bg-white/5"
                onMouseEnter={() => handleEnter(i, projectColor)}
                onMouseLeave={handleLeave}
              >
                {/* Massive marquee-like text that subtly shifts right on hover */}
              <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between px-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-8">
                <h2 className="font-display font-light text-[clamp(3rem,8vw,7rem)] uppercase leading-[0.85] tracking-tight mix-blend-difference text-white">
                  {p.title}
                </h2>
                <div className="mt-4 md:mt-0 flex items-center gap-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase">{p.category}</span>
                  <span className="text-xl md:text-3xl font-light transform group-hover:translate-x-4 transition-transform duration-500 ease-out">&#8594;</span>
                </div>
              </div>
              
              {/* Mobile Image inline fallback since floating is hidden */}
              <div className="md:hidden w-full aspect-video relative mt-6 rounded-md overflow-hidden opacity-0 h-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-700">
                 <Image src={p.thumb} alt={p.title} fill className="object-cover" />
              </div>
            </div>
            )
          })}
        </div>
      </section>

    </main>
  )
}
