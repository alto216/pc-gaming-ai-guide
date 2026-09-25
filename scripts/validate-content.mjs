import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { categories } from "../lib/site.ts";
import { gpus } from "../lib/gpus.ts";

const directory = path.resolve("content/articles");
const errors = [];
const slugs = new Set();
const categoriesSet = new Set(categories.map((category) => category.name));
const gpuIds = new Set(gpus.map((gpu) => gpu.id));
const today = new Date();
today.setHours(0, 0, 0, 0);
function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}
function isFuture(value) { return new Date(`${value}T00:00:00`).valueOf() > today.valueOf(); }
function validHttpsUrl(value) {
  try { const url = new URL(value); return url.protocol === "https:" && Boolean(url.hostname); } catch { return false; }
}
const files = fs.existsSync(directory) ? fs.readdirSync(directory).filter((file) => file.endsWith(".md")).sort() : [];
for (const file of files) {
  const filePath = path.join(directory, file);
  const slug = file.replace(/\.md$/i, "").toLowerCase();
  const at = `${file}`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push(`${at}: slugは英小文字・数字・ハイフンにしてください`);
  if (slugs.has(slug)) errors.push(`${at}: 重複slug (${slug})`);
  slugs.add(slug);
  let data;
  try { data = matter(fs.readFileSync(filePath, "utf8")).data; }
  catch (error) { errors.push(`${at}: Frontmatter解析エラー (${error.message})`); continue; }
  for (const field of ["title", "description"]) if (typeof data[field] !== "string" || !data[field].trim()) errors.push(`${at}: ${field}が空欄です`);
  if (!validDate(data.date)) errors.push(`${at}: dateは有効なYYYY-MM-DD必須です`);
  else if (isFuture(data.date)) errors.push(`${at}: dateが未来日です`);
  if (data.updated !== undefined && data.updated !== null && data.updated !== "") {
    if (!validDate(data.updated)) errors.push(`${at}: updatedが不正なYYYY-MM-DDです`);
    else if (isFuture(data.updated)) errors.push(`${at}: updatedが未来日です`);
    else if (validDate(data.date) && data.updated < data.date) errors.push(`${at}: updatedが公開日より前です`);
  }
  if (!categoriesSet.has(data.category)) errors.push(`${at}: categoryが未定義です (${data.category})`);
  if (data.gpuIds !== undefined && (!Array.isArray(data.gpuIds) || data.gpuIds.some((id) => !gpuIds.has(id)))) errors.push(`${at}: gpuIdsに不明なGPUがあります`);
  if (Array.isArray(data.gpuIds) && new Set(data.gpuIds).size !== data.gpuIds.length) errors.push(`${at}: gpuIdsが重複しています`);
  if (data.sources !== undefined && !Array.isArray(data.sources)) errors.push(`${at}: sourcesは配列で指定してください`);
  if (Array.isArray(data.sources)) data.sources.forEach((source, index) => {
    if (!source || typeof source.name !== "string" || !source.name.trim()) errors.push(`${at}: sources[${index}].nameが空欄です`);
    if (!validHttpsUrl(source?.url)) errors.push(`${at}: sources[${index}].urlは有効なHTTPS URL必須です`);
    if (!validDate(source?.checkedAt)) errors.push(`${at}: sources[${index}].checkedAtは有効なYYYY-MM-DD必須です`);
    else if (isFuture(source.checkedAt)) errors.push(`${at}: sources[${index}].checkedAtが未来日です`);
  });
}
if (errors.length) { for (const error of errors) console.error(`ERROR ${error}`); console.error(`Content validation failed: ${errors.length} error(s)`); process.exitCode = 1; }
else console.log(`Content OK: ${files.length} article(s)`);
