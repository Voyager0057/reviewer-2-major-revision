import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const socialImage = new URL("/og.png", origin).toString();

  return {
    metadataBase: new URL(origin),
    title: "Reviewer #2: Major Revision",
    description:
      "A multilingual academic-survival deckbuilding roguelike with 528 cards, 256 interactive stories, capability-linked reviews, five difficulties, and 16 endings.",
    applicationName: "Reviewer #2: Major Revision",
    openGraph: {
      title: "Reviewer #2: Major Revision",
      description: "Configure a manuscript and revision campaign, survive 256 hidden-outcome academic stories, and discover 16 decision-letter endings.",
      type: "website",
      locale: "en_US",
      alternateLocale: ["zh_CN", "ja_JP", "ko_KR", "es_ES"],
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Reviewer #2: Major Revision" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Reviewer #2: Major Revision",
      description: "A multilingual academic-survival deckbuilder with 528 cards, 256 interactive stories, configurable campaigns, local save slots, and 16 endings.",
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#080e1b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
