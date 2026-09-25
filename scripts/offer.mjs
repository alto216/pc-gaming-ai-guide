import readline from "node:readline";
import { ask, productsPath, offersPath, readJson, writeJson, isHttpsUrl, isDateOnly, shopDefinitions } from "./catalog-common.mjs";

const products = await readJson(productsPath);
const offers = await readJson(offersPath);
if (!products.length) { console.log("Productが未登録です。先に npm run product で商品を登録してください。"); process.exit(0); }
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
try {
  for (let i = 0; i < products.length; i++) console.log(`${i + 1}. ${products[i].name} (${products[i].id})`);
  const product = products[Number(await ask(rl, "Product番号 > ")) - 1];
  if (!product) { console.error("有効なProductを選択してください。"); process.exitCode = 1; }
  else {
    const shops = Object.entries(shopDefinitions);
    for (let i = 0; i < shops.length; i++) console.log(`${i + 1}. ${shops[i][1]} (${shops[i][0]})`);
    const shop = shops[Number(await ask(rl, "ショップ番号 > ")) - 1]?.[0];
    if (!shop) { console.error("有効なショップを選択してください。"); process.exitCode = 1; }
    else if (offers.some((o) => o.productId === product.id && o.shop === shop)) { console.error("同じProduct・ショップのOfferが既にあります。"); process.exitCode = 1; }
    else {
      let price = null;
      while (true) { const value = await ask(rl, "価格 (不明は空欄またはnull) > "); if (!value || value.toLowerCase() === "null") break; const parsed = Number(value); if (Number.isFinite(parsed) && parsed >= 0) { price = parsed; break; } console.log("0以上の数値、または空欄を入力してください。"); }
      let url = null;
      while (true) { const value = await ask(rl, "URL (不明は空欄) > "); if (!value) break; if (isHttpsUrl(value)) { url = value; break; } console.log("有効なHTTPS URLを入力してください。"); }
      const states = ["in-stock", "out-of-stock", "unknown"];
      console.log("在庫状態: 1 在庫あり / 2 在庫なし / 3 未確認");
      const availability = states[Number(await ask(rl, "選択 > ")) - 1];
      if (!availability) { console.error("有効な在庫状態を選択してください。"); process.exitCode = 1; }
      else {
        let checkedAt;
        while (true) { checkedAt = await ask(rl, "確認日 YYYY-MM-DD (必須) > "); if (isDateOnly(checkedAt)) break; console.log("実在するYYYY-MM-DD形式の日付が必要です。"); }
        let affiliate;
        while (affiliate === undefined) { const value = (await ask(rl, "affiliate true/false > ")).toLowerCase(); if (value === "true") affiliate = true; else if (value === "false") affiliate = false; else console.log("true または false を入力してください。"); }
        offers.push({ productId: product.id, shop, price, url, availability, checkedAt, affiliate });
        await writeJson(offersPath, offers);
        console.log("Offerを登録しました。");
      }
    }
  }
} finally { rl.close(); }
