import type { ShopName } from "@/lib/shops";

export type Category = "GPU" | "ローカルAI" | "ゲーミングPC" | "動画編集" | "PCパーツ" | "初心者向け";
export type ShopAvailability = "in-stock" | "out-of-stock" | "unknown";
export type ShopOffer = { shop: ShopName; price: number | null; url: string | null; availability: ShopAvailability; checkedAt: string; affiliate: boolean };
export type UsageClassification = 1 | 2 | 3 | 4;
export type GPU = {
  id: string;
  name: string;
  manufacturer: "NVIDIA" | "AMD";
  architecture: string;
  vramGB: number;
  memoryType: string;
  tdpW: number;
  recommendedPsuW: number;
  releaseYear: number;
  gamingScore: UsageClassification;
  aiScore: UsageClassification;
  videoEditingScore: UsageClassification;
  notes: string;
  officialUrl: string;
};
/** Each board-partner product points back to a reference GPU; offers and prices belong to Product/ShopOffer. */
export type ProductRecord = { id: string; gpuId: string; name: string; manufacturer: string; model: string; image: string | null; description: string; officialUrl: string | null; sourceUrl: string | null; sourceCheckedAt: string | null };
export type ShopOfferRecord = ShopOffer & { productId: string };
export type Product = ProductRecord & { shops: ShopOffer[] };
export type FAQItem = { question: string; answer: string };
export type ArticleSource = { name: string; url: string; checkedAt: string };
export type Article = { slug: string; title: string; description: string; date: string; updated?: string; category: Category; tags: string[]; thumbnail?: string; affiliateDisclosure: boolean; featured?: boolean; related?: string[]; gpuIds?: string[]; sources?: ArticleSource[]; faqs: FAQItem[]; headings: { id: string; text: string; level: number }[]; content: string };
