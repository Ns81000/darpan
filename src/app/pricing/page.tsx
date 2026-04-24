'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitReveal from '@/components/ui/SplitReveal'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const tiers = [
  {
    id: 'kinetic',
    num: '01',
    name: 'Kinetic',
    price: '2.5k',
    interval: '/ project',
    color: '#FF3366',
    desc: 'For independent creators scaling their content engine without compromising baseline quality.',
    features: ['A-Roll Narrative Assembly', 'Standard Color Grade', 'Basic Typography', 'Sound Balancing', '2 Revision Rounds'],
    popular: false
  },
  {
    id: 'dynamic',
    num: '02',
    name: 'Dynamic',
    price: '5.5k',
    interval: '/ project',
    color: '#00D1FF',
    desc: 'For brands demanding premium cinematic retention, advanced visual hooks, and deep immersion.',
    features: ['Advanced VFX & Compositing', 'Cinematic Color Architecture', 'Kinetic Typography Engine', 'Deep Foley & Sound Design', 'Unlimited Revisions'],
    popular: true
  },
  {
    id: 'monolith',
    num: '03',
    name: 'Monolith',
    price: '12k+',
    interval: '/ month',
    color: '#AA00FF',
    desc: 'Full-scale embedded post-production architecture. A dedicated tier for massive volume and A/B testing.',
    features: ['Dedicated Lead Editor', 'Daily Output Quotas', 'Bespoke 3D Asset Creation', 'Algorithmic A/B Hooks', 'Direct Slack Channel'],
    popular: false
  }
]

