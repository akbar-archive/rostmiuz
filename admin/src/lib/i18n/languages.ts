// To add a new language: add a dictionary file in ./dictionaries that
// satisfies `Dictionary` (see dictionaries/en.ts), register it in
// dictionaries/index.ts, then add its entry here.
export const LANGUAGES = [
  { code: "uz", label: "Oʻzbek", short: "UZ" },
  { code: "ru", label: "Русский", short: "RU" },
  { code: "en", label: "English", short: "EN" },
] as const;

export type Language = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: Language = "uz";
