import type { Dictionary } from "./en";

const ru: Dictionary = {
  nav: {
    openMap: "Открыть карту",
  },
  landing: {
    badge: "Ташкент, Узбекистан",
    titlePrefix: "Места, где мы",
    titleHighlight: "реально",
    titleSuffix: "побывали.",
    subtitle:
      "Никаких проплаченных отзывов и догадок. Каждое место на карте наша команда посетила, оценила и сфотографировала лично — и в подтверждение есть видео в Instagram.",
    exploreCta: "Смотреть карту",
    ratingSummary: (avg, count) => `${avg} средний рейтинг по ${count} местам`,
    whyTrust: "Почему этой карте можно доверять?",
    features: [
      {
        title: "Реально посещено",
        body: "Каждая точка на карте — место, где лично побывал кто-то из нашей команды, а не скопированный список.",
      },
      {
        title: "Честная оценка",
        body: "Единая оценка от 0 до 10 от команды. Без алгоритмов и завышенных звёзд для рекламодателей.",
      },
      {
        title: "Видео-доказательство",
        body: "Каждое место ссылается на ролик в Instagram с нашего настоящего визита — посмотрите его перед поездкой.",
      },
    ],
    recentlyAdded: "Недавно добавленные",
    seeAll: "Смотреть все →",
    readyTitle: "Готовы исследовать?",
    readySubtitle: "Откройте интерактивную карту и найдите следующее место в Ташкенте.",
    openMapCta: "Открыть карту",
    footerTagline: "rostmi.uz — создано командой, для команды.",
    instagramBadge: (name) => `Новое: ${name}`,
    instagramBadgeFallback: "Подписаться",
    photosBadge: (count) => `${count} фото`,
  },
  map: {
    home: "Домой",
    searchPlaceholder: "Поиск мест…",
    noResults: (query) => `Ничего не найдено по запросу «${query}».`,
  },
  detail: {
    googleMaps: "Google Карты",
    yandexMaps: "Яндекс Карты",
    instagram: "Instagram",
    share: "Поделиться",
    copied: "Скопировано",
  },
  language: {
    label: "Язык",
  },
};

export default ru;
