/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            50: '#eef4ff',
            100: '#dbe7fe',
            200: '#bfd6fe',
            300: '#93bafd',
            400: '#6094fa',
            500: '#3b6ff2',
            600: '#2851e6',
            700: '#213fd1',
            800: '#2135a8',
            900: '#1f3184',
          },
          purple: {
            50: '#f5f2ff',
            100: '#ede7fe',
            200: '#ddd2fd',
            300: '#c3aefb',
            400: '#a480f6',
            500: '#8752ef',
            600: '#7332e0',
            700: '#6224c4',
            800: '#511f9f',
            900: '#431c7f',
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
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(31, 49, 132, 0.06), 0 8px 24px -8px rgba(31, 49, 132, 0.10)',
        card: '0 1px 2px rgba(24, 29, 41, 0.04), 0 4px 16px -4px rgba(24, 29, 41, 0.08)',
        glow: '0 8px 30px -6px rgba(115, 50, 224, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
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
