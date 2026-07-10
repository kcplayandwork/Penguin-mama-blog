import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: 買好網域後，把下面換成你的正式網址（SEO 必填）
export default defineConfig({
  site: 'https://penguinmama.example.com',
  integrations: [sitemap()],
});
