"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Type,
  MapPin,
  AlignLeft,
  Star,
  MapPinned,
  ImageIcon,
  Link2,
  Loader2,
  Save,
  Eye,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { usePlaceForm } from "@/hooks/usePlaceForm";
import { inputClass, textareaClass } from "@/lib/styles";
import { SkeletonForm } from "@/components/Skeleton";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LocationPicker from "./LocationPicker";
import ImageUrlInput from "./ImageUrlInput";
import PlacePreviewModal from "./PlacePreviewModal";

function FieldLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
      <Icon className="h-3.5 w-3.5 text-neutral-400" strokeWidth={2.25} />
      {children}
    </label>
  );
}

// A plain `value={form.rating} onChange={(e) => updateField("rating",
// Number(e.target.value))}` forces the field to "0" the instant it's
// cleared — Number("") is 0 — so there's no way to blank it out before
// typing a new value. This keeps its own draft text locally: the shared
// numeric rating only updates once the draft actually parses, and an
// empty/invalid draft snaps back to the last valid value on blur instead
// of committing garbage.
function RatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [text, setText] = useState(() => String(value));

  function handleChange(raw: string) {
    setText(raw);
    if (raw.trim() === "") return;
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) onChange(parsed);
  }

  function handleBlur() {
    if (text.trim() === "" || Number.isNaN(Number(text))) setText(String(value));
  }

  return (
    <input
      type="number"
      min={0}
      max={10}
      step={0.1}
      required
      value={text}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      className={`w-32 ${inputClass}`}
    />
  );
}

export default function PlaceForm({ id }: { id: string | null }) {
  const router = useRouter();
  const { form, updateField, setLocation, addImage, removeImage, loading, saving, deleting, error, submit, remove } =
    usePlaceForm(id);
  const [showPreview, setShowPreview] = useState(false);
  const { t } = useLanguage();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await submit();
    if (ok) router.push("/");
  }

  async function handleDelete() {
    if (!confirm(t.dashboard.deleteConfirm(form.name))) return;
    const ok = await remove();
    if (ok) router.push("/");
  }

  if (loading) return <SkeletonForm />;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="animate-pop-in space-y-5 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="flex items-center gap-3 border-b border-neutral-200 pb-5 dark:border-neutral-800">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm">
            {id ? <Pencil className="h-5 w-5" strokeWidth={2.25} /> : <Plus className="h-5 w-5" strokeWidth={2.5} />}
          </span>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {id ? t.form.editTitle : t.form.addTitle}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {id ? t.form.editSubtitle : t.form.addSubtitle}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <FieldLabel icon={Type}>{t.form.name}</FieldLabel>
          <input
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <FieldLabel icon={MapPin}>{t.form.address}</FieldLabel>
          <input
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <FieldLabel icon={AlignLeft}>{t.form.description}</FieldLabel>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className={textareaClass}
          />
        </div>

        <div className="space-y-1">
          <FieldLabel icon={Star}>{t.form.rating}</FieldLabel>
          <RatingInput value={form.rating} onChange={(v) => updateField("rating", v)} />
        </div>

        <div className="space-y-1">
          <FieldLabel icon={MapPinned}>{t.form.location}</FieldLabel>
          <LocationPicker lat={form.lat} lng={form.lng} onChange={setLocation} />
        </div>

        <div className="space-y-1">
          <FieldLabel icon={ImageIcon}>{t.form.photos}</FieldLabel>
          <ImageUrlInput images={form.images} onAdd={addImage} onRemove={removeImage} />
        </div>

        <div className="space-y-1">
          <FieldLabel icon={Link2}>{t.form.instagramUrl}</FieldLabel>
          <input
            value={form.instagramUrl}
            onChange={(e) => updateField("instagramUrl", e.target.value)}
            placeholder="https://www.instagram.com/p/..."
            className={inputClass}
          />
        </div>

        {error && (
          <p className="animate-pop-in rounded-full bg-rose-50 px-4 py-2 text-sm text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">{t.form.saveError}</p>
        )}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="press-bounce flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-rose-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" strokeWidth={2.25} />}
            {saving ? t.form.saving : t.form.save}
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="press-bounce flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-neutral-500 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <Eye className="h-4 w-4" strokeWidth={2.25} />
            {t.form.preview}
          </button>
        </div>

        {id && (
          <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="press-bounce flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-rose-600 transition-colors duration-150 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" strokeWidth={2.25} />}
              {t.dashboard.delete}
            </button>
          </div>
        )}
      </form>

      {showPreview && <PlacePreviewModal place={form} onClose={() => setShowPreview(false)} />}
    </>
  );
}
