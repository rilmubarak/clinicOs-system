/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-red-500', 'bg-red-700',
    'bg-green-500', 'bg-green-700',
    'bg-blue-500', 'bg-blue-700',
    'text-red-600',
    'text-green-600',
    'text-blue-600',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

