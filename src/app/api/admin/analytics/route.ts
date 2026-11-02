import { analyticsAuthResponse, isAnalyticsAuthorized, privateHeaders } from "@/lib/analytics-auth";
import { getVisitorAnalytics } from "@/lib/visitors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!await isAnalyticsAuthorized(request.headers)) return analyticsAuthResponse();
  try {
    return Response.json(await getVisitorAnalytics(), { headers: privateHeaders });
  } catch {
    return Response.json({ error: "Analytics temporarily unavailable" }, { status: 503, headers: privateHeaders });
  }
}
