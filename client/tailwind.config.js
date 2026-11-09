/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        umber: '#60241E',      // deep brown — headings, footer, high-contrast text
        rust: '#95271D',       // primary brand/CTA
        clay: '#B34A44',       // secondary accent, active states
        amber: '#E77B49',      // highlights, icons, energetic details
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 10px 30px -8px rgba(96, 36, 30, 0.25)',
        'warm-lg': '0 20px 50px -12px rgba(96, 36, 30, 0.3)',
        'warm-sm': '0 4px 14px -4px rgba(96, 36, 30, 0.18)',
        glow: '0 0 30px rgba(231, 123, 73, 0.35)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0px rgba(231,123,73,0.4)' },
          '50%': { transform: 'scale(1.035)', boxShadow: '0 0 28px rgba(231,123,73,0.5)' },
        },
        blobFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(20px, -25px) scale(1.05)' },
          '66%': { transform: 'translate(-15px, 15px) scale(0.97)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(28px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmerSlow: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        breathe: 'breathe 4s ease-in-out infinite',
        blobFloat: 'blobFloat 12s ease-in-out infinite',
        blobFloatSlow: 'blobFloat 18s ease-in-out infinite',
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        shimmerSlow: 'shimmerSlow 3s linear infinite',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.33, 1, 0.68, 1)',
      },
    },
  },
  plugins: [],
};