import { NextResponse, type NextRequest } from "next/server";
import { destroySession } from "@/lib/session";

export async function GET(request: NextRequest) {
  await destroySession();
  return NextResponse.redirect(new URL("/en/developers", request.url));
}
