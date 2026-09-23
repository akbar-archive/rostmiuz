// Real provider marks (trimmed to their natural pin shape — see
// public/google-maps-logo.webp / public/yandex-maps-logo.webp). Their
// native aspect ratios aren't identical, so both are fit with
// object-contain into the SAME square box (pass a square className, e.g.
// "h-5 w-5") rather than sized by height alone — that would let Yandex's
// stockier shape read as visibly bigger than Google's taller one even at
// matching heights.

export function GoogleMapsIcon({ className = "h-5 w-5" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- fixed local asset, native aspect ratio matters more here than next/image's optimization
  return <img src="/google-maps-logo.webp" alt="" className={`object-contain ${className}`} />;
}

export function YandexMapsIcon({ className = "h-5 w-5" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- fixed local asset, native aspect ratio matters more here than next/image's optimization
  return <img src="/yandex-maps-logo.webp" alt="" className={`object-contain ${className}`} />;
}
