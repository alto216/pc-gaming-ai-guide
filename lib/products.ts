import productRecordsData from "@/data/products.json";
import offersData from "@/data/offers.json";
import type { Product, ProductRecord, ShopOfferRecord } from "@/lib/types";

/** Product records and offers are separately editable JSON; no unverified seed data is included. */
const productRecords = productRecordsData as ProductRecord[];
const offerRecords = offersData as ShopOfferRecord[];
export const products: Product[] = productRecords.map((product) => ({
  ...product,
  shops: offerRecords.filter((offer) => offer.productId === product.id).map((offer) => ({ shop: offer.shop, price: offer.price, url: offer.url, availability: offer.availability, checkedAt: offer.checkedAt, affiliate: offer.affiliate })),
}));

export function getProductsForGPU(gpuId: string) {
  return products.filter((product) => product.gpuId === gpuId);
}

export function hasAffiliateOffer(product: Product) {
  return product.shops.some((offer) => offer.affiliate && Boolean(offer.url));
}
