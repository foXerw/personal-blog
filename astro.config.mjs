// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 部署前按实际仓库填写：用户页用 https://<user>.github.io 且 base='/'；
// 项目页用 https://<user>.github.io 且 base='/<repo>'。
export default defineConfig({
  site: 'https://foxerw.github.io',
  base: '/personal-blog/',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
