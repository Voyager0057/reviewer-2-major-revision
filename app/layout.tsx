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
      "中英双语学术生存卡牌 Roguelike：264 张卡、160 条意见与三条解决路线，让每个行动真正对应审稿要求。",
    applicationName: "Reviewer #2: Major Revision",
    openGraph: {
      title: "Reviewer #2: Major Revision",
      description: "48 天完整投稿战役：用能力匹配卡牌完成审稿任务，处理服务器、导师与合作者制造的 128 种事件。",
      type: "website",
      locale: "zh_CN",
      alternateLocale: ["en_US"],
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Reviewer #2: Major Revision" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Reviewer #2: Major Revision",
      description: "A bilingual academic-survival deckbuilder with capability-linked cards, 160 review tasks, and a 48-day campaign.",
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
