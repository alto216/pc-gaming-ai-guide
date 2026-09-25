import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GPUUsageSummary } from "@/components/gpu-browser";
import { GPUProducts } from "@/components/article-ui";
import { getGPU, gpus } from "@/lib/gpus";
import { site } from "@/lib/site";
import { getArticles } from "@/lib/articles";

export function generateStaticParams() { return gpus.map(({ id }) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params; const gpu = getGPU(id); if (!gpu) return {};
  const description = `${gpu.name}のVRAM、メモリタイプ、電力、推奨電源などの基準仕様と、当サイト独自のVRAM容量分類を掲載。`;
  return { title: `${gpu.name}の仕様・用途分類`, description, alternates: site.canonical(`/gpu/${id}/`), openGraph: { type: "website", title: `${gpu.name}の仕様・用途分類`, description, ...(site.urlConfigured ? { url: `/gpu/${id}/` } : {}), siteName: site.name }, twitter: { card: "summary", title: `${gpu.name}の仕様・用途分類`, description } };
}

export default async function GPUDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const gpu = getGPU(id); if (!gpu) notFound();
  const relatedSlugs = gpu.id === "rtx-3060-12gb" ? ["rtx-3060-12gb-2026", "local-llm-vram-guide", "gaming-gpu-vs-ai-gpu"] : ["local-llm-vram-guide", "gaming-gpu-vs-ai-gpu"];
  const relatedArticles = getArticles().filter((article) => relatedSlugs.includes(article.slug));
  const description = `${gpu.name}のメーカー公表仕様と、当サイト独自の用途分類を確認できます。`;
  const webPageSchema = { "@context": "https://schema.org", "@type": "WebPage", name: `${gpu.name}の仕様・用途分類`, description, ...(site.urlConfigured ? { url: `${site.url}/gpu/${gpu.id}/`, isPartOf: { "@type": "WebSite", name: site.name, url: site.url } } : {}) };
  return <article className="container gpu-detail-page"><nav className="breadcrumbs"><Link href="/gpu/">GPU</Link><span>/</span><span>{gpu.name}</span></nav><header className="gpu-detail-header"><p className="eyebrow">GPU DATABASE / {gpu.manufacturer}</p><h1>{gpu.name}</h1><p>製品メーカーの個別カードではなく、GPUチップの基準仕様をまとめています。</p></header>
    <section className="gpu-spec-section"><h2>基本スペック</h2><dl className="gpu-spec-grid"><div><dt>メーカー / アーキテクチャ</dt><dd>{gpu.manufacturer} / {gpu.architecture}</dd></div><div><dt>VRAM</dt><dd>{gpu.vramGB}GB</dd></div><div><dt>メモリタイプ</dt><dd>{gpu.memoryType}</dd></div><div><dt>グラフィックスカード電力 / TBP</dt><dd>{gpu.tdpW}W</dd></div><div><dt>メーカー推奨電源</dt><dd>{gpu.recommendedPsuW}W</dd></div><div><dt>発売年</dt><dd>{gpu.releaseYear}</dd></div></dl><p className="gpu-spec-note">{gpu.notes} NVIDIA値は基準カード、AMD値はTypical Board Powerと最小電源推奨を参照しています。ボードメーカー製品の実際の仕様は個別に確認してください。</p><a className="button button-outline gpu-official-link" href={gpu.officialUrl} target="_blank" rel="noreferrer">メーカー公式仕様を確認 ↗</a></section>
    <GPUProducts gpuIds={[gpu.id]} heading="このGPUを搭載した製品" showEmptyState />
    <GPUUsageSummary gpu={gpu} />
    <section className="gpu-detail-copy"><h2>向いている用途</h2><p>VRAM容量から見たメモリ余裕の目安を用途評価に示しています。ゲームのfps、AIモデルの動作可否、動画の書き出し速度を示す値ではありません。用途別ソフトの対応状況や、条件が明記された実測情報もあわせて確認してください。</p><h2>注意点</h2><ul><li>GPUチップ名が同じでも、カード製品によりサイズ・冷却・電力設定・端子が異なります。</li><li>推奨電源は基準構成の目安です。PC全体の構成とカードメーカーの仕様を確認してください。</li><li>独自分類値はVRAM容量帯の整理に限り、性能順位やベンチマークではありません。</li></ul></section>
    <section className="gpu-related"><h2>関連する記事</h2><ul>{relatedArticles.map((article) => <li key={article.slug}><Link href={`/articles/${article.slug}/`}>{article.title} ↗</Link></li>)}<li><Link href="/gpu/compare/">GPU比較表を見る ↗</Link></li></ul></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema).replace(/</g, "\\u003c") }} />
  </article>;
}
