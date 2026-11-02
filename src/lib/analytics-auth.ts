// HTTP Basic authentication is sufficient for this single-owner, read-only dashboard.
// The secret is server-only. Production must be served over HTTPS.
export const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "Vary": "Authorization",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
};

export function analyticsConfigured(): boolean {
  return (process.env.ANALYTICS_ADMIN_PASSWORD?.length ?? 0) >= 24;
}

export async function isAnalyticsAuthorized(headers: Pick<Headers, "get">): Promise<boolean> {
  if (!analyticsConfigured()) return false;
  const authorization = headers.get("authorization");
  if (!authorization || authorization.length > 2048 || !/^Basic /i.test(authorization)) return false;
  let credentials: string;
  try { credentials = atob(authorization.slice(6)); } catch { return false; }
  const expected = `${process.env.ANALYTICS_ADMIN_USERNAME || "owner"}:${process.env.ANALYTICS_ADMIN_PASSWORD}`;
  const encoder = new TextEncoder();
  const [actualHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(credentials)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const actual = new Uint8Array(actualHash);
  const expectedBytes = new Uint8Array(expectedHash);
  let difference = 0;
  for (let i = 0; i < actual.length; i++) difference |= actual[i] ^ expectedBytes[i];
  return difference === 0;
}

export function analyticsAuthResponse(): Response {
  if (!analyticsConfigured()) return new Response("Private analytics is not configured.", { status: 503, headers: privateHeaders });
  return new Response("Authentication required.", {
    status: 401,
    headers: { ...privateHeaders, "WWW-Authenticate": 'Basic realm="Portfolio analytics", charset="UTF-8"' },
  });
}
