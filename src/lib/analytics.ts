export interface VisitAttribution {
  source: string;
  country: string | null;
  city: string | null;
}

function safeText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text && text.length <= maxLength && !/[\u0000-\u001f\u007f]/.test(text) ? text : null;
}

export function getVisitAttribution(body: Record<string, unknown>, headers: Headers, onVercel = process.env.VERCEL === "1"): VisitAttribution {
  const campaign = safeText(body.utmSource, 80);
  let source = campaign ? `Campaign: ${campaign.toLowerCase()}` : "Direct / Unknown";
  if (!campaign && typeof body.referrer === "string" && body.referrer.length <= 2048) {
    try {
      const referrer = new URL(body.referrer);
      const origin = headers.get("origin");
      if (["https:", "http:"].includes(referrer.protocol) && (!origin || referrer.origin !== new URL(origin).origin)) {
        source = referrer.hostname.replace(/^www\./, "").slice(0, 253);
      }
    } catch { /* Missing and malformed referrers remain unknown. */ }
  }
  // Only trust headers injected by our deployment platform, never client JSON or raw IPs.
  const countryHeader = onVercel ? headers.get("x-vercel-ip-country") : null;
  const country = countryHeader && /^[A-Z]{2}$/.test(countryHeader) ? countryHeader : null;
  let city: string | null = null;
  if (onVercel && country) {
    try { city = safeText(decodeURIComponent(headers.get("x-vercel-ip-city") || ""), 120); } catch { /* Invalid encoding. */ }
  }
  return { source, country, city };
}
