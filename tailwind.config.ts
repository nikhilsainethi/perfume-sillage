import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // warm ivory light theme — names keep their semantic role
        obsidian: '#FAF8F4', // app background base
        espresso: '#FFFFFF', // raised surface / panels
        smoke: '#FFFFFF', // card fill
        ink: '#1B1611', // text on accent fills
        parchment: { DEFAULT: '#221C15', dim: '#6E6456' },
        muted: '#7A7061',
        champagne: { DEFAULT: '#B0843C', bright: '#8A6526' },
        amber: '#B0702F',
        rose: '#B5786E',
        accord: {
          citrus: '#C9A53C',
          fresh: '#5E9E86',
          floral: '#C77E92',
          woody: '#9A6B45',
          spicy: '#C2542A',
          sweet: '#C98A3D',
          aromatic: '#6B9156',
          amber: '#B5803F',
          leather: '#7A4A3A',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Canela', 'Ogg', 'serif'],
        sans: ['Inter', '"Suisse Intl"', '"Neue Haas Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"Söhne Mono"', 'monospace'],
      },
      letterSpacing: {
        tightish: '-0.011em',
      },
      borderRadius: {
        chip: '999px',
        card: '20px',
        panel: '28px',
        input: '12px',
      },
      boxShadow: {
        e1: '0 1px 2px rgba(60,45,30,0.06), 0 1px 3px rgba(60,45,30,0.05)',
        e2: '0 8px 24px rgba(60,45,30,0.09), 0 2px 6px rgba(60,45,30,0.05)',
        e3: '0 24px 60px rgba(60,45,30,0.14), 0 0 40px rgba(176,132,60,0.08)',
        focus: '0 0 0 2px #FAF8F4, 0 0 0 4px #B0843C',
      },
      transitionTimingFunction: {
        enter: 'cubic-bezier(0.22, 1, 0.36, 1)',
        move: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
