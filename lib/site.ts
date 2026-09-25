function getConfiguredSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return undefined;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname))) return undefined;
    return parsed.origin;
  } catch { return undefined; }
}
const configuredSiteUrl = getConfiguredSiteUrl();
const localSiteUrl = "http://localhost:3000";
export const site = {
  name: "PCノート",
  description: "GPU・自作PC・ローカルAIを、初心者にも分かりやすく。",
  url: configuredSiteUrl || localSiteUrl,
  urlConfigured: Boolean(configuredSiteUrl),
  canonical(path: string) { return configuredSiteUrl ? { canonical: path } : undefined; },
};
export const categories = [
  { slug: "gpu", name: "GPU", description: "GPUの選び方、VRAM、用途別の比較を解説。" },
  { slug: "local-ai", name: "ローカルAI", description: "自分のPCでAIを動かすための基礎とGPU選び。" },
  { slug: "gaming", name: "ゲーミングPC", description: "ゲームを快適に遊ぶための構成と設定。" },
  { slug: "video-editing", name: "動画編集", description: "動画編集を支えるPCパーツと構成の考え方。" },
  { slug: "pc-parts", name: "PCパーツ", description: "パーツ選びと自作PCの基礎知識。" },
  { slug: "beginner", name: "初心者向け", description: "初めてのPC選びで知っておきたいこと。" },
];
export const categoryPath: Record<string, string> = { GPU: "gpu", ローカルAI: "local-ai", "ゲーミングPC": "gaming", 動画編集: "video-editing", PCパーツ: "pc-parts", 初心者向け: "beginner" };
