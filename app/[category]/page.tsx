import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { getArticles } from "@/lib/articles";
import { categories, site } from "@/lib/site";
export function generateStaticParams() { return categories.map(({ slug }) => ({ category: slug })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> { const { category: slug } = await params; const cat = categories.find((c) => c.slug === slug); const url = `/${slug}/`; return cat ? { title: cat.name, description: cat.description, alternates: site.canonical(url), openGraph: { title: `${cat.name}の記事`, description: cat.description, ...(site.urlConfigured ? { url } : {}) } } : {}; }
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) { const { category: slug } = await params; const category = categories.find((item) => item.slug === slug); if (!category) notFound(); const articles = getArticles().filter((a) => a.category === category.name); return <section className="container listing-page"><p className="eyebrow">CATEGORY / {slug.toUpperCase()}</p><h1>{category.name}</h1><p className="listing-description">{category.description}</p>{slug === "gpu" && <p className="gpu-category-compare"><Link href="/gpu/compare/">GPU比較表：仕様とVRAMでGPUを比べる ↗</Link></p>}<div className="article-grid">{articles.map((article) => <ArticleCard article={article} key={article.slug} />)}</div>{articles.length === 0 && <p className="empty-state">記事を準備中です。</p>}</section>; }
