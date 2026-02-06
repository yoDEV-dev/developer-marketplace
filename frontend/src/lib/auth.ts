import {
  OAuth2Client,
  CodeChallengeMethod,
  generateCodeVerifier,
  generateState,
  decodeIdToken,
} from "arctic";

const issuer = process.env.OAUTH_OIDC_ISSUER!;

export const oidcClient = new OAuth2Client(
  process.env.OAUTH_OIDC_CLIENT_ID!,
  process.env.OAUTH_OIDC_CLIENT_SECRET!,
  process.env.OAUTH_OIDC_REDIRECT_URI!,
);

export const authorizationEndpoint = `${issuer}/authorize`;
export const tokenEndpoint = `${issuer}/token`;
export const userinfoEndpoint = `${issuer}/userinfo`;

export interface OIDCUser {
  sub: string;
  name: string;
  email: string;
  preferred_username: string;
  picture: string;
  email_verified: boolean;
}

export function createAuthorizationURL(): {
  url: URL;
  state: string;
  codeVerifier: string;
} {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = oidcClient.createAuthorizationURLWithPKCE(
    authorizationEndpoint,
    state,
    CodeChallengeMethod.S256,
    codeVerifier,
    ["openid", "profile", "email"],
  );
  return { url, state, codeVerifier };
}

export async function exchangeCode(code: string, codeVerifier: string) {
  return oidcClient.validateAuthorizationCode(tokenEndpoint, code, codeVerifier);
}

export function decodeIDToken(idToken: string): OIDCUser {
  return decodeIdToken(idToken) as OIDCUser;
}

export async function fetchUserInfo(accessToken: string): Promise<OIDCUser> {
  const res = await fetch(userinfoEndpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
}

export { generateState, generateCodeVerifier };
