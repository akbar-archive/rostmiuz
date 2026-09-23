"use client";

import { useEffect, useState } from "react";
import { getPlace } from "@/lib/places";
import type { Place } from "@/lib/types";

export function usePlaceDetail(id: string | null) {
  // Keyed by id rather than reset-on-change: avoids ever needing to call
  // setState synchronously when id clears, which trips the
  // set-state-in-effect lint (and is genuinely the simpler derivation).
  const [loaded, setLoaded] = useState<{ id: string; place: Place | null } | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getPlace(id).then((result) => {
      if (!cancelled) setLoaded({ id, place: result });
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const place = loaded?.id === id ? loaded.place : null;
  const loading = id !== null && loaded?.id !== id;

  return { place, loading };
}
