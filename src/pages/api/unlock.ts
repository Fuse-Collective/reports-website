/**
 * POST /api/unlock
 *
 * Body (JSON): { email, firma, rodzajFirmy }
 *
 * - Validates input (email shape, firma non-empty, rodzajFirmy in allowlist).
 * - Submitting the form IS consent (statement shown above the button); no separate consent flag.
 * - Subscribes the email into MailerLite (idempotent — existing subscribers are updated).
 * - Sets a signed `unlocked` cookie (30 days) so subsequent /api/gated/[slug] requests pass.
 * - Returns { status: 'ok' } on success.
 *
 * No magic link. Trade-off accepted in planning: anyone could type someone
 * else's email; risk is mitigated by the explicit consent statement + niche audience.
 */
import type { APIRoute } from 'astro';
import { signCookie, buildSetCookie } from '../../lib/cookies';
import { subscribe } from '../../lib/mailerlite';
import {
  extractClientIp,
  extractMetaCookies,
  hashEmail,
  sendCapiEvent,
} from '../../lib/meta-pixel';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLE_VALUES = new Set(['b2b', 'agency', 'other']);

const ROLE_LABEL_PL: Record<string, string> = {
  b2b: 'Pracuje w firmie B2B (zarząd, sprzedaż, marketing)',
  agency: 'Dostarczam usługi dla B2B (agencja, konsultant)',
  other: 'Mam inną rolę',
};

// MailerLite group "Raporty - subskrypcja" — adding subscribers here triggers
// the welcome / onboarding automation tied to that group.
const REPORTS_SUBSCRIPTION_GROUP_ID = '185901003285988780';

type UnlockBody = {
  email?: unknown;
  firma?: unknown;
  rodzajFirmy?: unknown;
  /** Meta Pixel dedup key — UUID generated client-side, passed back to
   *  Meta CAPI so the server-side event collides with the browser-side
   *  fbq('track','Lead', ..., {eventID}) call. */
  meta_event_id?: unknown;
  /** window.location.href at submit time — Meta's `event_source_url`. */
  meta_event_source_url?: unknown;
};

export const POST: APIRoute = async ({ request }) => {
  let body: UnlockBody;
  try {
    body = (await request.json()) as UnlockBody;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const firma = typeof body.firma === 'string' ? body.firma.trim() : '';
  const rodzajFirmy = typeof body.rodzajFirmy === 'string' ? body.rodzajFirmy : '';

  if (!EMAIL_RE.test(email)) return json({ error: 'invalid_email' }, 400);
  if (!firma) return json({ error: 'missing_firma' }, 400);
  if (!ROLE_VALUES.has(rodzajFirmy)) return json({ error: 'invalid_role' }, 400);

  const result = await subscribe(
    email,
    {
      firma,
      rodzaj_firmy: ROLE_LABEL_PL[rodzajFirmy],
    },
    [REPORTS_SUBSCRIPTION_GROUP_ID],
  );

  if (!result.ok) {
    console.error('MailerLite subscribe failed:', result.status, result.body);
    if (result.reason === 'previously_unsubscribed') {
      return json({ error: 'previously_unsubscribed' }, 409);
    }
    return json({ error: 'subscribe_failed' }, 502);
  }

  // Meta CAPI Lead (server-side, deduplicated with the browser-side fbq
  // Lead via shared event_id). Fire-and-forget via waitUntil — never
  // blocks the response, never fails the unlock if Meta is down.
  const metaEventId = typeof body.meta_event_id === 'string' ? body.meta_event_id : '';
  const metaEventSourceUrl =
    typeof body.meta_event_source_url === 'string' ? body.meta_event_source_url : '';
  if (metaEventId && metaEventSourceUrl) {
    const { fbp, fbc } = extractMetaCookies(request.headers.get('cookie'));
    const clientIp = extractClientIp(request.headers);
    const userAgent = request.headers.get('user-agent') ?? undefined;
    sendCapiEvent({
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: metaEventId,
      event_source_url: metaEventSourceUrl,
      action_source: 'website',
      user_data: {
        em: [hashEmail(email)],
        ...(clientIp && { client_ip_address: clientIp }),
        ...(userAgent && { client_user_agent: userAgent }),
        ...(fbp && { fbp }),
        ...(fbc && { fbc }),
      },
      custom_data: {
        content_category: 'report',
        // The `rodzajFirmy` value is small (b2b/agency/other) — useful for
        // segmenting audiences in Ads Manager without leaking the firma value.
        audience_role: rodzajFirmy,
      },
    });
  }

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
