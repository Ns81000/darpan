'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

const stepData = [
  { id: 'name', title: '01 / NAME', question: `"What's your name?"`, type: 'input', placeholder: 'John Doe' },
  { id: 'email', title: '02 / EMAIL', question: `"What's your email address?"`, type: 'input', placeholder: 'john@example.com' },    
  { id: 'message', title: '03 / PROJECT DETAILS', question: 'Tell us about your project.', type: 'textarea', placeholder: 'I want to build a...' } 
]

export default function ContactPage() {
  const containerRef = useRef<HTMLElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<string, string>>({ name: '', email: '', message: '' })
  
  // Submit animation states
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [isError, setIsError] = useState(false)
  const sendBtnRef = useRef<HTMLButtonElement>(null)

  const { contextSafe } = useGSAP({ scope: containerRef })

  useGSAP(() => {
    stepRefs.current.forEach((el, index) => {
      if (!el) return
      
      const content = el.querySelector('.step-content')
      const line = el.querySelector('.step-line')
      
      if (index === step) {
         // Bring Active Step In
         gsap.to(el, { y: 0, opacity: 1, pointerEvents: 'auto', duration: 1, ease: 'power3.out', delay: 0.2 })
         gsap.to(content, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 })
         if (line) gsap.to(line, { scaleX: 1, duration: 1.2, ease: 'expo.out', delay: 0.5 })
         
         // Autofocus active input
         setTimeout(() => {
           const input = el.querySelector('input, textarea') as HTMLElement
           if (input) input.focus()
         }, 400)
         
      } else if (index < step) {
         // Expel Completed Step Up
         gsap.to(el, { y: -80, opacity: 0, pointerEvents: 'none', duration: 0.8, ease: 'power3.inOut' }) 
         if (line) gsap.to(line, { scaleX: 0, duration: 0.6, ease: 'power3.inOut' })
      } else {
         // Keep Future Steps Down
         gsap.to(el, { y: 80, opacity: 0, pointerEvents: 'none', duration: 0.8, ease: 'power3.inOut' })  
         gsap.set(content, { opacity: 0, y: 20 })
         if (line) gsap.set(line, { scaleX: 0 })
      }
    })
  }, [step])

  const handleNext = () => {
     if (step < stepData.length) {
        setStep(prev => prev + 1)
     }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => {
     if (e.key === 'Enter' && !e.shiftKey && form[id].trim() !== '') {
        e.preventDefault()
        handleNext()
     }
  }

  const handleSend = contextSafe(() => {
    if (isSending || isSent) return
    setIsSending(true)
    setIsError(false)
    
    const btn = sendBtnRef.current
    if (!btn) return

    const tl = gsap.timeline({
      onComplete: () => {
         const success = Math.random() > 0.3 // 70% success, 30% failure rate for demo
         if (success) {
            // Hide the active form div slowly
            gsap.to(stepRefs.current[3], { opacity: 0, y: -50, pointerEvents: 'none', duration: 1, ease: 'power3.inOut' })
            
            // Reveal cinematic success immersive screen
            setIsSent(true)
            gsap.to(".thank-you-screen", { opacity: 1, pointerEvents: 'auto', duration: 1, delay: 0.5, ease: "power2.out" })
            gsap.fromTo(".thank-you-title", { y: 40, opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, delay: 0.8, ease: "power3.out" })
            gsap.fromTo(".thank-you-text", { opacity: 0 }, { opacity: 1, duration: 1.5, delay: 1.2, ease: "power3.out" })
            
            // Subtle looping volumetric glow
            gsap.to(".ambient-success-glow", { scale: 1.1, opacity: 0.15, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" })
         } else {
            setIsError(true)
            setIsSending(false)
            
            // Haptic error shake
            gsap.to(btn, {
               x: 8,
               yoyo: true,
               repeat: 5,
               duration: 0.08,
               ease: "power1.inOut",
               borderColor: "rgba(255, 51, 102, 0.8)",
               onComplete: () => {
                  gsap.to(btn, { x: 0, borderColor: "rgba(255, 255, 255, 0.2)", duration: 0.3 })
               }
            })
         }
      }
    })

    // Cinematic Transmitting Pulse (No more broken white fill wiping out text)
    tl.to(btn, { scale: 0.95, duration: 0.2, ease: "power2.out" })
      .to(btn, { scale: 1, opacity: 0.6, boxShadow: "0 0 20px rgba(255,255,255,0.15)", repeat: 3, yoyo: true, duration: 0.6, ease: "power1.inOut" })
      .to(btn, { opacity: 1, boxShadow: "0 0 0px rgba(255,255,255,0)", duration: 0.2 })
  })

  return (
    <main ref={containerRef} className="relative w-full h-screen bg-[#050505] text-white flex flex-col items-center justify-center overflow-hidden selection:bg-white selection:text-black">
       
       {/* Dark, Cinematic Success Screen (Replaces the ugly bright green) */}
       <div className="thank-you-screen absolute inset-0 z-50 flex flex-col items-center justify-center opacity-0 pointer-events-none">
          <div className="ambient-success-glow absolute w-[60vw] h-[60vw] rounded-full bg-[#00D1FF] mix-blend-screen opacity-0 pointer-events-none" style={{ filter: 'blur(120px)', transform: 'translate(-50%, -50%)', top: '50%', left: '50%' }} />
          
          <div className="relative z-10 flex flex-col items-center text-center px-6">
             <h1 className="thank-you-title font-display font-light text-white text-[clamp(2.5rem,6vw,5rem)] tracking-tight mb-6">
                Transmission Successful.
             </h1>
             <p className="thank-you-text font-mono text-white/50 text-xs tracking-[0.3em] uppercase max-w-sm leading-relaxed">
                Our team will decode your message shortly.
             </p>
          </div>
       </div>

       {/* Minimal Background Grid */}
       <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
            style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}>
       </div>
       <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />

       <div className="relative w-full max-w-5xl h-[60vh] flex items-center justify-center z-10 px-6">

          {/* Map through the interactive steps */}
          {stepData.map((s, index) => (
             <div
               key={s.id}
               ref={el => { stepRefs.current[index] = el }}
               className="absolute w-full flex flex-col items-start justify-center opacity-0 pointer-events-none translate-y-[80px]"
             >
                <div className="step-content w-full flex flex-col opacity-0 translate-y-[20px]">
                  <div className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase mb-8 flex items-center gap-4">
                     {s.title}
                     <div className="h-[1px] w-12 bg-white/20"></div>
                  </div>

                  <h2 className="font-display font-light text-white text-[clamp(2rem,4vw,3rem)] tracking-tight mb-12">
                     {s.question.replace(/""/g, '')}
                  </h2>

                  <div className="w-full relative group">
                     {s.type === 'textarea' ? (
                        <textarea
                          value={form[s.id]}
                          onChange={(e) => setForm({...form, [s.id]: e.target.value})}
                          onKeyDown={(e) => handleKeyDown(e, s.id)}
                          placeholder={s.placeholder}
                          rows={4}
                          className="w-full bg-transparent outline-none text-left font-display font-light text-[clamp(1.5rem,3vw,2.5rem)] text-white/90 placeholder-white/10 resize-none pb-4 leading-tight"
                        />
                     ) : (
                        <input
                          type="text"
                          value={form[s.id]}
                          onChange={(e) => setForm({...form, [s.id]: e.target.value})}
                          onKeyDown={(e) => handleKeyDown(e, s.id)}
                          placeholder={s.placeholder}
                          className="w-full bg-transparent outline-none text-left font-display font-light text-[clamp(2rem,4vw,3.5rem)] text-white/90 placeholder-white/10 pb-4"
                          autoComplete="off"
                        />
                     )}
                     
                     <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"></div>
                     <div className="step-line absolute bottom-0 left-0 w-full h-[2px] bg-white origin-left scale-x-0 transition-opacity duration-300 group-focus-within:opacity-100 opacity-50"></div>
                  </div>

                  <div className={`mt-10 transition-all duration-700 ${form[s.id].trim().length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                     <button
                       onClick={handleNext}
                       className="group flex items-center gap-4 py-3 px-6 rounded-full bg-white text-black font-mono text-xs tracking-[0.2em] uppercase hover:bg-white/90 transition-all active:scale-[0.95]"
                     >
                        Next Step
                        <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">&#8594;</span>
                     </button>
                  </div>
                </div>
             </div>
          ))}

          {/* Final Stage */}
          <div
             ref={el => { stepRefs.current[3] = el }}
             className="absolute w-full flex flex-col items-center justify-center text-center opacity-0 pointer-events-none translate-y-[80px]"
          >
             <div className="step-content flex flex-col items-center opacity-0 translate-y-[20px]">
                <h2 className="font-display font-light text-white text-[clamp(3.5rem,8vw,6rem)] tracking-tight mb-6">
                  Ready to send?
                </h2>
                <p className={`font-mono tracking-[0.1em] text-sm mb-12 max-w-md mx-auto leading-relaxed transition-colors duration-300 ${isError ? 'text-[#FF3366]' : 'text-white/50'}`}>
                  {isError 
                     ? 'Signal Interrupted. Please try again.' 
                     : `Thanks for the details. We'll review your message and get back to you shortly.`}
                </p>
                
                <button 
                   ref={sendBtnRef}
                   onClick={handleSend}
                   className="group relative px-10 py-5 rounded-full border border-white/20 hover:border-white/50 bg-[#050505] overflow-hidden flex items-center justify-center gap-4 transition-all duration-300 active:scale-[0.97]"
                >
                   <span className={`relative z-10 font-mono text-xs tracking-[0.2em] uppercase font-bold transition-colors duration-300 ${isError ? 'text-[#FF3366]' : 'text-white'}`}>
                      {isSending ? 'Transmitting...' : isError ? 'Retry Signal' : 'Send Message'}
                   </span>
                   
                   {!isSending && !isError && (
                      <span className="relative z-10 text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110 text-white">&#8599;</span>
                   )}
                   {isError && !isSending && (
                      <span className="relative z-10 text-lg text-[#FF3366]">&#10007;</span>
                   )}
                </button>
             </div>
          </div>

       </div>
    </main>
  )
}
