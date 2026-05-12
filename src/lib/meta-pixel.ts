/**
 * Meta Pixel + Conversions API helpers (server-side).
 *
 * Architecture: the browser fires events via the standard `fbq()` snippet
 * mounted in BaseLayout (see src/components/MetaPixel.astro). For events
 * we care about (Lead, ViewContent), the server fires a deduplicated
 * mirror via the Graph API — both sides share the same `event_id`, so
 * Meta keeps whichever arrives first and drops the duplicate. This gives
 * us ad-blocker resilience + richer match data (hashed email, IP) on
 * conversions where it matters.
 *
 * Failures are intentionally swallowed: analytics MUST NOT break the
 * unlock flow or any user-facing response. Use waitUntil so the response
 * returns immediately while the CAPI call finishes in the background.
 *
 * Docs:
 *   https://developers.facebook.com/docs/marketing-api/conversions-api
 *   https://developers.facebook.com/docs/marketing-api/conversions-api/parameters
 *   https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events
 */
import { createHash } from 'node:crypto';
import { waitUntil } from '@vercel/functions';

const META_GRAPH_BASE = 'https://graph.facebook.com';

// Graph API version. Meta deprecates each version on a rolling ~2-year
// cycle, with months of advance notice. Bump intentionally — a new
// version often has subtle behaviour changes that need testing, so
// keeping this in code (vs. an env var) forces a code change + review.
const META_API_VERSION = 'v22.0';

export type MetaUserData = {
  /** SHA-256 hash of normalized email (lowercase + trim). */
  em?: string[];
  /** Client IP (typically X-Forwarded-For first hop). NOT hashed. */
  client_ip_address?: string;
  /** Client User-Agent. NOT hashed. */
  client_user_agent?: string;
  /** Browser ID — value of the `_fbp` cookie set by the browser pixel. */
  fbp?: string;
  /** Click ID — value of the `_fbc` cookie (set by the pixel when an ad click brings the user in via `?fbclid=`). */
  fbc?: string;
  /** External (your-system) ID — hashed. Optional. */
  external_id?: string[];
};

export type MetaCapiEvent = {
  event_name: 'PageView' | 'ViewContent' | 'Lead' | 'CompleteRegistration' | 'Contact' | 'Subscribe';
  event_time: number; // unix seconds
  event_id: string; // shared with browser-side event for dedup
  event_source_url: string;
  action_source: 'website';
  user_data: MetaUserData;
  custom_data?: Record<string, unknown>;
};

/** SHA-256 hex digest of the trimmed, lowercased input. Meta's match keys
 *  require this exact normalization. */
export function hashEmail(email: string): string {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

/** Parse the `_fbp` and `_fbc` cookies out of an incoming request's Cookie
 *  header. Returns `{}` when neither is present. */
export function extractMetaCookies(cookieHeader: string | null): { fbp?: string; fbc?: string } {
  if (!cookieHeader) return {};
  const out: { fbp?: string; fbc?: string } = {};
  for (const pair of cookieHeader.split(/;\s*/)) {
    const eq = pair.indexOf('=');
    if (eq === -1) continue;
    const name = pair.slice(0, eq);
    const value = pair.slice(eq + 1);
    if (name === '_fbp') out.fbp = value;
    else if (name === '_fbc') out.fbc = value;
  }
  return out;
}

/** Take the first IP from X-Forwarded-For (or fall back to X-Real-IP).
 *  Both headers are set by Vercel's edge in front of our serverless
 *  functions. Returns undefined when neither is present (e.g. local dev). */
export function extractClientIp(headers: Headers): string | undefined {
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = headers.get('x-real-ip');
  if (real) return real.trim();
  return undefined;
}

/** Fire-and-forget: dispatches the CAPI POST via waitUntil so it doesn't
 *  block the response. Errors are logged to stderr and swallowed. */
export function sendCapiEvent(event: MetaCapiEvent): void {
  const pixelId = import.meta.env.PUBLIC_META_PIXEL_ID;
  const accessToken = import.meta.env.META_CAPI_ACCESS_TOKEN;
  const testEventCode = import.meta.env.META_CAPI_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    // Silent no-op when not configured (e.g. local dev without the token).
    // We don't want to fail prod deploys just because token isn't set yet.
    return;
  }

  const body: Record<string, unknown> = {
    data: [event],
  };
  if (testEventCode) body.test_event_code = testEventCode;

  const url = `${META_GRAPH_BASE}/${META_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  waitUntil(
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error('Meta CAPI non-ok:', res.status, text);
        }
      })
      .catch((err) => {
        console.error('Meta CAPI fetch failed:', err);
      }),
  );
}
