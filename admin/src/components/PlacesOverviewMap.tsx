"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

// See LocationPicker.tsx for why this is needed: MapLibre's default
// worker-URL resolution breaks under Next.js's bundler, so we point it at
// a self-hosted copy instead. Must run before any Map is constructed.
setWorkerUrl("/maplibre-gl-worker.mjs");

function createMarkerElement(name: string, thumbnailUrl: string | null): HTMLDivElement {
  // MapLibre positions markers by writing its own `transform: translate(...)`
  // directly onto the element it's given, via inline style. Putting our own
  // hover/scale transform on that SAME element fights that positioning
  // transform (same CSS property, same node) and makes the pin jump on
  // hover. So MapLibre gets an outer wrapper to position, and all our own
  // styling — including the hover transform — lives on an inner child.
  const wrapper = document.createElement("div");
  wrapper.addEventListener("mouseenter", () => {
    wrapper.style.zIndex = "10";
  });
  wrapper.addEventListener("mouseleave", () => {
    wrapper.style.zIndex = "0";
  });

  const card = document.createElement("div");
  card.className =
    "flex h-11 w-11 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-rose-600 font-semibold text-white shadow-lg transition-transform duration-150 hover:scale-110";

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

export default function PlacesOverviewMap({ places }: { places: PlacePin[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const router = useRouter();
  const routerRef = useRef(router);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

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
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });

    map.on("load", () => {
      hidePoiLayers();
      setMapLoaded(true);
    });

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
    markers.current = [];

    places.forEach((place, index) => {
      const el = createMarkerElement(place.name, place.thumbnailUrl);
      el.title = place.name;
      el.addEventListener("click", () => routerRef.current.push(`/place?id=${place.id}`));

      // This component remounts fresh whenever the dashboard switches to
      // map view, so a bounce-in every time reads as intentional, not
      // chaotic (unlike re-animating on every click in the public map).
      const card = el.firstElementChild as HTMLElement | null;
      if (card) {
        card.classList.add("animate-pin-drop");
        card.style.animationDelay = `${Math.min(index, 15) * 40}ms`;
      }

      const marker = new Marker({ element: el }).setLngLat([place.lng, place.lat]).addTo(map);
      markers.current.push(marker);
    });
  }, [places]);

  return (
    <div className="relative h-[28rem] w-full overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800">
      <div ref={mapRef} className="h-full w-full" />
      {!mapLoaded && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400 dark:text-neutral-600" />
        </div>
      )}
    </div>
  );
}
