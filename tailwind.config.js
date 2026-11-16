/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#05253D',
          navyDark: '#092741',
          navyText: '#102A3A',
          cyan: '#00C8E8',
          cyanHover: '#00B7D8',
          cyanAccessible: '#0891B2',
          cyanDarkText: '#0E7490',
          cyanPale: '#EAFBFD',
          canvas: '#F5F8FA',
          surfaceAlt: '#EEF3F6',
          border: '#DCE5EA',
          muted: '#607482',
          subtle: '#8797A2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideInRight: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
