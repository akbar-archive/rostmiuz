"use client";

import { useEffect, useRef, useState } from "react";
import { MapLibreMap, Marker, AttributionControl, setWorkerUrl } from "maplibre-gl";
import { LocateFixed, Loader2, MousePointerClick } from "lucide-react";
import {
  TASHKENT_CENTER,
  TASHKENT_BOUNDS,
  MIN_ZOOM,
  DEFAULT_ZOOM,
  MAP_STYLE_LIGHT_URL,
  MAP_STYLE_DARK_URL,
} from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// See PlaceMap.tsx (web app) for why this is needed: MapLibre's default
// worker-URL resolution breaks under Next.js's bundler, so we point it at
// a self-hosted copy instead. Must run before any Map is constructed.
setWorkerUrl("/maplibre-gl-worker.mjs");

// A small "you are here" dot, distinct from the draggable red place pin —
// purely informational (not interactive, doesn't move the place marker).
function createUserLocationElement(): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "relative flex h-4 w-4 items-center justify-center";
  const pulse = document.createElement("span");
  pulse.className = "absolute h-full w-full animate-ping rounded-full bg-blue-400 opacity-75";
  const dot = document.createElement("span");
  dot.className = "relative h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow";
  el.appendChild(pulse);
  el.appendChild(dot);
  return el;
}

export default function LocationPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!mapRef.current) return;

    const center: [number, number] = lat && lng ? [lng, lat] : TASHKENT_CENTER;

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
      center,
      zoom: lat && lng ? 14 : DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxBounds: TASHKENT_BOUNDS,
      attributionControl: false,
      // No rotate/pitch — a flat 2D map is more predictable to pan on
      // touch devices, and avoids accidental tilts feeling "janky".
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });
    mapInstance.current = map;

    // Required attribution (OpenFreeMap's terms), but moved off bottom-right
    // so it doesn't overlap/block the locate-me button anchored there.
    map.addControl(new AttributionControl({ compact: true }), "bottom-left");

    // Hide the generic points-of-interest layer so the picker stays
    // uncluttered — streets, water, transit and district labels stay on.
    map.on("load", () => {
      hidePoiLayers();
      setMapLoaded(true);
    });

    // Follow the system theme live, matching the rest of the app's
    // Tailwind dark: classes — no in-app toggle needed.
    function handleThemeChange(e: MediaQueryListEvent) {
      map.setStyle(e.matches ? MAP_STYLE_DARK_URL : MAP_STYLE_LIGHT_URL);
      map.once("idle", hidePoiLayers);
    }
    prefersDark.addEventListener("change", handleThemeChange);

    const marker = new Marker({ draggable: true, color: "#e11d48" }).setLngLat(center).addTo(map);
    markerRef.current = marker;

    marker.on("dragend", () => {
      const pos = marker.getLngLat();
      onChangeRef.current(pos.lat, pos.lng);
    });

    map.on("click", (e) => {
      marker.setLngLat(e.lngLat);
      onChangeRef.current(e.lngLat.lat, e.lngLat.lng);
    });

    // Passive "you are here" indicator — best-effort only. Unlike the
    // "Locate me" button, this never moves the place pin and never surfaces
    // an error if permission is denied; it just doesn't show a dot.
    let userMarker: Marker | null = null;
    let watchId: number | null = null;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (userMarker) {
            userMarker.setLngLat([longitude, latitude]);
          } else {
            userMarker = new Marker({ element: createUserLocationElement() })
              .setLngLat([longitude, latitude])
              .addTo(map);
          }
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }

    return () => {
      prefersDark.removeEventListener("change", handleThemeChange);
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      userMarker?.remove();
      map.remove();
      mapInstance.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLocateMe() {
    if (!navigator.geolocation) {
      setLocateError(t.form.locateUnsupported);
      return;
    }

    setLocating(true);
    setLocateError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onChangeRef.current(latitude, longitude);
        mapInstance.current?.flyTo({ center: [longitude, latitude], zoom: 16 });
        markerRef.current?.setLngLat([longitude, latitude]);
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        setLocateError(error.code === error.PERMISSION_DENIED ? t.form.locateDenied : t.form.locateFailed);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div>
      <div className="relative">
        <div ref={mapRef} className="h-56 w-full overflow-hidden rounded-3xl border border-neutral-300 dark:border-neutral-700" />
        {!mapLoaded && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-neutral-100 dark:bg-neutral-800">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400 dark:text-neutral-600" />
          </div>
        )}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating}
          title={t.form.useMyLocation}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-neutral-600 shadow-md transition-colors duration-150 hover:bg-neutral-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-rose-400"
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4" strokeWidth={2.25} />
          )}
        </button>
      </div>
      {locateError && <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{locateError}</p>}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <MousePointerClick className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
          {t.form.locationHint}
        </p>
        {lat !== null && lng !== null && (
          <div className="flex gap-1.5">
            <span className="rounded-full bg-neutral-100 px-2 py-1 font-mono text-[11px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              {lat.toFixed(5)}
            </span>
            <span className="rounded-full bg-neutral-100 px-2 py-1 font-mono text-[11px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              {lng.toFixed(5)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
