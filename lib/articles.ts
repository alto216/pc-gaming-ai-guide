import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked, Renderer } from "marked";
import type { Article, Category, FAQItem } from "@/lib/types";

const dir = path.join(process.cwd(), "content/articles");
const slugify = (value: string) => value.toLowerCase().replace(/[？?！!。、,.]/g, "").replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "");
export function getArticles(): Article[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".md")).map((file) => {
    const slug = file.replace(/\.md$/, "");
    const parsed = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    const data = parsed.data as Partial<Article>;
    const headings = [...parsed.content.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => ({ id: slugify(match[2]), text: match[2], level: match[1].length }));
    return { slug, title: data.title ?? slug, description: data.description ?? "", date: data.date ?? "", updated: data.updated, category: (data.category ?? "初心者向け") as Category, tags: data.tags ?? [], thumbnail: data.thumbnail, affiliateDisclosure: data.affiliateDisclosure ?? true, featured: data.featured, related: data.related ?? [], gpuIds: data.gpuIds ?? [], sources: Array.isArray(data.sources) ? data.sources : [], faqs: (data.faqs ?? []) as FAQItem[], headings, content: parsed.content };
  }).sort((a, b) => b.date.localeCompare(a.date));
}
export function getArticle(slug: string) { return getArticles().find((article) => article.slug === slug); }
export async function renderMarkdown(markdown: string) {
  const renderer = new Renderer();
  renderer.heading = ({ text, depth }) => `<h${depth} id="${slugify(text.replace(/<[^>]*>/g, ""))}">${text}</h${depth}>`;
  return marked.parse(markdown, { renderer, gfm: true, breaks: false });
}
