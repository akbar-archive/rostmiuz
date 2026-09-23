import {
  collection,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  serverTimestamp,
  deleteField,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Place, PlaceInput, PlacePin, PlaceDetailFields } from "./types";

const PLACES_COLLECTION = "places";
const DETAIL_DOC_PATH = ["detail", "full"] as const;

const emptyDetail: PlaceDetailFields = {
  description: "",
  address: "",
  images: [],
  instagramUrl: "",
};

// Only what the map needs to draw pins — no description/images/instagram.
export async function getPlacePins(): Promise<PlacePin[]> {
  const snapshot = await getDocs(collection(db, PLACES_COLLECTION));
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      lat: data.lat,
      lng: data.lng,
      rating: data.rating,
      thumbnailUrl: data.thumbnailUrl ?? data.images?.[0] ?? null,
    };
  });
}

export async function getPlace(id: string): Promise<Place | null> {
  const pinRef = doc(db, PLACES_COLLECTION, id);
  const detailRef = doc(db, PLACES_COLLECTION, id, ...DETAIL_DOC_PATH);
  const [pinSnap, detailSnap] = await Promise.all([getDoc(pinRef), getDoc(detailRef)]);
  if (!pinSnap.exists()) return null;

  const pinData = pinSnap.data();
  const pin: PlacePin = {
    id,
    name: pinData.name,
    lat: pinData.lat,
    lng: pinData.lng,
    rating: pinData.rating,
    thumbnailUrl: pinData.thumbnailUrl ?? pinData.images?.[0] ?? null,
  };

  // Older docs (from before the pin/detail split) still carry the detail
  // fields directly on the pin doc — fall back to those until the place
  // is re-saved, which migrates it to the detail subdocument.
  const detail: PlaceDetailFields = detailSnap.exists()
    ? (detailSnap.data() as PlaceDetailFields)
    : {
        description: pinData.description ?? emptyDetail.description,
        address: pinData.address ?? emptyDetail.address,
        images: pinData.images ?? emptyDetail.images,
        instagramUrl: pinData.instagramUrl ?? emptyDetail.instagramUrl,
      };

  return { ...pin, ...detail };
}

export async function addPlace(input: PlaceInput): Promise<string> {
  const { description, address, images, instagramUrl, ...pin } = input;
  const ref = await addDoc(collection(db, PLACES_COLLECTION), {
    ...pin,
    thumbnailUrl: images[0] ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await setDoc(doc(db, PLACES_COLLECTION, ref.id, ...DETAIL_DOC_PATH), {
    description,
    address,
    images,
    instagramUrl,
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePlace(id: string, input: PlaceInput): Promise<void> {
  const { description, address, images, instagramUrl, ...pin } = input;
  await Promise.all([
    updateDoc(doc(db, PLACES_COLLECTION, id), {
      ...pin,
      thumbnailUrl: images[0] ?? null,
      updatedAt: serverTimestamp(),
      // Clears any legacy detail fields left on the pin doc from before
      // the split, so this document actually gets lighter after a save.
      description: deleteField(),
      address: deleteField(),
      images: deleteField(),
      instagramUrl: deleteField(),
    }),
    setDoc(doc(db, PLACES_COLLECTION, id, ...DETAIL_DOC_PATH), {
      description,
      address,
      images,
      instagramUrl,
      updatedAt: serverTimestamp(),
    }),
  ]);
}

export async function deletePlace(id: string): Promise<void> {
  await Promise.all([
    deleteDoc(doc(db, PLACES_COLLECTION, id, ...DETAIL_DOC_PATH)),
    deleteDoc(doc(db, PLACES_COLLECTION, id)),
  ]);
}
