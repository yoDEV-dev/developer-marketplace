import { NextResponse } from "next/server";
import {
  getTechTags,
  getSpecializations,
  getIndustries,
  getProjectTypes,
  getCountries,
  getCurrencies,
  getAiTools,
} from "@/repositories/lookups";

export async function GET() {
  try {
    const [techTags, specializations, industries, projectTypes, countries, currencies, aiTools] =
      await Promise.all([
        getTechTags(),
        getSpecializations(),
        getIndustries(),
        getProjectTypes(),
        getCountries(),
        getCurrencies(),
        getAiTools(),
      ]);

    return NextResponse.json(
      { techTags, specializations, industries, projectTypes, countries, currencies, aiTools },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      },
    );
  } catch (err) {
    console.error("Lookups fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch lookups" },
      { status: 500 },
    );
  }
}
