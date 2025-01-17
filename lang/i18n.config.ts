import zh from "./zh.json";
import en from "./en.json";
export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    zh,
  },
}));
