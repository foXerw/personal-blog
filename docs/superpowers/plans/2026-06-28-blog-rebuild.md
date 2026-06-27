# 个人博客重建实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Astro 重建个人博客，Content Collections 取代手填 JSON 索引，Markdown 构建期预渲染修复 SEO，精致组件风视觉，部署到 GitHub Pages。

**Architecture:** Astro 静态生成 → 每篇文章构建期预渲染为独立 HTML；Content Collections 用 Zod 校验 frontmatter 并自动生成索引；React 岛屿仅用于需水合的交互组件（主题切换/搜索/TOC/回到顶部）；Pagefind 构建期建搜索索引；Giscus 评论。

**Tech Stack:** Astro 5、Tailwind CSS 4（@tailwindcss/vite）、React 18（@astrojs/react）、Pagefind、Giscus、@astrojs/sitemap、@astrojs/rss、Vitest、Shiki 代码高亮、GitHub Actions。

## Global Constraints

- **Node 版本**：≥ 20.0.0（package.json `engines` 声明）。
- **包管理器**：npm（README/CI 均用 npm，不引入 pnpm/yarn）。
- **TypeScript**：strict 模式；所有 `.ts`/`.tsx`/`.astro` 通过 `astro check`。
- **TDD 范围**：纯工具函数（`formatDate` / `readingTime` / `excerptFrom`）用 Vitest 严格 TDD；Astro 页面/组件无可用单元测试框架，以 `astro check`（类型）+ `astro build`（能产出即通过）+ 本地 `astro dev` 人工目检为门禁。每个页面任务结束前必须跑这三步。
- **提交粒度**：每个 Task 末尾一次 commit；commit message 用 `feat:` / `chore:` / `docs:` 前缀，正文中文。
- **frontmatter 字段**：`title`(必填) / `date`(必填, YYYY-MM-DD) / `updated?` / `tags`(数组, 必填) / `categories?`(数组) / `cover?` / `excerpt`(必填) / `draft?`(bool, 默认 false) / `featured?`(bool, 默认 false)。YAML 数组分隔符必须用半角逗号 `,`，禁止全角逗号 `，`。
- **部署路径**：`astro.config.mjs` 的 `site` 与 `base` 为占位符，部署前按实际仓库填；所有内部链接用 `import.meta.env.BASE_URL` 或 Astro `<a href={...}>` 自动处理，禁止硬编码 `/personal-blog` 前缀。
- **占位信息**：博客名 `foxerw 的博客`、作者 `foxerw`、GitHub 用户名 `foxerw`、邮箱 `foxerw@example.com`（来自旧 README），用户后续可改。
- **旧文件**：Task 13 集中删除；删除前已确认内容迁移完成。git 历史可追溯。
- **不引入**：Ant Design、Next.js、Hugo、Service Worker/PWA、多语言。

---

## File Structure

| 文件 | 责任 |
|---|---|
| `package.json` | 依赖与脚本（dev/build/check/test） |
| `astro.config.mjs` | Astro 配置：site/base/集成/markdown |
| `tsconfig.json` | TS strict 配置，扩展 astro 严格预设 |
| `src/env.d.ts` | Astro 环境类型声明 |
| `src/styles/global.css` | Tailwind v4 入口 + 设计 token + 浅/深主题变量 + dark variant |
| `src/lib/utils.ts` | 纯工具：`formatDate` / `readingTime` / `excerptFrom` |
| `src/lib/utils.test.ts` | 上述函数的 Vitest 单测 |
| `src/content/config.ts` | Content Collection schema（Zod） |
| `src/content/posts/*.md` | 文章源文件 |
| `src/content/posts/_template.md` | 新文章模板 |
| `src/layouts/Base.astro` | 全站骨架：head/OG meta/主题脚本/Header/Footer |
| `src/components/Header.astro` | 顶部导航 + ThemeToggle 挂载点 + 搜索入口 |
| `src/components/Footer.astro` | 页脚版权/社交链接/RSS |
| `src/components/ThemeToggle.tsx` | React 岛屿：深浅切换 + localStorage 持久化 |
| `src/components/PostCard.astro` | 文章卡片 |
| `src/components/Toc.tsx` | React 岛屿：文章目录 + 滚动高亮 |
| `src/components/BackToTop.tsx` | React 岛屿：回到顶部 |
| `src/components/ReadingProgress.tsx` | React 岛屿：阅读进度条 |
| `src/components/CodeCopy.tsx` | React 岛屿：代码块复制按钮（构建期注入） |
| `src/components/Search.tsx` | React 岛屿：Pagefind 搜索框 |
| `src/components/Comments.tsx` | Giscus 评论封装 |
| `src/pages/index.astro` | 首页：精选 + 分页列表 |
| `src/pages/posts/[...slug].astro` | 文章详情 |
| `src/pages/archive.astro` | 归档（按年） |
| `src/pages/tags/index.astro` | 标签云 |
| `src/pages/tags/[tag]/[...page].astro` | 单标签分页列表 |
| `src/pages/about.astro` | 关于 |
| `src/pages/404.astro` | 404 |
| `src/pages/rss.xml.ts` | RSS feed |
| `public/robots.txt` | 爬虫协议 |
| `public/favicon.svg` | 站点图标（复用旧 logo.svg 内容） |
| `.github/workflows/deploy.yml` | 构建并部署到 GitHub Pages |
| `README.md` | 重写为新流程 |
| `如何发布文章.md` | 简化为"建 md → push" |

---

### Task 1: 项目脚手架与依赖

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Modify: `.gitignore`
- Delete: `css/`, `js/`, `data/`, `404.html`, `about.html`, `archive.html`, `categories.html`, `index.html`, `post.html`, `search.html`, `tags.html`, `robots.txt`, `sitemap.xml`, `DESIGN.md`, `如何发布文章.md`（旧版，Task 13 重写；本任务先删旧静态产物，保留 posts/ 与 images/ 与 README.md 待后续重写）

> 注：本任务删除旧 `*.html` / `css/` / `js/` / `data/`，因为它们与新架构冲突且会污染构建。`posts/*.md` 与 `images/` 保留待 Task 4 迁移。README 与 `如何发布文章.md` 暂保留，Task 13 重写。

