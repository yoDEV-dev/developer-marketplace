import { NextRequest, NextResponse } from "next/server";
import { getDeveloperById } from "@/repositories/developers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const developer = await getDeveloperById(id);
    if (!developer) {
      return NextResponse.json(
        { error: "Developer not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(developer);
  } catch (err) {
    console.error("Developer fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch developer" },
      { status: 500 },
    );
  }
}
