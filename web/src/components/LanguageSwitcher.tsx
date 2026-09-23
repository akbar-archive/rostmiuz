"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LANGUAGES } from "@/lib/i18n/languages";

export default function LanguageSwitcher({
  className = "",
  dropDirection = "down",
}: {
  className?: string;
  dropDirection?: "up" | "down";
}) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition-all duration-150 hover:bg-neutral-100 active:scale-95 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <Globe className="h-4 w-4" strokeWidth={2.25} />
        {current.short}
      </button>

      {open && (
        <div
          className={`animate-pop-in absolute right-0 z-20 min-w-[8.5rem] overflow-hidden rounded-2xl bg-white p-1 shadow-lg ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10 ${
            dropDirection === "up" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code);
                setOpen(false);
              }}
              className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm text-neutral-700 transition-colors duration-150 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {l.label}
              {l.code === language && <Check className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
