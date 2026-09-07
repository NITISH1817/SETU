/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0A192F',
          blue: '#1E3A8A',
          gold: '#D97706',
          slate: '#334155',
          light: '#F8FAFC',
          card: '#0F172A',
          emerald: '#059669',
          amber: '#D97706'
        }
      }
    },
  },
  plugins: [],
}
