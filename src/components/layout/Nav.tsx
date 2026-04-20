'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '@/components/ui/MagneticButton'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
}

const links = [
  { href: '/work',     label: 'Work'     },
  { href: '/services', label: 'Services' },
  { href: '/process',  label: 'Process'  },
  { href: '/pricing',  label: 'Pricing'  },
  { href: '/about',    label: 'About'    },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuOpenRef = useRef(false) // Track for GSAP callbacks without stale closures
  
  const headerRef  = useRef<HTMLElement>(null)
  const navRef     = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathname   = usePathname()

  const { contextSafe } = useGSAP({ scope: headerRef })

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

  // Dynamic Scroll Response for Nav Pill - Beautiful Collapse
  useGSAP(() => {
    let lastDirection = 0;
    
    // Create a 3D perspective context on the header to allow 3D fold on the nav
    gsap.set(headerRef.current, { perspective: 1000 });
    gsap.set(navRef.current, { transformOrigin: "top center" });

    ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        // If the mobile menu overlay is active, keep the nav pill fully visible
        if (menuOpenRef.current) return;

        const currentScrollY = self.scrollY;
        
        // Activate "Collapse" threshold
        if (currentScrollY > 120) {
          // Scrolling Down -> Elegantly hide, folding slightly away
          if (self.direction === 1 && lastDirection !== 1) {
            gsap.to(navRef.current, {
              yPercent: -120, // Slide completely out of view bounds
              rotateX: 15,    // Subtle 3D fold back
              scale: 0.95,    // Shrink back into depth
              opacity: 0,     // Fade out
              duration: 0.6,
              ease: 'power3.inOut',
              overwrite: 'auto'
            });
            lastDirection = 1;
          } 
          // Scrolling Up -> Snap back with a premium spring-like release
          else if (self.direction === -1 && lastDirection !== -1) {
            gsap.to(navRef.current, {
              yPercent: 0,
              rotateX: 0,
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: 'expo.out',
              overwrite: 'auto'
            });
            lastDirection = -1;
          }
        } 
        // Reached Absolute Top (Hero territory)
        else if (currentScrollY <= 120 && lastDirection !== 0) {
          gsap.to(navRef.current, {
            yPercent: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            maxWidth: 1100, // Reset width
            duration: 0.8,
            ease: 'expo.out',
            overwrite: 'auto'
          });
          lastDirection = 0;
        }

        // The "Breathing" Effect -> Pill compresses width slightly on fast down-scroll
        const velocity = Math.abs(self.getVelocity());
        if (velocity > 50 && currentScrollY > 150 && self.direction === 1 && !menuOpenRef.current) {
             gsap.to(navRef.current, {
                 maxWidth: Math.max(900, 1100 - velocity * 0.15),
                 duration: 0.4,
                 ease: 'power2.out',
                 overwrite: 'auto'
             });
        } else if ((self.direction === -1 || currentScrollY <= 150) && !menuOpenRef.current) {
             gsap.to(navRef.current, {
                 maxWidth: 1100,
                 duration: 0.8,
                 ease: 'expo.out',
                 overwrite: 'auto'
             });
        }

      }
    });

  }, { scope: headerRef }) // Only runs setup once

  useEffect(() => {
    window.addEventListener('preloader:complete', entranceAnimation, { once: true })
    return () => window.removeEventListener('preloader:complete', entranceAnimation)
  }, [])

  const toggleMenu = () => {
    const newState = !menuOpen
    setMenuOpen(newState)
    menuOpenRef.current = newState
    newState ? menuTL.current?.play() : menuTL.current?.reverse()
  }

  return (
    <>
      <header ref={headerRef} className="global-nav-container fixed top-8 left-1/2 -translate-x-1/2 z-[1000] w-[92%] max-w-[1100px] pointer-events-none">
        
        {/* Floating Glass Pill */}
        <div ref={navRef} className="nav-pill relative w-full mx-auto rounded-full border border-white/20 bg-black/40 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] opacity-0 pointer-events-auto overflow-hidden transition-colors duration-500 will-change-transform">
          
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
                  className={`group relative font-mono text-xs uppercase tracking-[0.25em] transition-all duration-500 ease-out py-2
                    ${pathname === href ? 'text-white' : 'text-white/40 hover:text-white'}`}
                >
                  <span className="relative z-10 inline-block transition-transform duration-500 group-hover:-translate-y-1">
                    {label}
                  </span>
                  
                  {/* Subtle glowing animated underline */}
                  <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-white/80 shadow-[0_0_10px_rgba(255,255,255,1)] -translate-x-1/2 transition-all duration-500 ease-out group-hover:w-full opacity-0 group-hover:opacity-100" />
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

      {/* Aggressive Shutter-Blade cinematic overlay */}
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
