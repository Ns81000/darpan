'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="interactive"]'

export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<HTMLDivElement>(null)
  const echoRef = useRef<HTMLDivElement>(null)
  const pointerMainPathRef = useRef<SVGPathElement>(null)
  const pointerAccentPathRef = useRef<SVGPathElement>(null)
  const echoPathRef = useRef<SVGPathElement>(null)

  useGSAP(() => {
    const root = rootRef.current
    const pointer = pointerRef.current
    const echo = echoRef.current
    const pointerMainPath = pointerMainPathRef.current
    const pointerAccentPath = pointerAccentPathRef.current
    const echoPath = echoPathRef.current

    if (!root || !pointer || !echo || !pointerMainPath || !pointerAccentPath || !echoPath) return

    const mm = gsap.matchMedia()

    mm.add('(pointer: fine)', () => {
      let initialized = false
      let isVisible = false
      let isInteractive = false
      let isPressed = false

      gsap.set(root, { autoAlpha: 0 })
      gsap.set([pointer, echo], {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        rotation: -10,
        scale: 1,
      })
      gsap.set(echo, { autoAlpha: 0.24 })

      const xPointer = gsap.quickTo(pointer, 'x', { duration: 0.08, ease: 'power3.out' })
      const yPointer = gsap.quickTo(pointer, 'y', { duration: 0.08, ease: 'power3.out' })
      const xEcho = gsap.quickTo(echo, 'x', { duration: 0.2, ease: 'power3.out' })
      const yEcho = gsap.quickTo(echo, 'y', { duration: 0.2, ease: 'power3.out' })

      const showCursor = () => {
        if (isVisible) return
        isVisible = true
        gsap.to(root, { autoAlpha: 1, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
      }

      const hideCursor = () => {
        if (!isVisible) return
        isVisible = false
        gsap.to(root, { autoAlpha: 0, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
      }

      const setInteractive = (nextState: boolean) => {
        if (isInteractive === nextState) return
        isInteractive = nextState

        if (nextState) {
          gsap.to(pointer, {
            scale: 1.08,
            rotation: -4,
            duration: 0.22,
            ease: 'power3.out',
            overwrite: 'auto',
          })
          gsap.to(echo, {
            scale: 1.12,
            rotation: -3,
            autoAlpha: 0.38,
            duration: 0.24,
            ease: 'power3.out',
            overwrite: 'auto',
          })
          gsap.to(pointerMainPath, {
            fill: 'rgba(255,255,255,0.1)',
            stroke: 'rgba(255,255,255,1)',
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto',
          })
          gsap.to(pointerAccentPath, {
            stroke: 'rgba(255,255,255,0.7)',
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto',
          })
          gsap.to(echoPath, {
            fill: 'rgba(255,255,255,0.08)',
            stroke: 'rgba(255,255,255,0.65)',
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto',
          })
          return
        }

        gsap.to(pointer, {
          scale: 1,
          rotation: -10,
          duration: 0.24,
          ease: 'power2.out',
          overwrite: 'auto',
        })
        gsap.to(echo, {
          scale: 1,
          rotation: -10,
          autoAlpha: 0.24,
          duration: 0.24,
          ease: 'power2.out',
          overwrite: 'auto',
        })
        gsap.to(pointerMainPath, {
          fill: 'rgba(8,8,8,0.95)',
          stroke: 'rgba(255,255,255,0.94)',
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
        })
        gsap.to(pointerAccentPath, {
          stroke: 'rgba(255,255,255,0.34)',
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
        })
        gsap.to(echoPath, {
          fill: 'rgba(0,0,0,0.18)',
          stroke: 'rgba(255,255,255,0.26)',
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      const setPressed = (nextState: boolean) => {
        if (isPressed === nextState) return
        isPressed = nextState

        if (nextState) {
          gsap.to(pointer, {
            scale: isInteractive ? 0.98 : 0.88,
            rotation: isInteractive ? -2 : -8,
            duration: 0.15,
            ease: 'power2.out',
            overwrite: 'auto',
          })
          gsap.to(echo, {
            scale: isInteractive ? 1.04 : 0.94,
            duration: 0.16,
            ease: 'power2.out',
            overwrite: 'auto',
          })
          return
        }

        gsap.to(pointer, {
          scale: isInteractive ? 1.08 : 1,
          rotation: isInteractive ? -4 : -10,
          duration: 0.2,
          ease: 'power3.out',
          overwrite: 'auto',
        })
        gsap.to(echo, {
          scale: isInteractive ? 1.12 : 1,
          rotation: isInteractive ? -3 : -10,
          duration: 0.2,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }

      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return

        if (!initialized) {
          initialized = true
          document.documentElement.classList.add('has-custom-cursor')
          showCursor()
        }

        const baseX = event.clientX - 2
        const baseY = event.clientY - 2

        xPointer(baseX)
        yPointer(baseY)
        xEcho(baseX - 2)
        yEcho(baseY - 1)

        const target = event.target instanceof Element ? event.target : null
        setInteractive(Boolean(target?.closest(INTERACTIVE_SELECTOR)))
      }

      const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType === 'mouse') setPressed(true)
      }

      const onPointerUp = (event: PointerEvent) => {
        if (event.pointerType === 'mouse') setPressed(false)
      }

      const onMouseOutWindow = (event: MouseEvent) => {
        if (event.relatedTarget === null) hideCursor()
      }

      const onMouseEnterWindow = () => {
        if (initialized) showCursor()
      }

      const onWindowBlur = () => hideCursor()

      const onVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          if (initialized) showCursor()
          return
        }
        hideCursor()
      }

      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('pointerdown', onPointerDown, { passive: true })
      window.addEventListener('pointerup', onPointerUp, { passive: true })
      window.addEventListener('mouseout', onMouseOutWindow)
      window.addEventListener('mouseenter', onMouseEnterWindow)
      window.addEventListener('blur', onWindowBlur)
      document.addEventListener('visibilitychange', onVisibilityChange)

      return () => {
        document.documentElement.classList.remove('has-custom-cursor')
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerdown', onPointerDown)
        window.removeEventListener('pointerup', onPointerUp)
        window.removeEventListener('mouseout', onMouseOutWindow)
        window.removeEventListener('mouseenter', onMouseEnterWindow)
        window.removeEventListener('blur', onWindowBlur)
        document.removeEventListener('visibilitychange', onVisibilityChange)
      }
    })

    return () => {
      mm.revert()
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, { scope: rootRef })

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[100000] opacity-0"
      aria-hidden="true"
    >
      <div
        ref={echoRef}
        className="absolute left-0 top-0 origin-top-left will-change-transform"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 50 50"
          fill="none"
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.14)]"
        >
          <path
            ref={echoPathRef}
            d="M41.695,27.683L17.963,5.272c-0.082-0.077-0.176-0.134-0.275-0.179c-0.026-0.012-0.053-0.017-0.08-0.026	c-0.09-0.032-0.181-0.05-0.276-0.056C17.312,5.01,17.296,5,17.277,5h-4c-0.266,0-0.52,0.105-0.707,0.293S12.277,5.734,12.277,6	l0.003,33c0,0.553,0.447,1,1,1h3.997c0.02,0,0.037-0.01,0.057-0.011c0.093-0.005,0.183-0.024,0.271-0.055	c0.03-0.01,0.06-0.017,0.088-0.03c0.102-0.047,0.198-0.106,0.281-0.187l0.009-0.009c0,0,0.001-0.001,0.001-0.001l4.361-4.243	l4.557,10.921C27.057,46.758,27.421,47,27.824,47h3.828c0.016,0.001,0.031,0.009,0.047,0.009c0.014,0,0.027-0.008,0.04-0.009h0.072	c0.235,0,0.457-0.087,0.633-0.233l4.056-1.861c0.502-0.23,0.722-0.823,0.492-1.325l-6.087-13.3l10.188-0.875	c0.393-0.033,0.729-0.295,0.858-0.667S41.981,27.954,41.695,27.683z M29.321,28.41c-0.323,0.027-0.614,0.211-0.778,0.492	c-0.163,0.281-0.181,0.624-0.045,0.92l6.262,13.683l-2.457,1.127L26.227,30.85l-0.019-0.044c0-0.001-0.001-0.002-0.001-0.002	L26.205,30.8c-0.004-0.009-0.011-0.017-0.016-0.026c-0.032-0.067-0.069-0.13-0.114-0.187c-0.019-0.024-0.043-0.044-0.064-0.066	c-0.036-0.038-0.071-0.076-0.112-0.108c-0.028-0.021-0.059-0.037-0.088-0.055c-0.041-0.025-0.081-0.051-0.126-0.07	c-0.032-0.014-0.067-0.023-0.101-0.033c-0.034-0.011-0.065-0.026-0.101-0.033c-0.016-0.003-0.033-0.002-0.049-0.005	c-0.01-0.001-0.018-0.006-0.028-0.007c-0.014-0.002-0.028,0.001-0.043,0c-0.025-0.002-0.05-0.007-0.074-0.007	c-0.014,0-0.027,0.007-0.04,0.008c-0.113,0.004-0.224,0.022-0.327,0.064c-0.003,0.001-0.006,0.001-0.009,0.003	c-0.107,0.044-0.202,0.11-0.289,0.189c-0.01,0.009-0.022,0.012-0.032,0.021l-6.316,6.146V8.319l20.422,19.285L29.321,28.41z"
            fill="rgba(0,0,0,0.18)"
            stroke="rgba(255,255,255,0.26)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        ref={pointerRef}
        className="absolute left-0 top-0 origin-top-left will-change-transform"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 50 50"
          fill="none"
          className="drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
        >
          <path
            ref={pointerMainPathRef}
            d="M41.695,27.683L17.963,5.272c-0.082-0.077-0.176-0.134-0.275-0.179c-0.026-0.012-0.053-0.017-0.08-0.026	c-0.09-0.032-0.181-0.05-0.276-0.056C17.312,5.01,17.296,5,17.277,5h-4c-0.266,0-0.52,0.105-0.707,0.293S12.277,5.734,12.277,6	l0.003,33c0,0.553,0.447,1,1,1h3.997c0.02,0,0.037-0.01,0.057-0.011c0.093-0.005,0.183-0.024,0.271-0.055	c0.03-0.01,0.06-0.017,0.088-0.03c0.102-0.047,0.198-0.106,0.281-0.187l0.009-0.009c0,0,0.001-0.001,0.001-0.001l4.361-4.243	l4.557,10.921C27.057,46.758,27.421,47,27.824,47h3.828c0.016,0.001,0.031,0.009,0.047,0.009c0.014,0,0.027-0.008,0.04-0.009h0.072	c0.235,0,0.457-0.087,0.633-0.233l4.056-1.861c0.502-0.23,0.722-0.823,0.492-1.325l-6.087-13.3l10.188-0.875	c0.393-0.033,0.729-0.295,0.858-0.667S41.981,27.954,41.695,27.683z M29.321,28.41c-0.323,0.027-0.614,0.211-0.778,0.492	c-0.163,0.281-0.181,0.624-0.045,0.92l6.262,13.683l-2.457,1.127L26.227,30.85l-0.019-0.044c0-0.001-0.001-0.002-0.001-0.002	L26.205,30.8c-0.004-0.009-0.011-0.017-0.016-0.026c-0.032-0.067-0.069-0.13-0.114-0.187c-0.019-0.024-0.043-0.044-0.064-0.066	c-0.036-0.038-0.071-0.076-0.112-0.108c-0.028-0.021-0.059-0.037-0.088-0.055c-0.041-0.025-0.081-0.051-0.126-0.07	c-0.032-0.014-0.067-0.023-0.101-0.033c-0.034-0.011-0.065-0.026-0.101-0.033c-0.016-0.003-0.033-0.002-0.049-0.005	c-0.01-0.001-0.018-0.006-0.028-0.007c-0.014-0.002-0.028,0.001-0.043,0c-0.025-0.002-0.05-0.007-0.074-0.007	c-0.014,0-0.027,0.007-0.04,0.008c-0.113,0.004-0.224,0.022-0.327,0.064c-0.003,0.001-0.006,0.001-0.009,0.003	c-0.107,0.044-0.202,0.11-0.289,0.189c-0.01,0.009-0.022,0.012-0.032,0.021l-6.316,6.146V8.319l20.422,19.285L29.321,28.41z"
            fill="rgba(8,8,8,0.95)"
            stroke="rgba(255,255,255,0.94)"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            ref={pointerAccentPathRef}
            d=""
            stroke="transparent"
            strokeWidth="0"
          />
        </svg>
      </div>
    </div>
  )
}