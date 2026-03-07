/**
 * Main.js - 主入口文件
 * 初始化所有模块
 */

// 导入模块（通过 script 标签加载）
// 确保加载顺序：utils -> theme -> navigation -> main

/**
 * 应用初始化
 */
const App = {
  /**
   * 初始化应用
   */
  init() {
    console.log('[App] Initializing...');
    
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onReady());
    } else {
      this.onReady();
    }
  },
  
  /**
   * DOM 就绪后执行
   */
  onReady() {
    console.log('[App] DOM ready');
    
    // 初始化图片懒加载
    this.initLazyLoad();
    
    // 初始化代码块复制按钮
    this.initCodeCopy();
    
    // 初始化回到顶部按钮
    this.initBackToTop();
    
    // 初始化阅读进度条
    this.initReadingProgress();
    
    // 添加页面加载动画
    this.addPageAnimation();
    
    console.log('[App] Initialized');
  },
  
  /**
   * 初始化图片懒加载
   */
  initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            Utils.lazyLoadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // 降级方案：直接加载
      images.forEach(img => Utils.lazyLoadImage(img));
    }
  },
  
  /**
   * 初始化代码块复制按钮
   */
  initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(pre => {
      // 创建复制按钮
      const button = document.createElement('button');
      button.className = 'code-copy-btn';
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>复制</span>
      `;
      button.setAttribute('aria-label', '复制代码');
      button.setAttribute('title', '复制代码');
      
      // 添加样式
      button.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        font-size: 12px;
        color: var(--color-text-tertiary);
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        opacity: 0;
        transition: all var(--transition-fast);
        z-index: 10;
      `;
      
      // 设置 pre 为相对定位
      pre.style.position = 'relative';
      
      // 悬停显示按钮
      pre.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
      });
      
      pre.addEventListener('mouseleave', () => {
        button.style.opacity = '0';
      });
      
      // 点击复制
      button.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        const text = code ? code.textContent : pre.textContent;
        
        const success = await Utils.copyToClipboard(text);
        
        if (success) {
          button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>已复制</span>
          `;
          
          setTimeout(() => {
            button.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>复制</span>
            `;
          }, 2000);
        }
      });
      
      pre.appendChild(button);
    });
  },
  
  /**
   * 初始化回到顶部按钮
   */
  initBackToTop() {
    // 创建按钮
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    `;
    button.setAttribute('aria-label', '回到顶部');
    button.setAttribute('title', '回到顶部');
    
    // 样式
    button.style.cssText = `
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-accent);
      color: #ffffff;
      border: none;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-lg);
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all var(--transition-normal);
      z-index: var(--z-fixed);
    `;
    
    // 悬停效果
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-4px)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(20px)';
    });
    
    // 点击滚动到顶部
    button.addEventListener('click', () => {
      Utils.scrollToTop();
    });
    
    document.body.appendChild(button);
    
    // 滚动显示/隐藏
    const toggleButton = Utils.throttle(() => {
      const scrollY = window.scrollY;
      
      if (scrollY > 500) {
        button.style.opacity = '1';
        button.style.visibility = 'visible';
        button.style.transform = 'translateY(0)';
      } else {
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
        button.style.transform = 'translateY(20px)';
      }
    }, 100);
    
    window.addEventListener('scroll', toggleButton, { passive: true });
  },
  
  /**
   * 初始化阅读进度条
   */
  initReadingProgress() {
    // 检查是否有文章页面
    const articleContent = document.querySelector('.article-content, .prose');
    if (!articleContent) return;
    
    // 创建进度条容器
    const container = document.createElement('div');
    container.className = 'reading-progress-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--color-border-light);
      z-index: var(--z-fixed);
    `;
    
    // 创建进度条
    const bar = document.createElement('div');
    bar.className = 'reading-progress-bar';
    bar.style.cssText = `
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, var(--color-accent), var(--color-accent-hover));
      transition: width var(--transition-fast);
    `;
    
    container.appendChild(bar);
    document.body.appendChild(container);
    
    // 更新进度
    const updateProgress = Utils.throttle(() => {
      const scrollTop = window.scrollY;
      const docHeight = Utils.getDocumentHeight() - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }, 50);
    
    window.addEventListener('scroll', updateProgress, { passive: true });
  },
  
  /**
   * 添加页面加载动画
   */
  addPageAnimation() {
    // 为文章卡片添加渐入动画
    const cards = document.querySelectorAll('.article-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(card);
    });
  }
};

// 启动应用
App.init();
