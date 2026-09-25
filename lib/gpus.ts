import type { GPU, UsageClassification } from "@/lib/types";

/**
 * Usage scores are a transparent VRAM-headroom classification, not a benchmark:
 * 1 = up to 8GB, 2 = 10–12GB, 3 = 16GB, 4 = 20GB or more.
 * They do not predict FPS, model compatibility, render time, or overall speed.
 */
function vramClass(vramGB: number): UsageClassification {
  if (vramGB <= 8) return 1;
  if (vramGB <= 12) return 2;
  if (vramGB <= 16) return 3;
  return 4;
}
function gpu(data: Omit<GPU, "gamingScore" | "aiScore" | "videoEditingScore">): GPU {
  const score = vramClass(data.vramGB);
  return { ...data, gamingScore: score, aiScore: score, videoEditingScore: score };
}

/** Reference GPU database. Board-partner cards may have different clocks, dimensions, power limits and PSU guidance. */
export const gpus: GPU[] = [
  gpu({ id: "rtx-3060-12gb", name: "GeForce RTX 3060 12GB", manufacturer: "NVIDIA", architecture: "Ampere", vramGB: 12, memoryType: "GDDR6", tdpW: 170, recommendedPsuW: 550, releaseYear: 2021, notes: "12GB reference configuration. Confirm the exact board-partner model before buying.", officialUrl: "https://www.nvidia.com/ja-jp/geforce/graphics-cards/30-series/rtx-3060-3060ti/" }),
  gpu({ id: "rtx-3060-ti", name: "GeForce RTX 3060 Ti", manufacturer: "NVIDIA", architecture: "Ampere", vramGB: 8, memoryType: "GDDR6 / GDDR6X（製品版による）", tdpW: 200, recommendedPsuW: 600, releaseYear: 2020, notes: "Reference specification is 8GB; NVIDIA lists GDDR6 and GDDR6X board variants.", officialUrl: "https://www.nvidia.com/ja-jp/geforce/graphics-cards/30-series/rtx-3060-3060ti/" }),
  gpu({ id: "rtx-3070", name: "GeForce RTX 3070", manufacturer: "NVIDIA", architecture: "Ampere", vramGB: 8, memoryType: "GDDR6", tdpW: 220, recommendedPsuW: 650, releaseYear: 2020, notes: "Reference card figures; partner-card requirements may differ.", officialUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3070-3070ti/" }),
  gpu({ id: "rtx-3080-10gb", name: "GeForce RTX 3080 10GB", manufacturer: "NVIDIA", architecture: "Ampere", vramGB: 10, memoryType: "GDDR6X", tdpW: 320, recommendedPsuW: 750, releaseYear: 2020, notes: "10GB reference variant. Do not confuse with the later 12GB variant.", officialUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3080-3080ti/" }),
  gpu({ id: "rtx-3080-12gb", name: "GeForce RTX 3080 12GB", manufacturer: "NVIDIA", architecture: "Ampere", vramGB: 12, memoryType: "GDDR6X", tdpW: 350, recommendedPsuW: 750, releaseYear: 2022, notes: "12GB reference variant; its reference card power differs from the 10GB model.", officialUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3080-3080ti/" }),
  gpu({ id: "rtx-3090", name: "GeForce RTX 3090", manufacturer: "NVIDIA", architecture: "Ampere", vramGB: 24, memoryType: "GDDR6X", tdpW: 350, recommendedPsuW: 750, releaseYear: 2020, notes: "Reference card specification. Check case clearance, connector and partner-board power requirements.", officialUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3090-3090ti/" }),
  gpu({ id: "rtx-4060", name: "GeForce RTX 4060", manufacturer: "NVIDIA", architecture: "Ada Lovelace", vramGB: 8, memoryType: "GDDR6", tdpW: 115, recommendedPsuW: 550, releaseYear: 2023, notes: "Reference configuration; board dimensions and connectors vary by manufacturer.", officialUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4060-4060ti/" }),
  gpu({ id: "rtx-4060-ti-8gb", name: "GeForce RTX 4060 Ti 8GB", manufacturer: "NVIDIA", architecture: "Ada Lovelace", vramGB: 8, memoryType: "GDDR6", tdpW: 160, recommendedPsuW: 550, releaseYear: 2023, notes: "8GB version. Confirm board-partner specifications for power and cooling.", officialUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4060-4060ti/" }),
  gpu({ id: "rtx-4060-ti-16gb", name: "GeForce RTX 4060 Ti 16GB", manufacturer: "NVIDIA", architecture: "Ada Lovelace", vramGB: 16, memoryType: "GDDR6", tdpW: 160, recommendedPsuW: 550, releaseYear: 2023, notes: "16GB version. More memory capacity does not imply the same speed in every workload.", officialUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4060-4060ti/" }),
  gpu({ id: "rtx-4070", name: "GeForce RTX 4070", manufacturer: "NVIDIA", architecture: "Ada Lovelace", vramGB: 12, memoryType: "GDDR6 / GDDR6X（製品版による）", tdpW: 200, recommendedPsuW: 650, releaseYear: 2023, notes: "NVIDIA lists GDDR6 and GDDR6X versions; check the exact SKU.", officialUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/" }),
  gpu({ id: "rtx-4070-super", name: "GeForce RTX 4070 SUPER", manufacturer: "NVIDIA", architecture: "Ada Lovelace", vramGB: 12, memoryType: "GDDR6X", tdpW: 220, recommendedPsuW: 650, releaseYear: 2024, notes: "Reference figures; partner-card specifications may vary.", officialUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/" }),
  gpu({ id: "rx-6700-xt", name: "Radeon RX 6700 XT", manufacturer: "AMD", architecture: "RDNA 2", vramGB: 12, memoryType: "GDDR6", tdpW: 230, recommendedPsuW: 650, releaseYear: 2021, notes: "AMD desktop Typical Board Power and minimum PSU recommendation.", officialUrl: "https://www.amd.com/en/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6700-xt.html" }),
  gpu({ id: "rx-6800", name: "Radeon RX 6800", manufacturer: "AMD", architecture: "RDNA 2", vramGB: 16, memoryType: "GDDR6", tdpW: 250, recommendedPsuW: 650, releaseYear: 2020, notes: "AMD desktop Typical Board Power and minimum PSU recommendation.", officialUrl: "https://www.amd.com/en/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6800.html" }),
  gpu({ id: "rx-6800-xt", name: "Radeon RX 6800 XT", manufacturer: "AMD", architecture: "RDNA 2", vramGB: 16, memoryType: "GDDR6", tdpW: 300, recommendedPsuW: 750, releaseYear: 2020, notes: "AMD desktop Typical Board Power and minimum PSU recommendation.", officialUrl: "https://www.amd.com/en/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6800-xt.html" }),
  gpu({ id: "rx-6900-xt", name: "Radeon RX 6900 XT", manufacturer: "AMD", architecture: "RDNA 2", vramGB: 16, memoryType: "GDDR6", tdpW: 300, recommendedPsuW: 850, releaseYear: 2020, notes: "AMD desktop Typical Board Power and minimum PSU recommendation.", officialUrl: "https://www.amd.com/en/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6900-xt.html" }),
  gpu({ id: "rx-7600-xt", name: "Radeon RX 7600 XT", manufacturer: "AMD", architecture: "RDNA 3", vramGB: 16, memoryType: "GDDR6", tdpW: 190, recommendedPsuW: 600, releaseYear: 2024, notes: "AMD desktop Typical Board Power and minimum PSU recommendation.", officialUrl: "https://www.amd.com/en/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7600-xt.html" }),
  gpu({ id: "rx-7800-xt", name: "Radeon RX 7800 XT", manufacturer: "AMD", architecture: "RDNA 3", vramGB: 16, memoryType: "GDDR6", tdpW: 263, recommendedPsuW: 700, releaseYear: 2023, notes: "AMD desktop Typical Board Power and minimum PSU recommendation.", officialUrl: "https://www.amd.com/en/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7800-xt.html" }),
  gpu({ id: "rx-7900-xt", name: "Radeon RX 7900 XT", manufacturer: "AMD", architecture: "RDNA 3", vramGB: 20, memoryType: "GDDR6", tdpW: 315, recommendedPsuW: 750, releaseYear: 2022, notes: "AMD desktop Typical Board Power and minimum PSU recommendation.", officialUrl: "https://www.amd.com/en/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7900xt.html" }),
  gpu({ id: "rx-7900-xtx", name: "Radeon RX 7900 XTX", manufacturer: "AMD", architecture: "RDNA 3", vramGB: 24, memoryType: "GDDR6", tdpW: 355, recommendedPsuW: 800, releaseYear: 2022, notes: "AMD desktop Typical Board Power and minimum PSU recommendation.", officialUrl: "https://www.amd.com/en/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7900xtx.html" }),
];

export const getGPU = (id: string) => gpus.find((item) => item.id === id);
export const usageDefinitions = {
  gamingScore: { label: "ゲーム", detail: "ゲーム性能やfpsの比較ではなく、VRAM容量帯による余裕分類。解像度・設定・ゲーム別の実測は別途必要です。" },
  aiScore: { label: "ローカルAI", detail: "モデルの動作保証ではなく、VRAM容量帯によるメモリ余裕分類。量子化やコンテキスト長などを別途確認してください。" },
  videoEditingScore: { label: "動画編集", detail: "編集速度の比較ではなく、VRAM容量帯によるメモリ余裕分類。ソフト・コーデック・素材により結果は異なります。" },
} as const;
export const scoreLabels: Record<UsageClassification, string> = { 1: "8GB以下", 2: "10〜12GB", 3: "16GB", 4: "20GB以上" };
