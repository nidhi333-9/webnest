import crypto from "crypto";

export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
