/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons'
export default <Partial<Config>>{
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  // darkMode:['selector','[data-mode="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Roboto fallback', ...fontFamily.sans],
      },
      animation: {
        drawer: 'drawerT 0.4s ease-in-out',
        drawerleft: 'drawerL 0.4s ease-in-out',
      },
      keyframes: {
        drawerT: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        drawerL: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(['uil', 'tabler']),
    }),
  ],
}
