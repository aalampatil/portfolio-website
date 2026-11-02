"use client";

import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const visitorId = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    let id = visitorId.current;
    try { id = localStorage.getItem("portfolio-visitor-id") || id; } catch { /* Storage can be blocked. */ }
    if (!id) id = crypto.randomUUID();
    visitorId.current = id;
    try { localStorage.setItem("portfolio-visitor-id", id); } catch { /* Use an in-memory ID for this visit. */ }

    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: id,
        referrer: document.referrer,
        utmSource: new URLSearchParams(window.location.search).get("utm_source"),
      }),
      cache: "no-store",
    }).then(async response => {
      if (!response.ok) throw new Error("Visitor counter unavailable");
      const data: { count: number } = await response.json();
      if (!Number.isSafeInteger(data.count) || data.count < 0) throw new Error("Invalid visitor count");
      if (active) setCount(data.count);
    }).catch(() => { if (active) setUnavailable(true); });
    return () => { active = false; };
  }, []);

  return (
    <span className="visitor-count" role="status" aria-label="Visitor count" title={unavailable ? "Visitor count temporarily unavailable" : "Anonymous browser visits; refreshing does not add another visit"}>
      <Eye size={14} aria-hidden="true" /><span>{count === null ? unavailable ? "—" : "…" : count.toLocaleString("en")}</span><span>visitors</span>
    </span>
  );
}
