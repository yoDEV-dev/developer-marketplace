import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "yodev_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(secret.slice(0, 32));
}

export interface SessionData {
  sub: string;
  profileId: string;
  name: string;
  email: string;
  picture: string;
}

export async function createSession(data: SessionData): Promise<string> {
  const secret = getSecret();
  const token = await new EncryptJWT(data as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .encrypt(secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return token;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const secret = getSecret();
    const { payload } = await jwtDecrypt(token, secret);
    return {
      sub: payload.sub as string,
      profileId: payload.profileId as string,
      name: payload.name as string,
      email: payload.email as string,
      picture: payload.picture as string,
    };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login");
  }
  return session;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
