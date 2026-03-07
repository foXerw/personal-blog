/**
 * Search.js - 本地搜索功能
 * 使用 Fuse.js 实现全文搜索
 */

const SearchManager = {
  // 配置
  config: {
    threshold: 0.3,
    maxResults: 20,
    minQueryLength: 2
  },
  
  // 数据
  posts: [],
  fuse: null,
  
  /**
   * 初始化
   */
  async init() {
    // 检查是否已加载 Fuse.js
    if (typeof Fuse === 'undefined') {
      console.warn('[Search] Fuse.js not loaded, loading from CDN...');
      await this.loadFuseJS();
    }
    
    try {
      await this.loadPosts();
      this.initFuse();
      console.log('[Search] Initialized');
    } catch (error) {
      console.error('[Search] Error:', error);
    }
  },
  
  /**
   * 加载 Fuse.js
   */
  loadFuseJS() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7/dist/fuse.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
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
   * 初始化 Fuse
   */
  initFuse() {
    this.fuse = new Fuse(this.posts, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'excerpt', weight: 0.3 },
        { name: 'tags', weight: 0.1 },
        { name: 'categories', weight: 0.1 }
      ],
      threshold: this.config.threshold,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: this.config.minQueryLength,
      shouldSort: true
    });
  },
  
  /**
   * 搜索
   */
  search(query) {
    if (!this.fuse || !query || query.length < this.config.minQueryLength) {
      return [];
    }
    
    const results = this.fuse.search(query);
    return results.slice(0, this.config.maxResults);
  },
  
  /**
   * 高亮匹配文本
   */
  highlightMatches(text, matches) {
    if (!matches || matches.length === 0) return text;
    
    let result = text;
    const indices = matches.flatMap(m => m.indices || []);
    
    // 按起始位置排序
    indices.sort((a, b) => a[0] - b[0]);
    
    // 去重和合并重叠
    const uniqueIndices = [];
    let lastEnd = -1;
    indices.forEach(([start, end]) => {
      if (start > lastEnd) {
        uniqueIndices.push([start, end]);
        lastEnd = end;
      } else if (end > lastEnd) {
        uniqueIndices[uniqueIndices.length - 1][1] = end;
        lastEnd = end;
      }
    });
    
    // 添加高亮标签
    let offset = 0;
    uniqueIndices.forEach(([start, end]) => {
      const adjustedStart = start + offset;
      const adjustedEnd = end + offset + 1;
      result = 
        result.substring(0, adjustedStart) +
        '<mark>' +
        result.substring(adjustedStart, adjustedEnd) +
        '</mark>' +
        result.substring(adjustedEnd);
      offset += 14; // <mark></mark> 的长度
    });
    
    return result;
  }
};

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SearchManager.init());
} else {
  SearchManager.init();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SearchManager;
}
