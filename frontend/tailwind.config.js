/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857'
        },
        slate: {
          950: '#0f172a'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
}
