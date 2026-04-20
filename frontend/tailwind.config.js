/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-teal': '#06B2B2',
        'soft-blue': '#E0F4FF',
        'soft-bg': '#f8fafc',
        'soft-border': 'rgba(0,0,0,0.05)',
        'nav-bg': 'rgba(255,255,255,0.85)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'sans-serif'],
        'brand': ['Poppins', 'sans-serif'],
        'serif': ['Lora', 'serif'],
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
        normal: '0',
        wide: '0.2px',
        wider: '0.3px',
        widest: '0.5px',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '600',       /* Tone down bold */
        extrabold: '700',  /* Tone down extrabold */
        black: '800',      /* Tone down black from 900 to 800 */
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2.5rem',
        '4xl': '3.5rem', // Match MediLocker soft corners
      },
      boxShadow: {
        'soft': '0 10px 40px rgba(0,0,0,0.04)',
        'hover': '0 20px 60px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
