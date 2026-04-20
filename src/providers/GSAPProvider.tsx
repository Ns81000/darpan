'use client'

import { type PropsWithChildren } from 'react'
import { gsap }          from 'gsap'
import { useGSAP }       from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip }          from 'gsap/Flip'
import { CustomEase }    from 'gsap/CustomEase'
import { SplitText }     from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, Flip, CustomEase, SplitText, DrawSVGPlugin)

  CustomEase.create('darpan.smooth',    'M0,0 C0.16,1 0.3,1 1,1')
  CustomEase.create('darpan.snappy',    'M0,0 C0.6,0.01 0.4,1 1,1')
  CustomEase.create('darpan.cinematic', 'M0,0 C0.19,1 0.22,1 1,1')
}

export function GSAPProvider({ children }: PropsWithChildren) {
  return <>{children}</>
}