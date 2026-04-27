/**
 * MailerLite Connect API wrappers.
 *
 * Strategy: pure subscriber pool (no group filter). A user is "unlocked" iff
 * their subscriber record exists with status === "active".
 *
 * Custom field keys (verified via GET /api/fields):
 *   - firma         (text)  — company name
 *   - rodzaj_firmy  (text)  — B2B / agency / other (free-text label)
 */
const API_BASE = 'https://connect.mailerlite.com/api';

function getToken(): string {
  const token = import.meta.env.MAILERLITE_API_KEY;
  if (!token) throw new Error('MAILERLITE_API_KEY missing');
  return token;
}

export type SubscribeFields = {
  firma?: string;
  rodzaj_firmy?: string;
};

export type SubscribeResult =
  | { ok: true }
  | { ok: false; status: number; body: string; reason: 'previously_unsubscribed' | 'other' };

export async function subscribe(
  email: string,
  fields: SubscribeFields = {},
  groups: string[] = [],
): Promise<SubscribeResult> {
  const payload: {
    email: string;
    fields: SubscribeFields;
    groups?: string[];
  } = { email, fields };
  if (groups.length > 0) payload.groups = groups;

  const res = await fetch(`${API_BASE}/subscribers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // 200 = updated, 201 = created. Both fine — idempotent.
  if (res.ok) return { ok: true };

  const body = await res.text().catch(() => '');

  // MailerLite blocks API re-subscription of users in `unsubscribed` (or
  // `bounced`/`junk`) state — 422 with a specific error message. Surface
  // this distinctly so the modal can render a helpful note instead of a
  // generic "try again" message.
  const reason: SubscribeResult extends { reason: infer R } ? R : never =
    res.status === 422 && /unsubscribed and cannot be imported/i.test(body)
      ? 'previously_unsubscribed'
      : 'other';

  return { ok: false, status: res.status, body, reason };
}

export async function isActive(email: string): Promise<boolean> {
  const res = await fetch(
    `${API_BASE}/subscribers/${encodeURIComponent(email)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Accept: 'application/json',
      },
    },
  );

  if (res.status === 404) return false;
  if (!res.ok) return false;

  const data = (await res.json().catch(() => null)) as
    | { data?: { status?: string } }
    | null;
  return data?.data?.status === 'active';
}
