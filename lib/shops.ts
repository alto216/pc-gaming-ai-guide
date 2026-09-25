export const shopDefinitions = {
  amazon: "Amazon",
  rakuten: "楽天市場",
  yahoo: "Yahoo!ショッピング",
  dospara: "ドスパラ",
  pcKoubou: "パソコン工房",
  tsukumo: "ツクモ",
  sofmap: "ソフマップ",
  mercari: "メルカリ",
  usedShop: "中古ショップ",
} as const;

export type ShopName = keyof typeof shopDefinitions | (string & {});
export function getShopLabel(shop: ShopName) {
  return shop in shopDefinitions ? shopDefinitions[shop as keyof typeof shopDefinitions] : shop;
}
