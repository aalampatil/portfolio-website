import { NextRequest, NextResponse } from "next/server";
import { analyticsAuthResponse, isAnalyticsAuthorized, privateHeaders } from "@/lib/analytics-auth";

export async function middleware(request: NextRequest) {
  if (!await isAnalyticsAuthorized(request.headers)) return analyticsAuthResponse();
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(privateHeaders)) response.headers.set(key, value);
  return response;
}

export const config = { matcher: ["/admin/analytics/:path*", "/api/admin/analytics/:path*"] };
