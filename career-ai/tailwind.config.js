/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          purple: {
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
          },
          ink: {
            50: '#f7f8fa',
            100: '#eef0f4',
            200: '#dde1e8',
            300: '#c3c9d4',
            400: '#9aa3b5',
            500: '#727d93',
            600: '#556077',
            700: '#404a5e',
            800: '#2b3242',
            900: '#181d29',
          },
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', '"Satisfy"', '"Caveat"', 'cursive'],
        cursive: ['"Caveat"', '"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(31, 49, 132, 0.06), 0 8px 24px -8px rgba(31, 49, 132, 0.10)',
        card: '0 1px 2px rgba(24, 29, 41, 0.04), 0 4px 16px -4px rgba(24, 29, 41, 0.08)',
        glow: '0 8px 30px -6px rgba(115, 50, 224, 0.25)',
      },

      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
