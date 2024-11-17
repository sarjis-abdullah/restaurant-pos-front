/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          100: '#FCE5ED', // Lightest shade
          200: '#F9BFD3', // Lighter shade
          300: '#F497AF', // Base color softened
          400: '#EC5F8D', // Slightly darker shade
          500: '#C21760', // Base color
          600: '#9A134D', // Darker shade
          700: '#730E3A', // Even darker
          800: '#4C0A27', // Very dark
          900: '#250514', // Darkest
        },
      },
    },
  },
  plugins: [],
}