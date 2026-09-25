import { getArticles } from "@/lib/articles";
import { site } from "@/lib/site";

export const dynamic = "force-static";
const escapeXml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
export function GET() {
  const entries = site.urlConfigured ? getArticles().map((article) => `<item><title>${escapeXml(article.title)}</title><link>${site.url}/articles/${encodeURIComponent(article.slug)}/</link><guid>${site.url}/articles/${encodeURIComponent(article.slug)}/</guid><pubDate>${new Date(`${article.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escapeXml(article.description)}</description></item>`).join("") : "";
  const homeLink = site.urlConfigured ? `<link>${site.url}/</link>` : "";
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(site.name)}</title>${homeLink}<description>${escapeXml(site.description)}</description><language>ja</language>${entries}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
