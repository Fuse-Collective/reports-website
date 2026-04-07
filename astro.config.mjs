// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://reports-website.com',
  output: 'static',

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
