/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Soporte modo oscuro usando la clase "dark"
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#1e1e1e",
        darkText: "#e5e5e5"
      }
    }
  },
  plugins: []
}