**Interfaces:**
- Produces: 可运行的空 Astro 工程（`npm run dev` 起本地服务）。

- [ ] **Step 1: 写 package.json**

```json
{
  "name": "personal-blog",
  "type": "module",
  "version": "2.0.0",
  "private": true,
  "engines": { "node": ">=20.0.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: 写 astro.config.mjs**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 部署前按实际仓库填写：用户页用 https://<user>.github.io 且 base='/'；
// 项目页用 https://<user>.github.io 且 base='/<repo>'。
export default defineConfig({
  site: 'https://foxerw.github.io',
  base: '/personal-blog',
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
```

- [ ] **Step 3: 写 tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: 写 src/env.d.ts**

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

- [ ] **Step 5: 更新 .gitignore（追加 Astro 构建产物）**

在现有 `.gitignore` 末尾追加：

```
# Astro
.astro/
dist/
# Pagefind 索引
public/pagefind/
# 依赖锁（保留 package-lock.json，忽略其他）
.pnp.*
```

- [ ] **Step 6: 删除旧静态产物**

Run:
```bash
git rm -r css js data
git rm 404.html about.html archive.html categories.html index.html post.html search.html tags.html robots.txt sitemap.xml DESIGN.md "如何发布文章.md"
```
Expected: 文件从工作区与索引移除。

- [ ] **Step 7: 安装依赖**

Run:
```bash
npm install astro@^5 @astrojs/react@^4 @astrojs/sitemap@^3 @astrojs/rss@^4 react@^18 react-dom@^18 tailwindcss@^4 @tailwindcss/vite@^4
npm install -D @types/react@^18 @types/react-dom@^18 vitest@^2
```
Expected: `node_modules/` 生成，`package-lock.json` 生成，无错误。

- [ ] **Step 8: 验证 dev 能起**

Run:
```bash
npm run dev
```
Expected: 控制台输出 `Local http://localhost:4321/personal-blog/`，无报错（页面 404 正常，因尚无页面）。Ctrl+C 退出。

- [ ] **Step 9: 提交**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/env.d.ts .gitignore
git commit -m "chore: 初始化 Astro 工程脚手架"
git add -A
git commit -m "chore: 删除旧静态博客产物"
```

---

### Task 2: 全局样式与设计 token

**Files:**
- Create: `src/styles/global.css`

**Interfaces:**
- Produces: `global.css`，被 `Base.astro`（Task 5）import；提供浅/深主题 CSS 变量与 Tailwind `dark:` variant。

- [ ] **Step 1: 写 global.css**

```css
@import "tailwindcss";

/* 让 dark: variant 跟随 [data-theme="dark"] */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  --color-accent: #667eea;
  --color-accent-hover: #5a67d8;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Microsoft YaHei", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", Monaco, Consolas, monospace;
}

:root {
  --color-bg: #ffffff;
  --color-bg-soft: #f8f9fa;
  --color-text: #2d3748;
  --color-text-soft: #4a5568;
  --color-border: #e2e8f0;
  --color-accent: #667eea;
}

[data-theme="dark"] {
  --color-bg: #1a202c;
  --color-bg-soft: #2d3748;
  --color-text: #f7fafc;
  --color-text-soft: #cbd5e0;
  --color-border: #4a5568;
  --color-accent: #90a4e8;
}

html {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text);
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

a {
  color: var(--color-accent);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
```

- [ ] **Step 2: 验证 Tailwind 装配（临时 import）**

临时在 `astro.config.mjs` 之外验证：创建 `src/pages/health.astro`：

```astro
---
import '../styles/global.css';
---
<html><body class="p-8 text-2xl dark:bg-black">hello</body></html>
```

Run:
```bash
npm run build
```
Expected: `dist/health.html` 生成，无 Tailwind/Vite 报错。

- [ ] **Step 3: 删除临时探针**

```bash
rm src/pages/health.astro
```

- [ ] **Step 4: 提交**

```bash
git add src/styles/global.css
git commit -m "feat: 全局样式与浅/深主题设计 token"
```

---

### Task 3: 工具函数 + Vitest（TDD）

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/lib/utils.test.ts`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces:
  - `formatDate(input: Date | string, locale?: "zh" | "iso"): string` — `zh` 返回 `YYYY年M月D日`，`iso` 返回 `YYYY-MM-DD`。
  - `readingTime(markdown: string): number` — 按中文每分钟 400 字、英文每分钟 200 词估算，取 `Math.max(1, Math.ceil(...))`。
  - `excerptFrom(body: string, max?: number): string` — 剥离 Markdown 标记，取前 `max`（默认 100）字符，超长加 `…`。

- [ ] **Step 1: 写 vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 2: 写失败测试 src/lib/utils.test.ts**

```ts
import { describe, it, expect } from 'vitest';
import { formatDate, readingTime, excerptFrom } from './utils';

describe('formatDate', () => {
  it('zh 格式', () => {
    expect(formatDate('2026-03-07', 'zh')).toBe('2026年3月7日');
  });
  it('iso 格式', () => {
    expect(formatDate('2026-03-07', 'iso')).toBe('2026-03-07');
  });
  it('Date 对象入参', () => {
    expect(formatDate(new Date('2026-03-07'), 'zh')).toBe('2026年3月7日');
  });
});

describe('readingTime', () => {
  it('空文本至少 1 分钟', () => {
    expect(readingTime('')).toBe(1);
  });
  it('400 字中文约 1 分钟', () => {
    const cjk = '字'.repeat(400);
    expect(readingTime(cjk)).toBe(1);
  });
  it('401 字中文约 2 分钟', () => {
    const cjk = '字'.repeat(401);
    expect(readingTime(cjk)).toBe(2);
  });
});

describe('excerptFrom', () => {
  it('剥离 markdown 标记', () => {
    expect(excerptFrom('## 标题\n**粗体** 正文')).toBe('标题 粗体 正文');
  });
  it('截断并加省略号', () => {
    const body = 'a'.repeat(120);
    expect(excerptFrom(body, 100)).toBe('a'.repeat(100) + '…');
  });
  it('短文本不加省略号', () => {
    expect(excerptFrom('短文本', 100)).toBe('短文本');
  });
});
```

- [ ] **Step 3: 跑测试确认失败**

Run: `npm test`
Expected: FAIL — `utils.ts` 不存在 / 函数未定义。

- [ ] **Step 4: 写实现 src/lib/utils.ts**

```ts
export function formatDate(
  input: Date | string,
  locale: 'zh' | 'iso' = 'zh',
): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if (locale === 'iso') {
    const mm = String(m).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  }
  return `${y}年${m}月${day}日`;
}

export function readingTime(markdown: string): number {
  if (!markdown) return 1;
  // 去代码块与标记
  const text = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`~\-\[\]\(\)!]/g, '')
    .replace(/\s+/g, '');
  // CJK 字符
  const cjk = (text.match(/[一-鿿]/g) || []).length;
  const nonCjk = text.length - cjk;
  const minutes = cjk / 400 + nonCjk / 200;
  return Math.max(1, Math.ceil(minutes));
}

