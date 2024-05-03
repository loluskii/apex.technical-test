const animate = require('tailwindcss-animate')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx,vue}',
    './components/**/*.{js,jsx,vue}',
    './app/**/*.{js,jsx,vue}',
    './src/**/*.{js,jsx,vue}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        xxl: '1536px'
      },
      fontWeight: {
        extralight: 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900
      },
      colors: {
        brand: {
          body: '#383A47',
          text: '#111827',
          muted: '#718096',
          'muted-2': '#88888A',
          success: '#0CAF60',
          primary: '#8C62FF',
          warning: '#D4A701',
          danger: '#FE964A',
          'success-light': '#E7F7EF',
          'primary-light': '#F4F0FF',
          'warning-light': '#FEF7DC',
          'danger-light': '#FFF0E6',
          'red-light':'#FFF0F0',
          input: '#FAFAFA',
          red: '#FD6A6A'
        }
      }
    }
  },
  plugins: [require('daisyui')]
}
