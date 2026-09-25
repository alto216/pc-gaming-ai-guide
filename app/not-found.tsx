import Link from "next/link";
import { getArticles } from "@/lib/articles";

export default function NotFound() {
  const latest = getArticles()[0];
  return <section className="container prose-page not-found-page"><p className="eyebrow">404 / NOT FOUND</p><h1>ページが見つかりません</h1><p className="page-lead">URLが変更されたか、ページが公開されていない可能性があります。</p><nav className="not-found-links" aria-label="ページ案内"><Link className="button" href="/">トップへ</Link><Link className="button button-outline not-found-outline" href="/gpu/compare/">GPU比較</Link>{latest && <Link className="text-link" href={`/articles/${latest.slug}/`}>最新記事：{latest.title} ↗</Link>}</nav></section>;
}
