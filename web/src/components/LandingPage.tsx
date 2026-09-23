"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Camera, Instagram, ArrowRight, Compass } from "lucide-react";
import { usePlacePins } from "@/hooks/usePlaces";
import { getPlace } from "@/lib/places";
import { formatRating } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Place } from "@/lib/types";
import TiltCard from "./TiltCard";
import RevealOnScroll from "./RevealOnScroll";
import StarRating from "./StarRating";
import LanguageSwitcher from "./LanguageSwitcher";

const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/rostmi_uz";

export default function LandingPage() {
  const { places } = usePlacePins();
  const { t } = useLanguage();
  // A single extra fetch (not the whole detail collection — that would
  // defeat the point of keeping the pin list light) so the floating
  // badges can show one real place's real Instagram link and photo count
  // instead of made-up numbers.
  const [spotlight, setSpotlight] = useState<Place | null>(null);

  useEffect(() => {
    const first = places[0];
    if (!first) return;
    let cancelled = false;
    getPlace(first.id).then((full) => {
      if (!cancelled) setSpotlight(full);
    });
    return () => {
      cancelled = true;
    };
  }, [places]);

  const averageRating = places.length ? places.reduce((sum, p) => sum + p.rating, 0) / places.length : 0;
  const previewPlaces = places.slice(0, 3);
  const features = t.landing.features.map((f, i) => ({ ...f, icon: [MapPin, Star, Instagram][i] }));

  return (
    <div className="relative overflow-hidden bg-white dark:bg-neutral-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rose-200/50 blur-3xl dark:bg-rose-900/20" />
        <div className="animate-blob animation-delay-2000 absolute right-0 top-40 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-900/10" />
        <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl dark:bg-purple-900/10" />
      </div>

      <header className="relative z-30 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm">
            <MapPin className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">rostmi.uz</span>
        </div>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <Link
            href="/map"
            className="group flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-150 hover:border-neutral-300 hover:bg-neutral-50 active:scale-95 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            {t.nav.openMap}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 px-6 pb-20 pt-10 sm:pt-16 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <Compass className="h-3.5 w-3.5" strokeWidth={2.5} />
            {t.landing.badge}
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-100">
            {t.landing.titlePrefix}{" "}
            <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              {t.landing.titleHighlight}
            </span>{" "}
            {t.landing.titleSuffix}
          </h1>
          <p className="mt-4 max-w-md text-neutral-600 dark:text-neutral-400">{t.landing.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/map"
              className="group flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-rose-700 hover:shadow-lg active:scale-95"
            >
              {t.landing.exploreCta}
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
            {places.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <StarRating rating={averageRating} className="h-4 w-4" />
                <span>{t.landing.ratingSummary(formatRating(averageRating), places.length)}</span>
              </div>
            )}
          </div>
        </div>

        <TiltCard className="relative mx-auto w-full max-w-sm">
          <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <span className="h-10 w-10 rounded-2xl bg-rose-100 dark:bg-rose-950/40" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-2.5 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-rose-200 to-rose-100 dark:from-rose-950/40 dark:to-neutral-800" />
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-950/30 dark:to-neutral-800" />
            </div>
            <div className="mt-3 flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
              ))}
            </div>
          </div>

          <a
            href={spotlight?.instagramUrl || INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-float absolute -left-6 top-8 flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-lg transition-transform duration-150 hover:scale-105 dark:bg-neutral-900 dark:text-neutral-300"
          >
            <Instagram className="h-3.5 w-3.5 text-rose-500" strokeWidth={2.25} />
            {spotlight?.instagramUrl ? t.landing.instagramBadge(spotlight.name) : t.landing.instagramBadgeFallback}
          </a>
          {!!spotlight?.images.length && (
            <div className="animate-float animation-delay-2000 absolute -right-4 bottom-10 flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-lg dark:bg-neutral-900 dark:text-neutral-300">
              <Camera className="h-3.5 w-3.5 text-amber-500" strokeWidth={2.25} />
              {t.landing.photosBadge(spotlight.images.length)}
            </div>
          )}
        </TiltCard>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <RevealOnScroll>
          <h2 className="text-center text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {t.landing.whyTrust}
          </h2>
        </RevealOnScroll>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {features.map((f, i) => (
            <RevealOnScroll key={f.title} delay={i * 100}>
              <div className="group h-full rounded-3xl border border-neutral-200 bg-white p-6 transition-colors duration-150 hover:border-rose-200 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-rose-900">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 group-hover:animate-wiggle dark:bg-rose-950/40 dark:text-rose-400">
                  <f.icon className="h-5 w-5" strokeWidth={2.25} />
                </span>
                <h3 className="mt-4 font-semibold text-neutral-900 dark:text-neutral-100">{f.title}</h3>
                <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">{f.body}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {previewPlaces.length > 0 && (
        <section className="relative z-10 mx-auto max-w-5xl px-6 pb-16">
          <RevealOnScroll>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{t.landing.recentlyAdded}</h2>
              <Link href="/map" className="text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400">
                {t.landing.seeAll}
              </Link>
            </div>
          </RevealOnScroll>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {previewPlaces.map((p, i) => (
              <RevealOnScroll key={p.id} delay={i * 80}>
                <Link
                  href={`/map?place=${p.id}`}
                  className="group block overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-all duration-150 hover:rotate-1 hover:border-rose-200 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-rose-900"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    {p.thumbnailUrl ? (
                      <Image
                        src={p.thumbnailUrl}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-rose-200 dark:text-rose-900">
                        <MapPin className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{p.name}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <StarRating rating={p.rating} className="h-3 w-3" />
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{formatRating(p.rating)}</span>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </section>
      )}

      <footer className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 px-6 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 -top-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-black/10 blur-3xl" />
        </div>

        <RevealOnScroll className="relative flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
            <MapPin className="h-7 w-7" strokeWidth={2.25} />
          </span>
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-5xl">{t.landing.readyTitle}</h2>
          <p className="mt-4 max-w-sm text-rose-50">{t.landing.readySubtitle}</p>

          <Link
            href="/map"
            className="group relative mt-10 flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-lg font-bold text-rose-600 shadow-2xl transition-all duration-150 hover:scale-105 active:scale-95"
          >
            <span className="animate-pulse-ring absolute inset-0 rounded-full bg-white" />
            {t.landing.openMapCta}
            <ArrowRight className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-1" />
          </Link>

          <p className="mt-10 text-xs text-rose-100/80">{t.landing.footerTagline}</p>
        </RevealOnScroll>
      </footer>
    </div>
  );
}
