# 🌟 foxerw 的个人博客

一个简洁、优雅、艺术感十足的静态个人博客，无需后端，纯 HTML/CSS/JS 实现。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

---

## 📖 项目介绍

这是一个专注于阅读体验的静态博客系统，采用极简主义设计风格，强调内容本身。无需复杂的构建工具，无需数据库，开箱即用。

### ✨ 核心特性

- 🎨 **极简设计** - 留白充足，排版精美，艺术感十足
- 🌓 **主题切换** - 支持深色/浅色主题，一键切换
- 📱 **响应式** - 完美适配手机、平板、桌面设备
- ⚡ **高性能** - 纯静态页面，加载迅速
- 🔍 **本地搜索** - 基于 Fuse.js 的全文搜索
- 📝 **Markdown** - 使用 Markdown 编写文章
- 🎯 **SEO 优化** - 语义化 HTML，完整的 Meta 标签
- 🇨🇳 **国内加速** - 使用七牛云 CDN，国内访问飞快

---

## 🚀 快速开始

### 本地预览

```bash
# 进入项目目录
cd ~/Projects/personal-blog

# 使用 Python 启动本地服务器
python3 -m http.server 8080

# 或使用 Node.js 的 http-server
npx http-server -p 8080

# 访问 http://localhost:8080
```

### 部署

#### GitHub Pages（推荐）

```bash
# 推送到 GitHub
git remote add origin <your-repo-url>
git push -u origin main

# 在 GitHub 仓库设置中启用 GitHub Pages
# 选择 main 分支作为源
```

访问：`https://yourusername.github.io/personal-blog`

#### Vercel / Netlify

1. 连接 GitHub 仓库
2. 自动部署，无需配置

#### 传统服务器

```bash
# 上传文件
scp -r ./* user@server:/var/www/html/

# Nginx 配置
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;
}
```

---

## 📁 文件结构

```
personal-blog/
├── index.html              # 首页
├── post.html               # 文章详情页
├── archive.html            # 归档页
├── categories.html         # 分类页
├── tags.html               # 标签页
├── about.html              # 关于页
├── search.html             # 搜索页
├── 404.html                # 404 页面
│
├── css/
│   ├── variables.css       # CSS 变量（主题色）
│   ├── base.css            # 基础样式
│   ├── layout.css          # 布局样式
│   ├── themes.css          # 主题样式
│   └── style.css           # 主入口
│
├── js/
│   ├── main.js             # 主入口
│   ├── theme.js            # 主题切换
│   ├── navigation.js       # 导航交互
│   ├── pagination.js       # 分页功能
│   ├── post.js             # 文章加载
│   ├── toc.js              # 目录生成
│   ├── search.js           # 搜索功能
│   └── utils.js            # 工具函数
│
├── posts/                  # 博客文章（Markdown）
│   ├── _template.md        # 文章模板
│   ├── welcome.md          # 示例文章
│   ├── minimalism.md       # 示例文章
│   └── frontend-art.md     # 示例文章
│
├── data/
│   └── posts.json          # 文章索引
│
├── images/                 # 图片资源
├── sitemap.xml             # 站点地图
├── robots.txt              # 爬虫协议
├── 如何发布文章.md          # 📝 发布指南
└── README.md               # 项目文档
```

---

## ✍️ 发布文章

### 简单三步

**1. 创建 Markdown 文件**

```bash
# 在 posts/ 目录创建文章
touch posts/your-article.md
```

```markdown
---
title: 文章标题
date: 2026-03-08
categories: [技术]
tags: [标签 1, 标签 2]
draft: false
featured: false
description: 文章简介
---

## 正文开始

你的内容...
```

**2. 更新文章索引**

编辑 `data/posts.json`，添加：

```json
{
  "slug": "your-article",
  "title": "文章标题",
  "date": "2026-03-08",
  "categories": ["技术"],
  "tags": ["标签 1"],
  "excerpt": "摘要...",
  "featured": false,
  "readingTime": 5
}
```

**3. 刷新预览**

浏览器访问 `http://localhost:8080`，按 `Cmd+Shift+R` 刷新

---

### 📝 详细指南

查看 **`如何发布文章.md`** 获取完整教程，包含：

- 完整的文章模板
- JSON 配置详解
- 分类标签管理
- 配图指南
- 常见问题

---

## 🎨 自定义

### 修改主题色

编辑 `css/variables.css`：

```css
:root {
  --color-accent: #667eea;        /* 强调色 */
  --color-accent-hover: #5a67d8;  /* 悬停色 */
}

[data-theme="dark"] {
  --color-accent: #90a4e8;        /* 深色主题强调色 */
}
```

### 修改个人信息

- **头像**: 替换 `images/avatar.jpg`
- **Logo**: 替换 `images/logo.svg`
- **关于页**: 编辑 `about.html`
- **社交链接**: 修改 `index.html` 中的链接

### 添加新页面

1. 复制现有页面（如 `about.html`）
2. 修改内容和标题
3. 在导航栏添加链接

---

## 🛠️ 技术栈

| 类型 | 技术 |
|------|------|
| **核心** | HTML5, CSS3, JavaScript (ES6+) |
| **样式** | CSS 变量，Flexbox, Grid |
| **Markdown** | [Marked.js](https://marked.js.org/) |
| **代码高亮** | [Highlight.js](https://highlightjs.org/) |
| **搜索** | [Fuse.js](https://fusejs.io/) |
| **CDN** | 七牛云 Staticfile |

**无框架依赖** - 原生 JavaScript 实现，轻量快速

---

## 📊 功能清单

### ✅ 已实现

| 模块 | 功能 |
|------|------|
| **页面系统** | 首页、文章详情、归档、分类、标签、关于、搜索、404 |
| **主题系统** | 深色/浅色切换、LocalStorage 保存、系统主题检测 |
| **响应式** | 移动端优先、4 个断点、汉堡菜单 |
| **交互功能** | 回到顶部、阅读进度、图片懒加载、代码复制、平滑滚动 |
| **SEO** | 语义化 HTML、Meta 标签、sitemap.xml、robots.txt |
| **性能** | CDN 加速、CSS 模块化、关键资源预加载 |

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 🙏 致谢

感谢所有开源项目的作者：

- [Marked.js](https://marked.js.org/) - Markdown 渲染
- [Highlight.js](https://highlightjs.org/) - 代码高亮
- [Fuse.js](https://fusejs.io/) - 全文搜索
- [七牛云](https://www.qiniu.com/) - 国内 CDN 加速

---

## 📬 联系方式

- 博客：https://yourdomain.com
- Email: foxerw@example.com
- GitHub: https://github.com/foxerw

---

*Made with ❤️ by foxerw | 用 ❤️ 构建*
