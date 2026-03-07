/**
 * Archive.js - 归档页面逻辑
 * 加载文章数据，按时间线展示，支持搜索
 */

const ArchiveManager = {
  // 数据
  posts: [],
  groupedData: {},
  
  /**
   * 初始化
   */
  async init() {
    try {
      await this.loadPosts();
      this.groupByDate();
      this.renderTimeline();
      this.bindSearch();
      this.updateStats();
      
      console.log('[Archive] Initialized');
    } catch (error) {
      console.error('[Archive] Error:', error);
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
    
    // 按日期排序（最新的在前）
    this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  
  /**
   * 按日期分组
   */
  groupByDate() {
    this.groupedData = {};
    
    this.posts.forEach(post => {
      const date = new Date(post.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const monthName = this.getMonthName(date.getMonth());
      
      if (!this.groupedData[year]) {
        this.groupedData[year] = {};
      }
      
      if (!this.groupedData[year][month]) {
        this.groupedData[year][month] = {
          name: monthName,
          posts: []
        };
      }
      
      this.groupedData[year][month].posts.push(post);
    });
  },
  
  /**
   * 获取月份名称
   */
  getMonthName(monthIndex) {
    const months = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
    return months[monthIndex];
  },
  
  /**
   * 渲染时间线
   */
  renderTimeline() {
    const container = document.getElementById('archive-timeline');
    if (!container) return;
    
    const years = Object.keys(this.groupedData).sort((a, b) => b - a);
    
    if (years.length === 0) {
      container.innerHTML = this.getEmptyHTML();
      return;
    }
    
    let html = '';
    
    years.forEach(year => {
      const months = this.groupedData[year];
      const monthKeys = Object.keys(months).sort((a, b) => b - a);
      const yearCount = monthKeys.reduce((sum, month) => sum + months[month].posts.length, 0);
      
      html += `
        <section class="year-section" data-year="${year}">
          <div class="year-header" data-year="${year}">
            <h2 class="year-title">${year}年</h2>
            <p class="year-count">${yearCount} 篇文章</p>
          </div>
      `;
      
      monthKeys.forEach(month => {
        const monthData = months[month];
        
        html += `
          <div class="month-group">
            <h3 class="month-title">${monthData.name}</h3>
            <ul class="article-list">
        `;
        
        monthData.posts.forEach(post => {
          const date = new Date(post.date);
          const day = date.getDate().toString().padStart(2, '0');
          
          html += `
            <li class="article-item" data-title="${post.title.toLowerCase()}">
              <time class="article-date" datetime="${post.date}">${month}-${day}</time>
              <a href="post.html?slug=${post.slug}" class="article-link">${post.title}</a>
              <div class="article-tags">
                ${(post.tags || []).slice(0, 2).map(tag => 
                  `<span class="tag">${tag}</span>`
                ).join('')}
              </div>
            </li>
          `;
        });
        
        html += `
            </ul>
          </div>
        `;
      });
      
      html += `</section>`;
    });
    
    container.innerHTML = html;
  },
  
  /**
   * 绑定搜索
   */
  bindSearch() {
    const input = document.getElementById('archive-search');
    if (!input) return;
    
    const handleSearch = Utils.debounce((e) => {
      const query = e.target.value.toLowerCase().trim();
      this.filterArticles(query);
    }, 300);
    
    input.addEventListener('input', handleSearch);
  },
  
  /**
   * 过滤文章
   */
  filterArticles(query) {
    const items = document.querySelectorAll('.article-item');
    
    items.forEach(item => {
      const title = item.getAttribute('data-title') || '';
      const shouldShow = !query || title.includes(query);
      item.style.display = shouldShow ? 'flex' : 'none';
    });
  },
  
  /**
   * 更新统计
   */
  updateStats() {
    const statsEl = document.getElementById('archive-stats');
    if (statsEl) {
      statsEl.textContent = `共 ${this.posts.length} 篇文章`;
    }
  },
  
  /**
   * 显示错误
   */
  showError() {
    const container = document.getElementById('archive-timeline');
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <p>暂无文章</p>
      </div>
    `;
  }
};

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ArchiveManager.init());
} else {
  ArchiveManager.init();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArchiveManager;
}
