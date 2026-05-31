import React from 'react'

export default function MobileBlocker() {
  return (
    <div className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-black p-8 text-center md:hidden h-[100svh] w-full overflow-hidden">
      {/* Premium Minimalist Header */}
      <div className="flex items-center gap-3 font-display font-medium tracking-[0.4em] text-white/90 text-sm uppercase mb-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Darpan Logo" className="w-8 h-8 object-contain" />
        DARPAN
      </div>
      
      {/* Decorative Line */}
      <div className="w-px h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0 mb-10" />
      
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

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-12 w-full flex justify-center opacity-30">
        <div className="w-1/2 max-w-[200px] h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>
    </div>
  )
}
