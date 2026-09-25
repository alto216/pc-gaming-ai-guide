import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleTOC, FAQ, Notice, AffiliateDisclosure, RelatedArticles, GPUProducts } from "@/components/article-ui";
import { getArticles, getArticle, renderMarkdown } from "@/lib/articles";
import { site, categoryPath } from "@/lib/site";
import { getProductsForGPU, hasAffiliateOffer } from "@/lib/products";

export function generateStaticParams() { return getArticles().map((article) => ({ slug: article.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `/articles/${slug}/`;
  return { title: article.title, description: article.description, alternates: site.canonical(url), openGraph: { type: "article", title: article.title, description: article.description, ...(site.urlConfigured ? { url } : {}), publishedTime: article.date, modifiedTime: article.updated, tags: article.tags }, twitter: { card: "summary", title: article.title, description: article.description } };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const html = await renderMarkdown(article.content);
  const articles = getArticles();
  const hasAffiliateProducts = (article.gpuIds ?? []).flatMap((id) => getProductsForGPU(id)).some(hasAffiliateOffer);
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, datePublished: article.date, dateModified: article.updated ?? article.date, ...(site.urlConfigured ? { mainEntityOfPage: `${site.url}/articles/${slug}/` } : {}), author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name } };
  return <article className="container article-layout"><div className="article-main"><div className="breadcrumbs"><Link href="/">TOP</Link><span>/</span><Link href={`/${categoryPath[article.category]}/`}>{article.category}</Link><span>/</span></div><header className="article-header"><p className="eyebrow">{article.category} · FIELD GUIDE</p><h1>{article.title}</h1><p className="article-description">{article.description}</p><div className="article-meta"><time dateTime={article.date}>公開 {article.date}</time>{article.updated && <time dateTime={article.updated}>更新 {article.updated}</time>}<span>{article.tags.map((tag) => `#${tag}`).join("　")}</span></div></header>{(article.affiliateDisclosure || hasAffiliateProducts) && <AffiliateDisclosure />}<ArticleTOC headings={article.headings} /><Notice><strong>掲載内容について</strong><br />この記事に実機ベンチマークはありません。性能・価格は製品と環境、時期により異なるため、購入前にメーカーと販売店の最新情報をご確認ください。</Notice><div className="prose" dangerouslySetInnerHTML={{ __html: html }} /><GPUProducts gpuIds={article.gpuIds ?? []} heading="この記事に関連する製品" /><FAQ items={article.faqs} /><RelatedArticles slugs={article.related ?? []} all={articles} />{Boolean(article.sources?.length) && <section className="article-sources"><h2>参考・出典</h2><ul>{article.sources?.map((source) => <li key={`${source.url}-${source.name}`}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.name} ↗</a><span>確認日: {source.checkedAt}</span></li>)}</ul></section>}</div><aside className="article-sidebar"><div><span className="sidebar-index">PC NOTE / GUIDE</span><strong>迷ったら、条件から。</strong><p>型番・用途・実測条件を揃えて比べると、スペック表が読みやすくなります。</p><Link href={`/${categoryPath[article.category]}/`} className="text-link">{article.category}の記事 <span>↗</span></Link></div></aside><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} /></article>;
}
