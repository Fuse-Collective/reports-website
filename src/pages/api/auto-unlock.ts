/**
 * POST /api/auto-unlock
 *
 * Body (JSON): { email }
 *
 * For users who are ALREADY active subscribers in MailerLite (e.g. clicked
 * a link in our email with `?email={$email}` appended). Skips the modal +
 * subscription flow entirely. Just verifies the email is active and sets
 * the gate cookie.
 *
 * - 200 + Set-Cookie when the email is active in MailerLite.
 * - 401 (no cookie) when the email is missing/invalid/not-active. The page's
 *   client script falls back to the modal flow on 401.
 *
 * Does NOT clear an existing cookie on failure — a wrong email passed in
 * the URL shouldn't log out a user who's already validly unlocked from a
 * prior session.
 */
import type { APIRoute } from 'astro';
import { signCookie, buildSetCookie } from '../../lib/cookies';
import { isActive } from '../../lib/mailerlite';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AutoUnlockBody = { email?: unknown };

export const POST: APIRoute = async ({ request }) => {
  let body: AutoUnlockBody;
  try {
    body = (await request.json()) as AutoUnlockBody;
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_RE.test(email)) return json({ error: 'invalid_email' }, 400);

  const active = await isActive(email);
  if (!active) return json({ error: 'not_active' }, 401);

  const token = signCookie(email);
  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': buildSetCookie(token),
    },
  });
};

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
