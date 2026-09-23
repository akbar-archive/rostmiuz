"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      else if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onIndexChange]);

  return createPortal(
    <div
      className="animate-pop-in fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={(e) => {
        // Stop here: this is a portal, so a React synthetic event still
        // bubbles through the *component* tree it was declared in — if a
        // parent (e.g. a modal with its own backdrop-click-to-close) sits
        // above this in JSX, an unstopped click would close both at once.
        e.stopPropagation();
        onClose();
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-150 hover:bg-white/20 active:scale-90"
      >
        <X className="h-5 w-5" strokeWidth={2.25} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index - 1 + images.length) % images.length);
            }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-150 hover:bg-white/20 active:scale-90 sm:left-4"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index + 1) % images.length);
            }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-150 hover:bg-white/20 active:scale-90 sm:right-4"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element -- portal-rendered, unsized external URL; next/image's fill needs a sized ancestor we don't want to impose here */}
      <img
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full rounded-lg object-contain"
      />

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {index + 1} / {images.length}
        </div>
      )}
    </div>,
    document.body
  );
}
