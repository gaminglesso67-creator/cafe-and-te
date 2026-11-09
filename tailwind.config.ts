import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        gold: {
          DEFAULT: 'var(--gold)',
          deep: 'var(--gold-deep)',
        },
        crimson: 'var(--accent-red)',
        charcoal: {
          DEFAULT: '#0F0F10',
          surface: '#1A1815',
        },
        cream: {
          DEFAULT: '#FFF4E0',
          muted: '#D9C7A8',
        },
      },
      fontFamily: {
        serif: ['var(--font-heading)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: ['1rem', { lineHeight: '1.65' }], // 16px minimum body text
        lg: ['1.0625rem', { lineHeight: '1.6' }],
        xl: ['1.1875rem', { lineHeight: '1.45' }],
        '2xl': ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.3' }],
        '3xl': ['clamp(1.5rem, 2.6vw, 1.875rem)', { lineHeight: '1.22' }],
        '4xl': ['clamp(1.75rem, 3.4vw, 2.375rem)', { lineHeight: '1.15' }],
        '5xl': ['clamp(2rem, 4.2vw, 3rem)', { lineHeight: '1.1' }],
        '6xl': ['clamp(2.25rem, 4.8vw, 3.5rem)', { lineHeight: '1.06' }],
      },
      spacing: {
        'safe-b': 'env(safe-area-inset-bottom, 0px)',
        'safe-t': 'env(safe-area-inset-top, 0px)',
        'safe-l': 'env(safe-area-inset-left, 0px)',
        'safe-r': 'env(safe-area-inset-right, 0px)',
        11: '2.75rem', // 44px minimum touch target
      },
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '3px',
        DEFAULT: '4px',
        md: '6px',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(232, 181, 71, 0.28), 0 0 4px rgba(232, 181, 71, 0.35)',
        'gold-glow-strong':
          '0 0 32px rgba(232, 181, 71, 0.55), 0 0 10px rgba(232, 181, 71, 0.65)',
        'signboard-frame':
          'inset 0 0 0 1px rgba(232, 181, 71, 0.32), 0 0 28px rgba(232, 181, 71, 0.14)',
        panel: '0 14px 36px rgba(0, 0, 0, 0.65)',
      },
      backgroundImage: {
        'gold-gradient': 'var(--gold-gradient)',
        'glow-hero': 'var(--glow-hero)',
        'photo-overlay':
          'linear-gradient(to top, rgba(15, 15, 16, 0.88) 0%, rgba(15, 15, 16, 0.45) 55%, rgba(15, 15, 16, 0.6) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
