# 🌟 foxerw 的个人博客

一个简洁、优雅、艺术感十足的静态个人博客，无需后端，纯 HTML/CSS/JS 实现。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

---

## 📖 项目介绍

这是一个专注于阅读体验的静态博客系统，采用极简主义设计风格，强调内容本身。无需复杂的构建工具，无需数据库，开箱即用。

### ✨ 核心特性

- 🎨 **极简设计** - 留白充足，排版精美，艺术感十足
- 🌓 **主题切换** - 支持深色/浅色主题，自动检测系统偏好
- 📱 **响应式** - 完美适配手机、平板、桌面设备
- ⚡ **高性能** - 纯静态页面，加载迅速
- 🔍 **本地搜索** - 基于 Fuse.js 的全文搜索
- ♿ **无障碍** - 符合 WCAG 标准，支持键盘导航
- 📝 **Markdown** - 使用 Markdown 编写文章
- 🎯 **SEO 优化** - 语义化 HTML，完整的 Meta 标签

---

## 🚀 快速开始

### 本地预览

```bash
# 克隆项目
git clone <repository-url>
cd personal-blog

# 使用 Python 启动本地服务器
python3 -m http.server 8080

# 或使用 Node.js 的 http-server
npx http-server -p 8080

# 访问 http://localhost:8080
```

### 部署

#### GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 `main` 分支作为源
4. 访问 `https://yourusername.github.io/personal-blog`

#### Vercel / Netlify

直接连接 GitHub 仓库，自动部署。

#### 传统服务器

```bash
# 将文件上传到服务器
scp -r ./* user@server:/var/www/html/

# 配置 Nginx
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
├── post.html               # 文章详情页模板
├── archive.html            # 归档页
├── categories.html         # 分类页
├── tags.html               # 标签页
├── about.html              # 关于页
├── search.html             # 搜索页
├── 404.html                # 404 页面
│
├── css/
│   ├── variables.css       # CSS 变量（主题色、间距等）
│   ├── base.css            # 基础样式（重置、排版）
│   ├── layout.css          # 布局样式
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
│   ├── post.js             # 文章加载
│   ├── archive.js          # 归档页逻辑
│   ├── categories.js       # 分类页逻辑
│   ├── tags.js             # 标签页逻辑
│   └── search-page.js      # 搜索页逻辑
│
├── posts/                  # 博客文章（Markdown 格式）
│   ├── _template.md        # 文章模板
│   └── 2024-03-07-hello-world.md
│
├── data/
│   └── posts.json          # 文章索引
│
├── images/                 # 图片资源
│   ├── logo.svg
│   └── avatar.jpg
│
├── sitemap.xml             # 站点地图
├── robots.txt              # 爬虫协议
├── .gitignore
└── README.md               # 项目文档
```

---

## ✍️ 添加文章

### 1. 创建 Markdown 文件

在 `posts/` 目录下创建新文件，命名格式：`YYYY-MM-DD-slug.md`

```markdown
---
title: 文章标题
date: 2024-03-07
updated: 2024-03-07
categories: [技术，生活]
tags: [JavaScript, Web]
cover: images/posts/cover.jpg
draft: false
featured: true
description: 文章描述（用于 SEO）
---

这里是文章正文...
```

### 2. 更新文章索引

编辑 `data/posts.json`，添加新文章信息：

```json
{
  "posts": [
    {
      "slug": "your-article-slug",
      "title": "文章标题",
      "date": "2024-03-07",
      "updated": "2024-03-07",
      "categories": ["技术"],
      "tags": ["JavaScript"],
      "excerpt": "文章摘要...",
      "cover": "images/posts/cover.jpg",
      "featured": false,
      "draft": false,
      "readingTime": 5
    }
  ]
}
```

### 3. 添加配图（可选）

将文章封面图放入 `images/posts/` 目录。

---

## 🎨 自定义指南

### 修改主题色

编辑 `css/variables.css`：

```css
:root {
  --color-accent: #667eea;        /* 强调色 */
  --color-accent-hover: #5a67d8;  /* 强调色悬停 */
  --color-accent-light: #ebf4ff;  /* 强调色浅色 */
}
```

### 修改个人信息

- **头像**: 替换 `images/avatar.jpg`
- **Logo**: 替换 `images/logo.svg`
- **关于页**: 编辑 `about.html`
- **社交链接**: 在 `index.html` 和 `about.html` 中修改

### 修改导航菜单

编辑所有 HTML 文件中的 `<nav class="navbar-menu">` 部分。

### 添加新页面

1. 复制现有页面作为模板
2. 修改内容和标题
3. 在导航栏添加链接

---

## 🛠️ 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 现代样式系统（CSS 变量、Flexbox、Grid）
- **JavaScript (ES6+)** - 原生 JavaScript，无框架依赖
- **Marked.js** - Markdown 渲染
- **Highlight.js** - 代码高亮
- **Fuse.js** - 全文搜索

---

## 📊 功能列表

### 页面系统
- [x] 首页（Hero 区域、文章列表、侧边栏）
- [x] 文章详情页（Markdown 渲染、代码高亮、目录）
- [x] 归档页（时间线视图）
- [x] 分类页（分类卡片）
- [x] 标签页（标签云）
- [x] 关于页（个人介绍、技能栈、经历）
- [x] 搜索页（全文搜索）
- [x] 404 页面

### 主题系统
- [x] 深色/浅色主题切换
- [x] 主题偏好保存（LocalStorage）
- [x] 系统主题自动检测
- [x] 平滑过渡动画

### 响应式设计
- [x] 移动端优先
- [x] 断点：480px, 768px, 1024px, 1440px
- [x] 移动端导航菜单（汉堡菜单）
- [x] 触摸友好的交互

### 交互功能
- [x] 回到顶部按钮
- [x] 阅读进度条
- [x] 图片懒加载
- [x] 代码块复制按钮
- [x] 平滑滚动
- [x] 文章目录自动生成

### SEO 优化
- [x] 语义化 HTML5 标签
- [x] Meta 标签（description, keywords, OG）
- [x] sitemap.xml
- [x] robots.txt

### 性能优化
- [x] 图片懒加载
- [x] 关键 CSS 内联
- [x] 预加载重要资源
- [x] 减少重绘重排

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 🙏 致谢

感谢所有开源项目的作者们：

- [Marked.js](https://marked.js.org/)
- [Highlight.js](https://highlightjs.org/)
- [Fuse.js](https://fusejs.io/)

---

## 📬 联系方式

- 博客：https://yourdomain.com
- Email: foxerw@example.com
- GitHub: https://github.com/foxerw

---

*Made with ❤️ by foxerw*
