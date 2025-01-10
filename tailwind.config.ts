/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
export default <Partial<Config>>  {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Roboto fallback', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}

