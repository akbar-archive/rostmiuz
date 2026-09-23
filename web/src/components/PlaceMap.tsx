"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { MapLibreMap, Marker, setWorkerUrl } from "maplibre-gl";
import {
  TASHKENT_CENTER,
  DEFAULT_ZOOM,
  TASHKENT_BOUNDS,
  MIN_ZOOM,
  MAP_STYLE_LIGHT_URL,
  MAP_STYLE_DARK_URL,
} from "@/lib/constants";
import type { PlacePin } from "@/lib/types";

// MapLibre normally locates its worker script relative to its own bundled
// module URL (import.meta.url) — but Next.js's bundler relocates/renames
// modules, so that computed URL 404s and the browser rejects the HTML
// fallback page as a worker script. Point it at a self-hosted copy instead
// (public/maplibre-gl-worker.mjs + its sibling maplibre-gl-shared.mjs).
// Must run before any Map is constructed.
setWorkerUrl("/maplibre-gl-worker.mjs");

type PlaceMapProps = {
  places: PlacePin[];
  selectedId: string | null;
  onSelectPlace: (id: string) => void;
};

function createMarkerElement(name: string, thumbnailUrl: string | null, isSelected: boolean): HTMLDivElement {
  // MapLibre positions markers by writing its own `transform: translate(...)`
  // directly onto the element it's given, via inline style. Putting our
  // hover/scale transform on that SAME element fights that positioning
  // transform (same CSS property, same node) and glitches on hover. So
  // MapLibre gets an outer wrapper to position, and all our own styling —
  // including the hover transform — lives on an inner child instead.
  const wrapper = document.createElement("div");
  const baseZIndex = isSelected ? "20" : "0";
  wrapper.style.zIndex = baseZIndex;
  // Bring whichever pin is under the cursor to the very front, so it isn't
  // clipped by neighboring pins when they're close together — restored to
  // its resting z-index (elevated if selected, normal otherwise) on leave.
  wrapper.addEventListener("mouseenter", () => {
    wrapper.style.zIndex = "30";
  });
  wrapper.addEventListener("mouseleave", () => {
    wrapper.style.zIndex = baseZIndex;
  });

  const card = document.createElement("div");
  const size = isSelected ? "h-16 w-16" : "h-12 w-12";
  const border = isSelected ? "border-rose-500 ring-2 ring-rose-300" : "border-white";
  card.className = `flex ${size} cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 ${border} bg-rose-600 font-semibold text-white shadow-lg transition-transform duration-150 hover:scale-105`;

  if (thumbnailUrl) {
    const img = document.createElement("img");
    img.src = thumbnailUrl;
    img.alt = "";
    img.className = "h-full w-full object-cover";
    card.appendChild(img);
  } else {
    card.textContent = name.charAt(0).toUpperCase();
  }

  wrapper.appendChild(card);
  return wrapper;
}

export default function PlaceMap({ places, selectedId, onSelectPlace }: PlaceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MapLibreMap | null>(null);
  const markers = useRef<Map<string, Marker>>(new Map());
  const onSelectPlaceRef = useRef(onSelectPlace);
  // Only bounce pins in on the very first render with data — re-selecting a
  // place recreates every marker (see effect below) but shouldn't replay
  // the drop animation on all of them each time.
  const hasDroppedInitialPins = useRef(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    onSelectPlaceRef.current = onSelectPlace;
  }, [onSelectPlace]);

  useEffect(() => {
    if (!mapRef.current) return;

    function hidePoiLayers() {
      const style = map.getStyle();
      style.layers?.forEach((layer) => {
        if ("source-layer" in layer && layer["source-layer"] === "poi") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    const map = new MapLibreMap({
      container: mapRef.current,
      style: prefersDark.matches ? MAP_STYLE_DARK_URL : MAP_STYLE_LIGHT_URL,
      center: TASHKENT_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxBounds: TASHKENT_BOUNDS,
      attributionControl: { compact: true },
      // No rotate/pitch — a flat 2D map is more predictable to pan on
      // touch devices, and avoids accidental tilts feeling "janky".
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });

    // Hide the generic points-of-interest layer (restaurants, shops,
    // museums, parks, ...) so only our own pins stand out. Streets, water,
    // transit/metro and administrative (district) labels live in separate
    // source layers and are untouched.
    map.on("load", () => {
      hidePoiLayers();
      setMapLoaded(true);
    });

    // Follow the system theme live, matching it the same way the rest of
    // the app's Tailwind dark: classes do — no in-app toggle needed.
    function handleThemeChange(e: MediaQueryListEvent) {
      map.setStyle(e.matches ? MAP_STYLE_DARK_URL : MAP_STYLE_LIGHT_URL);
      map.once("idle", hidePoiLayers);
    }
    prefersDark.addEventListener("change", handleThemeChange);

    mapInstance.current = map;

    return () => {
      prefersDark.removeEventListener("change", handleThemeChange);
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    markers.current.forEach((m) => m.remove());
    markers.current.clear();

    const shouldDrop = !hasDroppedInitialPins.current && places.length > 0;

    places.forEach((place, index) => {
      const isSelected = place.id === selectedId;
      const el = createMarkerElement(place.name, place.thumbnailUrl, isSelected);
      el.addEventListener("click", () => onSelectPlaceRef.current(place.id));

      if (shouldDrop) {
        // The wrapper (`el`) is what MapLibre positions via its own inline
        // transform — animating that would fight it. Its only child is the
        // styled card, so the drop animation goes there instead.
        const card = el.firstElementChild as HTMLElement | null;
        if (card) {
          card.classList.add("animate-pin-drop");
          card.style.animationDelay = `${Math.min(index, 15) * 40}ms`;
        }
      }

      const marker = new Marker({ element: el })
        .setLngLat([place.lng, place.lat])
        .addTo(map);

      markers.current.set(place.id, marker);
    });

    if (shouldDrop) hasDroppedInitialPins.current = true;

    const selected = places.find((p) => p.id === selectedId);
    if (selected) {
      map.easeTo({ center: [selected.lng, selected.lat], duration: 500 });
    }
  }, [places, selectedId]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />

      {!mapLoaded && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400 dark:text-neutral-600" />
        </div>
      )}
    </div>
  );
}
