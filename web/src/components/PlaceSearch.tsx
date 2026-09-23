"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import type { PlacePin } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import StarRating from "./StarRating";

export default function PlaceSearch({
  places,
  onSelect,
}: {
  places: PlacePin[];
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return places.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [places, query]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function handleSelect(id: string) {
    onSelect(id);
    handleQueryChange("");
    setFocused(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const place = results[activeIndex];
      if (place) handleSelect(place.id);
    } else if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="pointer-events-auto w-full max-w-sm">
      <div className="flex h-11 items-center gap-2.5 rounded-full bg-white/95 px-4 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-shadow duration-150 focus-within:ring-2 focus-within:ring-rose-300 dark:bg-neutral-900/95 dark:ring-white/10 dark:focus-within:ring-rose-800">
        <Search className="h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-500" strokeWidth={2.25} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={t.map.searchPlaceholder}
          maxLength={80}
          className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => handleQueryChange("")}
            className="shrink-0 cursor-pointer rounded-full p-0.5 text-neutral-400 transition-all duration-150 hover:bg-neutral-100 hover:text-neutral-600 active:scale-90 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {focused && results.length > 0 && (
        <ul className="animate-pop-in mt-2 max-h-80 overflow-y-auto rounded-2xl bg-white/95 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:bg-neutral-900/95 dark:ring-white/10">
          {results.map((place, i) => (
            <li key={place.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(place.id)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 active:scale-[0.98] ${
                  i === activeIndex ? "bg-rose-50 dark:bg-rose-950/40" : ""
                }`}
              >
                {place.thumbnailUrl ? (
                  <Image
                    src={place.thumbnailUrl}
                    alt=""
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-sm font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                    {place.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-medium ${
                      i === activeIndex
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-neutral-800 dark:text-neutral-200"
                    }`}
                  >
                    {place.name}
                  </p>
                  <StarRating rating={place.rating} className="h-3 w-3" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {focused && query && results.length === 0 && (
        <div className="animate-pop-in mt-2 flex flex-col items-center gap-1 rounded-2xl bg-white/95 p-4 text-center shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:bg-neutral-900/95 dark:ring-white/10">
          <Search className="h-4 w-4 text-neutral-300 dark:text-neutral-600" strokeWidth={2} />
          <p className="max-w-full break-words text-sm text-neutral-400 dark:text-neutral-500">
            <span className="break-all">{t.map.noResults(query)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
