import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAuthorizationURL } from "@/lib/auth";

export async function GET() {
  const { url, state, codeVerifier } = createAuthorizationURL();

  const cookieStore = await cookies();

  // Store PKCE verifier and state in short-lived cookies
  cookieStore.set("oidc_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  cookieStore.set("oidc_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(url);
}
