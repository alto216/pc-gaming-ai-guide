import type { ShopOffer } from "@/lib/types";

const DAY_MS = 24 * 60 * 60 * 1000;
export function isValidDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}
export function isValidHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() !== value || value.length === 0) return false;
  try { const url = new URL(value); return url.protocol === "https:" && Boolean(url.hostname); }
  catch { return false; }
}
export function isDateStale(checkedAt: string, now = new Date(), staleAfterDays = 30) {
  if (!isValidDateOnly(checkedAt)) return false;
  const checked = new Date(`${checkedAt}T00:00:00.000Z`).valueOf();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return today - checked >= staleAfterDays * DAY_MS;
}
export function isOfferStale(offer: Pick<ShopOffer, "checkedAt">, now = new Date()) {
  return isDateStale(offer.checkedAt, now);
}
