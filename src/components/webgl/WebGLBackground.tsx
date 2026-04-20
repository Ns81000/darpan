'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

// Vertex shader — passes UV to fragment
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader — animated dark cinematic smoke/fluid
// Pitch black with subtle evolving gray/blue-void shapes
const fragmentShader = `
  uniform float uTime;
  uniform vec2  uMouse;
  varying vec2  vUv;

  // Smooth noise
  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  void main() {
    vec2 uv = vUv;

    // Mouse parallax — subtle smoke distortion
    uv += uMouse * 0.05;

    // Slower, moodier time
    float t = uTime * 0.1;
    
    // Low-frequency noise for deep smoke
    float n1 = noise(uv * 2.0 + t);
    float n2 = noise(uv * 4.0 - t * 0.5);
    float n3 = noise(uv * 8.0 + t * 0.2);
    
    float n = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Cinematic palette: Absolute Black -> Eerie Dark Gray -> Faint Void Blue
    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 darkGray = vec3(0.03, 0.03, 0.03);
    vec3 voidBlue = vec3(0.02, 0.03, 0.05);

    vec3 col = mix(black, darkGray, smoothstep(0.2, 0.8, n));
    col = mix(col, voidBlue, smoothstep(0.5, 1.0, n2));

    // Vignette for dramatic edges (darkens corners)
    float dist = length(vUv - 0.5);
    float vignette = smoothstep(0.8, 0.2, dist);
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function WebGLBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current!
    const w  = el.clientWidth
    const h  = el.clientHeight

    // WebGL availability check
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return // CSS gradient fallback via className on parent

    // Scene setup
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(w, h)
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geo    = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      uTime:  { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }

    const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms })
    scene.add(new THREE.Mesh(geo, mat))

    // GSAP ticker drives Three.js — stays in sync with Lenis
    let frame: number
    const tick = (time: number) => {
      uniforms.uTime.value = time
      renderer.render(scene, camera)
    }
    gsap.ticker.add(tick)

    // Mouse parallax — GSAP smoothly interpolates uniform
    const onMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth)  * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      gsap.to(uniforms.uMouse.value, {
        x: nx, y: -ny,
        duration: 1.8, ease: 'power2.out',
        overwrite: true,
      })
    }
    window.addEventListener('mousemove', onMouse)

    // Resize
    const onResize = () => {
      const nw = el.clientWidth
      const nh = el.clientHeight
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      mat.dispose()
      geo.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      // CSS gradient fallback — shown if WebGL unavailable
      style={{ background: 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)' }}
      aria-hidden="true"
    />
  )
}