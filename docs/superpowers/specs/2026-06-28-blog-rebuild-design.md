# 个人博客重建设计方案

- 日期：2026-06-28
- 状态：已批准（待实施）
- 作者：foxerw

## 1. 背景与动机

当前项目（`D:\code\personal-blog`）是一个纯 HTML/CSS/JS 静态博客，文章用 Markdown 编写。存在两个根本性架构问题：

1. **手动维护文章索引**：每发一篇文章都要手改 `data/posts.json`（slug、摘要、阅读时长、分类标签计数），极易出错。
2. **运行时渲染 Markdown**：文章内容靠 JS 在浏览器里实时拉取 Markdown 渲染，搜索引擎抓不到正文，SEO 基本失效，首屏需等待 JS 加载。

这两个问题是"简陋感"的根源——不是样式问题，是架构问题。本次重建的核心目标就是替换这套底层机制。

参考博客 `github.com/Disdjj/blog` 经核查实为 Hugo + `hugo-texify3` 主题，部署于 Cloudflare Pages，使用 Giscus 评论。其"极客感"来自源码干净、产出纯静态 HTML、部署零成本，而非"零框架"。

## 2. 目标与非目标

### 目标

- 发文章流程从"建 md + 手改 JSON + 刷新"简化为"只建 md + git push"。
- 文章内容构建期预渲染为静态 HTML，SEO 满血、首屏零等待。
- 视觉为"精致组件风"：卡片、标签 chip、阴影/微动画、精致深浅主题切换。
- 部署到 GitHub Pages，零服务器成本，GitHub Actions 自动构建。
- 迁移现有 4 篇文章内容。

### 非目标（YAGNI）

- 不做评论以外的动态后端功能。
- 不做多语言。
- 不做 PWA / Service Worker（后续可加，不在本次范围）。
- 不强制零框架；接受构建期工具链。

## 3. 技术栈

| 层 | 选型 | 理由 |
|---|---|---|
| 站点生成 | Astro | 默认产出纯静态 HTML，Content Collections 自动索引 Markdown，React 岛屿按需水合 |
| 样式 | Tailwind CSS | 与精致组件风契合，设计 token 化 |
| 交互组件 | React（岛屿）+ shadcn 风格组件 | 仅主题/搜索/TOC/BackTop 等需水合，余皆静态 |
| 搜索 | Pagefind | 构建期建索引，静态搜索，零运行时后端 |
| 评论 | Giscus | 基于 GitHub Discussions，静态站标配 |
| 部署 | GitHub Pages + GitHub Actions | 零服务器，自动构建部署 |
| Markdown 渲染 | Astro 内建（@astrojs/markdown）+ Shiki 代码高亮 | 构建期渲染，无需客户端 marked.js |

## 4. 架构与目录结构

```
personal-blog/
├── src/
│   ├── content/
│   │   ├── posts/*.md          # 文章（Content Collections 自动索引）
│   │   └── config.ts           # frontmatter Zod schema（类型安全校验）
│   ├── layouts/
│   │   └── Base.astro          # 全站骨架：head/nav/footer/主题
│   ├── pages/
│   │   ├── index.astro                 # 首页：精选 + 文章列表分页
│   │   ├── posts/[...slug].astro       # 文章详情（静态预渲染每篇）
│   │   ├── tags/[tag]/[...page].astro  # 标签列表 + 分页
│   │   ├── archive.astro               # 归档（按年）
│   │   ├── about.astro
│   │   └── 404.astro
│   ├── components/
│   │   ├── PostCard.astro
│   │   ├── ThemeToggle.tsx     # React 岛屿
│   │   ├── Search.tsx          # 接 Pagefind
│   │   ├── Toc.tsx
│   │   ├── BackToTop.tsx
│   │   └── ...
│   └── styles/
│       └── global.css          # Tailwind + 设计 token（浅/深主题）
├── public/                     # favicon/robots.txt/CNAME
├── astro.config.mjs            # GitHub Pages basePath + 集成配置
├── tailwind.config.mjs
├── .github/workflows/deploy.yml
├── package.json
└── README.md
```

