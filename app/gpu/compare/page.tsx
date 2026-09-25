import type { Metadata } from "next";
import Link from "next/link";
import { GPUComparisonBrowser } from "@/components/gpu-browser";
import { gpus } from "@/lib/gpus";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "GPU比較表｜VRAM・電力・用途分類",
  description: "GeForce RTXとRadeon RXの仕様をメーカー公表値で比較。VRAM、メモリタイプ、TDP、推奨電源を絞り込めます。用途分類は性能ベンチマークではありません。",
  alternates: site.canonical("/gpu/compare/"),
  openGraph: { type: "website", title: "GPU比較表｜VRAM・電力・用途分類", description: "GeForce RTXとRadeon RXの主要仕様を一覧比較。", ...(site.urlConfigured ? { url: "/gpu/compare/" } : {}), siteName: site.name },
  twitter: { card: "summary", title: "GPU比較表｜VRAM・電力・用途分類", description: "GeForce RTXとRadeon RXの主要仕様を一覧比較。" },
};

export default function GPUComparePage() {
  return <section className="container gpu-compare-page"><nav className="breadcrumbs"><Link href="/gpu/">GPU</Link><span>/</span><span>比較</span></nav><p className="eyebrow">GPU DATABASE / COMPARE</p><h1>GPU仕様を横並びで比較</h1><p className="listing-description">メーカーが公開する基準仕様と、VRAM容量帯による独自の用途分類を一覧できます。</p><GPUComparisonBrowser items={gpus} /><div className="gpu-compare-links"><Link href="/gpu/">GPUカテゴリの記事を見る ↗</Link><Link href="/articles/gaming-gpu-vs-ai-gpu/">ゲーム用GPUとAI用GPUの選び方 ↗</Link></div></section>;
}
