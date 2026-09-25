import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { categories, site } from "@/lib/site";
import { gpus } from "@/lib/gpus";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap { if (!site.urlConfigured) return []; const pages = ["", "about/", "privacy/", "contact/", "editorial-policy/", ...categories.map((c) => `${c.slug}/`), "gpu/compare/"]; const builtAt = new Date(); return [...pages.map((path) => ({ url: `${site.url}/${path}`, lastModified: builtAt, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.6 })), ...getArticles().map((a) => ({ url: `${site.url}/articles/${a.slug}/`, lastModified: new Date(a.updated ?? a.date), changeFrequency: "monthly" as const, priority: a.featured ? 0.8 : 0.7 })), ...gpus.map((gpu) => ({ url: `${site.url}/gpu/${gpu.id}/`, lastModified: builtAt, changeFrequency: "monthly" as const, priority: 0.65 }))]; }
