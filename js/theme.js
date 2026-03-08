/**
 * Theme.js - 主题切换功能
 * 支持深色/浅色主题切换，保存用户偏好到 LocalStorage
 */

/**
 * 主题管理器
 */
const ThemeManager = {
  // 主题键名
  STORAGE_KEY: 'blog-theme-preference',
  
  // 可用主题
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark'
  },
  
  // 当前主题
  currentTheme: 'light',
  
  /**
   * 初始化主题
   */
  init() {
    const savedTheme = this.getSavedTheme();
    const systemTheme = this.getSystemTheme();
    
    // 确定初始主题
    this.currentTheme = savedTheme || systemTheme;
    
    // 应用主题
    this.applyTheme(this.currentTheme);
    
    // 监听系统主题变化
    this.watchSystemTheme();
    
    // 绑定切换按钮事件
    this.bindToggleEvents();
    
    console.log('[Theme] Initialized with theme:', this.currentTheme);
  },
  
  /**
   * 获取保存的主题偏好
   */
  getSavedTheme() {
    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch (e) {
      console.warn('[Theme] Cannot access localStorage:', e);
      return null;
    }
  },
  
  /**
   * 保存主题偏好
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (e) {
      console.warn('[Theme] Cannot save to localStorage:', e);
    }
  },
  
  /**
   * 获取系统主题
   */
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.THEMES.DARK;
    }
    return this.THEMES.LIGHT;
  },
  
  /**
   * 应用主题
   */
  applyTheme(theme) {
    const html = document.documentElement;
    
    // 设置主题属性
    html.setAttribute('data-theme', theme);
    
    // 更新当前主题
    this.currentTheme = theme;
    
    // 更新切换按钮状态
    this.updateToggleButtons(theme);
  },
  
  /**
   * 切换主题
   */
  toggleTheme() {
    const newTheme = this.currentTheme === this.THEMES.LIGHT 
      ? this.THEMES.DARK 
      : this.THEMES.LIGHT;
    
    this.saveTheme(newTheme);
    this.applyTheme(newTheme);
    
    console.log('[Theme] Toggled to:', newTheme);
  },
  
  /**
   * 更新切换按钮状态
   */
  updateToggleButtons(theme) {
    const buttons = document.querySelectorAll('.theme-toggle');
    const isDark = theme === this.THEMES.DARK;
    
    buttons.forEach(button => {
      button.setAttribute('aria-label', isDark ? '切换到浅色主题' : '切换到深色主题');
      button.setAttribute('title', isDark ? '当前：深色主题，点击切换浅色' : '当前：浅色主题，点击切换深色');
    });
  },
  
  /**
   * 监听系统主题变化
   */
  watchSystemTheme() {
    if (!window.matchMedia) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 现代浏览器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', (e) => {
        const savedTheme = this.getSavedTheme();
        if (!savedTheme) {
          // 只有没有保存偏好时才跟随系统
          this.applyTheme(e.matches ? this.THEMES.DARK : this.THEMES.LIGHT);
          console.log('[Theme] System theme changed');
        }
      });
    } else if (mediaQuery.addListener) {
      // 旧版浏览器兼容
      mediaQuery.addListener((e) => {
        const savedTheme = this.getSavedTheme();
        if (!savedTheme) {
          this.applyTheme(e.matches ? this.THEMES.DARK : this.THEMES.LIGHT);
        }
      });
    }
  },
  
  /**
   * 绑定切换按钮事件
   */
  bindToggleEvents() {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.theme-toggle');
      if (toggle) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleTheme();
      }
    });
  }
};

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
