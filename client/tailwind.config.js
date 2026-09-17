/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'saffron': {
          DEFAULT: '#FF671F',
          light: '#FF884D',
          dark: '#E0530A'
        },
        'india-navy': {
          DEFAULT: '#000080',
          dark: '#0B192C',
          light: '#1E3E62'
        },
        'india-green': {
          DEFAULT: '#046A38',
          light: '#0A8F4D',
          dark: '#024C27'
        }
      }
    },
  },
  plugins: [],
}
