import type { Metadata } from "next";
import MapView from "@/components/MapView";

export const metadata: Metadata = {
  title: "Map — rostmi.uz",
  description:
    "An interactive map of restaurants, cafés and spots our team has personally visited and rated around Tashkent, Uzbekistan.",
};

export default function MapPage() {
  return <MapView />;
}
