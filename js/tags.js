/**
 * Tags.js - 标签页面逻辑
 * 加载并展示所有标签及文章
 */

const TagsManager = {
  // 数据
  posts: [],
  tags: {},
  
  /**
   * 初始化
   */
  async init() {
    try {
      await this.loadPosts();
      this.groupByTag();
      this.renderTagsCloud();
      this.updateStats();
      this.bindSearch();
      this.bindClose();
      
      console.log('[Tags] Initialized');
    } catch (error) {
      console.error('[Tags] Error:', error);
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
   * 按标签分组
   */
  groupByTag() {
    this.tags = {};
    
    this.posts.forEach(post => {
      const tags = post.tags || [];
      tags.forEach(tag => {
        if (!this.tags[tag]) {
          this.tags[tag] = [];
        }
        this.tags[tag].push(post);
      });
    });
    
    // 每个标签内的文章按日期排序
    Object.keys(this.tags).forEach(tag => {
      this.tags[tag].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
    });
  },
  
  /**
   * 渲染标签云
   */
  renderTagsCloud() {
    const container = document.getElementById('tags-cloud');
    if (!container) return;
    
    const tagNames = Object.keys(this.tags).sort();
    
    if (tagNames.length === 0) {
      container.innerHTML = this.getEmptyHTML();
      return;
    }
    
    // 计算标签大小
    const counts = tagNames.map(tag => this.tags[tag].length);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);
    
    const getSizeClass = (count) => {
      if (maxCount === minCount) return 'tag-size-3';
      const ratio = (count - minCount) / (maxCount - minCount);
      if (ratio > 0.8) return 'tag-size-5';
      if (ratio > 0.6) return 'tag-size-4';
      if (ratio > 0.4) return 'tag-size-3';
      if (ratio > 0.2) return 'tag-size-2';
      return 'tag-size-1';
    };
    
    let html = '';
    
    tagNames.forEach(tag => {
      const count = this.tags[tag].length;
      const sizeClass = getSizeClass(count);
      
      html += `
        <a href="#tag-${encodeURIComponent(tag)}" class="tag-cloud-item ${sizeClass}" data-tag="${tag}">
          <span>#${tag}</span>
          <span class="count">${count}</span>
        </a>
      `;
    });
    
    container.innerHTML = html;
    
    // 绑定点击事件
    this.bindTagClicks();
  },
  
  /**
   * 绑定标签点击
   */
  bindTagClicks() {
    const items = document.querySelectorAll('.tag-cloud-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tag = item.getAttribute('data-tag');
        this.showTagDetail(tag);
      });
    });
  },
  
  /**
   * 显示标签详情
   */
  showTagDetail(tag) {
    const posts = this.tags[tag] || [];
    const detailEl = document.getElementById('tag-detail');
    const titleEl = document.getElementById('tag-detail-title');
    const countEl = document.getElementById('tag-detail-count');
    const listEl = document.getElementById('tag-articles-list');
    const cloudEl = document.getElementById('tags-cloud');
    
    if (!detailEl || !titleEl || !countEl || !listEl) return;
    
    titleEl.textContent = `#${tag}`;
    countEl.textContent = `${posts.length} 篇文章`;
    
    listEl.innerHTML = posts.map(post => `
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
              ${(post.tags || []).slice(0, 3).map(t => 
                `<span class="tag">${t}</span>`
              ).join('')}
            </div>
            <a href="post.html?slug=${post.slug}" class="tag" style="background: transparent; border: 1px solid var(--color-accent);">阅读全文 →</a>
          </div>
        </div>
      </article>
    `).join('');
    
    // 显示详情，隐藏标签云
    detailEl.classList.add('active');
    cloudEl.style.display = 'none';
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  
  /**
   * 隐藏标签详情
   */
  hideTagDetail() {
    const detailEl = document.getElementById('tag-detail');
    const cloudEl = document.getElementById('tags-cloud');
    
    if (detailEl) detailEl.classList.remove('active');
    if (cloudEl) cloudEl.style.display = 'flex';
  },
  
  /**
   * 绑定关闭按钮
   */
  bindClose() {
    const closeBtn = document.querySelector('.tag-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideTagDetail());
    }
  },
  
  /**
   * 绑定搜索
   */
  bindSearch() {
    const input = document.getElementById('tags-search');
    if (!input) return;
    
    const handleSearch = Utils.debounce((e) => {
      const query = e.target.value.toLowerCase().trim();
      this.filterTags(query);
    }, 300);
    
    input.addEventListener('input', handleSearch);
  },
  
  /**
   * 过滤标签
   */
  filterTags(query) {
    const items = document.querySelectorAll('.tag-cloud-item');
    
    items.forEach(item => {
      const tag = item.getAttribute('data-tag') || '';
      const shouldShow = !query || tag.toLowerCase().includes(query);
      item.style.display = shouldShow ? 'inline-flex' : 'none';
    });
  },
  
  /**
   * 更新统计
   */
  updateStats() {
    const statsEl = document.getElementById('tags-stats');
    if (statsEl) {
      const totalTags = Object.keys(this.tags).length;
      statsEl.textContent = `共 ${totalTags} 个标签，${this.posts.length} 篇文章`;
    }
  },
  
  /**
   * 显示错误
   */
  showError() {
    const container = document.getElementById('tags-cloud');
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
      <div class="empty-state">
        <p>暂无标签</p>
      </div>
    `;
  }
};

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => TagsManager.init());
} else {
  TagsManager.init();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TagsManager;
}