export function excerptFrom(body: string, max = 100): string {
  const text = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max) + '…';
}
```

- [ ] **Step 5: 跑测试确认通过**

Run: `npm test`
Expected: PASS，全部用例绿。

- [ ] **Step 6: 提交**

```bash
git add src/lib/utils.ts src/lib/utils.test.ts vitest.config.ts
git commit -m "feat: 日期/阅读时长/摘要工具函数及单测"
```

---

### Task 4: Content Collection schema 与文章迁移

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/welcome.md`（迁移自 `posts/welcome.md`）
- Create: `src/content/posts/minimalism.md`
- Create: `src/content/posts/frontend-art.md`
- Create: `src/content/posts/hello-world.md`（迁移自 `posts/2024-03-07-hello-world.md`）
- Create: `src/content/posts/_template.md`
- Delete: `posts/`（旧目录，迁移后删除）

**Interfaces:**
- Produces: `posts` collection，类型 `CollectionEntry<'posts'>`，供后续页面 `getCollection('posts')` 使用。frontmatter 经 Zod 校验。

- [ ] **Step 1: 写 src/content/config.ts**

```ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    cover: z.string().optional(),
    excerpt: z.string(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

- [ ] **Step 2: 迁移 welcome.md → src/content/posts/welcome.md**

正文照搬原 `posts/welcome.md`，frontmatter 改写（`description` → `excerpt`，`categories`/`tags` 半角逗号）：

```markdown
---
title: 欢迎来到我的博客
date: 2026-03-07
updated: 2026-03-07
categories: [生活]
tags: [博客, 随笔]
excerpt: 这是我的第一篇博客文章，介绍一下这个空间的用途和未来的规划。
featured: true
---

## 你好，世界！👋
```
（其后正文与原文件第 13–43 行一致。）

- [ ] **Step 3: 迁移 minimalism.md → src/content/posts/minimalism.md**

frontmatter：
```markdown
---
title: 极简主义的设计哲学
date: 2026-03-06
updated: 2026-03-06
categories: [技术, 设计]
tags: [设计, 极简主义, UI/UX]
excerpt: 探讨如何在设计和生活中实践极简主义，去除冗余，保留本质。
featured: true
---
```
（正文照搬原文件。注意原文 `克制的設計决策` 等繁体字保留原样。）

- [ ] **Step 4: 迁移 frontend-art.md → src/content/posts/frontend-art.md**

frontmatter：
```markdown
---
title: 前端开发的艺术
date: 2026-03-05
updated: 2026-03-05
categories: [技术]
tags: [前端, JavaScript, CSS]
excerpt: 前端不仅仅是实现功能，更是一种表达创意和美感的方式。
---
```
（正文照搬。）

- [ ] **Step 5: 迁移 hello-world.md → src/content/posts/hello-world.md**

frontmatter：
```markdown
---
title: 你好，世界！我的博客正式上线了
date: 2024-03-07
updated: 2024-03-07
categories: [生活]
tags: [博客, 生活]
excerpt: 经过一段时间的筹备，我的个人博客终于上线了！在这里分享搭建博客的心路历程和未来规划。
featured: true
---
```
（正文照搬；`cover` 字段删除，因旧图 `images/posts/hello-world.jpg` 不存在。）

- [ ] **Step 6: 写 _template.md**

```markdown
---
title: 文章标题
date: 2026-01-01
tags: [标签1, 标签2]
excerpt: 一句话摘要，用于首页卡片与 SEO。
featured: false
---

正文从这里开始。
```

- [ ] **Step 7: 删除旧 posts/ 目录**

```bash
git rm -r posts
```

- [ ] **Step 8: 验证 schema 与迁移（写临时探针页面）**

创建 `src/pages/_probe.astro`：

```astro
---
import { getCollection } from 'astro:content';
const posts = await getCollection('posts');
---
<ul>
  {posts.map(p => <li>{p.slug} | {p.data.title} | tags={p.data.tags.join(',')}</li>)}
</ul>
```

Run:
```bash
npm run check
npm run build
```
Expected: `astro check` 通过；`astro build` 产出 `dist/_probe/index.html`，列出 4 篇文章，slug 分别为 `welcome`/`minimalism`/`frontend-art`/`hello-world`。

- [ ] **Step 9: 删除探针并提交**

```bash
rm src/pages/_probe.astro
git add src/content
git commit -m "feat: Content Collection schema 与 4 篇文章迁移"
```

---

### Task 5: Base 布局 + 无闪烁主题脚本 + Header/Footer

**Files:**
- Create: `src/layouts/Base.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

**Interfaces:**
- Consumes: `global.css`（Task 2）。
- Produces: `Base` 布局，props `{ title: string; description?: string; image?: string; article?: boolean }`，供所有页面继承；内联无 FOUC 主题脚本读 localStorage/`prefers-color-scheme` 设 `data-theme`。

- [ ] **Step 1: 写 src/layouts/Base.astro**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
  image?: string;
}

