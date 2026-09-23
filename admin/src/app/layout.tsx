import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AdminGate from "@/components/AdminGate";
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

export const metadata: Metadata = {
  title: "Rostmi Admin",
  description: "Internal admin panel — not for public use.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <AdminGate>{children}</AdminGate>
        </LanguageProvider>
      </body>
    </html>
  );
}
