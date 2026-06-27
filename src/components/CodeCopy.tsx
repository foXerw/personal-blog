import { useEffect } from 'react';

export default function CodeCopy() {
  useEffect(() => {
    const blocks = document.querySelectorAll('pre');
    blocks.forEach(pre => {
      if (pre.querySelector('button')) return;
      const btn = document.createElement('button');
      btn.textContent = '复制';
      btn.className = 'absolute right-2 top-2 rounded border px-2 py-0.5 text-xs';
      btn.style.borderColor = 'var(--color-border)';
      btn.onclick = async () => {
        const code = pre.querySelector('code')?.textContent || '';
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = '已复制';
        } catch {
          btn.textContent = '复制失败';
        }
        setTimeout(() => (btn.textContent = '复制'), 1500);
      };
      (pre as HTMLElement).style.position = 'relative';
      pre.appendChild(btn);
    });
  }, []);
  return null;
}
