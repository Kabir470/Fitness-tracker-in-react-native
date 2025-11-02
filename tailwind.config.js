/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2EE58F',
        secondary: '#4DC6FF',
        bg: '#FFFFFF',
        surface: '#F6F9FC',
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