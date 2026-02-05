import { NextResponse } from "next/server";
import {
  getTechTags,
  getSpecializations,
  getIndustries,
  getProjectTypes,
  getCountries,
  getCurrencies,
} from "@/repositories/lookups";

export async function GET() {
  try {
    const [techTags, specializations, industries, projectTypes, countries, currencies] =
      await Promise.all([
        getTechTags(),
        getSpecializations(),
        getIndustries(),
        getProjectTypes(),
        getCountries(),
        getCurrencies(),
      ]);

    return NextResponse.json(
      { techTags, specializations, industries, projectTypes, countries, currencies },
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
