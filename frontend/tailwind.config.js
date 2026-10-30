/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'desktop-min': '1366px',
        'desktop-fhd': '1920px',
      },
      fontFamily: {
        archivo: ['Archivo', 'sans-serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        canvas: {
          primary: '#0B1326',
          deep: '#060E20',
        },
        surface: {
          container: '#131B2E',
          elevated: '#171F33',
          interactive: '#222A3D',
          highlight: '#2D3449',
        },
        border: {
          subtle: '#3E4850',
        },
        accent: {
          primary: '#89CEFF',
          action: '#0EA5E9',
          contrast: '#00344D',
        },
        text: {
          primary: '#DAE2FD',
          secondary: '#BEC8D2',
          muted: '#88929B',
        },
      },
    },
  },
  plugins: [],
};
