const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      dropShadow: {
        'lg': [
          '0 10px 20px rgba(0, 0, 0, 0.75)'
        ]
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
      'secondary-dark': '#247F73'
    }
  },
  plugins: [],
}
