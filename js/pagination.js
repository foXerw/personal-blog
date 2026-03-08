/**
 * Pagination.js - 分页功能
 * 处理文章列表的分页显示
 */

/**
 * 分页管理器
 */
const PaginationManager = {
  // 每页文章数
  postsPerPage: 5,
  
  // 当前页码
  currentPage: 1,
  
  // 总文章数
  totalPosts: 0,
  
  // 总页数
  totalPages: 0,
  
  // 所有文章数据
  allPosts: [],
  
  /**
   * 初始化分页
   */
  init() {
    const articlesList = document.getElementById('articles-list');
    if (!articlesList) return;
    
    // 获取所有文章卡片
    const articleCards = articlesList.querySelectorAll('.article-card');
    this.totalPosts = articleCards.length;
    this.totalPages = Math.ceil(this.totalPosts / this.postsPerPage);
    
    if (this.totalPages <= 1) {
      // 只有一页，隐藏分页
      const pagination = document.querySelector('.pagination');
      if (pagination) pagination.style.display = 'none';
      return;
    }
    
    // 存储所有文章
    this.allPosts = Array.from(articleCards);
    
    // 绑定分页事件
    this.bindPaginationEvents();
    
    // 初始化显示第一页
    this.showPage(1);
    
    console.log('[Pagination] Initialized:', {
      totalPosts: this.totalPosts,
      totalPages: this.totalPages,
      postsPerPage: this.postsPerPage
    });
  },
  
  /**
   * 显示指定页
   */
  showPage(pageNum) {
    if (pageNum < 1 || pageNum > this.totalPages) return;
    
    this.currentPage = pageNum;
    
    // 计算显示范围
    const startIndex = (pageNum - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    
    // 隐藏所有文章
    this.allPosts.forEach((post, index) => {
      if (index >= startIndex && index < endIndex) {
        post.style.display = 'block';
        // 添加动画
        post.style.opacity = '0';
        post.style.transform = 'translateY(10px)';
        setTimeout(() => {
          post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          post.style.opacity = '1';
          post.style.transform = 'translateY(0)';
        }, 50 * (index - startIndex));
      } else {
        post.style.display = 'none';
      }
    });
    
    // 更新分页按钮状态
    this.updatePaginationButtons(pageNum);
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  
  /**
   * 更新分页按钮状态
   */
  updatePaginationButtons(currentPage) {
    const prevBtn = document.querySelector('.pagination-link[rel="prev"]');
    const nextBtn = document.querySelector('.pagination-link[rel="next"]');
    const pageNumbers = document.querySelectorAll('.pagination-link[data-page]');
    
    // 更新上一页/下一页按钮
    if (prevBtn) {
      if (currentPage === 1) {
        prevBtn.classList.add('disabled');
        prevBtn.setAttribute('aria-disabled', 'true');
        prevBtn.style.pointerEvents = 'none';
        prevBtn.style.opacity = '0.5';
      } else {
        prevBtn.classList.remove('disabled');
        prevBtn.setAttribute('aria-disabled', 'false');
        prevBtn.style.pointerEvents = 'auto';
        prevBtn.style.opacity = '1';
      }
    }
    
    if (nextBtn) {
      if (currentPage === this.totalPages) {
        nextBtn.classList.add('disabled');
        nextBtn.setAttribute('aria-disabled', 'true');
        nextBtn.style.pointerEvents = 'none';
        nextBtn.style.opacity = '0.5';
      } else {
        nextBtn.classList.remove('disabled');
        nextBtn.setAttribute('aria-disabled', 'false');
        nextBtn.style.pointerEvents = 'auto';
        nextBtn.style.opacity = '1';
      }
    }
    
    // 更新页码按钮
    pageNumbers.forEach(btn => {
      const page = parseInt(btn.getAttribute('data-page'));
      if (page === currentPage) {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
      }
    });
  },
  
  /**
   * 绑定分页事件
   */
  bindPaginationEvents() {
    document.querySelector('.pagination')?.addEventListener('click', (e) => {
      const link = e.target.closest('.pagination-link');
      if (!link || link.classList.contains('disabled')) return;
      
      e.preventDefault();
      
      const rel = link.getAttribute('rel');
      const page = link.getAttribute('data-page');
      
      if (rel === 'prev') {
        this.showPage(this.currentPage - 1);
      } else if (rel === 'next') {
        this.showPage(this.currentPage + 1);
      } else if (page) {
        this.showPage(parseInt(page));
      }
    });
  }
};

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PaginationManager.init());
} else {
  PaginationManager.init();
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PaginationManager;
}
