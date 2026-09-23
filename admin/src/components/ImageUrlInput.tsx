"use client";

import { useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { Plus, X, ImageOff } from "lucide-react";
import { inputClass } from "@/lib/styles";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function ImageThumb({ src, onRemove }: { src: string; onRemove: () => void }) {
  const [broken, setBroken] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
      {broken ? (
        <div className="flex h-full w-full items-center justify-center text-neutral-300 dark:text-neutral-600">
          <ImageOff className="h-6 w-6" strokeWidth={1.5} />
        </div>
      ) : (
        <Image src={src} alt="" fill className="object-cover" onError={() => setBroken(true)} />
      )}
      <button
        type="button"
        onClick={() => {
          if (confirm(t.form.removeImageConfirm)) onRemove();
        }}
        title={t.form.removeImage}
        className="absolute right-1 top-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white opacity-100 transition-all duration-150 hover:bg-black/80 active:scale-90 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function ImageUrlInput({
  images,
  onAdd,
  onRemove,
}: {
  images: string[];
  onAdd: (url: string) => void;
  onRemove: (index: number) => void;
}) {
  const [value, setValue] = useState("");
  const { t } = useLanguage();

  function handleAdd() {
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.form.addImageUrlPlaceholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="press-bounce flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-neutral-900 px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-neutral-700"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {t.form.addImage}
        </button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((src, i) => (
            <ImageThumb key={`${src}-${i}`} src={src} onRemove={() => onRemove(i)} />
          ))}
        </div>
      )}
    </div>
  );
}
