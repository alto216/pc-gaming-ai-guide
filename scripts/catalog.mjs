import { gpus, shopDefinitions, productsPath, offersPath, readJson, isHttpsUrl, isDateOnly, stale } from "./catalog-common.mjs";

const errors = [];
const warnings = [];
let products = [];
let offers = [];
try { products = await readJson(productsPath); if (!Array.isArray(products)) throw new Error("root must be an array"); }
catch (error) { errors.push(`products.json: ${error.message}`); }
try { offers = await readJson(offersPath); if (!Array.isArray(offers)) throw new Error("root must be an array"); }
catch (error) { errors.push(`offers.json: ${error.message}`); }
const gpuIds = new Set(gpus.map((gpu) => gpu.id));
const productIds = new Set();
for (const [index, product] of products.entries()) {
  const at = `products[${index}]`;
  if (!product || typeof product !== "object" || Array.isArray(product)) { errors.push(`${at}: objectが必要です`); continue; }
  if (typeof product.id !== "string" || !product.id.trim()) errors.push(`${at}: idが空欄です`);
  else if (productIds.has(product.id)) errors.push(`${at}: Product id重複 (${product.id})`);
  else productIds.add(product.id);
  if (!gpuIds.has(product.gpuId)) errors.push(`${at}: 存在しないgpuId (${product.gpuId})`);
  for (const key of ["name", "manufacturer", "model"]) if (typeof product[key] !== "string" || !product[key].trim()) errors.push(`${at}: ${key}が空欄です`);
  for (const key of ["officialUrl", "image", "sourceUrl"]) if (product[key] != null && !isHttpsUrl(product[key])) errors.push(`${at}: ${key}が不正URLです`);
  if (product.sourceCheckedAt != null && !isDateOnly(product.sourceCheckedAt)) errors.push(`${at}: sourceCheckedAtが不正です`);
  if (product.sourceUrl && !product.sourceCheckedAt) warnings.push(`${at}: sourceUrlに確認日がありません`);
}
const offerKeys = new Set();
for (const [index, offer] of offers.entries()) {
  const at = `offers[${index}]`;
  if (!offer || typeof offer !== "object" || Array.isArray(offer)) { errors.push(`${at}: objectが必要です`); continue; }
  if (!productIds.has(offer.productId)) errors.push(`${at}: 存在しないproductId (${offer.productId})`);
  const key = `${offer.productId}\u0000${offer.shop}`;
  if (offerKeys.has(key)) errors.push(`${at}: 重複Offer (${offer.productId}/${offer.shop})`);
  offerKeys.add(key);
  if (!Object.hasOwn(shopDefinitions, offer.shop)) errors.push(`${at}: 未定義Shop (${offer.shop})`);
  if (offer.price !== null && (typeof offer.price !== "number" || !Number.isFinite(offer.price) || offer.price < 0)) errors.push(`${at}: 不正な価格`);
  if (offer.url != null && !isHttpsUrl(offer.url)) errors.push(`${at}: 不正URL`);
  if (!isDateOnly(offer.checkedAt)) errors.push(`${at}: checkedAtは有効なYYYY-MM-DD必須です`);
  if (!["in-stock", "out-of-stock", "unknown"].includes(offer.availability)) errors.push(`${at}: 不正な在庫状態`);
  if (typeof offer.affiliate !== "boolean") errors.push(`${at}: affiliateはboolean必須です`);
  if (isDateOnly(offer.checkedAt) && stale(offer.checkedAt)) warnings.push(`${at}: 30日以上更新されていません (${offer.checkedAt})`);
}
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);
if (errors.length) { console.error(`Catalog validation failed: ${errors.length} error(s)`); process.exitCode = 1; }
else console.log(`Catalog OK: ${products.length} Product(s), ${offers.length} Offer(s), ${warnings.length} warning(s)`);
