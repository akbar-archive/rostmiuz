"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_LANGUAGE, type Language } from "./languages";
import { dictionaries } from "./dictionaries";

const STORAGE_KEY = "rostmi-lang";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof dictionaries)[Language];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage may be unavailable (private mode, blocked cookies) — fall
      // back to the default language silently.
    }
    if (!stored || !(stored in dictionaries)) return;
    // Deferred rather than called synchronously in the effect body itself
    // — avoids triggering a same-tick cascading render.
    const timeout = setTimeout(() => setLanguageState(stored as Language), 0);
    return () => clearTimeout(timeout);
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Nothing more we can do if storage is unavailable.
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: dictionaries[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
