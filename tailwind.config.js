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
    },
  },
  plugins: [],
};
