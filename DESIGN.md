# 个人博客项目 - 完整设计方案

## 📋 项目概述

一个简洁、优雅、艺术感十足的静态个人博客，无需后端，纯 HTML/CSS/JS 实现。

---

## 🎯 核心功能需求

### 1. 页面系统
- [ ] **首页 (index.html)**
  - Hero 区域（个人简介 + 头像/艺术字）
  - 精选文章展示（置顶/推荐）
  - 文章列表（分页/无限滚动）
  - 侧边栏（关于我、分类、标签云、社交链接）
  - 页脚（版权信息、备案、RSS 订阅）

- [ ] **文章详情页 (post.html)**
  - 文章标题、发布日期、阅读时长
  - 文章目录（TOC）自动生成
  - 正文内容（支持 Markdown 渲染）
  - 代码高亮
  - 图片懒加载 + 灯箱效果
  - 上一篇/下一篇导航
  - 评论区（静态评论系统，如 Giscus/Utterances）
  - 分享按钮

- [ ] **归档页 (archive.html)**
  - 按年份/月份归档
  - 时间线视图
  - 文章统计

- [ ] **分类页 (categories.html)**
  - 分类列表
  - 每个分类的文章数量
  - 分类详情页面

- [ ] **标签页 (tags.html)**
  - 标签云
  - 标签详情页面

- [ ] **关于页 (about.html)**
  - 个人介绍
  - 头像/照片
  - 技能栈展示
  - 时间线（经历）
  - 社交链接
  - 联系方式

- [ ] **404 页面 (404.html)**
  - 艺术化设计
  - 返回首页链接

### 2. 主题系统
- [ ] 深色/浅色主题切换
- [ ] 主题偏好保存到 LocalStorage
- [ ] 系统主题自动检测（prefers-color-scheme）
- [ ] 平滑过渡动画

### 3. 响应式设计
- [ ] 移动端优先
- [ ] 断点：480px, 768px, 1024px, 1440px
- [ ] 移动端导航菜单（汉堡菜单）
- [ ] 触摸友好的交互

### 4. 性能优化
- [ ] 图片懒加载
- [ ] CSS/JS 压缩（生产环境）
- [ ] 关键 CSS 内联
- [ ] 预加载重要资源
- [ ] Service Worker 缓存（PWA 支持）

### 5. SEO 优化
- [ ] 语义化 HTML5 标签
- [ ] Meta 标签（description, keywords, OG）
- [ ] 结构化数据（JSON-LD）
- [ ] sitemap.xml
- [ ] robots.txt
- [ ] canonical URL

### 6. 可访问性 (A11y)
- [ ] ARIA 标签
- [ ] 键盘导航支持
- [ ] 焦点可见性
- [ ] 颜色对比度符合 WCAG 标准

### 7. 交互功能
- [ ] 回到顶部按钮
- [ ] 阅读进度条
- [ ] 搜索功能（本地搜索，如 Fuse.js）
- [ ] 代码块复制按钮
- [ ] 图片点击放大（灯箱）
- [ ] 平滑滚动

---

## 🏗️ 技术架构

### 文件结构

```
personal-blog/
├── index.html              # 首页
├── post.html               # 文章详情页模板
├── archive.html            # 归档页
├── categories.html         # 分类页
├── tags.html               # 标签页
├── about.html              # 关于页
├── 404.html                # 404 页面
│
├── css/
│   ├── variables.css       # CSS 变量（主题色、间距等）
│   ├── base.css            # 基础样式（重置、排版）
│   ├── layout.css          # 布局样式
│   ├── components.css      # 组件样式
│   ├── pages.css           # 页面特定样式
│   ├── themes.css          # 主题样式
│   └── style.css           # 主入口（导入所有）
│
├── js/
│   ├── main.js             # 主入口
│   ├── theme.js            # 主题切换
│   ├── navigation.js       # 导航交互
│   ├── search.js           # 搜索功能
│   ├── toc.js              # 目录生成
│   ├── utils.js            # 工具函数
│   └── sw.js               # Service Worker
│
├── posts/                  # 博客文章（Markdown 格式）
│   ├── _template.md        # 文章模板
│   ├── 2024-01-01-hello.md
│   └── ...
│
├── images/                 # 图片资源
│   ├── logo.svg
│   ├── avatar.jpg
│   └── posts/              # 文章配图
│
├── data/                   # 数据文件
│   ├── posts.json          # 文章索引（由脚本生成）
│   ├── categories.json
│   └── tags.json
│
├── scripts/                # 构建脚本
│   ├── generate-index.js   # 生成文章索引
│   └── build.js            # 构建脚本
│
├── .gitignore
├── package.json            # 项目配置（可选，用于构建工具）
└── README.md               # 项目文档
```

