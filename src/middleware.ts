/**
 * Edge middleware — server-side analytics dispatcher.
 *
 * Fires a fire-and-forget pageview event to Umami for every HTML page
 * request. Runs on Vercel Edge Network (configured via middlewareMode:
 * 'edge' in astro.config.mjs), which means it executes for prerendered
 * static pages too — not just on-demand rendered routes.
 *
 * Why server-side: client-side `<script>` tags get blocked by ad blockers
 * (~30-40% of desktop visitors). Edge dispatch sees every request,
 * forwarding the visitor's User-Agent and IP to Umami so per-visitor
 * de-dup, geo, device classification still work.
 */
import { defineMiddleware } from 'astro:middleware';

const UMAMI_ENDPOINT = 'https://analytics.fusecollective.com/api/send';
const UMAMI_WEBSITE_ID = 'a1a2956b-bee8-4192-99ca-93ab4db5f98b';

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip tracking in dev — local visits shouldn't pollute production stats.
  if (import.meta.env.DEV) return next();

  const url = new URL(context.request.url);
  const path = url.pathname;

  // Track HTML routes only — skip API endpoints, _astro/* internals,
  // and anything with a file extension (images, css, js, fonts, etc).
  const isPageRoute =
    !path.startsWith('/api/') &&
    !path.startsWith('/_') &&
    !/\.[a-z0-9]+$/i.test(path);

  if (isPageRoute) {
    const headers = context.request.headers;
    const ua = headers.get('user-agent') ?? '';
    const referer = headers.get('referer') ?? '';
    const xff = headers.get('x-forwarded-for') ?? '';
    const acceptLang = headers.get('accept-language') ?? '';
    const language = acceptLang.split(',')[0] || 'en';

    // Fire-and-forget. Not awaited — TTFB stays unaffected; if Umami is
    // slow or down it doesn't matter for the user-facing response.
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
          url: path + url.search,
          referrer: referer,
          language,
          // screen + title intentionally omitted — neither is reliably
          // available server-side. Umami treats them as null.
        },
      }),
    }).catch(() => {});
  }

  return next();
});
