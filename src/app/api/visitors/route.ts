import { getVisitorCount, isVisitorId, registerVisitor } from "@/lib/visitors";
import { getVisitAttribution } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    return Response.json({ count: await getVisitorCount() }, { headers });
  } catch {
    return Response.json({ error: "Visitor count temporarily unavailable" }, { status: 503, headers });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return Response.json({ error: "Invalid request" }, { status: 400, headers });
  }
  if (!body || typeof body !== "object" || !("visitorId" in body) || !isVisitorId(body.visitorId)) {
    return Response.json({ error: "Invalid visitor ID" }, { status: 400, headers });
  }
  try {
    const attribution = getVisitAttribution(body as Record<string, unknown>, request.headers);
    return Response.json({ count: await registerVisitor(body.visitorId, attribution) }, { headers });
  } catch {
    return Response.json({ error: "Visitor count temporarily unavailable" }, { status: 503, headers });
  }
}
