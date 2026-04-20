import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Cinematic dark mode palette
        'bg-base':      '#000000',   // absolute black
        'bg-surface':   '#0A0A0A',   // eerie black
        'bg-surface-2': '#111111',   // void gray
        
        // Obsidian Glass surfaces
        'glass-white':  'rgba(255, 255, 255, 0.03)',
        'glass-cream':  'rgba(0, 0, 0, 0.65)',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
        
        // Text
        'accent':       '#FFFFFF',   // pure white
        'accent-dim':   '#888888',   // dimmed silver
        'accent-faint': '#333333',   // faint borders
        
        // Highlights (Glows/Ambilight will be dynamic, but setting base here)
        'highlight':     '#FFFFFF',  
        'highlight-dim': '#AAAAAA',  
        
        // Inverted surfaces
        'ink':           '#FFFFFF',
        'ink-surface':   '#F0F0F0',
      },
      fontFamily: {
        display: ['var(--font-space)', 'sans-serif'],
        body:    ['var(--font-inter)', 'sans-serif'],
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in':  'cubic-bezier(0.7,  0, 0.84, 0)',
        'expo-io':  'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      backdropBlur: {
        'glass': '16px',
        'glass-heavy': '24px',
      },
    },
  },
  plugins: [],
}

export default config