const { title, description = 'foxerw 的个人博客', image } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const ogImage = image ? new URL(image, Astro.site) : undefined;
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:type" content="article" />
    {ogImage && <meta property="og:image" content={ogImage} />}
    <link rel="icon" href={new URL('favicon.svg', Astro.site)} />
    <link rel="alternate" type="application/rss+xml" title="RSS" href={new URL('rss.xml', Astro.site)} />
    <script is:inline>
      // 无 FOUC：在首屏渲染前定主题
      const t = localStorage.getItem('theme');
      const dark = t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    </script>
  </head>
  <body>
    <Header />
    <main class="mx-auto max-w-3xl px-4 py-8">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: 写 src/components/Header.astro**

```astro
---
import ThemeToggle from './ThemeToggle.tsx';
const nav = [
  { name: '文章', href: '/' },
  { name: '归档', href: '/archive' },
  { name: '标签', href: '/tags' },
  { name: '关于', href: '/about' },
];
const base = import.meta.env.BASE_URL;
---
<header class="sticky top-0 z-50 border-b" style="border-color: var(--color-border); background: var(--color-bg);">
  <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
    <a href={base} class="text-lg font-bold no-underline" style="color: var(--color-text);">
      foxerw 的博客
    </a>
    <nav class="flex items-center gap-4">
      {nav.map(item => (
        <a href={`${base}${item.href.replace(/^\//, '')}`} class="no-underline" style="color: var(--color-text-soft);">
          {item.name}
        </a>
      ))}
      <ThemeToggle client:load />
    </nav>
  </div>
</header>
```

> 注：`ThemeToggle` 在 Task 6 实现；本任务先创建占位组件以保证 build 通过。

- [ ] **Step 3: 写 ThemeToggle 占位（Task 6 替换）**

`src/components/ThemeToggle.tsx`：

```tsx
export default function ThemeToggle() {
  return <button aria-label="切换主题">🌓</button>;
}
```

- [ ] **Step 4: 写 src/components/Footer.astro**

```astro
---
const year = new Date().getFullYear();
---
<footer class="border-t py-6 text-center text-sm" style="border-color: var(--color-border); color: var(--color-text-soft);">
  <p>© {year} foxerw · <a href={`${import.meta.env.BASE_URL}rss.xml`}>RSS</a> · <a href="https://github.com/foxerw" target="_blank" rel="noopener">GitHub</a></p>
</footer>
```

- [ ] **Step 5: 临时首页验证**

创建 `src/pages/index.astro`：

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="首页">
  <h1>构建中</h1>
</Base>
```

Run:
```bash
npm run check && npm run build && npm run dev
```
Expected: `astro check` 通过；build 产出 `dist/index.html`；dev 打开页面能看到 Header/Footer/标题，主题按钮显示 🌓，刷新无闪烁。

- [ ] **Step 6: 提交**

```bash
git add src/layouts src/components/Header.astro src/components/Footer.astro src/components/ThemeToggle.tsx src/pages/index.astro
git commit -m "feat: Base 布局与无闪烁主题脚本"
```

---

### Task 6: ThemeToggle React 岛屿

**Files:**
- Modify: `src/components/ThemeToggle.tsx`

**Interfaces:**
- Produces: 可点击的深浅主题切换按钮，读写 `localStorage['theme']`，同步 `<html data-theme>`。

- [ ] **Step 1: 重写 ThemeToggle.tsx**

```tsx
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === 'dark');
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      aria-label="切换深浅主题"
      title="切换主题"
      className="rounded-md border px-2 py-1 text-sm"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
```

- [ ] **Step 2: 验证**

Run:
```bash
npm run check && npm run build && npm run dev
```
Expected: 首页点按钮在 ☀️/🌙 间切换，`<html data-theme>` 变化，刷新后保持选择。

- [ ] **Step 3: 提交**

```bash
git add src/components/ThemeToggle.tsx
git commit -m "feat: ThemeToggle 深浅主题切换岛屿"
```

---

### Task 7: PostCard + 首页分页列表

**Files:**
- Create: `src/components/PostCard.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getCollection('posts')`、`formatDate`/`readingTime`（Task 3）、`excerptFrom`。
- Produces: 首页 `/` 与分页 `/[2]/`、`/[3]/` …，每页 10 篇，按 date 降序；`featured` 文章置顶于首页顶部精选区。

- [ ] **Step 1: 写 PostCard.astro**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { formatDate } from '../lib/utils';

interface Props { post: CollectionEntry<'posts'>; }
const { post } = Astro.props;
const { title, date, tags, excerpt } = post.data;
const base = import.meta.env.BASE_URL;
---
<article class="rounded-lg border p-4 transition hover:shadow-md" style="border-color: var(--color-border);">
  <h2 class="mb-1 text-lg font-semibold">
    <a href={`${base}posts/${post.slug}`} class="no-underline" style="color: var(--color-text);">
      {title}
    </a>
  </h2>
  <p class="mb-2 text-sm" style="color: var(--color-text-soft);">{formatDate(date)} · {readingTime(post.body)} 分钟</p>
  <p class="mb-2" style="color: var(--color-text-soft);">{excerpt}</p>
  <div class="flex flex-wrap gap-2">
    {tags.map(t => (
      <a href={`${base}tags/${t}`} class="rounded-full border px-2 py-0.5 text-xs no-underline" style="border-color: var(--color-border); color: var(--color-text-soft);">
        #{t}
      </a>
    ))}
  </div>
</article>
```

> 修正：`readingTime` 也需 import。在 frontmatter import 行补 `import { formatDate, readingTime } from '../lib/utils';`。

- [ ] **Step 2: 重写首页 index.astro**

```astro
---
import type { GetStaticPaths } from 'astro';
import Base from '../layouts/Base.astro';
import PostCard from '../components/PostCard.astro';
import { getCollection } from 'astro:content';

