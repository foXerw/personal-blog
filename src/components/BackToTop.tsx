import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 rounded-full border px-3 py-2 shadow"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
      aria-label="回到顶部"
    >↑</button>
  );
}
