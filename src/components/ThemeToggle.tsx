import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === 'dark');
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      aria-label="切换深浅主题"
      title="切换主题"
      className="rounded-md border px-2 py-1 text-sm"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
