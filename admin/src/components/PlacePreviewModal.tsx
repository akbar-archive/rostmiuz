"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, MapPin, Copy, Check, Instagram, ImageOff } from "lucide-react";
import type { PlaceInput } from "@/lib/types";
import { googleMapsUrl, yandexMapsUrl } from "@/lib/mapLinks";
import { formatRating } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { GoogleMapsIcon, YandexMapsIcon } from "./MapProviderIcons";
import StarRating from "./StarRating";
import Lightbox from "./Lightbox";

export default function PlacePreviewModal({
  place,
  onClose,
}: {
  place: PlaceInput;
  onClose: () => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  async function handleCopyAddress(address: string) {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard permission denied or unavailable — nothing more we can do.
    }
  }

  // Portal straight to <body> so this overlay can never be trapped inside
  // an ancestor that happens to establish a containing block (a CSS
  // transform/filter/etc. anywhere between here and <body>) — that trap is
  // exactly what confined this modal to the page column instead of the
  // full viewport before. Safe without a mounted-check: this component is
  // only ever rendered client-side, from a click handler, never during SSR.
  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="animate-pop-in relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden overflow-y-auto rounded-3xl bg-white shadow-xl dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-150 hover:bg-black/60 active:scale-90"
        >
          <X className="h-4 w-4" strokeWidth={2.25} />
        </button>

        <button
          type="button"
          disabled={place.images.length === 0}
          onClick={() => setLightboxIndex(0)}
          className="group relative block h-40 w-full shrink-0 overflow-hidden bg-neutral-100 disabled:cursor-default dark:bg-neutral-800"
        >
          {place.images.length > 0 ? (
            <Image
              src={place.images[0]}
              alt={place.name || t.preview.untitled}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-50 to-neutral-100 dark:from-rose-950/30 dark:to-neutral-900">
              <ImageOff className="h-8 w-8 text-rose-200 dark:text-rose-900" strokeWidth={1.5} />
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
          {place.images.length > 1 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              1 / {place.images.length}
            </span>
          )}
        </button>

        <div className="space-y-3 p-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {place.name || t.preview.untitled}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={place.rating} />
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {formatRating(place.rating)} / 10
              </span>
            </div>
          </div>

          {place.address && (
            <button
              type="button"
              onClick={() => handleCopyAddress(place.address)}
              className="flex w-full cursor-pointer items-start gap-2 rounded-2xl bg-neutral-50 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-neutral-100 dark:bg-neutral-800/60 dark:hover:bg-neutral-800"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-500" strokeWidth={2.25} />
              <span className="min-w-0 flex-1 text-sm text-neutral-600 dark:text-neutral-400">{place.address}</span>
              {copied ? (
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.25} />
              ) : (
                <Copy className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-500" strokeWidth={2.25} />
              )}
            </button>
          )}

          {place.description && (
            <p className="whitespace-pre-line text-sm text-neutral-700 dark:text-neutral-300">{place.description}</p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <a
              href={googleMapsUrl(place.lat, place.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-full border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-150 hover:border-neutral-300 hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
            >
              <GoogleMapsIcon className="h-5 w-5" />
              {t.preview.googleMaps}
            </a>
            <a
              href={yandexMapsUrl(place.lat, place.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-full border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-150 hover:border-neutral-300 hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
            >
              <YandexMapsIcon className="h-5 w-5" />
              {t.preview.yandexMaps}
            </a>
          </div>

          {place.instagramUrl && (
            <a
              href={place.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:shadow active:scale-95"
            >
              <Instagram className="h-4 w-4" strokeWidth={2.25} />
              {t.preview.instagram}
            </a>
          )}

          {place.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {place.images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-xl ring-1 ring-neutral-200 transition-transform duration-150 hover:scale-105 dark:ring-neutral-800"
                >
                  <Image src={src} alt="" fill unoptimized className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={place.images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>,
    document.body
  );
}
