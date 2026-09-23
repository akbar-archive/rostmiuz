"use client";

import { useEffect, useState } from "react";
import { getPlacePins, deletePlace } from "@/lib/places";
import type { PlacePin } from "@/lib/types";

function sortPlaces(list: PlacePin[]) {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

export function useAdminPlaces() {
  const [places, setPlaces] = useState<PlacePin[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    getPlacePins()
      .then((p) => setPlaces(sortPlaces(p)))
      .finally(() => setLoading(false));
  }, []);

  async function remove(id: string) {
    setDeletingId(id);
    await deletePlace(id);
    const p = await getPlacePins();
    setPlaces(sortPlaces(p));
    setDeletingId(null);
  }

  return { places, loading, deletingId, remove };
}
