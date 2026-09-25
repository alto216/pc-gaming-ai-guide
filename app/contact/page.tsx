import type { Metadata } from "next";
import { site } from "@/lib/site";
export const metadata: Metadata = { title: "お問い合わせ", description: "PCノートへのお問い合わせについて。", alternates: site.canonical("/contact/") };
export default function ContactPage() { return <section className="container prose-page"><p className="eyebrow">CONTACT</p><h1>お問い合わせ</h1><p className="page-lead">お問い合わせ方法は準備中です。</p><p>現時点では、このページから問い合わせを送信できません。製品の購入・保証・技術サポートについては、メーカーまたは販売店へお問い合わせください。</p></section>; }
