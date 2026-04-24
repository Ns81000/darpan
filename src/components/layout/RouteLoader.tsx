'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTransitionState } from 'next-transition-router'

const LOADER_DELAY_MS = 450

export default function RouteLoader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const spinnerRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<HTMLDivElement[]>([])
  const loopsRef = useRef<Array<gsap.core.Tween | gsap.core.Timeline>>([])
  const showTimerRef = useRef<number | null>(null)
  const isVisibleRef = useRef(false)

  const { stage } = useTransitionState()
  const stageRef = useRef(stage)
  stageRef.current = stage

  useEffect(() => {
    const root = rootRef.current
    const panel = panelRef.current
    const spinner = spinnerRef.current
    const bars = barsRef.current.filter(Boolean)

    if (!root || !panel || !spinner || bars.length === 0) return

    const clearShowTimer = () => {
      if (showTimerRef.current !== null) {
        window.clearTimeout(showTimerRef.current)
        showTimerRef.current = null
      }
    }

    const clearLoops = () => {
      loopsRef.current.forEach((animation) => animation.kill())
      loopsRef.current = []
    }

    const showLoader = () => {
      if (isVisibleRef.current) return
      isVisibleRef.current = true

      gsap.killTweensOf([root, panel, spinner, bars])
      gsap.set(root, { display: 'grid' })

      gsap.timeline()
        .to(root, {
          autoAlpha: 1,
          duration: 0.28,
          ease: 'power2.out',
        })
        .fromTo(
          panel,
          { yPercent: 14, scale: 0.95, autoAlpha: 0, filter: 'blur(10px)' },
          {
            yPercent: 0,
            scale: 1,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 0.58,
            ease: 'expo.out',
          },
          0
        )

      loopsRef.current = [
        gsap.to(spinner, {
          rotation: 360,
          duration: 1.35,
          ease: 'none',
          repeat: -1,
        }),
        gsap.timeline({ repeat: -1 }).to(bars, {
          scaleY: 0.28,
          duration: 0.32,
          stagger: 0.08,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 1,
        }),
      ]
    }

    const hideLoader = () => {
      clearShowTimer()
      if (!isVisibleRef.current) return

      isVisibleRef.current = false
      clearLoops()

      gsap.killTweensOf([root, panel])

      gsap.timeline({
        onComplete: () => {
          gsap.set(root, { autoAlpha: 0, display: 'none' })
          gsap.set(bars, { scaleY: 1 })
          gsap.set(spinner, { rotation: 0 })
        },
      })
        .to(panel, {
          yPercent: -12,
          scale: 0.95,
          autoAlpha: 0,
          filter: 'blur(8px)',
          duration: 0.34,
          ease: 'power2.in',
        })
        .to(
          root,
          {
            autoAlpha: 0,
            duration: 0.24,
            ease: 'power1.out',
          },
          0.08
        )
    }

    if (stage === 'leaving') {
      clearShowTimer()
      showTimerRef.current = window.setTimeout(() => {
        if (stageRef.current === 'leaving') {
          showLoader()
        }
      }, LOADER_DELAY_MS)
    } else {
      hideLoader()
    }

    return () => {
      clearShowTimer()
      clearLoops()
    }
  }, [stage])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10020] hidden place-items-center opacity-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.9)_52%,rgba(0,0,0,0.98)_100%)]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.06),transparent_42%)]" />

      <div
        ref={panelRef}
        className="relative flex min-w-[240px] flex-col items-center gap-6 rounded-[28px] border border-white/15 bg-black/55 px-8 py-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
      >
        <div className="relative size-14">
          <div
            ref={spinnerRef}
            className="absolute inset-0 rounded-full border border-white/15 border-t-white/80"
          />
          <div className="absolute inset-[11px] rounded-full border border-white/10" />
          <div className="absolute left-1/2 top-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.9)]" />
        </div>

        <div className="flex items-end gap-1.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              ref={(element) => {
                if (element) barsRef.current[index] = element
              }}
              className="h-5 w-1.5 origin-bottom rounded-full bg-white/75"
            />
          ))}
        </div>

        <p className="font-mono text-[0.64rem] uppercase tracking-[0.38em] text-white/70">
          Preparing next scene
        </p>
      </div>
    </div>
  )
}
