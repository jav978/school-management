/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        brand: {
          primary: '#281470',
          purple: '#3e229c',
          secondary: '#38bdf8',
          accent: '#f7c301',
          gold: '#f7c301',
          'gold-light': '#ffdf66',
          red: '#da2318',
          gray: '#dddedc',
          dark: '#23175c',
          night: '#16113a',
          surface: '#1b1145'
        }
      }
    }
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark",
    base: false,
    styled: true,
    utils: true,
    logs: false
  }
}
