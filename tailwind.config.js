/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          900: '#031018',
          800: '#05202b',
        },
        blue: {
          700: '#0b3a66',
        },
        cyan: {
          600: '#00d8ff',
        },
        aqua: {
          500: '#2bd3ff',
        },
        muted: '#94a3b8',
      },
      fontFamily: {
        'clash-display': ['ClashDisplay-Bold', 'sans-serif'],
        'plus-jakarta': ['Plus Jakarta Sans', 'sans-serif'],
      },
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.01em',
      },
      animation: {
        'scroll-left': 'scroll-left 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(0, 216, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 216, 255, 0.6)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-pool': 'linear-gradient(180deg, rgba(0, 216, 255, 0.1) 0%, rgba(0, 216, 255, 0) 100%)',
        'background': 'radial-gradient(100% 100% at 0% 0%, var(--bg-700) 0%, var(--bg-800) 45%, transparent 100%), radial-gradient(100% 100% at 100% 100%, var(--primary-600) 0%, var(--bg-800) 45%, transparent 100%)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      })
    },
  ],
}
