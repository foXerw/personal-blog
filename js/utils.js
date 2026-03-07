/**
 * Utils.js - 工具函数库
 * 提供常用的辅助函数
 */

const Utils = {
  /**
   * 防抖函数
   * @param {Function} func - 要执行的函数
   * @param {number} wait - 等待时间（毫秒）
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  /**
   * 节流函数
   * @param {Function} func - 要执行的函数
   * @param {number} limit - 时间限制（毫秒）
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  /**
   * 格式化日期
   * @param {string|Date} date - 日期字符串或 Date 对象
   * @param {string} locale - 语言环境
   * @param {Object} options - 格式化选项
   */
  formatDate(date, locale = 'zh-CN', options = {}) {
    const d = date instanceof Date ? date : new Date(date);
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return d.toLocaleDateString(locale, { ...defaultOptions, ...options });
  },
  
  /**
   * 格式化相对时间
   * @param {string|Date} date - 日期
   */
  formatRelativeTime(date) {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffSecs < 60) return '刚刚';
    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    if (diffDays < 30) return `${diffDays} 天前`;
    if (diffMonths < 12) return `${diffMonths} 个月前`;
    return `${diffYears} 年前`;
  },
  
  /**
   * 计算阅读时间
   * @param {string} text - 文章内容
   * @param {number} wordsPerMinute - 每分钟阅读字数
   */
  calculateReadingTime(text, wordsPerMinute = 300) {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(1, minutes);
  },
  
  /**
   * 截取文本
   * @param {string} text - 文本
   * @param {number} length - 长度
   * @param {string} suffix - 后缀
   */
  truncate(text, length = 100, suffix = '...') {
    if (text.length <= length) return text;
    return text.substring(0, length) + suffix;
  },
  
  /**
   * 提取文本摘要
   * @param {string} html - HTML 内容
   * @param {number} length - 长度
   */
  extractExcerpt(html, length = 200) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    return this.truncate(text.trim(), length);
  },
  
  /**
   * 生成 slug
   * @param {string} text - 文本
   */
  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
  
  /**
   * 转义 HTML
   * @param {string} text - 文本
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  /**
   * 获取 URL 参数
   * @param {string} name - 参数名
   * @param {string} url - URL（可选，默认当前 URL）
   */
  getUrlParam(name, url = window.location.href) {
    const params = new URLSearchParams(new URL(url).search);
    return params.get(name);
  },
  
  /**
   * 深拷贝对象
   * @param {Object} obj - 对象
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  
  /**
   * 检查元素是否在视口中
   * @param {Element} element - DOM 元素
   * @param {number} offset - 偏移量
   */
  isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
      rect.bottom >= -offset
    );
  },
  
  /**
   * 懒加载图片
   * @param {Element} img - 图片元素
   */
  lazyLoadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    
    img.src = src;
    img.removeAttribute('data-src');
    
    img.onload = () => {
      img.classList.add('loaded');
    };
  },
  
  /**
   * 复制到剪贴板
   * @param {string} text - 文本
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch (e) {
        document.body.removeChild(textarea);
        return false;
      }
    }
  },
  
  /**
   * 显示 Toast 提示
   * @param {string} message - 消息
   * @param {string} type - 类型（success/error/info）
   * @param {number} duration - 持续时间
   */
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      background: var(--color-text-primary);
      color: var(--color-bg-primary);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      z-index: var(--z-tooltip);
      animation: fadeInUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeOutDown 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  
  /**
   * 获取滚动位置
   */
  getScrollPosition() {
    return {
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset
    };
  },
  
  /**
   * 获取文档高度
   */
  getDocumentHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
  },
  
  /**
   * 平滑滚动到顶部
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },
  
  /**
   * 平滑滚动到底部
   */
  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
