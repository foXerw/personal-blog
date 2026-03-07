/**
 * Navigation.js - 导航交互功能
 * 处理移动端汉堡菜单、滚动导航等交互
 */

/**
 * 导航管理器
 */
const NavigationManager = {
  // 配置
  config: {
    mobileBreakpoint: 768,
    scrollThreshold: 100,
    navbarHeight: 64
  },
  
  // 状态
  state: {
    isMenuOpen: false,
    isScrolled: false,
    lastScrollY: 0
  },
  
  /**
   * 初始化导航
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.handleScroll();
    this.updateActiveLink();
    
    console.log('[Navigation] Initialized');
  },
  
  /**
   * 缓存 DOM 元素
   */
  cacheElements() {
    this.elements = {
      navbar: document.querySelector('.navbar'),
      hamburger: document.querySelector('.hamburger'),
      menu: document.querySelector('.navbar-menu'),
      links: document.querySelectorAll('.navbar-link'),
      body: document.body
    };
  },
  
  /**
   * 绑定事件
   */
  bindEvents() {
    // 汉堡菜单点击
    if (this.elements.hamburger) {
      this.elements.hamburger.addEventListener('click', () => this.toggleMenu());
    }
    
    // 菜单链接点击
    this.elements.links.forEach(link => {
      link.addEventListener('click', () => {
        if (this.state.isMenuOpen) {
          this.closeMenu();
        }
      });
    });
    
    // 滚动事件
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    
    // 窗口大小变化
    window.addEventListener('resize', () => this.handleResize());
    
    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
      if (this.state.isMenuOpen && !e.target.closest('.navbar')) {
        this.closeMenu();
      }
    });
    
    // ESC 键关闭菜单
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isMenuOpen) {
        this.closeMenu();
      }
    });
    
    // 触摸滑动关闭菜单
    if (this.elements.menu) {
      let touchStartY = 0;
      let touchEndY = 0;
      
      this.elements.menu.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });
      
      this.elements.menu.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        if (touchEndY > touchStartY + 50) {
          this.closeMenu();
        }
      }, { passive: true });
    }
  },
  
  /**
   * 切换菜单
   */
  toggleMenu() {
    if (this.state.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  },
  
  /**
   * 打开菜单
   */
  openMenu() {
    if (this.state.isMenuOpen) return;
    
    this.state.isMenuOpen = true;
    
    if (this.elements.hamburger) {
      this.elements.hamburger.classList.add('active');
      this.elements.hamburger.setAttribute('aria-expanded', 'true');
    }
    
    if (this.elements.menu) {
      this.elements.menu.classList.add('active');
      this.elements.menu.setAttribute('aria-hidden', 'false');
    }
    
    // 防止背景滚动
    this.elements.body.style.overflow = 'hidden';
    
    // 聚焦第一个链接（可访问性）
    const firstLink = this.elements.menu?.querySelector('a');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
    
    console.log('[Navigation] Menu opened');
  },
  
  /**
   * 关闭菜单
   */
  closeMenu() {
    if (!this.state.isMenuOpen) return;
    
    this.state.isMenuOpen = false;
    
    if (this.elements.hamburger) {
      this.elements.hamburger.classList.remove('active');
      this.elements.hamburger.setAttribute('aria-expanded', 'false');
    }
    
    if (this.elements.menu) {
      this.elements.menu.classList.remove('active');
      this.elements.menu.setAttribute('aria-hidden', 'true');
    }
    
    // 恢复背景滚动
    this.elements.body.style.overflow = '';
    
    console.log('[Navigation] Menu closed');
  },
  
  /**
   * 处理滚动
   */
  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // 检测是否滚动超过阈值
    const shouldAddScrolledClass = currentScrollY > this.config.scrollThreshold;
    
    if (shouldAddScrolledClass !== this.state.isScrolled) {
      this.state.isScrolled = shouldAddScrolledClass;
      
      if (this.elements.navbar) {
        if (shouldAddScrolledClass) {
          this.elements.navbar.classList.add('scrolled');
        } else {
          this.elements.navbar.classList.remove('scrolled');
        }
      }
    }
    
    this.state.lastScrollY = currentScrollY;
  },
  
  /**
   * 处理窗口大小变化
   */
  handleResize() {
    // 桌面端关闭菜单
    if (window.innerWidth >= this.config.mobileBreakpoint && this.state.isMenuOpen) {
      this.closeMenu();
    }
  },
  
  /**
   * 更新活动链接
   */
  updateActiveLink() {
    const currentPath = window.location.pathname;
    
    this.elements.links.forEach(link => {
      const href = link.getAttribute('href');
      
      // 移除所有活动状态
      link.classList.remove('active');
      
      // 检查是否匹配
      if (href === currentPath || 
          (currentPath === '/' && href === '/index.html') ||
          (currentPath === '' && href === '/')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  },
  
  /**
   * 平滑滚动到锚点
   */
  scrollToAnchor(hash) {
    if (!hash) return;
    
    const target = document.querySelector(hash);
    if (!target) return;
    
    const navbarHeight = this.config.navbarHeight;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => NavigationManager.init());
} else {
  NavigationManager.init();
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationManager;
}
