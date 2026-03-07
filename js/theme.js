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
    DARK: 'dark',
    AUTO: 'auto'
  },
  
  /**
   * 初始化主题
   */
  init() {
    const savedTheme = this.getSavedTheme();
    const systemTheme = this.getSystemTheme();
    
    // 确定初始主题
    let initialTheme = savedTheme;
    if (!initialTheme || initialTheme === this.THEMES.AUTO) {
      initialTheme = systemTheme;
    }
    
    // 应用主题
    this.applyTheme(initialTheme);
    
    // 监听系统主题变化
    this.watchSystemTheme();
    
    // 绑定切换按钮事件
    this.bindToggleEvents();
    
    console.log('[Theme] Initialized with theme:', initialTheme);
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
    
    // 移除所有主题属性
    html.removeAttribute('data-theme');
    
    // 设置新主题
    if (theme === this.THEMES.AUTO) {
      const systemTheme = this.getSystemTheme();
      html.setAttribute('data-theme', systemTheme);
      html.setAttribute('data-theme-auto', 'true');
    } else {
      html.setAttribute('data-theme', theme);
      html.removeAttribute('data-theme-auto');
    }
    
    // 更新切换按钮状态
    this.updateToggleButtons(theme);
  },
  
  /**
   * 切换主题
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isAuto = document.documentElement.hasAttribute('data-theme-auto');
    
    let newTheme;
    if (isAuto || !currentTheme) {
      // 从自动模式切换到深色
      newTheme = this.THEMES.DARK;
    } else if (currentTheme === this.THEMES.DARK) {
      // 从深色切换到浅色
      newTheme = this.THEMES.LIGHT;
    } else {
      // 从浅色切换到深色
      newTheme = this.THEMES.DARK;
    }
    
    this.saveTheme(newTheme);
    this.applyTheme(newTheme);
    
    console.log('[Theme] Toggled to:', newTheme);
  },
  
  /**
   * 循环切换主题（light -> dark -> auto -> light）
   */
  cycleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isAuto = document.documentElement.hasAttribute('data-theme-auto');
    
    let newTheme;
    if (isAuto || !currentTheme) {
      newTheme = this.THEMES.LIGHT;
    } else if (currentTheme === this.THEMES.LIGHT) {
      newTheme = this.THEMES.DARK;
    } else {
      newTheme = this.THEMES.AUTO;
    }
    
    this.saveTheme(newTheme);
    this.applyTheme(newTheme);
    
    console.log('[Theme] Cycled to:', newTheme);
  },
  
  /**
   * 更新切换按钮状态
   */
  updateToggleButtons(theme) {
    const buttons = document.querySelectorAll('.theme-toggle');
    buttons.forEach(button => {
      button.setAttribute('aria-label', `切换到${this.getThemeName(theme)}主题`);
      button.setAttribute('title', `当前：${this.getThemeName(theme)}主题，点击切换`);
    });
  },
  
  /**
   * 获取主题名称
   */
  getThemeName(theme) {
    const names = {
      [this.THEMES.LIGHT]: '浅色',
      [this.THEMES.DARK]: '深色',
      [this.THEMES.AUTO]: '自动'
    };
    return names[theme] || '未知';
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
        if (savedTheme === this.THEMES.AUTO) {
          this.applyTheme(e.matches ? this.THEMES.DARK : this.THEMES.LIGHT);
          console.log('[Theme] System theme changed');
        }
      });
    } else if (mediaQuery.addListener) {
      // 旧版浏览器兼容
      mediaQuery.addListener((e) => {
        const savedTheme = this.getSavedTheme();
        if (savedTheme === this.THEMES.AUTO) {
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
        this.cycleTheme();
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
