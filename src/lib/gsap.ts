'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip }           from 'gsap/Flip'
import { CustomEase }     from 'gsap/CustomEase'
import { SplitText }      from 'gsap/SplitText'
import { DrawSVGPlugin }  from 'gsap/DrawSVGPlugin'

// Register once — safe to call multiple times
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip, CustomEase, SplitText, DrawSVGPlugin)

  // Brand eases
  CustomEase.create('darpan.smooth',    'M0,0 C0.16,1 0.3,1 1,1')
  CustomEase.create('darpan.snappy',    'M0,0 C0.6,0.01 0.4,1 1,1')
  CustomEase.create('darpan.cinematic', 'M0,0 C0.19,1 0.22,1 1,1')
}

export { gsap, ScrollTrigger, Flip, CustomEase, SplitText, DrawSVGPlugin }