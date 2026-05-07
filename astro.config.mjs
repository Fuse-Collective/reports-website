// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://reports.fusecollective.com',
  // Hybrid: static by default, opt into server-rendering per route via
  // `export const prerender = false`. Used by /api/gated/* routes that
  // serve the gated portion of reports after subscription verification.
  output: 'static',
  // middlewareMode: 'edge' — deploys src/middleware.ts as a Vercel Edge
  // Function that runs on every request, including prerendered pages.
  // Used for server-side analytics (Umami) so we don't depend on
  // client-side scripts that ad blockers strip.
  adapter: vercel({
    middlewareMode: 'edge',
  }),

  integrations: [
    sitemap(),
    icon({
      iconDir: 'src/icons',
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
