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
        'sans': ['Montserrat', 'Poppins', 'system-ui', 'sans-serif'],
        'display': [' Montserrat', 'sans-serif'],
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
