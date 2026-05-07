/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        'pink-beige': '#F9E4D4',
        'soft-orange': '#FFB38A',
        'soft-blue': '#B8DEFF',
        'light-green': '#C8EFBC',
        'warm-gray': '#F5F0EB',
      },
      fontFamily: {
        sans: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
