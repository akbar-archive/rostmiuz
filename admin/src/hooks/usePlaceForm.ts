"use client";

import { useEffect, useState } from "react";
import { addPlace, getPlace, updatePlace, deletePlace } from "@/lib/places";
import type { PlaceInput } from "@/lib/types";
import { TASHKENT_CENTER } from "@/lib/constants";

const emptyForm: PlaceInput = {
  name: "",
  description: "",
  address: "",
  lat: TASHKENT_CENTER[1],
  lng: TASHKENT_CENTER[0],
  rating: 8,
  images: [],
  instagramUrl: "",
};

export function usePlaceForm(id: string | null) {
  const [form, setForm] = useState<PlaceInput>(emptyForm);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getPlace(id).then((place) => {
      if (place) setForm(place);
      setLoading(false);
    });
  }, [id]);

  function updateField<K extends keyof PlaceInput>(key: K, value: PlaceInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setLocation(lat: number, lng: number) {
    setForm((f) => ({ ...f, lat, lng }));
  }

  function addImage(url: string) {
    const trimmed = url.trim();
    if (!trimmed) return;
    setForm((f) => (f.images.includes(trimmed) ? f : { ...f, images: [...f.images, trimmed] }));
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  async function submit(): Promise<boolean> {
    setSaving(true);
    setError(null);
    try {
      if (id) {
        await updatePlace(id, form);
      } else {
        await addPlace(form);
      }
      return true;
    } catch {
      // A stable code, not a hardcoded English string — PlaceForm
      // translates it via the current language dictionary.
      setError("save-failed");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function remove(): Promise<boolean> {
    if (!id) return false;
    setDeleting(true);
    try {
      await deletePlace(id);
      return true;
    } catch {
      setError("save-failed");
      return false;
    } finally {
      setDeleting(false);
    }
  }

  return { form, updateField, setLocation, addImage, removeImage, loading, saving, deleting, error, submit, remove };
}
