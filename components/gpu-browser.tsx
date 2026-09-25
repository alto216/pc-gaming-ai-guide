"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { GPU } from "@/lib/types";
import { scoreLabels, usageDefinitions } from "@/lib/gpus";

type MakerFilter = "all" | GPU["manufacturer"];
type VramFilter = "all" | "8-or-less" | "10-12" | "16" | "20-plus";
type UsageFilter = "all" | "gamingScore" | "aiScore" | "videoEditingScore";
const inVramBand = (gpu: GPU, band: VramFilter) => {
  if (band === "8-or-less") return gpu.vramGB <= 8;
  if (band === "10-12") return gpu.vramGB >= 10 && gpu.vramGB <= 12;
  if (band === "16") return gpu.vramGB === 16;
  if (band === "20-plus") return gpu.vramGB >= 20;
  return true;
};
const scoreFor = (gpu: GPU, usage: UsageFilter) => usage === "all" ? null : gpu[usage];
const shortlistMinimum: Partial<Record<Exclude<UsageFilter, "all">, number>> = { gamingScore: 2, aiScore: 3, videoEditingScore: 2 };
const shortlistLabel: Partial<Record<Exclude<UsageFilter, "all">, string>> = { gamingScore: "10GB以上", aiScore: "16GB以上", videoEditingScore: "10GB以上" };

export function GPUComparisonBrowser({ items }: { items: GPU[] }) {
  const [manufacturer, setManufacturer] = useState<MakerFilter>("all");
  const [vram, setVram] = useState<VramFilter>("all");
  const [usage, setUsage] = useState<UsageFilter>("all");
  const filtered = useMemo(() => items.filter((item) => item.manufacturer === manufacturer || manufacturer === "all")
    .filter((item) => inVramBand(item, vram))
    // The shortlist is a VRAM headroom starting point, not a compatibility or performance verdict.
    .filter((item) => { const score = scoreFor(item, usage); return score === null || score >= (usage === "all" ? 0 : shortlistMinimum[usage] ?? 0); }), [items, manufacturer, vram, usage]);

  return <>
    <div className="gpu-filters" aria-label="GPU比較フィルター">
      <label>メーカー<select value={manufacturer} onChange={(e) => setManufacturer(e.target.value as MakerFilter)}><option value="all">すべて</option><option value="NVIDIA">NVIDIA</option><option value="AMD">AMD</option></select></label>
      <label>VRAM<select value={vram} onChange={(e) => setVram(e.target.value as VramFilter)}><option value="all">すべて</option><option value="8-or-less">8GB以下</option><option value="10-12">10〜12GB</option><option value="16">16GB</option><option value="20-plus">20GB以上</option></select></label>
      <label>用途<select value={usage} onChange={(e) => setUsage(e.target.value as UsageFilter)}><option value="all">すべて</option><option value="gamingScore">ゲーム</option><option value="aiScore">ローカルAI</option><option value="videoEditingScore">動画編集</option></select></label>
      <span className="gpu-result-count">{filtered.length} GPU</span>
    </div>
    {usage !== "all" && <p className="gpu-filter-note">この用途ではVRAM {shortlistLabel[usage]}を候補一覧の目安にしています。下回るGPUも用途によって利用でき、動作可否や性能を判定するものではありません。</p>}
    <div className="gpu-table-scroll" role="region" aria-label="GPU比較表（左右にスクロールできます）" tabIndex={0}>
      <table className="gpu-table"><thead><tr><th scope="col">GPU名</th><th scope="col">VRAM</th><th scope="col">メモリタイプ</th><th scope="col">TDP / TBP</th><th scope="col">推奨電源</th><th scope="col">発売年</th><th scope="col">ゲーム用途</th><th scope="col">ローカルAI用途</th><th scope="col">動画編集用途</th></tr></thead>
        <tbody>{filtered.map((item) => <tr key={item.id}><th scope="row"><Link href={`/gpu/${item.id}/`}>{item.name}<span aria-hidden="true"> ↗</span></Link><small>{item.manufacturer} · {item.architecture}</small></th><td>{item.vramGB}GB</td><td>{item.memoryType}</td><td>{item.tdpW}W</td><td>{item.recommendedPsuW}W</td><td>{item.releaseYear}</td><td>{item.gamingScore}/4 <small>{scoreLabels[item.gamingScore]}</small></td><td>{item.aiScore}/4 <small>{scoreLabels[item.aiScore]}</small></td><td>{item.videoEditingScore}/4 <small>{scoreLabels[item.videoEditingScore]}</small></td></tr>)}</tbody>
      </table>
    </div>
    <p className="gpu-score-legend"><strong>当サイト独自の用途分類</strong> — 数値はVRAM容量帯だけを使ったメモリ余裕の分類です。ベンチマーク値、性能順位、fps、動作保証ではありません。1:8GB以下 / 2:10〜12GB / 3:16GB / 4:20GB以上。</p>
    <p className="gpu-spec-note">電力・電源の値はメーカー基準モデルまたはメーカー推奨システム構成の公称値です。製品メーカーのカード仕様は異なる場合があります。購入前に公式仕様を確認してください。</p>
    <div className="gpu-source-list"><span>メーカー仕様:</span> <a href="https://www.nvidia.com/ja-jp/geforce/graphics-cards/30-series/rtx-3060-3060ti/" target="_blank" rel="noreferrer">NVIDIA GeForce</a><a href="https://www.amd.com/en/products/specifications/graphics.html" target="_blank" rel="noreferrer">AMD 製品仕様一覧</a></div>
  </>;
}

export function GPUUsageSummary({ gpu }: { gpu: GPU }) {
  const rows: [keyof typeof usageDefinitions, number][] = [
    ["gamingScore", gpu.gamingScore], ["aiScore", gpu.aiScore], ["videoEditingScore", gpu.videoEditingScore],
  ];
  return <section className="gpu-usage"><h2>用途評価</h2><p className="gpu-score-legend"><strong>当サイト独自の用途分類</strong> — VRAM容量帯からメモリ余裕を整理した分類値です。実測性能や適合保証ではありません。</p><div className="gpu-usage-grid">{rows.map(([key, score]) => <article key={key}><h3>{usageDefinitions[key].label}</h3><strong>{score}/4 · {scoreLabels[score as keyof typeof scoreLabels]}</strong><p>{usageDefinitions[key].detail}</p></article>)}</div></section>;
}
