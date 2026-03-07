/**
 * Search Page.js - 搜索页面逻辑
 */

const SearchPageManager = {
  /**
   * 初始化
   */
  init() {
    this.bindInput();
    this.bindKeyboard();
    this.checkQuery();
  },
  
  /**
   * 绑定输入事件
   */
  bindInput() {
    const input = document.getElementById('search-input');
    if (!input) return;
    
    const handleInput = Utils.debounce((e) => {
      const query = e.target.value.trim();
      this.performSearch(query);
    }, 300);
    
    input.addEventListener('input', handleInput);
  },
  
  /**
   * 绑定键盘快捷键
   */
  bindKeyboard() {
    // Ctrl+K 聚焦搜索框
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('search-input');
        if (input) input.focus();
      }
    });
  },
  
  /**
   * 检查 URL 查询参数
   */
  checkQuery() {
    const query = Utils.getUrlParam('q');
    if (query) {
      const input = document.getElementById('search-input');
      if (input) {
        input.value = query;
        this.performSearch(query);
      }
    }
  },
  
  /**
   * 执行搜索
   */
  performSearch(query) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;
    
    if (!query || query.length < 2) {
      resultsEl.innerHTML = '';
      return;
    }
    
    const results = SearchManager.search(query);
    this.renderResults(results, query);
  },
  
  /**
   * 渲染结果
   */
  renderResults(results, query) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;
    
    if (results.length === 0) {
      resultsEl.innerHTML = this.getEmptyHTML(query);
      return;
    }
    
    let html = `
      <p class="search-stats">找到 ${results.length} 篇相关文章</p>
      <div class="articles-list">
    `;
    
    results.forEach(result => {
      const post = result.item;
      const titleMatches = result.matches?.find(m => m.key === 'title');
      const excerptMatches = result.matches?.find(m => m.key === 'excerpt');
      
      const highlightedTitle = titleMatches 
        ? SearchManager.highlightMatches(post.title, titleMatches.matches)
        : post.title;
      
      const highlightedExcerpt = excerptMatches
        ? SearchManager.highlightMatches(post.excerpt || '', excerptMatches.matches)
        : post.excerpt || '';
      
      html += `
        <article class="search-result-item">
          <h2 class="search-result-title">
            <a href="post.html?slug=${post.slug}">${highlightedTitle}</a>
          </h2>
          <p class="search-result-meta">
            <time datetime="${post.date}">${Utils.formatDate(post.date)}</time>
            <span> · </span>
            <span>${post.readingTime || 5} 分钟阅读</span>
          </p>
          <p class="search-result-excerpt">${highlightedExcerpt}</p>
          <div class="article-card-tags" style="margin-top: var(--spacing-3);">
            ${(post.tags || []).slice(0, 3).map(tag => 
              `<span class="tag">${tag}</span>`
            ).join('')}
          </div>
        </article>
      `;
    });
    
    html += '</div>';
    resultsEl.innerHTML = html;
  },
  
  /**
   * 空状态 HTML
   */
  getEmptyHTML(query) {
    return `
      <div class="search-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p>未找到与 "<strong>${query}</strong>" 相关的文章</p>
        <p style="margin-top: var(--spacing-2); font-size: var(--text-sm);">试试其他关键词</p>
      </div>
    `;
  }
};

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SearchPageManager.init());
} else {
  SearchPageManager.init();
}
