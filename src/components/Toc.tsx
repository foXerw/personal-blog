import { useEffect, useState } from 'react';

interface TocItem { id: string; text: string; level: number; }

export default function Toc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState('');

  useEffect(() => {
    const heads = Array.from(document.querySelectorAll('article h2, article h3'));
    setItems(heads.map(h => ({
      id: h.id,
      text: h.textContent || '',
      level: h.tagName === 'H2' ? 2 : 3,
    })));
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
    }, { rootMargin: '-80px 0px -70% 0px' });
    heads.forEach(h => obs.observe(h));
    return () => obs.disconnect();
  }, []);

  if (items.length === 0) return null;
  return (
    <nav>
      <ul>
        {items.map(it => (
          <li key={it.id} style={{ paddingLeft: it.level === 3 ? '0.9rem' : 0 }}>
            <a
              href={`#${it.id}`}
              onClick={e => { e.preventDefault(); document.getElementById(it.id)?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{ color: active === it.id ? 'var(--accent)' : undefined }}
            >{it.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
