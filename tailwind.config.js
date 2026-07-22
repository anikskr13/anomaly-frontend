/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        darkbg: '#0d1117',
        card: '#161b22',
        border: '#30363d',
        accentBlue: '#1f6feb',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      }
    },
  },
  plugins: [],
}
