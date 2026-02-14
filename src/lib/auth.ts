/**
 * Authentication Utilities
 * JWT-based auth with HTTP-only cookies
 *
 * IMPORTANT: This module is imported by middleware (Edge Runtime).
 * bcrypt is loaded dynamically only where needed (Node.js only).
 * `jose` is Edge-compatible and safe to import at top level.
 */
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-in-production"
);

const TOKEN_COOKIE = "token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** JWT payload shape */
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/** Hash a plain-text password (Node.js only — do NOT call from Edge) */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.hash(password, 12);
}

/** Compare plain-text against hashed password (Node.js only) */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hash);
}

/** Create a signed JWT */
export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/** Verify and decode a JWT — returns null if invalid */
export async function verifyToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Get current session from cookies (Server Components & Route Handlers).
 * Do NOT call from middleware — use verifyToken with request.cookies instead.
 */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Helper: set auth cookie on a NextResponse */
export function setTokenCookie(
  response: { cookies: { set: Function } },
  token: string
) {
  response.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: TOKEN_MAX_AGE,
    path: "/",
  });
}

/** Helper: clear auth cookie on a NextResponse */
export function clearTokenCookie(response: { cookies: { set: Function } }) {
  response.cookies.set(TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  });
}
