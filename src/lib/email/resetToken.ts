import crypto from "crypto";

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getResetExpiry(): Date {
  return new Date(Date.now() + 60 * 60 * 1000);
}

export function isTokenExpired(expiry: Date): boolean {
  return new Date() > expiry;
}
