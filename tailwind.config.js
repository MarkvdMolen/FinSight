/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          100: '#017573',
          200: '#019B98',
          300: '#55CCC9',
          400: '#81D9D7',  
          500: '#C1FFFF'
        },
        accent: {
          100: '#DD0025',
          200: '#FFBFAB'
        },
        beige: {
          100: '#edf0d8',
          700: '#ba8400'
        },
        money_green: {
          100: '#267E4F'
        },
        text: {
          100: '#014E60',
          200: '#3F7A8D'
        },
        bg: {
          100: '#FBFBFB',
          200: '#F1F1F1',  
          300: '#C8C8C8'
        },
      },
      screens: {
        'mobile': '360',
        'tablet': '768px',   
        'laptop': '1366px',
        'desktop': '1920px'  
      }
    },
  },
  plugins: [],
}

