import type { Config } from 'tailwindcss'

// Brand colors extracted from https://www.caglobalint.com via Playwright (2026-06-22)
// Primary: rgb(9, 125, 132)  → #097d84 (teal — header, CTAs, footer)
// Dark:    rgb(13, 59, 57)   → #0d3b39 (dark teal — form submit, secondary accents)
// Body font: Montserrat | Heading font: Poppins

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'] as const,
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal:          '#097d84',   // Primary — header bg, CTAs, footer
          'teal-dark':   '#0d3b39',   // Secondary — form buttons, hover states
          'teal-light':  '#12a3ac',   // Lighter variant for hover/highlights
          'teal-faint':  '#e8f5f6',   // Very light teal for backgrounds/cards
          neutral:       '#f5f5f5',   // Light grey card backgrounds
          'neutral-dark': '#6b7280',  // Muted text
        },
      },
      fontFamily: {
        heading: ['Poppins', 'var(--font-heading)', 'system-ui', 'sans-serif'],
        body:    ['Montserrat', 'var(--font-body)',  'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