### 设计规范

#### 色彩系统
```css
:root {
  /* 浅色主题 */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-text-primary: #2d3748;
  --color-text-secondary: #4a5568;
  --color-accent: #667eea;
  --color-accent-hover: #5a67d8;
  --color-border: #e2e8f0;
  
  /* 深色主题 */
  --color-bg-primary-dark: #1a202c;
  --color-bg-secondary-dark: #2d3748;
  --color-text-primary-dark: #f7fafc;
  --color-text-secondary-dark: #e2e8f0;
  --color-accent-dark: #90a4e8;
  --color-border-dark: #4a5568;
}
```

#### 排版系统
```css
:root {
  /* 字体 */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-mono: 'Fira Code', 'Monaco', 'Consolas', monospace;
  
  /* 字号 */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  
  /* 行高 */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* 间距 */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
}
```

#### 动画系统
```css
/* 过渡 */
--transition-fast: 150ms ease;
--transition-normal: 300ms ease;
--transition-slow: 500ms ease;

/* 关键帧动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

---

## 📝 内容管理方案

### Markdown 文章格式

```markdown
---
title: 文章标题
date: 2024-01-01
updated: 2024-01-02
categories: [技术, 生活]
tags: [JavaScript, Web]
cover: images/posts/cover.jpg
draft: false
featured: true
---

文章正文内容...
```

### 文章索引生成

使用 Node.js 脚本解析 Markdown 文件，生成 `data/posts.json`：

```json
{
  "posts": [
    {
      "slug": "hello-world",
      "title": "你好世界",
      "date": "2024-01-01",
      "categories": ["技术"],
      "tags": ["JavaScript"],
      "excerpt": "文章摘要...",
      "cover": "images/posts/cover.jpg",
      "featured": true,
      "readingTime": 5
    }
  ]
}
```

---

## 🚀 实现计划

### 阶段一：基础架构（优先级：高）
1. [ ] 创建文件结构
2. [ ] CSS 变量和基础样式
3. [ ] 首页布局和样式
4. [ ] 响应式导航
5. [ ] 主题切换功能

### 阶段二：核心页面（优先级：高）
1. [ ] 文章详情页
2. [ ] Markdown 渲染（使用 marked.js）
3. [ ] 代码高亮（使用 highlight.js 或 Prism）
4. [ ] 关于页面
5. [ ] 404 页面

### 阶段三：功能增强（优先级：中）
1. [ ] 归档页面
2. [ ] 分类页面
3. [ ] 标签页面
4. [ ] 搜索功能
5. [ ] 文章目录生成

### 阶段四：优化完善（优先级：中）
1. [ ] 图片懒加载
2. [ ] 回到顶部按钮
3. [ ] 阅读进度条
4. [ ] 灯箱效果
5. [ ] 代码复制功能

### 阶段五：高级功能（优先级：低）
1. [ ] Service Worker / PWA
2. [ ] SEO 优化
3. [ ] 可访问性优化
4. [ ] 性能优化
5. [ ] 评论系统集成

---

## 📦 依赖库（CDN 引入）

```html
<!-- Markdown 渲染 -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<!-- 代码高亮 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css">
<script src="https://cdn.jsdelivr.net/npm/highlight.js@11/lib/core.min.js"></script>

<!-- 搜索 -->
<script src="https://cdn.jsdelivr.net/npm/fuse.js@7/dist/fuse.min.js"></script>

<!-- 图标 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons@latest/iconfont/tabler-icons.min.css">
```

---

## 📊 成功标准

- [ ] 所有核心页面完成
- [ ] 响应式设计在所有断点正常工作
- [ ] 深色/浅色主题切换流畅
- [ ] Lighthouse 评分：性能 > 90，可访问性 > 90，SEO > 90
- [ ] 无 JavaScript 错误
- [ ] 代码整洁、有注释
- [ ] Git 提交历史清晰

---

## 🎨 设计灵感

参考风格：
- 极简主义（Minimalism）
- 瑞士设计风格（Swiss Style）
- 日本侘寂美学（Wabi-Sabi）
- 现代网页设计趋势

关键词：留白、网格系统、排版优先、微妙的动画、克制的色彩

---

*最后更新：2024-03-07*