### 单元边界

- `content/config.ts`：唯一负责定义文章 frontmatter schema 与校验。
- `Base.astro`：唯一负责全站骨架（head/导航/页脚/主题变量挂载），所有页面继承。
- 每个 page 负责一个路由的数据获取与布局，不互相依赖。
- React 岛屿组件各自独立、可单独水合、互不依赖。

## 5. 数据流（核心：取代手填 JSON）

1. 作者写 `src/content/posts/xxx.md`，frontmatter 字段：`title` / `date` / `updated?` / `tags` / `categories?` / `cover?` / `excerpt` / `draft?` / `featured?`。
2. `content/config.ts` 用 Zod schema 校验 frontmatter——字段缺失或类型错误在构建期直接报错并阻断部署。
3. 任意页面通过 `getCollection('posts')` 拿到全量文章（自动排除 `draft: true`），分页/标签/归档/精选全部代码计算。
4. 构建期每篇文章预渲染为独立静态 HTML；Pagefind 扫描产物建立搜索索引。
5. 推送 GitHub → Actions 跑 `astro build` → 部署 `dist/` 到 Pages。

**发文章流程**：只建 md + git push。

## 6. 组件与视觉设计

### 设计 token

- CSS 变量 + Tailwind：浅色 / 深色两套配色。
- `prefers-color-scheme` 自动检测 + 手动切换，持久化到 `localStorage`，无闪烁（FOUC）挂载脚本内联到 `<head>`。
- 排版尺度：字号 / 行高 / 间距统一变量化。

### 组件清单

- **PostCard**：封面图（懒加载）+ 标题 + 摘要 + 标签 chip + 日期 + 阅读时长。
- **文章页**：阅读进度条、自动 TOC（跟随滚动高亮）、代码块复制按钮、图片灯箱、上下篇导航。
- **ThemeToggle**：深浅切换 React 岛屿。
- **Search**：接 Pagefind 的搜索框。
- **BackToTop**：回到顶部。
- **Giscus**：评论区。

### 字体

- 中文：系统字体栈。
- 等宽：JetBrains Mono。

## 7. 错误处理

- frontmatter 校验失败 → 构建期报错并阻断部署（CI 红），不会漏发错配置的文章。
- 不存在的 slug → Astro 默认 404，配定制 `404.astro` 友好页面。
- 图片缺失 → 构建期警告，文章页降级显示占位。

## 8. 测试策略

以"构建即测试"为主：

- CI 执行 `astro check`（类型检查）+ `astro build`（能产出即通过）。
- 关键纯工具函数（日期格式化、摘要截取、阅读时长估算）配 Vitest 单元测试。
- 死链检查可选（lychee 跑 CI），默认不启用，后续按需。

## 9. 迁移与部署

### 保留并迁移

- 4 篇 `posts/*.md` 文章内容：frontmatter 适配新 schema，日期/标签对齐。
- `images/logo.svg`。
- `README.md` 重写为新流程。
- `如何发布文章.md` 简化为"建 md → push"一段话。

### 删除

- 全套旧 `*.html`（index/post/about/archive/categories/tags/search/404）。
- 旧 `css/`、`js/` 目录。
- `data/posts.json` 及 `data/` 目录。
- `DESIGN.md`（被本 spec 取代）。
- `sitemap.xml`（改由 Astro 集成 `@astrojs/sitemap` 生成）。

> 旧文件在 git 历史中仍可追溯，删除不等于丢失。

### 部署

- GitHub Actions 自动构建并部署到 GitHub Pages。
- 需用户提供：博客名 / 作者名 / GitHub 用户名 / 可选自定义域名。未提供前留清晰占位符。
- `astro.config.mjs` 配置 `site` 与 `base`（子路径部署场景）。

## 10. 成功标准

- 发文章只需新建 md + push，无需手改任何索引文件。
- Lighthouse：性能 > 90，可访问性 > 90，SEO > 90。
- 深浅主题切换流畅、无 FOUC。
- CI 构建通过即视为可发布。
- 现有 4 篇文章内容完整迁移上线。
