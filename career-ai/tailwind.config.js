/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            50: '#eef6fb',
            100: '#dcecf6',
            200: '#b9d9ea',
            300: '#8bbbd5',
            400: '#5798bd',
            500: '#327da7',
            600: '#17658f',
            700: '#145274',
            800: '#164660',
            900: '#183b56',
            950: '#0c2638',
          },
          orange: {
            50: '#fff5f1',
            100: '#ffe5dc',
            200: '#ffc9b8',
            300: '#f5a18a',
            400: '#e9795d',
            500: '#d95f45',
            600: '#c64d36',
            700: '#a43d2d',
            800: '#86372d',
            900: '#70332c',
            950: '#3d1714',
          },
          purple: {
            50: '#edf9f7',
            100: '#d6f1ed',
            200: '#afe2da',
            300: '#7ccbc0',
            400: '#45ad9f',
            500: '#239486',
            600: '#14796e',
            700: '#126259',
            800: '#124f49',
            900: '#12423e',
            950: '#062925',
          },
          ink: {
            50: '#fafafa',
            100: '#f4f4f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#0a0a0a',
            950: '#000000',
          },
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Lato', 'system-ui', 'sans-serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(0, 0, 0, 0.05), 0 8px 24px -8px rgba(0, 0, 0, 0.08)',
        card: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px -4px rgba(0, 0, 0, 0.08)',
        glow: '0 8px 30px -6px rgba(23, 101, 143, 0.28)',
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