export const getStaticPaths = (async ({ paginate }) => {
  const all = (await getCollection('posts', p => !p.data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return paginate(all, { pageSize: 10 });
}) satisfies GetStaticPaths;

const { page } = Astro.props;
const featured = page.currentPage === 1
  ? (await getCollection('posts', p => p.data.featured && !p.data.draft))
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  : [];
const base = import.meta.env.BASE_URL;
---
<Base title="foxerw 的博客">
  {featured.length > 0 && (
    <section class="mb-8">
      <h2 class="mb-4 text-xl font-bold">精选</h2>
      <div class="grid gap-4">
        {featured.map(p => <PostCard post={p} />)}
      </div>
    </section>
  )}
  <section class="grid gap-4">
    {page.data.map(p => <PostCard post={p} />)}
  </section>
  <nav class="mt-8 flex justify-between">
    {page.url.prev && <a href={`${base}${page.url.prev.replace(/^\//, '')}`}>← 上一页</a>}
    <span>{page.currentPage} / {page.lastPage}</span>
    {page.url.next && <a href={`${base}${page.url.next.replace(/^\//, '')}`}>下一页 →</a>}
  </nav>
</Base>
```

- [ ] **Step 3: 验证**

Run:
```bash
npm run check && npm run build
```
Expected: 产出 `dist/index.html` 与（若文章 >10）分页页；本地 dev 首页列出 4 篇文章卡片，精选区显示 3 篇 featured（welcome/minimalism/hello-world），点标题进详情页（详情页 Task 8 之前会 404，正常）。

- [ ] **Step 4: 提交**

```bash
git add src/components/PostCard.astro src/pages/index.astro
git commit -m "feat: 文章卡片与首页分页"
```

---

### Task 8: 文章详情页

**Files:**
- Create: `src/pages/posts/[...slug].astro`
- Create: `src/components/ReadingProgress.tsx`
- Create: `src/components/Toc.tsx`
- Create: `src/components/BackToTop.tsx`
- Create: `src/components/CodeCopy.tsx`

**Interfaces:**
- Consumes: `getCollection('posts')`、`formatDate`/`readingTime`、`Base`。
- Produces: 每篇文章静态页 `/posts/<slug>/`，含 TOC、阅读进度、上下篇、代码复制、回到顶部。

- [ ] **Step 1: 写 ReadingProgress.tsx**

```tsx
import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full" style={{ background: 'var(--color-accent)', width: `${p}%` }} />
  );
}
```

- [ ] **Step 2: 写 BackToTop.tsx**

```tsx
import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 rounded-full border px-3 py-2 shadow"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
      aria-label="回到顶部"
    >↑</button>
  );
}
```

- [ ] **Step 3: 写 Toc.tsx**

```tsx
import { useEffect, useState } from 'react';

interface TocItem { id: string; text: string; level: number; }

