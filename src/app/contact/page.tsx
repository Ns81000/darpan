'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import MagneticButton from '@/components/ui/MagneticButton'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(DrawSVGPlugin)
}

export default function ContactPage() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('.form-group', {
      y: 30, opacity: 0,
      stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.4
    })

    document.querySelectorAll('.form-field').forEach(field => {
      field.addEventListener('focus', () => {
        gsap.to(field, { borderColor: '#A0722A', duration: 0.3 })
      })
      field.addEventListener('blur', () => {
        if (!(field as HTMLInputElement).value) {
          gsap.to(field, { borderColor: '#D4CFC8', duration: 0.3 })
        }
      })
    })
  }, { scope: ref })

  const showSuccess = () => {
    gsap.to('.contact-form', {
      opacity: 0, y: -20, duration: 0.4, onComplete: () => {
        (document.querySelector('.contact-form') as HTMLElement).style.display = 'none';
        (document.querySelector('.form-success') as HTMLElement).style.display = 'flex';
        gsap.from('.success-circle', { drawSVG: 0, duration: 1.0, ease: 'power2.out' })
        gsap.to('.check-path', { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 })
        gsap.from('.success-title, .success-sub', {
          opacity: 0, y: 20, stagger: 0.2, duration: 0.6, ease: 'power2.out', delay: 1.2
        })
      }
    })
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showSuccess()
  }

  return (
    <main ref={ref} className="bg-bg-base pt-40 pb-24 min-h-screen">
      <div className="px-[clamp(1.5rem,6vw,6rem)] max-w-[800px] mx-auto text-center mb-16">
        <h1 className="font-display font-light text-accent" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>Let's talk.</h1>
        <p className="font-body text-accent-dim mt-4 text-[1.125rem]">Tell us about your project.</p>
      </div>

      <div className="px-[clamp(1.5rem,6vw,6rem)] max-w-[600px] mx-auto relative">
        <form className="contact-form space-y-6" onSubmit={onSubmit}>
          <div className="form-group grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Name" required className="form-field" />
            <input type="email" placeholder="Email" required className="form-field" />
          </div>
          <div className="form-group">
            <select required className="form-field" defaultValue="">
              <option value="" disabled>Select Service</option>
              <option value="short">Short-form</option>
              <option value="long">Long-form</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div className="form-group">
            <textarea placeholder="Tell us about the project..." rows={5} required className="form-field" />
          </div>
          <div className="form-group mt-8 flex justify-center">
            <MagneticButton type="submit" className="bg-highlight hover:bg-[#8f6424] text-bg-base px-10 py-4 w-full md:w-auto rounded-full font-body font-medium uppercase tracking-wide text-[0.875rem] transition-colors duration-300">
              Send brief
            </MagneticButton>
          </div>
        </form>

        {/* Success State */}
        <div className="form-success hidden flex-col items-center justify-center text-center py-16 absolute inset-0">
          <svg className="w-24 h-24 mb-6" viewBox="0 0 100 100">
            <circle className="success-circle" cx="50" cy="50" r="45" fill="none" stroke="#A0722A" strokeWidth="4" />
            <path className="check-path" d="M30 50 l15 15 l25 -25" fill="none" stroke="#A0722A" strokeWidth="4" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" />
          </svg>
          <h3 className="success-title font-display text-accent text-3xl mb-2">Message received.</h3>
          <p className="success-sub font-body text-accent-dim text-[1.125rem]">We'll be in touch shortly.</p>
        </div>
      </div>
    </main>
  )
}