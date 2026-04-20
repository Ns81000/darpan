'use client'

import { useRef, type PropsWithChildren } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useTransitionState } from 'next-transition-router'

const STRIPS = 5

export default function PageTransition({ children }: PropsWithChildren) {
  const stripsRef = useRef<HTMLDivElement[]>([])
  const { stage } = useTransitionState()

  useGSAP(() => {
    // EXIT: near-black strips stagger down — high contrast against cream
    if (stage === 'leaving') {
      gsap.set(stripsRef.current, { yPercent: -100 })
      gsap.to(stripsRef.current, {
        yPercent: 0,
        duration: 0.6,
        ease: 'expo.inOut',
        stagger: 0.06,
      })
    }

    // ENTRY: strips stagger up and out
    if (stage === 'entering') {
      gsap.set(stripsRef.current, { yPercent: 0 })
      gsap.to(stripsRef.current, {
        yPercent: 100,
        duration: 0.6,
        ease: 'expo.inOut',
        stagger: 0.06,
        onComplete: () => {
          window.dispatchEvent(new Event('transition:entered'))
        }
      })
    }
  }, { dependencies: [stage] })

  return (
    <>
      {/* Void-gray colored strips for a dramatic but smooth cinematic fade */}
      <div className="fixed inset-0 z-[9998] pointer-events-none flex">
        {Array.from({ length: STRIPS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { if (el) stripsRef.current[i] = el }}
            className="flex-1 bg-[#111111] -translate-y-full border-r border-[#0A0A0A]"
          />
        ))}
      </div>
      {children}
    </>
  )
}