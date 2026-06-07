/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FFFAF0',
        burgundy: '#800020',
        'burgundy-dark': '#5a0015',
        saffron: '#FF9933',
        emerald: '#006400',
        cream: '#FFFDD0',
        gray: {
          400: '#9CA3AF',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};