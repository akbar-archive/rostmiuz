import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://rostmiuz.web.app";
const title = "Rostmi";
const ogTitle = "rostmi.uz — places we've actually been to";
const description =
  "An interactive map of restaurants, cafés and spots our team has personally visited and rated around Tashkent, Uzbekistan — with photos and the Instagram video from each visit.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: ["Tashkent", "Uzbekistan", "restaurants", "cafes", "map", "reviews", "places to visit"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: ogTitle,
    description,
    url: siteUrl,
    siteName: "rostmi.uz",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: ogTitle,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
