import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site";
export const metadata: Metadata = { metadataBase: new URL(site.url), title: { default: "PCノート｜ゲーム・AI・動画編集のPC選び", template: "%s | PCノート" }, description: site.description, alternates: { ...(site.canonical("/") ?? {}), ...(site.urlConfigured ? { types: { "application/rss+xml": "/feed.xml" } } : {}) }, openGraph: { type: "website", locale: "ja_JP", siteName: site.name, title: "PCノート｜ゲーム・AI・動画編集のPC選び", description: site.description, ...(site.urlConfigured ? { url: "/" } : {}) }, twitter: { card: "summary", title: "PCノート｜ゲーム・AI・動画編集のPC選び", description: site.description }, verification: { google: "6gadKeMTvJ2BDVAv2EreXQJp0wfZ9cnwTrE-5heGfKU" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ja"><body><SiteHeader /><main>{children}</main><SiteFooter /></body></html>; }
