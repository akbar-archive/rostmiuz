"use client";

import { useEffect, useState } from "react";
import { getPlacePins } from "@/lib/places";
import type { PlacePin } from "@/lib/types";

export function usePlacePins() {
  const [places, setPlaces] = useState<PlacePin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlacePins()
      .then(setPlaces)
      .finally(() => setLoading(false));
  }, []);

  return { places, loading };
}
