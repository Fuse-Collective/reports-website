/**
 * POST /api/meta/capi
 *
 * Client-initiated mirror for Meta Conversions API. The browser pixel
 * fires the event client-side; the same client then POSTs here with the
 * shared `event_id` so we can re-send the event server-side (richer
 * match data: client IP, _fbp/_fbc cookies that we can't read from
 * client JS — wait, we CAN, but the server already sees them on the
 * incoming Cookie header without depending on client JS being unblocked).
 *
 * This endpoint exists for events the server can't independently
 * detect — primarily ViewContent on page open. Lead is fired directly
 * from /api/unlock where the email is already in scope (richer match
 * data still). PageView is intentionally browser-only — mirroring it
 * here would require per-request plumbing that doesn't pay off for the
 * lowest-value event.
 *
 * Body (JSON):
 *   {
 *     event_name: 'ViewContent',  // whitelisted set
 *     event_id: string,             // shared with browser fbq call
 *     event_source_url: string,     // window.location.href
 *     custom_data?: { content_name?, content_category?, ... }
 *   }
 *
 * Response: 204 No Content on accept, 4xx on rejection. The browser
 * doesn't need the response — analytics is fire-and-forget.
 */
import type { APIRoute } from 'astro';
import {
  extractClientIp,
  extractMetaCookies,
  sendCapiEvent,
  type MetaCapiEvent,
} from '../../../lib/meta-pixel';

export const prerender = false;

// Whitelisted events that can be triggered from the client. Lead is
// deliberately NOT here — we fire it server-side from /api/unlock with
// the hashed email already in scope. Allowing client-triggered Lead
// would let anyone POST fake conversions.
const ALLOWED_EVENTS = new Set<MetaCapiEvent['event_name']>([
  'ViewContent',
  'PageView',
]);

type ClientCapiBody = {
  event_name?: unknown;
  event_id?: unknown;
  event_source_url?: unknown;
  custom_data?: unknown;
};

export const POST: APIRoute = async ({ request }) => {
  // Same-origin check via Origin header. Blocks naive cross-origin abuse
  // without breaking same-origin fetches from our page. (Browsers always
  // attach Origin on POST regardless of CORS config.)
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return new Response(null, { status: 403 });
      }
    } catch {
      return new Response(null, { status: 403 });
    }
  }

  let body: ClientCapiBody;
  try {
    body = (await request.json()) as ClientCapiBody;
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const eventName = body.event_name as MetaCapiEvent['event_name'];
  if (!ALLOWED_EVENTS.has(eventName)) {
    return new Response(JSON.stringify({ error: 'event_not_allowed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const eventId = typeof body.event_id === 'string' ? body.event_id : '';
  const eventSourceUrl = typeof body.event_source_url === 'string' ? body.event_source_url : '';
  if (!eventId || !eventSourceUrl) {
    return new Response(JSON.stringify({ error: 'missing_fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { fbp, fbc } = extractMetaCookies(request.headers.get('cookie'));
  const clientIp = extractClientIp(request.headers);
  const userAgent = request.headers.get('user-agent') ?? undefined;

  sendCapiEvent({
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: eventSourceUrl,
    action_source: 'website',
    user_data: {
      ...(clientIp && { client_ip_address: clientIp }),
      ...(userAgent && { client_user_agent: userAgent }),
      ...(fbp && { fbp }),
      ...(fbc && { fbc }),
    },
    custom_data:
      body.custom_data && typeof body.custom_data === 'object'
        ? (body.custom_data as Record<string, unknown>)
        : undefined,
  });

  return new Response(null, { status: 204 });
};
