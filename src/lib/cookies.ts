/**
 * HMAC-signed cookie helpers for the gate.
 *
 * Format: `<base64url(payload)>.<base64url(signature)>`
 * Payload: `{ email: string, exp: number }` (exp = unix seconds)
 * Signature: HMAC-SHA256 over the base64url-encoded payload, keyed by GATE_SIGNING_KEY.
 *
 * Anyone can read the payload; no one can forge a valid signature without the key.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'unlocked';
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

export type GatePayload = {
  email: string;
  exp: number;
};

function getKey(): string {
  const key = import.meta.env.GATE_SIGNING_KEY;
  if (!key) {
    throw new Error('GATE_SIGNING_KEY missing — cookie signing disabled');
  }
  return key;
}

function base64urlEncode(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  return Buffer.from(
    input.replace(/-/g, '+').replace(/_/g, '/') + pad,
    'base64',
  ).toString('utf8');
}

function sign(payloadEncoded: string): string {
  return base64urlEncode(
    createHmac('sha256', getKey()).update(payloadEncoded).digest(),
  );
}

export function signCookie(email: string): string {
  const payload: GatePayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + THIRTY_DAYS_SECONDS,
  };
  const payloadEncoded = base64urlEncode(JSON.stringify(payload));
  const signature = sign(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export function verifyCookie(token: string | undefined): GatePayload | null {
  if (!token) return null;
  const [payloadEncoded, signature] = token.split('.');
  if (!payloadEncoded || !signature) return null;

  const expected = sign(payloadEncoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let payload: GatePayload;
  try {
    payload = JSON.parse(base64urlDecode(payloadEncoded));
  } catch {
    return null;
  }

  if (typeof payload.email !== 'string' || typeof payload.exp !== 'number') {
    return null;
  }
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}

export function buildSetCookie(token: string): string {
  const isProd = import.meta.env.PROD;
  const parts = [
    `${COOKIE_NAME}=${token}`,
    'Path=/',
    `Max-Age=${THIRTY_DAYS_SECONDS}`,
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (isProd) parts.push('Secure');
  return parts.join('; ');
}

export function buildClearCookie(): string {
  const isProd = import.meta.env.PROD;
  const parts = [
    `${COOKIE_NAME}=`,
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (isProd) parts.push('Secure');
  return parts.join('; ');
}

export function readCookie(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  for (const pair of cookieHeader.split(/;\s*/)) {
    const eq = pair.indexOf('=');
    if (eq === -1) continue;
    if (pair.slice(0, eq) === COOKIE_NAME) return pair.slice(eq + 1);
  }
  return undefined;
}
