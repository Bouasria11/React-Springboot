/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        ember: '#d94f30',
        moss: '#31735f',
        linen: '#f7f1e8',
      },
      boxShadow: {
        soft: '0 12px 30px rgba(17, 24, 39, 0.10)',
      },
    },
  },
  plugins: [],
};