export default function PricingPage() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray('.pricing-card') as HTMLElement[]
    
    // Initial entrance
    gsap.fromTo(cards, 
       { y: 150, opacity: 0, rotateX: 15, scale: 0.9 },
       { 
          y: 0, opacity: 1, rotateX: 0, scale: 1, 
          duration: 1.2, 
          stagger: 0.15, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.cards-container',
            start: 'top 85%',
          }
       }
    )

    const listeners: { el: Element, type: string, fn: EventListener }[] = []

    // 3D Hover & Sibling Blur Mechanics
    cards.forEach((card) => {
       // QuickTo for ultra-smooth 60fps mapping
       const xTo = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" })
       const yTo = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" })
       const glareXTo = gsap.quickTo(card.querySelector('.glare'), "x", { duration: 0.4, ease: "power3.out" })
       const glareYTo = gsap.quickTo(card.querySelector('.glare'), "y", { duration: 0.4, ease: "power3.out" })

       const onMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect()
          const relX = e.clientX - rect.left
          const relY = e.clientY - rect.top
          
          // Normalize -0.5 to 0.5
          const normX = (relX / rect.width) - 0.5
          const normY = (relY / rect.height) - 0.5

          // Tilt factors: max 12 degrees
          xTo(normX * 12)
          yTo(-normY * 12)

          // Move Glare to mouse position
          glareXTo(relX - 500) // 500 is half of the 1000px width
          glareYTo(relY - 500)
       }

       const onMouseEnter = () => {
          // Bring up glare
          gsap.to(card.querySelector('.glare'), { opacity: 0.4, duration: 0.4 })
          
          // Lift card slightly
          gsap.to(card, { scale: 1.02, zIndex: 20, duration: 0.5, ease: 'back.out(1.5)' })

          // Dim and recede siblings
          const siblings = cards.filter(c => c !== card)
          gsap.to(siblings, {
            scale: 0.92,
            opacity: 0.4,
            filter: 'blur(8px)',
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          })
       }

       const onMouseLeave = () => {
          // Reset rotations and lifts
          xTo(0)
          yTo(0)
          gsap.to(card.querySelector('.glare'), { opacity: 0, duration: 0.4 })
          
          // Reset all cards
          gsap.to(cards, {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            zIndex: 1,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto'
          })
       }

       card.addEventListener('mousemove', onMouseMove as EventListener)
       card.addEventListener('mouseenter', onMouseEnter)
       card.addEventListener('mouseleave', onMouseLeave)
       
       listeners.push({ el: card, type: 'mousemove', fn: onMouseMove as EventListener })
       listeners.push({ el: card, type: 'mouseenter', fn: onMouseEnter })
       listeners.push({ el: card, type: 'mouseleave', fn: onMouseLeave })
    })

    // FAQ animations
    document.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q')!
      const a = item.querySelector('.faq-a')!
      const icon = item.querySelector('.faq-icon')!
      gsap.set(a, { height: 0, opacity: 0, overflow: 'hidden' })

      const onFaqClick = () => {
        const isOpen = item.classList.contains('open')
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
          openItem.classList.remove('open')
          gsap.to(openItem.querySelector('.faq-a'), { height: 0, opacity: 0, duration: 0.45, ease: 'power2.inOut', overwrite: 'auto' })
          gsap.to(openItem.querySelector('.faq-icon'), { rotation: 0, duration: 0.3, overwrite: 'auto' })
        })
        if (!isOpen) {
          item.classList.add('open')
          gsap.to(a, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.inOut', overwrite: 'auto' })   
          gsap.to(icon, { rotation: 135, duration: 0.3, ease: 'back.out(2)', overwrite: 'auto' })   
        }
      }

      q.addEventListener('click', onFaqClick as EventListener)
      listeners.push({ el: q, type: 'click', fn: onFaqClick as EventListener })
    })

    return () => {
      listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn))
    }
  }, { scope: containerRef })

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#030303] text-white pt-40 pb-24 overflow-hidden selection:bg-white selection:text-black flex flex-col items-center">
       
       {/* Ambient Environment Mesh */}
       <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#111_0%,transparent_50%)]" />
         <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,#000_70%,transparent_100%)]" />
       </div>

       <div className="relative z-10 w-full max-w-[1400px] px-6 md:px-12 flex flex-col">
         
         {/* Header */}
         <div className="flex flex-col items-center text-center mb-20 md:mb-32">
            <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/50 mb-6 flex items-center justify-center gap-4">
               <div className="w-8 h-[1px] bg-white/20" />
               Value Geometry
               <div className="w-8 h-[1px] bg-white/20" />
            </div>
            <SplitReveal as="h1" className="font-display font-light text-[clamp(3.5rem,8vw,7rem)] uppercase leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
                Investment <br /> <span className="text-white/40">Architecture</span>
            </SplitReveal>
         </div>

         {/* Pricing Cards Grid - Perspective applied for 3D tilts */}
         <div className="cards-container grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-6 xl:gap-8 [perspective:2000px] mb-40">
            {tiers.map((tier) => (
              <div 
                key={tier.id}
                className="pricing-card relative flex flex-col p-[1px] rounded-2xl md:rounded-3xl [transform-style:preserve-3d] group cursor-crosshair transition-colors duration-500"
                style={{
                  background: tier.popular ? `linear-gradient(135deg, ${tier.color}80 0%, rgba(255,255,255,0.05) 100%)` : 'rgba(255,255,255,0.1)'
                }}
              >
                {/* The Inner Card Surface */}
                <div className="relative w-full h-full flex flex-col bg-[#080808] rounded-2xl md:rounded-[23px] overflow-hidden z-10 p-8 md:p-10">
                  
                  {/* Spotlight Glare - Position controlled by GSAP quickTo */}
                  <div 
                    className="glare absolute top-0 left-0 w-[1000px] h-[1000px] opacity-0 pointer-events-none mix-blend-screen z-0"
                    style={{
                      background: `radial-gradient(circle at center, ${tier.color}35 0%, transparent 40%)`
                    }}
                  />

                  {/* Header Badge */}
                  <div className="relative z-10 flex items-center justify-between mb-8">
                     <span className="font-mono text-[10px] uppercase tracking-[0.3em] border px-3 py-1 rounded-full border-white/10 text-white/50 group-hover:border-white/30 transition-colors">
                       Tier // {tier.num}
                     </span>
                     {tier.popular && (
                       <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full shadow-[0_0_15px_currentColor]" style={{ backgroundColor: tier.color, color: '#000' }}>
                         Dominant Choice
                       </span>
                     )}
                  </div>

                  {/* Name & Price */}
                  <div className="relative z-10">
                    <h2 className="font-display text-3xl md:text-4xl mb-4 tracking-tight" style={{ color: tier.color }}>
                      {tier.name}
                    </h2>
                    <div className="flex items-baseline gap-2 mb-8 border-b border-white/10 pb-8 group-hover:border-white/20 transition-colors">
                      <span className="font-display font-light text-5xl md:text-6xl text-white tracking-tighter">
                         ${tier.price}
                      </span>
                      <span className="font-mono text-sm text-white/40 tracking-widest uppercase">
                         {tier.interval}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="relative z-10 font-body text-[14px] md:text-[15px] text-white/60 leading-[1.7] font-light mb-10 h-[85px]">
                    {tier.desc}
                  </p>

                  {/* Features List */}
                  <ul className="relative z-10 flex flex-col gap-4 mb-16 flex-grow border-l border-white/10 pl-6 ml-1">
                    {tier.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-4 relative">
                         <div className="absolute -left-[27px] top-[6px] w-[5px] h-[5px] rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: tier.color }} />
                         <span className="font-mono text-[11px] md:text-[12px] leading-[1.6] tracking-wide text-white/80 uppercase">
                           {feat}
                         </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="relative z-10 mt-auto w-full pt-6">
                    <Link href='/contact' className="block w-full">
                      <div 
                        className="w-full py-4 md:py-5 border rounded-full font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-center transition-all duration-500"
                        style={{
                           backgroundColor: tier.popular ? 'white' : 'transparent',
                           color: tier.popular ? 'black' : 'white',
                           borderColor: tier.popular ? 'white' : 'rgba(255,255,255,0.2)'
                        }}
                      >
                        Initiate Sequence
                      </div>
                    </Link>
                  </div>

                </div>
              </div>
            ))}
         </div>

         {/* FAQ Section */}
         <div className="w-full max-w-[800px] mx-auto mt-20">
           <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/50 mb-6 flex items-center justify-center gap-4">
              <div className="w-8 h-[1px] bg-white/20" />
              Intelligence
              <div className="w-8 h-[1px] bg-white/20" />
           </div>
           <h2 className="font-display font-light text-white text-[clamp(2.5rem,5vw,4rem)] mb-12 text-center tracking-tight">System Queries</h2>
           
           <div className="flex flex-col gap-2">
             {[
               { q: "What is the typical turnaround threshold?", a: "For standard Kinetic packages, we guarantee a 48-hour delivery parameter. Dynamic and Monolith tiers feature custom delivery algorithms based on complexity." },
               { q: "Is the revision process restricted?", a: "Kinetic includes 2 precision alteration rounds. Dynamic and Monolith tiers operate on an unlimited revision loop to ensure absolutely perfect telemetry." },
               { q: "How is communication handled?", a: "We establish a dedicated hyper-fast Slack node for rapid deployment comms, integrated directly with Frame.io for pinpoint frame-accurate feedback." }
             ].map((faq, i) => (
                <div key={i} className="faq-item border-b border-white/10 pb-2 cursor-pointer group select-none">
                  <div className="faq-q flex items-center justify-between py-6">   
                    <h4 className="font-body font-light text-white text-[1rem] md:text-[1.25rem] group-hover:text-[#00D1FF] transition-colors">{faq.q}</h4>
                    <div className="faq-icon text-white/50 group-hover:text-[#00D1FF] text-2xl leading-none flex items-center justify-center">+</div>
                  </div>
                  <div className="faq-a overflow-hidden">
                    <p className="font-body text-white/50 pt-2 pb-8 text-[0.9rem] leading-relaxed max-w-[90%]">{faq.a}</p>
                  </div>
                </div>
             ))}
           </div>
         </div>

       </div>
    </main>
  )
}
