import readline from "node:readline";
import { ask, gpus, productsPath, offersPath, readJson, writeJson, isHttpsUrl, isDateOnly } from "./catalog-common.mjs";
import { getShopLabel } from "../lib/shops.ts";

const products = await readJson(productsPath);
const offers = await readJson(offersPath);
function showCatalog() {
  if (!products.length) console.log("商品は未登録です。");
  for (const gpu of gpus) {
    const matches = products.filter((p) => p.gpuId === gpu.id);
    if (!matches.length) continue;
    console.log(`\n${gpu.name}`);
    for (const p of matches) {
      console.log(`└ ${p.manufacturer} ${p.name}`);
      for (const offer of offers.filter((o) => o.productId === p.id)) console.log(`  ├ ${getShopLabel(offer.shop)}${offer.price === null ? "" : ` ¥${offer.price.toLocaleString("ja-JP")}`} (確認 ${offer.checkedAt})`);
    }
  }
  console.log(`\n商品数: ${products.length} / Offer数: ${offers.length} / 最終確認日: ${offers.map((o) => o.checkedAt).filter(Boolean).sort().at(-1) ?? "なし"}`);
}
showCatalog();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
try {
  while (true) {
    const mode = await ask(rl, "\n1: 商品追加 / 2: 一覧再表示 / Enter: 終了 > ");
    if (!mode) break;
    if (mode === "2") { showCatalog(); continue; }
    if (mode !== "1") { console.log("1、2、またはEnterを入力してください。"); continue; }
    for (let i = 0; i < gpus.length; i++) console.log(`${i + 1}. ${gpus[i].name} (${gpus[i].id})`);
    const selected = Number(await ask(rl, "GPU番号 > ")) - 1;
    const gpu = gpus[selected];
    if (!gpu) { console.log("有効なGPUを選択してください。"); continue; }
    const required = async (label) => { while (true) { const value = await ask(rl, label); if (value) return value; console.log("空欄にはできません。"); } };
    const manufacturer = await required("メーカー > ");
    const name = await required("商品名 > ");
    const model = await required("型番 > ");
    const optionalUrl = async (label) => { while (true) { const value = await ask(rl, label); if (!value) return null; if (isHttpsUrl(value)) return value; console.log("https:// から始まる有効なURLを入力してください。"); } };
    const officialUrl = await optionalUrl("公式URL (任意、空欄可) > ");
    const image = await optionalUrl("画像URL (任意、空欄可) > ");
    const description = await ask(rl, "説明 (任意) > ");
    const sourceUrl = await optionalUrl("実在確認元URL (任意、空欄可) > ");
    let sourceCheckedAt = null;
    if (sourceUrl) while (true) { const date = await ask(rl, "確認日 YYYY-MM-DD > "); if (isDateOnly(date)) { sourceCheckedAt = date; break; } console.log("有効なYYYY-MM-DD形式の日付が必要です。"); }
    const base = `${gpu.id}-${manufacturer}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || gpu.id;
    let id = base; let suffix = 2;
    while (products.some((p) => p.id === id)) id = `${base}-${suffix++}`;
    products.push({ id, gpuId: gpu.id, name, manufacturer, model, image, description, officialUrl, sourceUrl, sourceCheckedAt });
    await writeJson(productsPath, products);
    console.log(`登録しました: ${id}`);
  }
} finally { rl.close(); }
