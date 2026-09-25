import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
export const metadata: Metadata = { title: "このサイトについて", description: "PCノートの編集方針と情報の扱いについて。", alternates: site.canonical("/about/") };
export default function AboutPage() { return <section className="container prose-page"><p className="eyebrow">ABOUT</p><h1>スペックの先にある、<br />使い方まで。</h1><p className="page-lead">PCノートは、PC・GPU・ゲーム・ローカルAI・動画編集の情報を、用途に合わせて選ぶために整理するサイトです。</p><h2>情報源と確認</h2><ul><li>製品仕様はメーカー公式情報を優先し、参考・出典を記事に掲載します。</li><li>メーカー公称値と実測値を区別し、実測出典がない性能値を実測結果として扱いません。</li><li>架空の価格、ベンチマーク、利用実績は作成しません。</li><li>記事制作にAIを補助利用する場合があります。公開前に内容と出典を確認します。</li></ul><h2>広告について</h2><p>当サイトはアフィリエイト広告を利用しています。広告リンクを掲載する場合は、その旨が分かるよう表示します。広告の有無を情報の根拠や評価の代わりにしません。</p><h2>情報の更新</h2><p>仕様・価格・ソフトウェア対応は変わることがあります。購入や導入の前にメーカー、販売店、ソフトウェア提供元の最新情報をご確認ください。詳しくは<Link href="/editorial-policy/">編集方針</Link>をご覧ください。</p></section>; }
