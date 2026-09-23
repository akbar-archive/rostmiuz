// The canonical shape every other dictionary is checked against (see
// ru.ts / uz.ts: `const ru: Dictionary = {...}`). Add a new string here
// first — TypeScript will then flag every other dictionary that's
// missing it.
const en = {
  nav: {
    openMap: "Open map",
  },
  landing: {
    badge: "Tashkent, Uzbekistan",
    titlePrefix: "Places we've",
    titleHighlight: "actually",
    titleSuffix: "been to.",
    subtitle:
      "No sponsored reviews, no guesswork. Every spot on this map was visited, rated and photographed by our own team — with the Instagram reel to prove it.",
    exploreCta: "Explore the map",
    ratingSummary: (avg: string, count: number) => `${avg} average across ${count} spots`,
    whyTrust: "Why trust this map?",
    features: [
      {
        title: "Actually visited",
        body: "Every pin marks somewhere a member of our team has personally been — never a copy-pasted listing.",
      },
      {
        title: "Honestly rated",
        body: "A single 0–10 team rating. No algorithm, no inflated stars for advertisers.",
      },
      {
        title: "Video proof",
        body: "Each place links straight to the Instagram reel from our actual visit — see it before you go.",
      },
    ],
    recentlyAdded: "Recently added",
    seeAll: "See all →",
    readyTitle: "Ready to explore?",
    readySubtitle: "Open the interactive map and find your next spot in Tashkent.",
    openMapCta: "Open the map",
    footerTagline: "rostmi.uz — built by the team, for the team.",
    instagramBadge: (name: string) => `New: ${name}`,
    instagramBadgeFallback: "Follow us",
    photosBadge: (count: number) => `${count} photos`,
  },
  map: {
    home: "Home",
    searchPlaceholder: "Search places…",
    noResults: (query: string) => `No places match "${query}".`,
  },
  detail: {
    googleMaps: "Google Maps",
    yandexMaps: "Yandex Maps",
    instagram: "Instagram",
    share: "Share",
    copied: "Copied",
  },
  language: {
    label: "Language",
  },
};

export type Dictionary = typeof en;
export default en;
