/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBackground: '#06121d',
        customPurple: 'rgb(139 92 246)',
        customBlue: 'rgb(14 165 233)',
      },
      fontFamily: {
        primaryFont: ['Roboto', 'sans-serif'], // font chữ chung
        script: ['Dancing Script', 'cursive'],
      },
      fontSize: {
        '3xl': '1.953rem',
      },
    },
  },
  plugins: [],
}

