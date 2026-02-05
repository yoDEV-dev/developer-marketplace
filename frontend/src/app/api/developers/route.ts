import { NextRequest, NextResponse } from "next/server";
import {
  searchDevelopers,
  type DeveloperSearchFilters,
} from "@/repositories/developers";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const filters: DeveloperSearchFilters = {
    q: params.get("q") || undefined,
    techTags: params.get("tech")?.split(",").filter(Boolean) || undefined,
    availability: params.get("availability") || undefined,
    rateMin: params.has("rate_min")
      ? Number(params.get("rate_min"))
      : undefined,
    rateMax: params.has("rate_max")
      ? Number(params.get("rate_max"))
      : undefined,
    country: params.get("country") || undefined,
    experience: params.get("experience") || undefined,
    verified: params.get("verified") === "true" || undefined,
    hasPortfolio: params.get("has_portfolio") === "true" || undefined,
    sort: params.get("sort") || undefined,
    limit: params.has("limit") ? Number(params.get("limit")) : 20,
    offset: params.has("offset") ? Number(params.get("offset")) : 0,
  };

  try {
    const result = await searchDevelopers(filters);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Developer search error:", err);
    return NextResponse.json(
      { error: "Failed to search developers" },
      { status: 500 },
    );
  }
}
