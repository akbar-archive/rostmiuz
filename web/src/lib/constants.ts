// MapLibre uses [lng, lat] order everywhere, not {lat, lng}.
export const TASHKENT_CENTER: [number, number] = [69.24834, 41.3133];
export const DEFAULT_ZOOM = 12;

// Loose bounding box around Tashkent city + a small buffer — keeps the
// map from being panned or zoomed out to anywhere else.
// Format: [[west, south], [east, north]].
export const TASHKENT_BOUNDS: [[number, number], [number, number]] = [
  [69.05, 41.18],
  [69.45, 41.42],
];
export const MIN_ZOOM = 11;

export const MAP_STYLE_LIGHT_URL = "https://tiles.openfreemap.org/styles/positron";
export const MAP_STYLE_DARK_URL = "https://tiles.openfreemap.org/styles/dark";
