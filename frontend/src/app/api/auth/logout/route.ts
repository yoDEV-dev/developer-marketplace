import { NextResponse, type NextRequest } from "next/server";
import { destroySession } from "@/lib/session";

export async function GET(request: NextRequest) {
  await destroySession();
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost";
  return NextResponse.redirect(new URL("/en/developers", `${proto}://${host}`));
}
