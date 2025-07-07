// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',  // adjust if your code is in a different folder
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',       // replaces blue-600
        secondary: '#64748b',     // replaces gray-500
        accent: '#f59e0b',        // e.g., buttons or highlights
        light: '#f9fafb',         // replaces gray-50
        dark: '#1f2937',          // replaces gray-900
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      spacing: {
        'section': '4rem',        // for consistent section padding
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
