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
      "中英双语学术生存卡牌 Roguelike：528 张卡、256 个故事、160 条能力关联意见、5 档难度与 16 个结局。",
    applicationName: "Reviewer #2: Major Revision",
    openGraph: {
      title: "Reviewer #2: Major Revision",
      description: "配置论文、难度与返修周期；在 256 个隐藏后果互动故事中对抗 Reviewer #2，并寻找 16 种结局。",
      type: "website",
      locale: "zh_CN",
      alternateLocale: ["en_US"],
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Reviewer #2: Major Revision" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Reviewer #2: Major Revision",
      description: "A bilingual academic-survival deckbuilder with 528 cards, 256 interactive stories, configurable campaigns, local save slots, and 16 endings.",
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
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
