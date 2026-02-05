import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCode, decodeIDToken } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { queryOne } from "@/lib/db";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    console.error("OIDC error:", error, url.searchParams.get("error_description"));
    return NextResponse.redirect(new URL("/en/developers", request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/en/developers", request.url));
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("oidc_state")?.value;
  const codeVerifier = cookieStore.get("oidc_code_verifier")?.value;

  // Clean up OIDC cookies
  cookieStore.delete("oidc_state");
  cookieStore.delete("oidc_code_verifier");

  if (!storedState || state !== storedState || !codeVerifier) {
    console.error("OIDC state mismatch or missing code verifier");
    return NextResponse.redirect(new URL("/en/developers", request.url));
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCode(code, codeVerifier);
    const idToken = tokens.idToken();
    const user = decodeIDToken(idToken);

    // Find or create developer profile
    let profile = await queryOne<{ id: string }>(
      "SELECT id FROM developer_profiles WHERE user_id = $1",
      [user.sub],
    );

    if (!profile) {
      profile = await queryOne<{ id: string }>(
        `INSERT INTO developer_profiles (user_id, display_name, headline, profile_photo_url)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [
          user.sub,
          user.name || user.preferred_username,
          "Developer",
          user.picture || null,
        ],
      );
    }

    // Create session
    await createSession({
      sub: user.sub,
      profileId: profile!.id,
      name: user.name || user.preferred_username,
      email: user.email,
      picture: user.picture || "",
    });

    return NextResponse.redirect(new URL("/en/dashboard", request.url));
  } catch (err) {
    console.error("OIDC callback error:", err);
    return NextResponse.redirect(new URL("/en/developers", request.url));
  }
}
