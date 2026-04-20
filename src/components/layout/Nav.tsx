'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import MagneticButton from '@/components/ui/MagneticButton'

const links = [
  { href: '/work',     label: 'Work'     },
  { href: '/services', label: 'Services' },
  { href: '/process',  label: 'Process'  },
  { href: '/about',    label: 'About'    },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef     = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathname   = usePathname()

  const { contextSafe } = useGSAP({ scope: navRef })

  const menuTL = useRef<gsap.core.Timeline | null>(null)

  const entranceAnimation = contextSafe(() => {
    // Cinematic glass floating pill entrance
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0, filter: 'blur(10px)', scale: 0.95 },
      { y: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.5, ease: 'power3.out', delay: 0.5 }
    )

    menuTL.current = gsap.timeline({ paused: true })
    menuTL.current
      .set(overlayRef.current, { opacity: 1 })
      // Cinematic "Shutter Blade" / angled slash wipe
      .fromTo(overlayRef.current,
        { clipPath: 'polygon(0% 0%, 0% 0%, -10% 100%, 0% 100%)' },
        { clipPath: 'polygon(0% 0%, 120% 0%, 100% 100%, 0% 100%)', duration: 1.1, ease: 'power4.inOut' }
      )
      // Text pulls in sharply with skew, imitating a fast camera pan
      .fromTo('.mobile-nav-link', 
        { x: -100, skewX: 15, opacity: 0, filter: 'blur(8px)', scale: 1.1 },
        { x: 0, skewX: 0, opacity: 1, filter: 'blur(0px)', scale: 1, stagger: 0.06, duration: 0.9, ease: 'expo.out' }, 
        '-=0.7'
      )
  })

  useEffect(() => {
    window.addEventListener('preloader:complete', entranceAnimation, { once: true })
    return () => window.removeEventListener('preloader:complete', entranceAnimation)
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    menuOpen ? menuTL.current?.reverse() : menuTL.current?.play()
  }

  return (
    <>
      <header className="global-nav-container fixed top-8 left-1/2 -translate-x-1/2 z-[1000] w-[92%] max-w-[1100px] pointer-events-none transition-colors duration-500">
        
        {/* Floating Glass Pill - Nav element (Uses backdrop blur so text isn't lost in high contrast areas) */}
        <div ref={navRef} className="nav-pill relative w-full rounded-full border border-white/20 bg-black/40 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] opacity-0 pointer-events-auto overflow-hidden transition-colors duration-500">
          
          <div className="absolute inset-0 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

          <div className="relative flex items-center justify-between px-8 py-4 sm:px-10">
            {/* Minimalist Wordmark */}
            <Link href="/" className="font-display font-medium tracking-[0.4em] text-white/90 text-sm sm:text-base uppercase z-[11]">
              DARPAN
            </Link>

            {/* Desktop Links */}
            <nav className="hidden lg:flex items-center gap-10 z-[11]">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`font-mono text-xs uppercase tracking-[0.25em] transition-all duration-500 ease-out
                    ${pathname === href ? 'text-white' : 'text-white/40 hover:text-white hover:scale-105 hover:tracking-[0.3em]'}`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA & Menu Group */}
            <div className="flex items-center gap-6 z-[11]">
              <MagneticButton
                href="/contact"
                className="hidden sm:inline-flex items-center justify-center bg-white text-black px-6 py-2.5 rounded-full
                           font-mono text-[0.7rem] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105"
              >
                Get a quote
              </MagneticButton>

              {/* Cinematic Hamburger */}
              <button
                onClick={toggleMenu}
                className="lg:hidden flex flex-col justify-center gap-[4px] w-6 h-6 relative group z-50 mix-blend-difference"
                aria-label="Toggle menu"
              >
                <span className={`block h-[1px] w-full bg-white transition-all duration-500 origin-center ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
                <span className={`block h-[1px] w-full bg-white transition-all duration-300 ${menuOpen ? 'w-0 opacity-0' : 'group-hover:w-3/4'}`} />
                <span className={`block h-[1px] w-full bg-white transition-all duration-500 origin-center ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Aggressive Shutter-Blade cinematic overlay (moved OUTSIDE header to prevent bounding box collapse) */}
      <div
        ref={overlayRef}
        className="fixed top-0 left-0 w-full h-[100svh] bg-[#020202]/98 backdrop-blur-2xl flex flex-col justify-center items-center opacity-0 z-[1001]"
        style={{ clipPath: 'polygon(0% 0%, 0% 0%, -10% 100%, 0% 100%)', pointerEvents: menuOpen ? 'auto' : 'none' }}
      >
        <button 
          onClick={toggleMenu} 
          className="absolute top-12 md:top-14 right-12 text-white/50 font-mono text-[0.65rem] tracking-[0.3em] uppercase hover:text-white transition-colors duration-300"
        >
          [ Close ]
        </button>
        
        <nav className="flex flex-col items-center gap-8 md:gap-10">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={toggleMenu}
              className="mobile-nav-link font-display font-light text-[clamp(3.5rem,8vw,6rem)]
                         text-white/60 hover:text-white uppercase tracking-tighter hover:tracking-normal transition-all duration-700 ease-out"
            >
              {label}
            </Link>
          ))}
          
          <Link
            href="/contact"
            onClick={toggleMenu}
            className="mobile-nav-link mt-8 md:mt-12 text-[#020202] bg-white rounded-full px-12 py-5 font-mono text-[0.7rem] uppercase tracking-[0.3em] font-bold shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all duration-500 hover:shadow-[0_0_80px_rgba(255,255,255,0.6)] hover:scale-105"
          >
            Start a project
          </Link>
        </nav>
      </div>
    </>
  )
}