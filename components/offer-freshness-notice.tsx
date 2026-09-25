"use client";

import { useEffect, useState } from "react";
import { isDateStale } from "@/lib/catalog-utils";

export function OfferFreshnessNotice({ checkedAt }: { checkedAt: string[] }) {
  const [stale, setStale] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setStale(checkedAt.some((date) => isDateStale(date))), 0);
    return () => window.clearTimeout(timer);
  }, [checkedAt]);
  return stale ? <p className="product-price-note">この価格情報は更新から時間が経っています</p> : null;
}
