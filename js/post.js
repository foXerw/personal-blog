/**
 * Post.js - 文章详情页逻辑
 * 加载 Markdown 文章，渲染内容，处理导航
 */

const PostManager = {
  // 当前文章数据
  currentPost: null,
  allPosts: [],
  
  /**
   * 初始化
   */
  async init() {
    try {
      // 获取文章 slug
      const slug = this.getPostSlug();
      if (!slug) {
        this.showError('未找到文章');
        return;
      }
      
      // 加载文章数据
      await this.loadPostsData();
      
      // 查找文章
      const post = this.findPostBySlug(slug);
      if (!post) {
        this.showError('文章不存在');
        return;
      }
      
      this.currentPost = post;
      
      // 加载并渲染文章
      await this.loadAndRenderPost(post);
      
      // 更新页面信息
      this.updatePageInfo(post);
      
      // 更新导航
      this.updateNavigation(post);
      
      // 更新代码高亮主题
      this.updateCodeHighlightTheme();
      
      console.log('[Post] Loaded:', post.title);
    } catch (error) {
      console.error('[Post] Error:', error);
      this.showError('加载文章失败');
    }
  },
  
  /**
   * 获取文章 slug
   */
  getPostSlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
  },
  
  /**
   * 加载文章数据
   */
  async loadPostsData() {
    try {
      const response = await fetch('data/posts.json');
      const data = await response.json();
      this.allPosts = data.posts || [];
    } catch (error) {
      console.warn('[Post] Cannot load posts.json, using empty array');
      this.allPosts = [];
    }
  },
  
  /**
   * 查找文章
   */
  findPostBySlug(slug) {
    return this.allPosts.find(post => post.slug === slug);
  },
  
  /**
   * 加载并渲染文章
   */
  async loadAndRenderPost(post) {
    try {
      const response = await fetch(`posts/${post.slug}.md`);
      if (!response.ok) throw new Error('Article not found');
      
      const markdown = await response.text();
      const html = this.renderMarkdown(markdown);
      
      const contentEl = document.getElementById('post-content');
      if (contentEl) {
        contentEl.innerHTML = html;
        
        // 处理图片懒加载
        this.processImages(contentEl);
        
        // 触发代码高亮
        this.highlightCode();
      }
    } catch (error) {
      console.error('[Post] Failed to load article:', error);
      this.showError('文章内容加载失败');
    }
  },
  
  /**
   * 渲染 Markdown
   */
  renderMarkdown(markdown) {
    if (typeof marked === 'undefined') {
      console.warn('[Post] Marked.js not loaded');
      return `<p>${markdown.replace(/\n/g, '<br>')}</p>`;
    }
    
    // 移除 front matter (YAML 元数据)
    const content = this.removeFrontMatter(markdown);
    
    // 配置 marked
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      mangle: false,
      highlight: (code, lang) => {
        if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (e) {
            console.warn('[Post] Highlight error:', e);
          }
        }
        return code;
      }
    });
    
    return marked.parse(content);
  },
  
  /**
   * 移除 Markdown 的 front matter
   */
  removeFrontMatter(markdown) {
    // Front matter 以 --- 开头和结尾
    const frontMatterRegex = /^---\n[\s\S]*?\n---\n/;
    return markdown.replace(frontMatterRegex, '');
  },
  
  /**
   * 处理图片懒加载
   */
  processImages(container) {
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        img.setAttribute('data-src', src);
        img.removeAttribute('src');
        img.classList.add('lazy');
      }
    });
  },
  
  /**
   * 代码高亮
   */
  highlightCode() {
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  },
  
  /**
   * 更新页面信息
   */
  updatePageInfo(post) {
    // 标题
    document.title = `${post.title} | foxerw 的博客`;
    
    // 文章标题
    const titleEl = document.getElementById('post-title');
    if (titleEl) titleEl.textContent = post.title;
    
    // 日期
    const dateEl = document.getElementById('post-date');
    if (dateEl) {
      dateEl.textContent = Utils.formatDate(post.date);
      dateEl.setAttribute('datetime', post.date);
    }
    
    // 阅读时间
    const timeEl = document.getElementById('post-reading-time');
    if (timeEl) {
      timeEl.textContent = `${post.readingTime || 5} 分钟阅读`;
    }
    
    // 标签
    const tagsEl = document.getElementById('post-tags');
    if (tagsEl && post.tags) {
      tagsEl.innerHTML = post.tags.map(tag => 
        `<a href="tags.html?tag=${encodeURIComponent(tag)}" class="tag">${tag}</a>`
      ).join('');
    }
    
    // 封面图
    const coverEl = document.getElementById('post-cover');
    if (coverEl && post.cover) {
      coverEl.style.display = 'block';
      coverEl.setAttribute('data-src', post.cover);
      coverEl.setAttribute('alt', post.title);
      Utils.lazyLoadImage(coverEl);
    }
    
    // SEO Meta
    this.updateMetaTags(post);
  },
  
  /**
   * 更新 Meta 标签
   */
  updateMetaTags(post) {
    // 创建或更新 Description
    let descEl = document.querySelector('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement('meta');
      descEl.setAttribute('name', 'description');
      document.head.appendChild(descEl);
    }
    descEl.setAttribute('content', post.excerpt || post.description || '');
    
    // 创建或更新 Keywords
    let keywordsEl = document.querySelector('meta[name="keywords"]');
    if (!keywordsEl) {
      keywordsEl = document.createElement('meta');
      keywordsEl.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsEl);
    }
    keywordsEl.setAttribute('content', (post.tags || []).join(', '));
    
    // Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', post.title);
    
    // Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', post.excerpt || '');
    
    // Open Graph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', window.location.href);
  },
  
  /**
   * 更新导航
   */
  updateNavigation(currentPost) {
    const currentIndex = this.allPosts.findIndex(p => p.slug === currentPost.slug);
    if (currentIndex === -1) return;
    
    // 上一篇
    const prevEl = document.getElementById('post-prev');
    const prevTitleEl = document.getElementById('post-prev-title');
    if (prevEl && prevTitleEl && currentIndex > 0) {
      const prevPost = this.allPosts[currentIndex - 1];
      prevEl.href = `post.html?slug=${prevPost.slug}`;
      prevTitleEl.textContent = prevPost.title;
      prevEl.style.display = 'flex';
    }
    
    // 下一篇
    const nextEl = document.getElementById('post-next');
    const nextTitleEl = document.getElementById('post-next-title');
    if (nextEl && nextTitleEl && currentIndex < this.allPosts.length - 1) {
      const nextPost = this.allPosts[currentIndex + 1];
      nextEl.href = `post.html?slug=${nextPost.slug}`;
      nextTitleEl.textContent = nextPost.title;
      nextEl.style.display = 'flex';
    }
  },
  
  /**
   * 更新代码高亮主题
   */
  updateCodeHighlightTheme() {
    const lightTheme = document.getElementById('hljs-light');
    const darkTheme = document.getElementById('hljs-dark');
    
    if (!lightTheme || !darkTheme) return;
    
    const updateTheme = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      
      if (isDark) {
        lightTheme.disabled = true;
        darkTheme.disabled = false;
      } else {
        lightTheme.disabled = false;
        darkTheme.disabled = true;
      }
    };
    
    updateTheme();
    
    // 监听主题变化
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  },
  
  /**
   * 显示错误
   */
  showError(message) {
    const contentEl = document.getElementById('post-content');
    const titleEl = document.getElementById('post-title');
    
    if (titleEl) titleEl.textContent = '错误';
    if (contentEl) {
      contentEl.innerHTML = `
        <div style="text-align: center; padding: var(--spacing-12);">
          <h2 style="color: var(--color-error); margin-bottom: var(--spacing-4);">😕 ${message}</h2>
          <a href="index.html" class="tag" style="display: inline-block;">返回首页</a>
        </div>
      `;
    }
  }
};

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PostManager.init());
} else {
  PostManager.init();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PostManager;
}
