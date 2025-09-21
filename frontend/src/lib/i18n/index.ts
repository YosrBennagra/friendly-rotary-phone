import { en } from "./en";

export type Locale = "en";

const dictionaries = {
  en,
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? en;
}