export default function Toc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState('');

  useEffect(() => {
    const heads = Array.from(document.querySelectorAll('article h2, article h3'));
    setItems(heads.map(h => ({
      id: h.id,
      text: h.textContent || '',
      level: h.tagName === 'H2' ? 2 : 3,
    })));
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
    }, { rootMargin: '-80px 0px -70% 0px' });
    heads.forEach(h => obs.observe(h));
    return () => obs.disconnect();
  }, []);

  if (items.length === 0) return null;
  return (
    <nav className="text-sm">
      <ul className="space-y-1">
        {items.map(it => (
          <li key={it.id} style={{ paddingLeft: it.level === 3 ? '1rem' : 0 }}>
            <a
              href={`#${it.id}`}
              onClick={e => { e.preventDefault(); document.getElementById(it.id)?.scrollIntoView({ behavior: 'smooth' }); }}
              className="no-underline"
              style={{ color: active === it.id ? 'var(--color-accent)' : 'var(--color-text-soft)' }}
            >{it.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 4: 写 CodeCopy.tsx**

```tsx
import { useEffect } from 'react';

export default function CodeCopy() {
  useEffect(() => {
    const blocks = document.querySelectorAll('pre');
    blocks.forEach(pre => {
      if (pre.querySelector('button')) return;
      const btn = document.createElement('button');
      btn.textContent = '复制';
      btn.className = 'absolute right-2 top-2 rounded border px-2 py-0.5 text-xs';
      btn.style.borderColor = 'var(--color-border)';
      btn.onclick = async () => {
        const code = pre.querySelector('code')?.textContent || '';
        await navigator.clipboard.writeText(code);
        btn.textContent = '已复制';
        setTimeout(() => (btn.textContent = '复制'), 1500);
      };
      (pre as HTMLElement).style.position = 'relative';
      pre.appendChild(btn);
    });
  }, []);
  return null;
}
```

- [ ] **Step 5: 写文章详情页 src/pages/posts/[...slug].astro**

```astro
---
import type { GetStaticPaths } from 'astro';
import Base from '../../layouts/Base.astro';
import Toc from '../../components/Toc.tsx';
import BackToTop from '../../components/BackToTop.tsx';
import ReadingProgress from '../../components/ReadingProgress.tsx';
import CodeCopy from '../../components/CodeCopy.tsx';
import Comments from '../../components/Comments.tsx';
import { getCollection } from 'astro:content';
import { formatDate, readingTime } from '../../lib/utils';

export const getStaticPaths = (async () => {
  const posts = (await getCollection('posts', p => !p.data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return posts.map((post, i) => ({
    params: { slug: post.slug },
    props: { post, prev: posts[i + 1], next: posts[i - 1] },
  }));
}) satisfies GetStaticPaths;

const { post, prev, next } = Astro.props;
const { Content, headings } = await post.render();
const base = import.meta.env.BASE_URL;
---
<Base title={post.data.title} description={post.data.excerpt} article>
  <ReadingProgress client:load />
  <article>
    <header class="mb-6">
      <h1 class="mb-2 text-3xl font-bold">{post.data.title}</h1>
      <p class="text-sm" style="color: var(--color-text-soft);">
        {formatDate(post.data.date)} · {readingTime(post.body)} 分钟阅读
      </p>
      <div class="flex flex-wrap gap-2">
        {post.data.tags.map(t => (
          <a href={`${base}tags/${t}`} class="text-xs no-underline" style="color: var(--color-text-soft);">#{t}</a>
        ))}
      </div>
    </header>
    {headings.length > 0 && (
      <aside class="mb-6 rounded-lg border p-4" style="border-color: var(--color-border);">
        <Toc client:load />
      </aside>
    )}
    <div class="prose prose-lg max-w-none" style="color: var(--color-text);">
      <Content />
    </div>
    <CodeCopy client:idle />
  </article>
  <nav class="mt-10 flex justify-between border-t pt-4" style="border-color: var(--color-border);">
    {prev && <a href={`${base}posts/${prev.slug}`}>← {prev.data.title}</a>}
    {next && <a href={`${base}posts/${next.slug}`}>{next.data.title} →</a>}
  </nav>
  <Comments client:visible />
  <BackToTop client:idle />
</Base>
```

> `Comments` 组件 Task 11 实现；本任务先建占位以保证 build 通过。

- [ ] **Step 6: 写 Comments 占位**

`src/components/Comments.tsx`：

```tsx
export default function Comments() {
  return <div className="mt-10 text-sm" style={{ color: 'var(--color-text-soft)' }}>评论区（Task 11 接入 Giscus）</div>;
}
```

- [ ] **Step 7: 验证**

Run:
```bash
npm run check && npm run build && npm run dev
```
Expected: 4 篇文章各产出 `dist/posts/<slug>/index.html`；本地打开 `/posts/welcome/` 能看到正文、TOC、上下篇、阅读进度条、代码块右上角"复制"按钮、回到顶部；标题锚点可滚动跳转。

- [ ] **Step 8: 提交**

```bash
git add src/pages/posts src/components/ReadingProgress.tsx src/components/Toc.tsx src/components/BackToTop.tsx src/components/CodeCopy.tsx src/components/Comments.tsx
git commit -m "feat: 文章详情页与 TOC/进度/复制/回到顶部"
```

---

### Task 9: 归档、标签、关于、404

**Files:**
- Create: `src/pages/archive.astro`
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag]/[...page].astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: `getCollection('posts')`、`formatDate`、`Base`、`PostCard`。

- [ ] **Step 1: 写 archive.astro**

```astro
---
import Base from '../layouts/Base.astro';
import { getCollection } from 'astro:content';
import { formatDate } from '../lib/utils';

const posts = (await getCollection('posts', p => !p.data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

const byYear = new Map<number, typeof posts>();
for (const p of posts) {
  const y = p.data.date.getFullYear();
  if (!byYear.has(y)) byYear.set(y, []);
  byYear.get(y)!.push(p);
}
const base = import.meta.env.BASE_URL;
---
<Base title="归档">
  <h1 class="mb-6 text-2xl font-bold">归档</h1>
  {[...byYear.entries()].map(([year, list]) => (
    <section class="mb-8">
      <h2 class="mb-3 text-xl font-semibold">{year}</h2>
      <ul class="space-y-2">
        {list.map(p => (
          <li class="flex justify-between">
            <a href={`${base}posts/${p.slug}`} class="no-underline" style="color: var(--color-text);">{p.data.title}</a>
            <span class="text-sm" style="color: var(--color-text-soft);">{formatDate(p.data.date, 'iso')}</span>
          </li>
        ))}
      </ul>
    </section>
  ))}
</Base>
```

- [ ] **Step 2: 写 tags/index.astro（标签云）**

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts', p => !p.data.draft);
const counts = new Map<string, number>();
for (const p of posts) for (const t of p.data.tags) counts.set(t, (counts.get(t) || 0) + 1);
const tags = [...counts.entries()].sort((a, b) => b[1] - a[1]);
const base = import.meta.env.BASE_URL;
---
<Base title="标签">
  <h1 class="mb-6 text-2xl font-bold">标签</h1>
  <div class="flex flex-wrap gap-3">
    {tags.map(([name, n]) => (
      <a href={`${base}tags/${name}`} class="no-underline" style="font-size: `${Math.min(2, 1 + n * 0.1)}rem`; color: var(--color-accent);">
        #{name} <span class="text-xs">({n})</span>
      </a>
    ))}
  </div>
</Base>
```

- [ ] **Step 3: 写 tags/[tag]/[...page].astro**

```astro
---
import type { GetStaticPaths } from 'astro';
import Base from '../../../layouts/Base.astro';
import PostCard from '../../../components/PostCard.astro';
import { getCollection } from 'astro:content';

export const getStaticPaths = (async ({ paginate }) => {
  const posts = await getCollection('posts', p => !p.data.draft);
  const tags = [...new Set(posts.flatMap(p => p.data.tags))];
  return tags.flatMap(tag => {
    const filtered = posts
      .filter(p => p.data.tags.includes(tag))
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
    return paginate(filtered, {
      params: { tag },
      props: { tag },
      pageSize: 10,
    });
  });
}) satisfies GetStaticPaths;

const { page, tag } = Astro.props;
---
<Base title={`标签：${tag}`}>
  <h1 class="mb-6 text-2xl font-bold">#{tag}</h1>
  <div class="grid gap-4">{page.data.map(p => <PostCard post={p} />)}</div>
</Base>
```

- [ ] **Step 4: 写 about.astro**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="关于" description="关于 foxerw">
  <article class="prose prose-lg max-w-none" style="color: var(--color-text);">
    <h1>关于</h1>
    <p>我是 foxerw，一名热爱技术的开发者。</p>
    <p>这里记录我的技术学习、生活感悟与项目分享。相信分享让知识更有价值。</p>
    <ul>
      <li>GitHub：<a href="https://github.com/foxerw" target="_blank" rel="noopener">@foxerw</a></li>
      <li>Email：foxerw@example.com</li>
    </ul>
  </article>
</Base>
```

- [ ] **Step 5: 写 404.astro**

```astro
---
import Base from '../layouts/Base.astro';
const base = import.meta.env.BASE_URL;
---
<Base title="404">
  <div class="py-20 text-center">
    <h1 class="mb-4 text-6xl font-bold">404</h1>
    <p class="mb-6" style="color: var(--color-text-soft);">这一页不存在，或许被写进了平行宇宙。</p>
    <a href={base} class="no-underline">← 回首页</a>
  </div>
</Base>
```

- [ ] **Step 6: 验证**

Run:
```bash
npm run check && npm run build && npm run dev
```
Expected: 产出 `archive`、`tags`、各标签分页、`about`、`404`；本地点导航各项可达；标签云字体随数量变化；归档按年分组。

- [ ] **Step 7: 提交**

```bash
git add src/pages/archive.astro src/pages/tags src/pages/about.astro src/pages/404.astro
git commit -m "feat: 归档/标签/关于/404 页面"
```

---

### Task 10: Pagefind 搜索

**Files:**
- Create: `src/components/Search.tsx`
- Create: `src/pages/search.astro`
- Modify: `package.json`（postbuild 脚本）
- Install: `pagefind`（devDep）

**Interfaces:**
- Produces: `/search` 页面，输入即搜（接 Pagefind 构建期索引）；`npm run build` 后自动生成索引到 `dist/pagefind/`。

- [ ] **Step 1: 安装 pagefind**

Run:
```bash
npm install -D pagefind
```

- [ ] **Step 2: package.json 加 postbuild**

把 `scripts` 改为：

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "postbuild": "pagefind --site dist",
  "preview": "astro preview",
  "check": "astro check",
  "test": "vitest run"
}
```

- [ ] **Step 3: 写 Search.tsx**

```tsx
import { useEffect, useState } from 'react';

interface Result { id: string; data: { url: string; meta: { title: string }; excerpt: string }; }

export default function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [pf, setPf] = useState<any>(null);

  useEffect(() => {
    // @ts-expect-error Pagefind 由构建期注入，运行时才有
    import(/* @vite-ignore */ `${import.meta.env.BASE_URL}pagefind/pagefind-entry.js`)
      .then((m: any) => { m.init?.(); setPf(m); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!pf || !q) { setResults([]); return; }
    let cancelled = false;
    pf.preload(q);
    pf.search(q).then((res: any) => {
      if (cancelled) return;
      Promise.all(res.results.slice(0, 10).map((r: any) => r.data())).then((data: any[]) => {
        if (!cancelled) setResults(data);
      });
    });
    return () => { cancelled = true; };
  }, [q, pf]);

  return (
    <div>
      <input
        type="search"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="搜索文章…"
        className="w-full rounded-md border px-3 py-2"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
      />
      <ul className="mt-4 space-y-2">
        {results.map(r => (
          <li key={r.id} className="rounded-md border p-3" style={{ borderColor: 'var(--color-border)' }}>
            <a href={r.data.url} className="font-semibold no-underline">{r.data.meta.title}</a>
            <p className="text-sm" style={{ color: 'var(--color-text-soft)' }} dangerouslySetInnerHTML={{ __html: r.data.excerpt }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: 写 search.astro**

```astro
---
import Base from '../layouts/Base.astro';
import Search from '../components/Search.tsx';
---
<Base title="搜索">
  <h1 class="mb-6 text-2xl font-bold">搜索</h1>
  <Search client:load />
</Base>
```

- [ ] **Step 5: Header 加搜索入口**

在 `src/components/Header.astro` 的 `nav` 数组追加 `{ name: '搜索', href: '/search' }`。

- [ ] **Step 6: 验证**

Run:
```bash
npm run check && npm run build
```
Expected: build 后 `dist/pagefind/` 目录存在（含 `pagefind-entry.js` 与索引文件）。本地预览：
```bash
npm run preview
```
打开 `/search`，输入"前端"能看到 `frontend-art` 结果，点击跳转详情页。

- [ ] **Step 7: 提交**

```bash
git add package.json package-lock.json src/components/Search.tsx src/pages/search.astro src/components/Header.astro
git commit -m "feat: Pagefind 静态搜索"
```

---

### Task 11: Giscus 评论

**Files:**
- Modify: `src/components/Comments.tsx`

**Interfaces:**
- Produces: 文章页底部 Giscus 评论（基于 GitHub Discussions）。

- [ ] **Step 1: 重写 Comments.tsx**

```tsx
import { useEffect, useRef } from 'react';

interface Props { repo?: string; repoId?: string; category?: string; categoryId?: string; }

export default function Comments({
  repo = 'foxerw/personal-blog',
  repoId = '',            // TODO 部署后到 https://giscus.app 生成填入
  category = 'Announcements',
  categoryId = '',        // TODO 同上
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!repoId || !categoryId || !ref.current) return;
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.crossOrigin = 'anonymous';
    s.async = true;
    s.setAttribute('data-repo', repo);
    s.setAttribute('data-repo-id', repoId);
    s.setAttribute('data-category', category);
    s.setAttribute('data-category-id', categoryId);
    s.setAttribute('data-mapping', 'pathname');
    s.setAttribute('data-theme', 'preferred_color_scheme');
    s.setAttribute('data-lang', 'zh-CN');
    ref.current.innerHTML = '';
    ref.current.appendChild(s);
  }, [repo, repoId, category, categoryId]);

  return <div ref={ref} className="mt-10" />;
}
```

- [ ] **Step 2: 验证（占位状态）**

Run:
```bash
npm run check && npm run build && npm run dev
```
Expected: 文章页底部渲染空 `div`（因 `repoId` 为空，组件提前 return，不加载脚本，无报错）。

> 完整启用：仓库启用 Discussions → 到 https://giscus.app 填仓库名取 `repo-id`/`category-id` → 填入上方默认值。此为部署后的一次性配置，不阻断构建。

- [ ] **Step 3: 提交**

```bash
git add src/components/Comments.tsx
git commit -m "feat: Giscus 评论组件"
```

---

### Task 12: SEO（robots、RSS、sitemap 复核）

**Files:**
- Create: `public/robots.txt`
- Create: `src/pages/rss.xml.ts`
- Create: `public/favicon.svg`（内容复用旧 `images/logo.svg`）

**Interfaces:**
- Consumes: `@astrojs/rss`（Task 1 装入）、`@astrojs/sitemap`（Task 1 装入，已自动产出 `/sitemap-index.xml`）。

- [ ] **Step 1: 写 public/robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://foxerw.github.io/personal-blog/sitemap-index.xml
```

- [ ] **Step 2: 写 src/pages/rss.xml.ts**

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', p => !p.data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 20);
  return rss({
    title: 'foxerw 的博客',
    description: '技术与生活记录',
    site: context.site!,
    items: posts.map(p => ({
      title: p.data.title,
      description: p.data.excerpt,
      pubDate: p.data.date,
      link: `/posts/${p.slug}/`,
    })),
  });
}
```

- [ ] **Step 3: 写 favicon.svg（复制旧 logo）**

Run:
```bash
cp images/logo.svg public/favicon.svg
```

- [ ] **Step 4: 验证**

Run:
```bash
npm run check && npm run build
```
Expected: 产出 `dist/rss.xml`、`dist/sitemap-index.xml`、`dist/robots.txt`、`dist/favicon.svg`；`dist/rss.xml` 内含 4 篇文章条目。

- [ ] **Step 5: 提交**

```bash
git add public/robots.txt public/favicon.svg src/pages/rss.xml.ts
git commit -m "feat: RSS/robots/favicon/sitemap"
```

---

### Task 13: GitHub Actions 部署 + README/发布指南重写 + 收尾

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`（全量重写）
- Create: `如何发布文章.md`（全量重写）
- Delete: `images/`（`logo.svg` 已复制到 `public/favicon.svg`；若 `images/` 仅含 logo.svg 则删除整个目录）

**Interfaces:**
- Produces: 推送 main 即自动构建部署到 GitHub Pages；README 描述新流程；发布指南一段话。

- [ ] **Step 1: 写 .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 全量重写 README.md**

```markdown
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
```

- [ ] **Step 3: 全量重写 如何发布文章.md**

```markdown
# 如何发布文章

## 三步

1. 在 `src/content/posts/` 新建 Markdown 文件，如 `my-post.md`：

```markdown
---
title: 文章标题
date: 2026-06-28
tags: [标签1, 标签2]
excerpt: 一句话摘要，显示在首页卡片与搜索结果。
featured: false
---

正文从这里开始。
```

2. `git add src/content/posts/my-post.md && git commit -m "feat: 发布新文章 文章标题"`
3. `git push` → GitHub Actions 自动构建部署，约 1 分钟后上线。

## 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | 是 | 标题 |
| `date` | 是 | 发布日期 YYYY-MM-DD |
| `tags` | 是 | 标签数组，半角逗号分隔 |
| `excerpt` | 是 | 摘要 |
| `categories` | 否 | 分类数组 |
| `updated` | 否 | 更新日期 |
| `cover` | 否 | 封面图路径 |
| `draft` | 否 | true 时不发布，默认 false |
| `featured` | 否 | true 时首页精选置顶，默认 false |

## 本地预览

```bash
npm run dev
```

frontmatter 写错（如缺 `excerpt`）会在 `npm run build` / CI 阶段报错，不会发出去。
```

- [ ] **Step 4: 删除旧 images 目录（若仅含 logo.svg）**

Run:
```bash
ls images/
```
若仅 `logo.svg`：
```bash
git rm -r images
```
若有其他图片资源，保留 `images/` 并在 README 说明后续配图放 `public/`。

- [ ] **Step 5: 最终全量验证**

Run:
```bash
npm run check && npm run test && npm run build
```
Expected: `astro check` 通过、Vitest 全绿、`astro build` 产出完整 `dist/`（含 4 篇文章页、首页、归档、标签、关于、404、搜索、rss、sitemap、pagefind 索引）。

- [ ] **Step 6: 提交**

```bash
git add .github/workflows/deploy.yml README.md "如何发布文章.md"
git commit -m "feat: GitHub Pages 部署工作流与文档重写"
```

---

## Self-Review

**1. Spec coverage:**
- 取代手填 JSON → Task 4 Content Collections + Task 7 `getCollection`。✓
- 构建期预渲染 / SEO → Task 1 markdown 配置、Task 5 OG meta/canonical、Task 12 sitemap/robots/RSS。✓
- 精致组件风 → Task 2 token、Task 7 PostCard、Task 6 ThemeToggle、Task 8 进度/TOC/复制。✓
- 深浅主题无 FOUC → Task 5 内联脚本 + Task 6 岛屿。✓
- Pagefind 搜索 → Task 10。✓
- Giscus 评论 → Task 11。✓
- 迁移 4 篇 → Task 4。✓
- 删除旧文件 → Task 1（静态产物）+ Task 4（旧 posts）+ Task 13（images）。✓
- GitHub Pages 部署 → Task 13。✓
- 工具函数单测 → Task 3。✓
- 404/归档/标签/关于 → Task 9。✓
- 无遗漏。

**2. Placeholder scan:**
- Task 11 `Comments.tsx` 内 `// TODO 部署后到 giscus.app 生成填入` —— 此为部署后一次性配置，已显式标注且不阻断构建（空值提前 return）。spec §9 明确"未提供前留清晰占位符"，符合。
- Task 1 `site`/`base` 占位符——spec §9 明确允许，并标注修改方式。符合。
- 无其他 TBD/TODO/"implement later"。

**3. Type consistency:**
- `formatDate`/`readingTime`/`excerptFrom` 签名在 Task 3 定义，Task 7/8/9 调用一致。✓
- `PostCard` props `post: CollectionEntry<'posts'>`，Task 7/9 调用一致。✓
- `Base` props `{ title, description?, image? }`，Task 5 定义，Task 7/8/9/10 调用一致（`article` prop 在 Task 5 接口里未声明但详情页传入——**修正**：Task 5 Props interface 需加 `article?: boolean`）。

> **修正已识别**：Task 5 Step 1 的 `interface Props` 应为：

```ts
interface Props {
  title: string;
  description?: string;
  image?: string;
  article?: boolean;
}
```

执行 Task 5 时按此修正版书写。其余类型一致。

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-28-blog-rebuild.md`. Two execution options:

1. **Subagent-Driven (recommended)** — 每个 Task 派一个全新 subagent 执行，Task 间我做两阶段评审，迭代快、上下文干净。
2. **Inline Execution** — 在当前会话内按 executing-plans 批量执行，带检查点评审。

Which approach?
