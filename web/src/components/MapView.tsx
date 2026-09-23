"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import PlaceMap from "@/components/PlaceMap";
import PlaceDetailPanel from "@/components/PlaceDetailPanel";
import PlaceSearch from "@/components/PlaceSearch";
import MapSkeleton from "@/components/MapSkeleton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { usePlacePins } from "@/hooks/usePlaces";
import { usePlaceDetail } from "@/hooks/usePlaceDetail";
import { useSelectedPlaceId } from "@/hooks/useSelectedPlaceId";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function MapViewContent() {
  const { places, loading } = usePlacePins();
  const { selectedId, select, clear } = useSelectedPlaceId();
  const { place, loading: detailLoading } = usePlaceDetail(selectedId);
  const { t } = useLanguage();

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {loading && <MapSkeleton />}

      <div className="pointer-events-none absolute left-3 right-3 top-3 z-30 flex items-start gap-2">
        <Link
          href="/"
          title={t.map.home}
          className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/95 text-neutral-700 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-all duration-150 hover:bg-white active:scale-90 dark:bg-neutral-900/95 dark:text-neutral-300 dark:ring-white/10 dark:hover:bg-neutral-900"
        >
          <Home className="h-4 w-4" strokeWidth={2.25} />
        </Link>
        <div className="min-w-0 flex-1">
          <PlaceSearch places={places} onSelect={select} />
        </div>
        <div className="pointer-events-auto flex h-11 shrink-0 items-center rounded-full bg-white/95 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:bg-neutral-900/95 dark:ring-white/10">
          <LanguageSwitcher />
        </div>
      </div>

      <PlaceMap places={places} selectedId={selectedId} onSelectPlace={select} />

      {selectedId && <PlaceDetailPanel place={place} loading={detailLoading} onClose={clear} />}
    </div>
  );
}

export default function MapView() {
  return (
    <Suspense fallback={<MapSkeleton />}>
      <MapViewContent />
    </Suspense>
  );
}
