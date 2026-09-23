// Split in two for a reason: Firestore's web SDK always returns whole
// documents (no server-side field selection on reads), so the only way to
// keep the "/" map load light is to physically store the heavy fields
// somewhere the initial pins query never touches.

// Lives at places/{id} — small, fetched for every pin on the map.
// thumbnailUrl mirrors images[0] from the detail doc (kept in sync on
// every save) purely so the map marker can show a photo without pulling
// the full images array down for every place on every "/" load.
export type PlacePin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number; // our team's rating, 0-10
  thumbnailUrl: string | null;
};

// Lives at places/{id}/detail/full — fetched only once a pin is selected.
export type PlaceDetailFields = {
  description: string;
  address: string;
  images: string[]; // image URLs found/saved from the web
  instagramUrl: string;
};

export type Place = PlacePin & PlaceDetailFields;

// thumbnailUrl is never user-edited — it's derived from images[0] at
// write time (see places.ts), so forms don't carry it as input.
export type PlaceInput = Omit<Place, "id" | "thumbnailUrl">;
