/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Northern Lights Aurora Palette - Magical dreamy tones
        mint: {
          50: '#f0fdfa',   // Lightest mint mist
          100: '#ccfbf1',  // Light mint
          200: '#99f6e4',  // Soft mint
          300: '#5eead4',  // Medium mint
          400: '#2dd4bf',  // Bright mint
          500: '#14b8a6',  // Main mint
          600: '#0d9488',  // Deep mint
          700: '#0f766e',  // Dark mint
          800: '#115e59',  // Darker mint
          900: '#134e4a',  // Deepest mint
        },
        sage: {
          50: '#f0fdf4',   // Lightest sage green
          100: '#dcfce7',  // Light sage
          200: '#bbf7d0',  // Soft sage
          300: '#86efac',  // Medium sage
          400: '#4ade80',  // Bright sage
          500: '#22c55e',  // Main sage
          600: '#16a34a',  // Deep sage
          700: '#15803d',  // Dark sage
          800: '#166534',  // Darker sage
          900: '#14532d',  // Deepest sage
        },
        lime: {
          50: '#f7fee7',   // Lightest lime green
          100: '#ecfccb',  // Light lime
          200: '#d9f99d',  // Soft lime
          300: '#bef264',  // Medium lime
          400: '#a3e635',  // Bright lime
          500: '#84cc16',  // Main lime
          600: '#65a30d',  // Deep lime
          700: '#4d7c0f',  // Dark lime
          800: '#365314',  // Darker lime
          900: '#1a2e05',  // Deepest lime
        },
        cloud: {
          50: '#fefefe',   // Pure white
          100: '#fafafa',  // Softest gray
          200: '#f4f4f5',  // Light gray
          300: '#e4e4e7',  // Soft gray
          400: '#a1a1aa',  // Medium gray
          500: '#71717a',  // Main gray
          600: '#52525b',  // Deep gray
          700: '#3f3f46',  // Dark gray
          800: '#27272a',  // Darker gray
          900: '#18181b',  // Darkest gray
        }
      },
      fontFamily: {
        'zen': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'zen-xs': ['0.75rem', { lineHeight: '1rem' }],
        'zen-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'zen-base': ['1rem', { lineHeight: '1.5rem' }],
        'zen-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'zen-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'zen-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'zen-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'zen-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        'zen-xs': '0.5rem',
        'zen-sm': '0.75rem',
        'zen-md': '1rem',
        'zen-lg': '1.5rem',
        'zen-xl': '2rem',
        'zen-2xl': '3rem',
      },
      borderRadius: {
        'zen': '0.75rem',
        'zen-lg': '1rem',
        'zen-xl': '1.5rem',
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'breathe-slow': 'breathe 6s ease-in-out infinite',
        'breathe-deep': 'breatheDeep 12s ease-in-out infinite',
        'gentle-pulse': 'gentlePulse 3s ease-in-out infinite',
        'zen-float': 'zenFloat 6s ease-in-out infinite',
        'zen-float-slow': 'zenFloat 8s ease-in-out infinite',
        'ripple': 'ripple 0.6s linear',
        'meditation-glow': 'meditationGlow 4s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'meditation-focus': 'meditationFocus 8s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        gentlePulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        zenFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-4px) rotate(0.5deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        meditationGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(20, 184, 166, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(20, 184, 166, 0.2), 0 0 40px rgba(34, 197, 94, 0.1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breatheDeep: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '33%': { transform: 'scale(1.3)', opacity: '1' },
          '66%': { transform: 'scale(1.3)', opacity: '1' },
        },
        meditationFocus: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.8' },
          '25%': { transform: 'scale(1.1) rotate(1deg)', opacity: '1' },
          '50%': { transform: 'scale(1.2) rotate(0deg)', opacity: '0.9' },
          '75%': { transform: 'scale(1.1) rotate(-1deg)', opacity: '1' },
        },
      },
      backdropBlur: {
        'zen': '8px',
      },
      boxShadow: {
        'mint': '0 4px 20px -2px rgba(20, 184, 166, 0.12), 0 2px 8px -2px rgba(20, 184, 166, 0.08)',
        'mint-lg': '0 8px 30px -4px rgba(20, 184, 166, 0.18), 0 4px 12px -2px rgba(20, 184, 166, 0.1)',
        'mint-xl': '0 12px 40px -4px rgba(20, 184, 166, 0.22), 0 6px 16px -2px rgba(20, 184, 166, 0.12)',
        'mint-2xl': '0 20px 50px -4px rgba(20, 184, 166, 0.25), 0 8px 20px -2px rgba(20, 184, 166, 0.15)',
        'sage': '0 4px 20px -2px rgba(34, 197, 94, 0.12), 0 2px 8px -2px rgba(34, 197, 94, 0.08)',
        'lime': '0 4px 20px -2px rgba(132, 204, 22, 0.12), 0 2px 8px -2px rgba(132, 204, 22, 0.08)',
        'inner-mint': 'inset 0 2px 4px 0 rgba(20, 184, 166, 0.08)',
        'meditation': '0 0 30px rgba(20, 184, 166, 0.15), 0 0 60px rgba(34, 197, 94, 0.1)',
      },
    },
  },
  plugins: [],
}