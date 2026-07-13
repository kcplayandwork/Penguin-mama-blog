import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://penguinmama.blog',
  integrations: [sitemap()],
});
