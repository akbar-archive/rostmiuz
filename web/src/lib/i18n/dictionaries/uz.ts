import type { Dictionary } from "./en";

const uz: Dictionary = {
  nav: {
    openMap: "Xaritani ochish",
  },
  landing: {
    badge: "Toshkent, Oʻzbekiston",
    titlePrefix: "Biz",
    titleHighlight: "chindan ham",
    titleSuffix: "borgan joylarimiz.",
    subtitle:
      "Sotib olingan sharhlar yoʻq, taxmin yoʻq. Xaritadagi har bir joyga jamoamiz aʼzolari shaxsan tashrif buyurgan, baholagan va suratga olgan — buning isboti sifatida Instagram videosi bilan.",
    exploreCta: "Xaritani koʻrish",
    ratingSummary: (avg, count) => `${avg} oʻrtacha baho, ${count} ta joy boʻyicha`,
    whyTrust: "Nega bu xaritaga ishonsa boʻladi?",
    features: [
      {
        title: "Chindan tashrif buyurilgan",
        body: "Xaritadagi har bir nuqta — jamoamiz aʼzosi shaxsan borgan joy, hech qachon koʻchirilgan roʻyxat emas.",
      },
      {
        title: "Halol baholangan",
        body: "Jamoaning yagona 0–10 bahosi. Algoritm yoʻq, reklama uchun boʻrttirilgan yulduzlar yoʻq.",
      },
      {
        title: "Video dalil",
        body: "Har bir joy bizning haqiqiy tashrifimizdan olingan Instagram videosiga toʻgʻridan-toʻgʻri ulanadi — borishdan oldin koʻrib oling.",
      },
    ],
    recentlyAdded: "Yaqinda qoʻshilganlar",
    seeAll: "Barchasini koʻrish →",
    readyTitle: "Sayohatga tayyormisiz?",
    readySubtitle: "Interaktiv xaritani oching va Toshkentdagi keyingi manzilingizni toping.",
    openMapCta: "Xaritani ochish",
    footerTagline: "rostmi.uz — jamoa tomonidan, jamoa uchun yaratilgan.",
    instagramBadge: (name) => `Yangi: ${name}`,
    instagramBadgeFallback: "Bizni kuzating",
    photosBadge: (count) => `${count} ta surat`,
  },
  map: {
    home: "Bosh sahifa",
    searchPlaceholder: "Joy qidirish…",
    noResults: (query) => `“${query}” boʻyicha hech narsa topilmadi.`,
  },
  detail: {
    googleMaps: "Google Xarita",
    yandexMaps: "Yandex Xarita",
    instagram: "Instagram",
    share: "Ulashish",
    copied: "Nusxalandi",
  },
  language: {
    label: "Til",
  },
};

export default uz;
