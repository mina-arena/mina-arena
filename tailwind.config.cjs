const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'almendra-regular': ['Almendra Regular'],
        'almendra-bold': ['Almendra Bold']
      },
      fontSize: {
        '3xl': '2rem',
        '4xl': '3rem'
      },
      backgroundImage: {
        'paper-pattern': 'url("/images/backgrounds/white-paper.jpg")',
        'arena-landscape': 'url("/images/backgrounds/arena-landscape.webp")'
      }
    },
    colors: {
      ...colors,
      'light': '#F4F4F4',
      'dark': '#22181C',
      'neutral': '#312F2F',
      'primary': '#EF626C',
      'primary-light': '#F8B5B9',
      'primary-dark': '#BB111D',
      'secondary': '#84DCCF',
      'secondary-light': '#DFF6F3',
      'secondary-dark': '#247F73',
      'gold': '#eeb119'
    }
  },
  plugins: [],
}
