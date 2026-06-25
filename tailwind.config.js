/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        muted: '#657085',
        line: '#d8e0ea',
        canvas: '#f4f8fb',
        panel: '#ffffff',
        teal: {
          50: '#e9fbfc',
          100: '#c8f3f5',
          500: '#099aa6',
          600: '#007f8c',
          700: '#046977'
        },
        coral: {
          50: '#fff1ed',
          500: '#ff654a',
          600: '#e84f35'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ]
      },
      boxShadow: {
        soft: '0 18px 45px rgba(16, 24, 40, 0.08)',
        message: '0 10px 30px rgba(9, 154, 166, 0.18)'
      },
      borderRadius: {
        xl2: '1.25rem'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-220% 0' },
          '100%': { backgroundPosition: '220% 0' }
        },
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.7 },
          '50%': { transform: 'scale(1.8)', opacity: 0 }
        }
      },
      animation: {
        'fade-up': 'fadeUp 460ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'float-soft': 'floatSoft 5.5s ease-in-out infinite',
        shimmer: 'shimmer 2.8s linear infinite',
        'pulse-ring': 'pulseRing 1.8s ease-out infinite'
      }
    }
  },
  plugins: []
};
