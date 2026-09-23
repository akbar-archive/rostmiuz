"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useSelectedPlaceId() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("place");

  function select(id: string) {
    router.replace(`/map?place=${id}`, { scroll: false });
  }

  function clear() {
    router.replace("/map", { scroll: false });
  }

  return { selectedId, select, clear };
}
