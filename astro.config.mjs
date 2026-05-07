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
  adapter: vercel(),

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
