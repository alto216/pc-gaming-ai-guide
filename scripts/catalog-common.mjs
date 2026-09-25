import { readFile, writeFile } from "node:fs/promises";
import { gpus } from "../lib/gpus.ts";
import { shopDefinitions } from "../lib/shops.ts";

export const productsPath = new URL("../data/products.json", import.meta.url);
export const offersPath = new URL("../data/offers.json", import.meta.url);
export async function readJson(path) { return JSON.parse(await readFile(path, "utf8")); }
export async function writeJson(path, value) { await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8"); }
export { gpus, shopDefinitions };
export const isHttpsUrl = (value) => {
  if (typeof value !== "string" || value.trim() !== value || !value) return false;
  try { const parsed = new URL(value); return parsed.protocol === "https:" && Boolean(parsed.hostname); } catch { return false; }
};
export const isDateOnly = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
};
export const stale = (date) => isDateOnly(date) && Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()) - Date.parse(`${date}T00:00:00.000Z`) >= 30 * 86400000;
export const ask = (rl, label) => new Promise((resolve) => rl.question(label, (answer) => resolve(answer.trim())));
