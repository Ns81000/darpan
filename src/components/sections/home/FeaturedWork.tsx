'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const projects = [
  { id: '1', title: 'NIGHT RIDER', desc: 'Commercial // Automotive', thumb: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80' },
  { id: '2', title: 'ECHOES', desc: 'Documentary // Sony', thumb: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80' },
  { id: '3', title: 'VELOCITY', desc: 'Short-form // Nike', thumb: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80' },
  { id: '4', title: 'SILENT WAVE', desc: 'Brand Story // Audio', thumb: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80' },
  { id: '5', title: 'THE VAULT', desc: 'Music Video // Records', thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
]

export default function FeaturedWork() {
  const containerRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const title1Ref = useRef<HTMLHeadingElement>(null)
  const title2Ref = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    const track = trackRef.current
    if (!track) return

    // Total scroll movement to align last item to center
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth)

    // Master Timeline for horizontal scroll and single-scroll snapping
    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${track.scrollWidth * 1.5}`, // Increased scroll distance to make scrolling feel less sensitive/fast
        pin: true,
        scrub: 1, // reduced scrub duration for tighter 1:1 feel

        invalidateOnRefresh: true,
      }
    })

    // Parallax massive background typography - BOUND TO THE SCROLLTRIGGER OF THE MAIN TWEEN
    gsap.to(title1Ref.current, {
      x: () => -(window.innerWidth * 0.5),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${track.scrollWidth * 1.5}`,
        scrub: 1.2,

      }
    })
    
    gsap.to(title2Ref.current, {
      x: () => (window.innerWidth * 0.5),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${track.scrollWidth * 1.5}`,
        scrub: 1.2,

      }
    })

    // Cinematic 3D focus effect for center item
    const items = gsap.utils.toArray('.work-item') as HTMLElement[]
    items.forEach((item, i) => {
      const img = item.querySelector('.work-img')
      const text = item.querySelector('.work-text')
      const border = item.querySelector('.work-border')

      const isFirst = i === 0;
      const isLast = i === items.length - 1;

      // ENTRY: Card moves from Right-Edge to Center
      // Skip entry animation for the first card, because it's ALREADY in the center when the section pins!
      if (!isFirst) {
        gsap.fromTo(img, {
          scale: 1.3,
          filter: 'blur(20px)',
          opacity: 0.3,
          rotateY: -20,
        }, {
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          rotateY: 0,
          ease: 'none', // linear transition with the scrollbar makes it smooth
          scrollTrigger: {
            trigger: item,
            containerAnimation: tween,
            start: 'left right',
            end: 'center center',
            scrub: true,
          }
        })

        gsap.fromTo(border, {
          opacity: 0,
        }, {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            containerAnimation: tween,
            start: 'left 60%',
            end: 'center center',
            scrub: true,
          }
        })

        gsap.fromTo(text, {
          opacity: 0,
          y: 40,
          rotateX: -30,
        }, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            containerAnimation: tween,
            start: 'left 80%',
            end: 'center center',
            scrub: true,
          }
        })
      } else {
        // Vertical ENTRY for the FIRST card (animates as you scroll down into the pinned section)
        gsap.fromTo(img, {
          scale: 1.3,
          filter: 'blur(20px)',
          opacity: 0.3,
          rotateY: -20,
        }, {
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          rotateY: 0,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: containerRef.current, // Triggers on vertical page scroll instead of horizontal track
            start: 'top 75%', // Wait until the section is comfortably in view
            end: 'top top',   // Fully resolved right when it pins
            scrub: true,
          }
        })

        gsap.fromTo(border, {
          opacity: 0,
        }, {
          opacity: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            end: 'top top',
            scrub: true,
          }
        })

        gsap.fromTo(text, {
          opacity: 0,
          y: 40,
          rotateX: -30,
        }, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            end: 'top top',
            scrub: true,
          }
        })
      }

      // EXIT: Card moves from Center to Left-Edge
      // Skip exit animation for the last card since it lives forever in the center
      if (!isLast) {
        gsap.fromTo(img, {
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          rotateY: 0,
        }, {
          scale: 1.3,
          filter: 'blur(20px)',
          opacity: 0.3,
          rotateY: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            containerAnimation: tween,
            start: 'center 48%', // Start exiting just slightly after center so first item is safe at 0 progress
            end: 'right left',
            scrub: true,
            immediateRender: false, // CRITICAL: Stop GSAP from locking the start values during vertical entry
          }
        })

        gsap.fromTo(border, {
          opacity: 1,
        }, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            containerAnimation: tween,
            start: 'center 48%',
            end: 'right 40%',
            scrub: true,
            immediateRender: false,
          }
        })

        gsap.fromTo(text, {
          opacity: 1,
          y: 0,
          rotateX: 0,
        }, {
          opacity: 0,
          y: -40,
          rotateX: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            containerAnimation: tween,
            start: 'center 48%',
            end: 'right 80%',
            scrub: true,
            immediateRender: false,
          }
        })
      }
    })

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-start pointer-events-auto">
      
      {/* Massive Kinetic Background Typography to replace the old collapsing title */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none overflow-hidden z-0 opacity-[0.03] mix-blend-screen select-none">
        <h2 ref={title1Ref} className="font-display text-[25vw] text-white uppercase tracking-tighter leading-[0.85] whitespace-nowrap pl-[10vw]">
          THE ARCHIVES THE ARCHIVES THE ARCHIVES
        </h2>
        <h2 ref={title2Ref} className="font-display text-[25vw] text-transparent uppercase tracking-tighter leading-[0.85] whitespace-nowrap ml-[-50vw]" style={{ WebkitTextStroke: '2px rgba(255,255,255,1)' }}>
          SELECTED WORKS SELECTED WORKS
        </h2>
      </div>

      {/* The scrolling track: math precisely calculated to center items on mobile & desktop */}
      <div 
        ref={trackRef} 
        className="relative z-10 flex gap-[15vw] items-center h-full px-[15vw] md:px-[30vw]"
        style={{ width: 'fit-content' }}
      >
        {projects.map((p, i) => (
          <div 
            key={p.id} 
            className="work-item relative flex-shrink-0 w-[70vw] md:w-[40vw] h-[60vh] md:h-[70vh] flex flex-col justify-center group cursor-pointer"
            style={{ perspective: '1000px' }}
          >
            <div className="relative w-full h-[70%] md:h-[80%] overflow-hidden rounded-[2rem] bg-black transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
              
              {/* Image with extreme blur that comes into focus */}
              <div 
                className="work-img absolute inset-0 w-full h-full bg-cover bg-center transform-gpu"
                style={{ backgroundImage: `url(${p.thumb})` }}
              />
              
              {/* Dynamic Glow Border */}
              <div className="work-border absolute inset-0 border-[2px] border-white/40 rounded-[2rem] shadow-[inset_0_0_60px_rgba(255,255,255,0.2)] pointer-events-none" />

              {/* Noise Overlay */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Kinetic Text Underneath */}
            <div className="work-text mt-8 flex flex-col items-center text-center transform-gpu">
              <span className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase block mb-3 border border-white/20 px-3 py-1 rounded-full">
                [{p.id}] {p.desc}
              </span>
              <h3 className="font-display text-3xl md:text-5xl text-white uppercase tracking-tighter mix-blend-difference">
                {p.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
      
    </section>
  )
}
