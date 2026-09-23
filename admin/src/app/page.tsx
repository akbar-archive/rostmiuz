"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPinned, Pencil, Trash2, Plus, Star, Search, X, List, Map as MapIcon } from "lucide-react";
import { useAdminPlaces } from "@/hooks/usePlaces";
import { SkeletonList } from "@/components/Skeleton";
import StarRating from "@/components/StarRating";
import PlacesOverviewMap from "@/components/PlacesOverviewMap";
import { inputClass } from "@/lib/styles";
import { formatRating } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-4 transition-colors duration-150 hover:border-rose-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-rose-900">
      <p className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
        <Icon className="h-3.5 w-3.5 group-hover:animate-wiggle" strokeWidth={2.25} />
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { places, loading, deletingId, remove } = useAdminPlaces();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  const { t } = useLanguage();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return places;
    return places.filter((p) => p.name.toLowerCase().includes(q));
  }, [places, query]);

  const averageRating = places.length
    ? places.reduce((sum, p) => sum + p.rating, 0) / places.length
    : 0;

  function handleDelete(id: string, name: string) {
    if (!confirm(t.dashboard.deleteConfirm(name))) return;
    remove(id);
  }

  if (loading) return <SkeletonList />;

  if (places.length === 0) {
    return (
      <div className="animate-pop-in flex flex-col items-center gap-3 rounded-3xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-700">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
          <MapPinned className="h-6 w-6" strokeWidth={2} />
        </span>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{t.dashboard.noPlacesYet}</p>
        <Link
          href="/place"
          className="press-bounce flex cursor-pointer items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-rose-700 hover:shadow"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {t.dashboard.addFirstPlace}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{t.dashboard.title}</h1>
        <Link
          href="/place"
          className="press-bounce flex cursor-pointer items-center gap-1.5 rounded-full bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-rose-700 hover:shadow"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {t.dashboard.addPlace}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={MapPinned} label={t.dashboard.totalPlaces} value={String(places.length)} />
        <StatCard icon={Star} label={t.dashboard.averageRating} value={`${formatRating(averageRating)} / 10`} />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            strokeWidth={2.25}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.dashboard.searchPlaceholder}
            maxLength={80}
            className={`${inputClass} h-11 pl-10 pr-9`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 transition-colors duration-150 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex h-11 shrink-0 items-center gap-0.5 rounded-full border border-neutral-200 p-1 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setView("list")}
            title={t.dashboard.listView}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-150 active:scale-90 ${
              view === "list"
                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            }`}
          >
            <List className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={() => setView("map")}
            title={t.dashboard.mapView}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-150 active:scale-90 ${
              view === "map"
                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            }`}
          >
            <MapIcon className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </div>
      </div>

      {view === "map" ? (
        <div className="animate-pop-in">
          <PlacesOverviewMap places={filtered} />
        </div>
      ) : filtered.length === 0 ? (
        <p className="mx-auto max-w-full break-words px-4 py-8 text-center text-sm text-neutral-400 dark:text-neutral-500">
          <span className="break-all">{t.dashboard.noResults(query)}</span>
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((place, i) => (
            <li
              key={place.id}
              style={{ animationDelay: `${i * 30}ms` }}
              className={`animate-pop-in group flex items-center justify-between rounded-3xl border border-neutral-200 bg-white px-4 py-3 transition-colors duration-150 hover:border-rose-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-rose-900 ${
                deletingId === place.id ? "pointer-events-none opacity-40" : ""
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                {place.thumbnailUrl ? (
                  <Image
                    src={place.thumbnailUrl}
                    alt=""
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 shrink-0 rounded-xl object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-sm font-semibold text-rose-600 transition-transform duration-200 group-hover:scale-105 dark:bg-rose-950/40 dark:text-rose-400">
                    {place.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">{place.name}</p>
                  <p className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                    <StarRating rating={place.rating} className="h-3.5 w-3.5" />
                    {formatRating(place.rating)} / 10
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity duration-150 sm:opacity-70 sm:group-hover:opacity-100">
                <Link
                  href={`/place?id=${place.id}`}
                  title={t.dashboard.edit}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-all duration-150 hover:bg-rose-50 hover:text-rose-600 active:scale-90 dark:text-neutral-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2} />
                </Link>
                <button
                  onClick={() => handleDelete(place.id, place.name)}
                  title={t.dashboard.delete}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition-all duration-150 hover:bg-rose-50 hover:text-rose-600 active:scale-90 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
