export function googleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function yandexMapsUrl(lat: number, lng: number): string {
  // Yandex takes points as "lon,lat" in the pt parameter.
  return `https://yandex.com/maps/?pt=${lng},${lat}&z=17&l=map`;
}
