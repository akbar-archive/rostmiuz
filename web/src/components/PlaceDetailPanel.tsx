"use client";

import { useState } from "react";
import Image from "next/image";
import { X, MapPin, Copy, Check, Instagram, Share2, ImageOff } from "lucide-react";
import type { Place } from "@/lib/types";
import { googleMapsUrl, yandexMapsUrl } from "@/lib/mapLinks";
import { formatRating } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { GoogleMapsIcon, YandexMapsIcon } from "./MapProviderIcons";
import StarRating from "./StarRating";
import Lightbox from "./Lightbox";
import ConfettiBurst from "./ConfettiBurst";
import { PlaceDetailSkeleton } from "./Skeleton";

export default function PlaceDetailPanel({
  place,
  loading,
  onClose,
}: {
  place: Place | null;
  loading: boolean;
  onClose: () => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [copyBurst, setCopyBurst] = useState(0);
  const [shareBurst, setShareBurst] = useState(0);
  const { t } = useLanguage();

  async function handleCopyAddress(address: string) {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setCopyBurst((k) => k + 1);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard permission denied or unavailable — nothing more we can do.
    }
  }

  async function handleShare(place: Place) {
    const url = `${window.location.origin}/map?place=${place.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: place.name, url });
      } catch {
        // User dismissed the native share sheet — not an error.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setShareBurst((k) => k + 1);
      setTimeout(() => setShared(false), 1800);
    } catch {
      // Clipboard permission denied or unavailable — nothing more we can do.
    }
  }

  return (
    <div className="animate-slide-in-panel absolute inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col overflow-hidden bg-white shadow-xl sm:m-3 sm:h-[calc(100%-1.5rem)] sm:rounded-3xl dark:bg-neutral-900">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-150 hover:bg-black/60 active:scale-90"
      >
        <X className="h-4 w-4" strokeWidth={2.25} />
      </button>

      <div className="flex-1 overflow-y-auto">
        {loading || !place ? (
          <PlaceDetailSkeleton />
        ) : (
          <>
            <button
              type="button"
              disabled={place.images.length === 0}
              onClick={() => setLightboxIndex(0)}
              className="group relative block h-40 w-full shrink-0 overflow-hidden bg-neutral-100 disabled:cursor-default dark:bg-neutral-800"
            >
              {place.images.length > 0 ? (
                <Image
                  src={place.images[0]}
                  alt={place.name}
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
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{place.name}</h2>
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
                  className="relative flex w-full cursor-pointer items-start gap-2 rounded-2xl bg-neutral-50 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-neutral-100 dark:bg-neutral-800/60 dark:hover:bg-neutral-800"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-500" strokeWidth={2.25} />
                  <span className="min-w-0 flex-1 text-sm text-neutral-600 dark:text-neutral-400">{place.address}</span>
                  {copied ? (
                    <Check className="animate-pop-bounce mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.25} />
                  ) : (
                    <Copy className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-500" strokeWidth={2.25} />
                  )}
                  <ConfettiBurst triggerKey={copyBurst} />
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
                  {t.detail.googleMaps}
                </a>
                <a
                  href={yandexMapsUrl(place.lat, place.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-full border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-150 hover:border-neutral-300 hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
                >
                  <YandexMapsIcon className="h-5 w-5" />
                  {t.detail.yandexMaps}
                </a>
              </div>

              <div className="flex items-center gap-2">
                {place.instagramUrl && (
                  <a
                    href={place.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:shadow active:scale-95"
                  >
                    <Instagram className="h-4 w-4" strokeWidth={2.25} />
                    {t.detail.instagram}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleShare(place)}
                  className={`relative flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-all duration-150 hover:border-neutral-300 hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-800 ${
                    place.instagramUrl ? "" : "flex-1"
                  }`}
                >
                  {shared ? (
                    <Check className="animate-pop-bounce h-4 w-4 text-emerald-500" strokeWidth={2.25} />
                  ) : (
                    <Share2 className="h-4 w-4" strokeWidth={2.25} />
                  )}
                  {shared ? t.detail.copied : t.detail.share}
                  <ConfettiBurst triggerKey={shareBurst} />
                </button>
              </div>

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
          </>
        )}
      </div>

      {place && lightboxIndex !== null && (
        <Lightbox
          images={place.images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
