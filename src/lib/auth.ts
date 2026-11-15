import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { normalizeRole } from "@/lib/access";
import type { TeamRole } from "@/lib/cms-types";

export const ADMIN_COOKIE = "liminova_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type DashboardSession = {
  email: string;
  role: TeamRole;
  memberId?: string;
};

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
  };
}

export async function createAdminSession(
  email: string,
  role: TeamRole = "leadership",
  memberId?: string,
) {
  const token = await new SignJWT({ email, role, memberId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function getAdminSession(): Promise<DashboardSession | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = normalizeRole(payload.role);
    if (!role || typeof payload.email !== "string") return null;
    const memberId = typeof payload.memberId === "string" ? payload.memberId : undefined;
    return { email: payload.email, role, memberId };
  } catch {
    return null;
  }
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hex] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hex) return false;
  const actual = scryptSync(password, salt, 32);
  const expected = Buffer.from(hex, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function verifyCredentials(email: string, password: string) {
  const expected = getAdminCredentials();
  if (!expected.email || !expected.password) return false;
  return (
    timingSafeEqualString(email.trim().toLowerCase(), expected.email.toLowerCase()) &&
    timingSafeEqualString(password, expected.password)
  );
}

function timingSafeEqualString(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    const pad = Buffer.alloc(aBuf.length);
    timingSafeEqual(aBuf, pad);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}
