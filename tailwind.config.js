/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        handwriting: ['Caveat', 'cursive'],
      },
      colors: {
        parchment: {
          50: '#FDFCF9',
          100: '#FAF9F5',
          200: '#F4F2EB',
          300: '#E8E5DA',
          400: '#D5D1C3',
        },
        ink: {
          950: '#141413',
          900: '#1C1B19',
          800: '#2B2A27',
          700: '#44423D',
          600: '#615F59',
          500: '#85837B',
        },
        accent: {
          terracotta: '#C85A32',
          olive: '#5A6B47',
          indigo: '#3B4B75',
          amber: '#D97706',
        }
      }
    },
  },
  plugins: [],
}
