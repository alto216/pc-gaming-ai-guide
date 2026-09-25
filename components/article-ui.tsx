import Link from "next/link";
import Image from "next/image";
import type { FAQItem, Product } from "@/lib/types";
import { getGPU } from "@/lib/gpus";
import { getProductsForGPU, hasAffiliateOffer } from "@/lib/products";
import { getShopLabel } from "@/lib/shops";
import { OfferFreshnessNotice } from "@/components/offer-freshness-notice";

export function AffiliateDisclosure() { return <p className="affiliate-disclosure">当サイトはアフィリエイト広告を利用しています。この記事に広告リンクが含まれる場合は、その旨を商品リンク付近にも表示します。</p>; }
export function Notice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "caution" }) { return <aside className={`notice notice-${tone}`}><span aria-hidden="true">{tone === "caution" ? "!" : "i"}</span><div>{children}</div></aside>; }
export function ProductCard({ product }: { product: Product }) {
  const gpu = getGPU(product.gpuId);
  const hasAffiliate = hasAffiliateOffer(product);
  return <article className="product-card"><div className="product-thumb">{product.image ? <Image src={product.image} alt={`${product.name}の商品画像`} width={130} height={130} unoptimized /> : <span aria-hidden="true">▧</span>}</div><div className="product-content">
    <p className="eyebrow">{product.manufacturer}</p><h3>{product.name}</h3><p className="product-model">型番: {product.model}{gpu ? <> · GPU: {gpu.name}</> : null}</p><p>{product.description}</p>
    {product.officialUrl && <a className="product-official-link" href={product.officialUrl} target="_blank" rel="noreferrer">メーカー製品情報 ↗</a>}
    {hasAffiliate && <p className="product-ad-note">広告 / アフィリエイトリンクを含みます</p>}
    {product.shops.length ? <div className="offer-list">{product.shops.map((offer, index) => <div className="offer-row" key={`${offer.shop}-${index}`}><strong>{getShopLabel(offer.shop)}</strong><span className="offer-price">{offer.price !== null ? `¥${offer.price.toLocaleString("ja-JP")}` : "価格を確認"}</span><span className={`offer-availability availability-${offer.availability}`}>{offer.availability === "in-stock" ? "在庫あり" : offer.availability === "out-of-stock" ? "在庫なし" : "在庫未確認"}</span><span className="offer-checked">価格確認: {offer.checkedAt ? offer.checkedAt.slice(0, 10) : "未登録"}</span><AffiliateButton url={offer.url} productId={product.id} shop={offer.shop} affiliate={offer.affiliate} /></div>)}</div> : <p className="no-offers">現在登録されている販売情報はありません</p>}
    {product.shops.length > 0 && <><p className="product-price-note">価格・在庫は変更される場合があります。</p><OfferFreshnessNotice checkedAt={product.shops.map((offer) => offer.checkedAt)} /></>}
  </div></article>;
}
export function AffiliateButton({ url, productId, shop, affiliate }: { url: string | null; productId: string; shop: string; affiliate: boolean }) {
  if (!url) return <span className="button button-small button-disabled" aria-disabled="true">商品URL未登録</span>;
  return <a className="button button-small" href={url} rel={affiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"} target="_blank" data-product-id={productId} data-shop={shop} data-affiliate={affiliate ? "true" : "false"}>商品を見る ↗</a>;
}
export function GPUProducts({ gpuIds, heading = "GPU搭載製品", showEmptyState = false }: { gpuIds: string[]; heading?: string; showEmptyState?: boolean }) {
  const matching = gpuIds.flatMap((id) => getProductsForGPU(id));
  if (!matching.length && !showEmptyState) return null;
  return <section className="gpu-products"><h2>{heading}</h2>{matching.length ? matching.map((product) => <ProductCard product={product} key={product.id} />) : <p className="no-products">現在、登録されている商品情報はありません。</p>}</section>;
}
export function ComparisonTable({ headers, rows }: { headers: string[]; rows: string[][] }) { return <div className="table-scroll"><table className="comparison-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>; }
export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) { return <div className="pros-cons"><section><h3>メリット</h3><ul>{pros.map((x) => <li key={x}>{x}</li>)}</ul></section><section><h3>注意したい点</h3><ul>{cons.map((x) => <li key={x}>{x}</li>)}</ul></section></div>; }
export function ArticleTOC({ headings }: { headings: { id: string; text: string; level: number }[] }) { return headings.length ? <nav className="article-toc" aria-label="目次"><strong>この記事の内容</strong><ol>{headings.map((h) => <li className={h.level === 3 ? "toc-sub" : ""} key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>)}</ol></nav> : null; }
export function FAQ({ items }: { items: FAQItem[] }) { return items.length ? <section className="faq-section"><h2>よくある質問</h2>{items.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section> : null; }
export function RelatedArticles({ slugs, all }: { slugs: string[]; all: { slug: string; title: string }[] }) { const articles = slugs.map((slug) => all.find((a) => a.slug === slug)).filter((a): a is { slug: string; title: string } => Boolean(a)); return articles.length ? <section className="related"><h2>次に読みたい記事</h2><ul>{articles.map((a) => <li key={a.slug}><Link href={`/articles/${a.slug}/`}>{a.title} <span aria-hidden="true">↗</span></Link></li>)}</ul></section> : null; }
