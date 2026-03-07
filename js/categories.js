/**
 * Categories.js - 分类页面逻辑
 * 加载并展示所有分类及文章
 */

const CategoriesManager = {
  // 数据
  posts: [],
  categories: {},
  
  // 分类图标映射
  categoryIcons: {
    '技术': '💻',
    '生活': '🌟',
    '随笔': '✍️',
    '教程': '📖',
    '分享': '🎁',
    '默认': '📁'
  },
  
  /**
   * 初始化
   */
  async init() {
    try {
      await this.loadPosts();
      this.groupByCategory();
      this.renderCategories();
      this.updateStats();
      
      console.log('[Categories] Initialized');
    } catch (error) {
      console.error('[Categories] Error:', error);
      this.showError();
    }
  },
  
  /**
   * 加载文章数据
   */
  async loadPosts() {
    const response = await fetch('data/posts.json');
    const data = await response.json();
    this.posts = data.posts || [];
  },
  
  /**
   * 按分类分组
   */
  groupByCategory() {
    this.categories = {};
    
    this.posts.forEach(post => {
      const cats = post.categories || [];
      cats.forEach(category => {
        if (!this.categories[category]) {
          this.categories[category] = [];
        }
        this.categories[category].push(post);
      });
    });
    
    // 每个分类内的文章按日期排序
    Object.keys(this.categories).forEach(category => {
      this.categories[category].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
    });
  },
  
  /**
   * 获取分类图标
   */
  getCategoryIcon(category) {
    return this.categoryIcons[category] || this.categoryIcons['默认'];
  },
  
  /**
   * 渲染分类
   */
  renderCategories() {
    const container = document.getElementById('categories-grid');
    if (!container) return;
    
    const categoryNames = Object.keys(this.categories).sort();
    
    if (categoryNames.length === 0) {
      container.innerHTML = this.getEmptyHTML();
      return;
    }
    
    let html = '';
    
    categoryNames.forEach(category => {
      const posts = this.categories[category];
      const icon = this.getCategoryIcon(category);
      
      html += `
        <a href="#category-${encodeURIComponent(category)}" class="category-card" data-category="${category}">
          <div class="category-icon">${icon}</div>
          <h2 class="category-name">${category}</h2>
          <p class="category-count">${posts.length} 篇文章</p>
          <div class="category-posts">
            ${posts.slice(0, 3).map(post => `
              <span class="category-post-item" title="${post.title}">${post.title}</span>
            `).join('')}
            ${posts.length > 3 ? `<span class="category-post-item" style="color: var(--color-accent);">查看更多 →</span>` : ''}
          </div>
        </a>
      `;
    });
    
    container.innerHTML = html;
    
    // 绑定点击事件
    this.bindCategoryClicks();
  },
  
  /**
   * 绑定分类点击
   */
  bindCategoryClicks() {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const category = card.getAttribute('data-category');
        this.showCategoryDetail(category);
      });
    });
  },
  
  /**
   * 显示分类详情
   */
  showCategoryDetail(category) {
    const posts = this.categories[category] || [];
    const icon = this.getCategoryIcon(category);
    
    const modal = document.createElement('div');
    modal.className = 'category-modal active';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
    
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="关闭">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 class="modal-title" id="modal-title">${icon} ${category}</h2>
        <div class="articles-list">
          ${posts.map(post => `
            <article class="article-card">
              <div class="article-card-content">
                <h3 class="article-card-title">
                  <a href="post.html?slug=${post.slug}">${post.title}</a>
                </h3>
                <div class="article-card-meta">
                  <time datetime="${post.date}">${Utils.formatDate(post.date)}</time>
                  <span>·</span>
                  <span>${post.readingTime || 5} 分钟阅读</span>
                </div>
                <p class="article-card-excerpt">${post.excerpt || ''}</p>
                <div class="article-card-footer">
                  <div class="article-card-tags">
                    ${(post.tags || []).slice(0, 3).map(tag => 
                      `<span class="tag">${tag}</span>`
                    ).join('')}
                  </div>
                  <a href="post.html?slug=${post.slug}" class="tag" style="background: transparent; border: 1px solid var(--color-accent);">阅读全文 →</a>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // 关闭按钮事件
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => this.closeModal(modal));
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    });
    
    // ESC 关闭
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
    
    // 阻止滚动
    document.body.style.overflow = 'hidden';
  },
  
  /**
   * 关闭模态框
   */
  closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
    document.body.style.overflow = '';
  },
  
  /**
   * 更新统计
   */
  updateStats() {
    const statsEl = document.getElementById('categories-stats');
    if (statsEl) {
      const totalCategories = Object.keys(this.categories).length;
      statsEl.textContent = `共 ${totalCategories} 个分类，${this.posts.length} 篇文章`;
    }
  },
  
  /**
   * 显示错误
   */
  showError() {
    const container = document.getElementById('categories-grid');
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <p>加载失败，请稍后重试</p>
        </div>
      `;
    }
  },
  
  /**
   * 空状态 HTML
   */
  getEmptyHTML() {
    return `
      <div class="empty-state" style="grid-column: 1/-1;">
        <p>暂无分类</p>
      </div>
    `;
  }
};

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CategoriesManager.init());
} else {
  CategoriesManager.init();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CategoriesManager;
}
