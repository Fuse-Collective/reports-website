/**
 * Vercel Routing Middleware — server-side analytics dispatcher.
 *
 * This is Vercel's framework-agnostic Routing Middleware (NOT Astro's
 * src/middleware.ts). It lives at the project root, runs as a Vercel Edge
 * Function on the edge network BEFORE the request hits any of our
 * serverless API endpoints, and is fully decoupled from the @astrojs/vercel
 * adapter output.
 *
 * Why server-side: client-side `<script>` tags get blocked by ad blockers
 * (~30-40% of desktop visitors). Edge dispatch sees every request,
 * forwarding the visitor's User-Agent and IP to Umami so per-visitor
 * de-dup, geo, and device classification still work.
 *
 * Why root-level (not src/middleware.ts in 'edge' adapter mode): Astro's
 * `middlewareMode: 'edge'` setup serializes `context.locals` through a
 * header to downstream serverless functions and gates that handshake on
 * the edge function reading the request. That handshake broke our gate's
 * POST /api/auto-unlock + /api/unlock endpoints (both consume request
 * body via `await request.json()`) — see commit 8e7b792 revert.
 *
 * The `matcher` below excludes /api/*, /_astro/*, and any path with a
 * file extension, so this middleware NEVER sees the gate's POST bodies.
 * It only fires for HTML page navigations.
 *
 * Docs:
 *   https://vercel.com/docs/routing-middleware
 *   https://vercel.com/docs/routing-middleware/getting-started
 *   https://vercel.com/docs/routing-middleware/api
 *   https://vercel.com/docs/frameworks/frontend/astro#using-vercel's-routing-middleware
 */
import { next } from '@vercel/functions';
import type { RequestContext } from '@vercel/functions';

const UMAMI_ENDPOINT = 'https://analytics.fusecollective.com/api/send';
const UMAMI_WEBSITE_ID = 'a1a2956b-bee8-4192-99ca-93ab4db5f98b';

export default function middleware(
  request: Request,
  context: RequestContext,
): Response {
  // Only track GET (page navigations). Anything else is a no-op passthrough.
  if (request.method !== 'GET') return next();

  const url = new URL(request.url);

  const headers = request.headers;
  const ua = headers.get('user-agent') ?? '';
  const referer = headers.get('referer') ?? '';
  const xff =
    headers.get('x-forwarded-for') ??
    headers.get('x-real-ip') ??
    '';
  const acceptLang = headers.get('accept-language') ?? '';
  const language = acceptLang.split(',')[0] || 'en';

  // Use waitUntil so the runtime keeps the function alive until Umami
  // responds, while the user-facing response continues immediately.
  context.waitUntil(
    fetch(UMAMI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': ua,
        ...(xff && { 'X-Forwarded-For': xff }),
      },
      body: JSON.stringify({
        type: 'event',
        payload: {
          website: UMAMI_WEBSITE_ID,
          hostname: url.hostname,
          url: url.pathname + url.search,
          referrer: referer,
          language,
          // screen + title intentionally omitted — neither is reliably
          // available server-side. Umami treats them as null.
        },
      }),
    }).catch(() => {
      // Swallow — analytics failures must never affect page delivery.
    }),
  );

  return next();
}

/**
 * matcher: skip /api/*, /_astro/*, and any path with a file extension
 * (images, css, js, fonts, sitemap.xml, robots.txt, favicon.ico, etc).
 *
 * The negative-lookahead regex below means: "match any path that does
 * NOT start with api/, _astro/, or end with .{ext}".
 */
export const config = {
  matcher: ['/((?!api/|_astro/|.*\\.[a-zA-Z0-9]+$).*)'],
};
