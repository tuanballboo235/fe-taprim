/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Màu xanh chính
        secondary: '#dc2626', // Màu đỏ phụ (cho giỏ hàng)
      },
    },
  },
  plugins: [],
};