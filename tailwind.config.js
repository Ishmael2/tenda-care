module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Theme Colors
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#4c0519',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        bold: '600',
        black: '900',
      },
      borderRadius: {
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3.5rem',
        '3xl': '4rem',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-top': 'slideInFromTop 0.3s ease-out',
        'slide-in-right': 'slideInFromRight 0.5s ease-out',
        'slide-in-bottom': 'slideInFromBottom 0.3s ease-out',
        'zoom-in': 'zoomIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounceSlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInFromTop: {
          from: {
            opacity: '0',
            transform: 'translateY(-2rem)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInFromRight: {
          from: {
            opacity: '0',
            transform: 'translateX(2rem)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInFromBottom: {
          from: {
            opacity: '0',
            transform: 'translateY(2rem)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        zoomIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(185, 28, 28, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(185, 28, 28, 0.8)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'red': '0 0 30px rgba(185, 28, 28, 0.4)',
        'red-glow': '0 0 50px rgba(185, 28, 28, 0.6)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      opacity: {
        0: '0',
        5: '0.05',
        10: '0.1',
        20: '0.2',
        30: '0.3',
        40: '0.4',
        50: '0.5',
        60: '0.6',
        70: '0.7',
        80: '0.8',
        90: '0.9',
        95: '0.95',
        100: '1',
      },
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
