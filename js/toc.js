/**
 * TOC.js - 文章目录自动生成
 * 解析文章标题，生成可点击的目录导航
 */

const TOCManager = {
  // 配置
  config: {
    selector: '.prose',
    headingSelector: 'h2, h3, h4',
    containerId: 'toc-list',
    activeClass: 'active',
    offset: 100 // 滚动偏移
  },
  
  // 状态
  headings: [],
  observer: null,
  
  /**
   * 初始化目录
   */
  init() {
    const content = document.querySelector(this.config.selector);
    if (!content) return;
    
    this.extractHeadings(content);
    this.renderTOC();
    this.observeHeadings();
    
    console.log('[TOC] Initialized');
  },
  
  /**
   * 提取标题
   */
  extractHeadings(content) {
    const headings = content.querySelectorAll(this.config.headingSelector);
    
    this.headings = Array.from(headings).map((heading, index) => {
      // 生成 ID
      let id = heading.id;
      if (!id) {
        id = `heading-${index}`;
        heading.id = id;
      }
      
      // 获取层级
      const level = parseInt(heading.tagName.charAt(1));
      
      return {
        id,
        text: heading.textContent.trim(),
        level,
        element: heading
      };
    });
  },
  
  /**
   * 渲染目录
   */
  renderTOC() {
    const container = document.getElementById(this.config.containerId);
    if (!container || this.headings.length === 0) {
      if (container) {
        container.innerHTML = '<p style="font-size: var(--text-sm); color: var(--color-text-tertiary);">暂无目录</p>';
      }
      return;
    }
    
    const ul = document.createElement('ul');
    ul.className = 'toc-list';
    ul.setAttribute('role', 'navigation');
    ul.setAttribute('aria-label', '文章目录');
    
    this.headings.forEach(heading => {
      const li = document.createElement('li');
      li.className = `toc-level-${heading.level}`;
      
      const a = document.createElement('a');
      a.href = `#${heading.id}`;
      a.className = 'toc-link';
      a.textContent = heading.text;
      a.setAttribute('data-target', heading.id);
      a.addEventListener('click', (e) => this.handleTOCClick(e, heading));
      
      li.appendChild(a);
      ul.appendChild(li);
    });
    
    container.innerHTML = '';
    container.appendChild(ul);
  },
  
  /**
   * 处理目录点击
   */
  handleTOCClick(e, heading) {
    e.preventDefault();
    
    // 平滑滚动
    const navbarHeight = 64;
    const targetPosition = heading.element.getBoundingClientRect().top + window.scrollY - navbarHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // 更新 URL（不触发滚动）
    history.pushState(null, '', `#${heading.id}`);
  },
  
  /**
   * 观察标题可见性
   */
  observeHeadings() {
    if (!('IntersectionObserver' in window) || this.headings.length === 0) return;
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.setActiveTOC(entry.target.id);
        }
      });
    }, {
      rootMargin: '-100px 0px -80% 0px',
      threshold: 0
    });
    
    this.headings.forEach(heading => {
      this.observer.observe(heading.element);
    });
  },
  
  /**
   * 设置活动目录项
   */
  setActiveTOC(headingId) {
    const links = document.querySelectorAll('.toc-link');
    links.forEach(link => {
      link.classList.remove(this.config.activeClass);
      if (link.getAttribute('data-target') === headingId) {
        link.classList.add(this.config.activeClass);
      }
    });
  },
  
  /**
   * 销毁观察器
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
};

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => TOCManager.init());
} else {
  TOCManager.init();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TOCManager;
}
