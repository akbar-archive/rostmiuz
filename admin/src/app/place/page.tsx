"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PlaceForm from "@/components/PlaceForm";
import { SkeletonForm } from "@/components/Skeleton";

function PlaceFormWithParams() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return <PlaceForm id={id} />;
}

export default function AdminPlacePage() {
  return (
    <Suspense fallback={<SkeletonForm />}>
      <PlaceFormWithParams />
    </Suspense>
  );
}
