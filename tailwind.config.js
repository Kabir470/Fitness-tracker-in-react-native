/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#22D3EE',
  bg: '#F2E4FD',
  surface: '#FFFFFF',
        text: '#101418',
      },
      borderRadius: {
        xl: '25px',
      },
      boxShadow: {
        soft: '0 6px 12px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
};