'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'

const pricingTiers = [
  { name: 'Starter', price: '$800/mo', best: 'Best for new creators', features: ['4 Short-form videos', 'Color grading', 'Basic motion graphics', '48hr turnaround'], cta: 'Start Starter' },
  { name: 'Pro', price: '$2,000/mo', best: 'Best for growing channels', features: ['12 Short-form & 2 Long-form videos', 'Advanced sound design', 'Custom VFX', 'Priority support'], cta: 'Get Pro', featured: true },
  { name: 'Scale', price: 'Custom', best: 'For agencies & teams', features: ['Unlimited requests', 'Dedicated editor', 'Daily delivery', 'Strategy sessions'], cta: 'Let\'s talk' }
]

const faqs = [
  { q: "What's the typical turnaround time?", a: "For short-form content, we guarantee a 48-hour delivery. Long-form videos typically take 3-5 days depending on the complexity of the project." },
  { q: "Do you offer revisions?", a: "Yes, every standard package includes two rounds of revisions to ensure you're completely satisfied with the final edit." },
  { q: "How do we communicate during a project?", a: "We setup a dedicated Slack channel or Slack Connect for rapid comms, and use frame.io for seamless feedback integration on edits." }
]

export default function PricingPage() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('.pricing-card', {
      scrollTrigger: { trigger: '.pricing-cards', start: 'top 75%' },
      y: 80, opacity: 0, scale: 0.93,
      stagger: 0.18, duration: 1.0, ease: 'back.out(1.4)'
    })

    gsap.to('.pricing-card--featured', {
      y: -10, duration: 2.5,
      ease: 'sine.inOut', repeat: -1, yoyo: true
    })

    document.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q')!
      const a = item.querySelector('.faq-a')!
      const icon = item.querySelector('.faq-icon')!
      gsap.set(a, { height: 0, overflow: 'hidden' })

      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open')
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
          openItem.classList.remove('open')
          gsap.to(openItem.querySelector('.faq-a'), { height: 0, duration: 0.45, ease: 'power2.inOut' })
          gsap.to(openItem.querySelector('.faq-icon'), { rotation: 0, duration: 0.3 })
        })
        if (!isOpen) {
          item.classList.add('open')
          gsap.to(a, { height: 'auto', duration: 0.5, ease: 'power2.inOut' })
          gsap.to(icon, { rotation: 45, duration: 0.3, ease: 'back.out(2)' })
        }
      })
    })
  }, { scope: sectionRef })

  return (
    <main ref={sectionRef} className="bg-bg-base pt-40 pb-24">
      <div className="px-[clamp(1.5rem,6vw,6rem)] max-w-[1200px] mx-auto mb-20 text-center">
        <h1 className="font-display font-light text-accent mb-6" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>Plans & Pricing</h1>
        <p className="font-body text-accent-dim text-[1.125rem]">Simple, transparent monthly retainers.</p>
      </div>

      <div className="pricing-cards px-[clamp(1.5rem,6vw,6rem)] max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {pricingTiers.map((tier) => (
          <GlassCard
            key={tier.name}
            className={`pricing-card p-10 flex flex-col min-h-[500px] ${tier.featured ? 'pricing-card--featured border-2 border-highlight' : ''}`}
          >
            {tier.featured && (
              <div className="mb-4">
                <span className="font-body text-[0.75rem] tracking-[0.2em] uppercase text-highlight">
                  Most popular
                </span>
              </div>
            )}
            <h3 className="font-display font-light text-accent text-3xl mb-2">{tier.name}</h3>
            <p className="font-body text-highlight text-3xl font-medium mb-4">{tier.price}</p>
            <p className="font-body text-accent-dim text-[0.875rem] mb-6 pb-6 border-b border-accent-faint">{tier.best}</p>
            <ul className="space-y-4 mb-10 flex-1">
              {tier.features.map(f => (
                <li key={f} className="flex items-start gap-4">
                  <span className="w-5 h-[1px] bg-highlight inline-block mt-[0.7em] flex-shrink-0" />
                  <span className="font-body text-accent-dim text-[0.9375rem] leading-[1.6]">{f}</span>
                </li>
              ))}
            </ul>
            <MagneticButton
              href="/contact"
              className={`w-full text-center px-6 py-4 rounded-full font-body font-medium tracking-wide text-[0.875rem] transition-all duration-300 ${
                tier.featured
                  ? 'bg-highlight text-bg-base hover:bg-[#8f6424]'
                  : 'border border-highlight text-highlight hover:bg-highlight hover:text-bg-base'
              }`}
            >
              {tier.cta}
            </MagneticButton>
          </GlassCard>
        ))}
      </div>

      <div className="px-[clamp(1.5rem,6vw,6rem)] max-w-[800px] mx-auto mt-20">
        <h2 className="font-display font-light text-accent text-4xl mb-12 text-center">Frequently asked questions</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
             <div key={i} className="faq-item border-b border-accent-faint pb-4 cursor-pointer group">
               <div className="faq-q flex items-center justify-between py-4">
                 <h4 className="font-body font-medium text-accent text-[1.125rem] group-hover:text-highlight transition-colors">{faq.q}</h4>
                 <div className="faq-icon transform transition-transform text-accent text-2xl group-hover:text-highlight">+</div>
               </div>
               <div className="faq-a overflow-hidden">
                 <p className="font-body text-accent-dim pt-2 pb-6 text-[0.9375rem] leading-relaxed">{faq.a}</p>
               </div>
             </div>
          ))}
        </div>
      </div>
    </main>
  )
}