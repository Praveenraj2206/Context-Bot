/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0f0f1a",
          card: "#1a1a2e",
          accent: "#7c3aed",
          soft: "#a78bfa"
        }
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
}
