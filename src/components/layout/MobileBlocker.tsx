import React from 'react'

export default function MobileBlocker() {
  return (
    <div className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-black p-8 text-center md:hidden h-[100svh] w-full overflow-hidden">
      {/* Premium Minimalist Header */}
      <div className="flex items-center gap-3 font-display font-medium tracking-[0.4em] text-white/90 text-sm uppercase mb-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Darpan Logo" className="w-8 h-8 object-contain" />
        DARPAN
      </div>
      
      {/* Main Message */}
      <h2 className="font-display text-2xl font-light tracking-widest uppercase text-white mb-6">
        Desktop Required
      </h2>
      
      <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50 max-w-[280px] leading-relaxed mx-auto">
        This experience utilizes advanced physics and WebGL telemetry engineered exclusively for desktop displays.
        <br />
        <br />
        Please revisit on a laptop or desktop device.
      </p>

      {/* Cinematic Bottom Light Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[50vh] pointer-events-none flex justify-center items-end overflow-hidden">
        {/* Core highlight line */}
        <div className="relative w-full max-w-[80vw] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent flex-shrink-0" />
        {/* Wide soft volumetric glow */}
        <div className="absolute bottom-[-10px] w-[140vw] h-[120px] bg-white/[0.04] blur-[40px] rounded-[100%]" />
        {/* Intense focused glow */}
        <div className="absolute bottom-[-5px] w-[90vw] h-[60px] bg-white/[0.08] blur-[20px] rounded-[100%]" />
      </div>
    </div>
  )
}
