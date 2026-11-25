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
        archivo: ['Be Vietnam Pro', 'sans-serif'],
        sans: ['Be Vietnam Pro', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        canvas: {
          primary: 'var(--bg)',
          deep: 'var(--surface-subtle)',
        },
        surface: {
          container: 'var(--surface)',
          elevated: 'var(--surface)',
          interactive: 'var(--surface-subtle)',
          highlight: 'var(--line)',
        },
        border: {
          subtle: 'var(--line-strong)',
        },
        accent: {
          primary: 'var(--accent)',
          action: 'var(--accent)',
          contrast: 'var(--accent-contrast)',
        },
        text: {
          primary: 'var(--text)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
      },
    },
  },
  plugins: [],
};
