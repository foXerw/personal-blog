# foxerw 的个人博客

基于 Astro 的静态博客，部署在 GitHub Pages。文章用 Markdown 编写，构建期预渲染为静态 HTML。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321/personal-blog/
```

## 常用命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 本地开发 |
| `npm run build` | 构建静态站点到 dist/（含 Pagefind 索引） |
| `npm run preview` | 预览构建产物 |
| `npm run check` | TypeScript 类型检查 |
| `npm run test` | 运行 Vitest 单测 |

## 发布文章

在 `src/content/posts/` 新建 `.md`，`git push` 即自动部署。详见 `如何发布文章.md`。

## 部署

推送 `main` 分支 → GitHub Actions 自动构建并发布到 Pages。
首次需在仓库 Settings → Pages → Source 选 "GitHub Actions"。

`astro.config.mjs` 的 `site`/`base` 按实际部署地址修改。

## 技术栈

Astro 5 · Tailwind 4 · React 18（岛屿）· Pagefind · Giscus · Vitest
