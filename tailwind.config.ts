/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons";
export default <Partial<Config>>{
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  // darkMode:['selector','[data-mode="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "Roboto fallback", ...fontFamily.sans],
      },
      animation: {
        opacity: "opacityT 0.4s ease-in-out",
        drawerleft: "drawerL 0.4s ease-in-out",
      },
      height: {
        modalH: "calc(100vh - 210px)",
      },
      keyframes: {
        opacityT: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        drawerL: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["uil", "tabler"]),
    }),
  ],
};
