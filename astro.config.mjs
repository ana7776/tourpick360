import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const publishDate = new Date();

export default defineConfig({
  site: 'https://tourpick360.com',
  devToolbar: {
    enabled: false
  },
  integrations: [
    sitemap({
      lastmod: publishDate,
      changefreq: 'daily',
      priority: 0.8
    })
  ]
});
