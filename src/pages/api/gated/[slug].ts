/**
 * GET /api/gated/[slug]
 *
 * Returns the gated portion of a report (dark overview + constellations
 * + strategic-assessment) as an HTML fragment. The fragment is injected
 * into the static page's #gated-content mount point by client JS.
 *
 * Phase 2: cookie + MailerLite verification.
 *   - Reads signed `unlocked` cookie (HMAC over `{ email, exp }`).
 *   - On every request, re-checks MailerLite for active subscription.
 *   - Any failure → 401 + clear cookie. Client script leaves mount empty
 *     so the gate teaser stays visible.
 */
import type { APIRoute } from 'astro';
import { experimental_AstroContainer } from 'astro/container';
import { getEntry } from 'astro:content';
import GatedSections from '../../../components/GatedSections.astro';
import { readCookie, verifyCookie, buildClearCookie } from '../../../lib/cookies';
import { isActive } from '../../../lib/mailerlite';

export const prerender = false;

const unauthorized = () =>
  new Response('Unauthorized', {
    status: 401,
    headers: { 'Set-Cookie': buildClearCookie() },
  });

export const GET: APIRoute = async ({ params, request }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  const token = readCookie(request.headers.get('cookie'));
  const payload = verifyCookie(token);
  if (!payload) return unauthorized();

  const active = await isActive(payload.email);
  if (!active) return unauthorized();

  const report = await getEntry('reports', slug);
  if (!report) {
    return new Response('Report not found', { status: 404 });
  }

  const sections: any[] = report.data.sections;

  // Mirror the slicing logic from src/pages/[slug].astro for the gated portion.
  const primaryIdx = sections.findIndex((s) => s.type === 'overview');
  const darkIdx = sections.findIndex(
    (s, i) => i > primaryIdx && s.type === 'overview',
  );
  const ctaIdx = sections.findIndex((s) => s.type === 'cta');
  const menuEndIdx = sections.findIndex(
    (s) => s.anchorId === 'ocena-strategiczna',
  );

  const scope2End = Math.min(
    ctaIdx !== -1 ? ctaIdx : Infinity,
    menuEndIdx !== -1 ? menuEndIdx : Infinity,
    sections.length,
  );

  const primaryData = primaryIdx !== -1 ? sections[primaryIdx] : null;
  const darkData = darkIdx !== -1 ? sections[darkIdx] : null;

  const sideNav = primaryData
    ? {
        areasLabel: primaryData.areasLabel,
        areas: primaryData.areas,
        sectionPills: primaryData.sectionPills ?? [],
      }
    : null;

  const scope2Content =
    darkIdx !== -1 ? sections.slice(darkIdx + 1, scope2End) : [];
  const postMenu = sections.slice(scope2End);

  // Render the gated portion to an HTML string via Container API.
  const container = await experimental_AstroContainer.create();
  const html = await container.renderToString(GatedSections, {
    props: { darkData, sideNav, scope2Content, postMenu },
  });

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
    },
  });
};
