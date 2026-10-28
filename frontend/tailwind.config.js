/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#080d1f',
          900: '#0d1328',
          800: '#111a32'
        },
        brand: {
          50: '#dffdf5',
          100: '#9ae6cc',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46'
        },
        violet: {
          500: '#8b5cf6'
        },
        amber: {
          400: '#fbbf24'
        }
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(0, 0, 0, 0.55)',
        glow: '0 0 30px rgba(16, 185, 129, 0.28)'
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at top, rgba(92, 94, 255, 0.15), transparent 40%)'
      }
    }
  },
  plugins: []
}
