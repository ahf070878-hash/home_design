import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "hunibangun_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

export type AdminSession = {
  sub: string;
  email: string;
  role: "ADMIN" | "FINANCE" | "EDITOR";
  exp: number;
};

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || (process.env.NODE_ENV !== "production" ? "hunibangun-local-demo-session-secret" : null);
}

function signature(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function hashAdminPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(password, salt, 64).toString("base64url");
  return `scrypt$${salt}$${hash}`;
}

export function verifyAdminPassword(password: string, storedHash: string) {
  const [algorithm, salt, expected] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !expected) return false;
  const expectedBuffer = Buffer.from(expected, "base64url");
  const suppliedBuffer = scryptSync(password, salt, expectedBuffer.length);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export function createAdminSessionToken(session: Omit<AdminSession, "exp">) {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET belum dikonfigurasi.");
  const payload = Buffer.from(JSON.stringify({ ...session, exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SECONDS })).toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}

export function readAdminSessionToken(token: string | undefined): AdminSession | null {
  const secret = sessionSecret();
  if (!secret || !token) return null;
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return null;
  const expectedSignature = signature(payload, secret);
  const expectedBuffer = Buffer.from(expectedSignature);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  if (expectedBuffer.length !== suppliedBuffer.length || !timingSafeEqual(expectedBuffer, suppliedBuffer)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<AdminSession>;
    if (typeof session.sub !== "string" || typeof session.email !== "string" || typeof session.exp !== "number") return null;
    if (!new Set(["ADMIN", "FINANCE", "EDITOR"]).has(session.role ?? "")) return null;
    if (session.exp <= Math.floor(Date.now() / 1000)) return null;
    return session as AdminSession;
  } catch {
    return null;
  }
}

export function readAdminSessionFromRequest(request: Request) {
  const cookie = request.headers.get("cookie")?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  return readAdminSessionToken(cookie ? decodeURIComponent(cookie.slice(ADMIN_SESSION_COOKIE.length + 1)) : undefined);
}

export function isAdminMutationAuthorized(request: Request) {
  if (readAdminSessionFromRequest(request)) return true;
  const expected = process.env.SETTINGS_ADMIN_TOKEN;
  if (process.env.NODE_ENV !== "production" && !expected) return true;
  if (!expected) return false;
  const supplied = request.headers.get("x-settings-token") ?? "";
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}
