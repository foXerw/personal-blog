import { useEffect, useState } from 'react';

interface Result {
  id: string;
  url: string;
  meta: { title: string };
  excerpt: string;
}

export default function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [pf, setPf] = useState<any>(null);

  useEffect(() => {
    import(/* @vite-ignore */ `${import.meta.env.BASE_URL}pagefind/pagefind.js`)
      .then((m: any) => { m.init?.(); setPf(m); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!pf || !q) { setResults([]); return; }
    let cancelled = false;
    pf.preload(q);
    pf.search(q).then(async (res: any) => {
      if (cancelled) return;
      const data = await Promise.all(
        res.results.slice(0, 10).map(async (r: any) => {
          const d = await r.data();
          return { id: r.id, url: d.url, meta: d.meta, excerpt: d.excerpt };
        }),
      );
      if (!cancelled) setResults(data);
    }).catch(() => setResults([]));
    return () => { cancelled = true; };
  }, [q, pf]);

  return (
    <div>
      <input
        type="search"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="搜索文章…"
        className="w-full rounded-md border px-3 py-2"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
      />
      <ul className="mt-4 space-y-2">
        {results.map(r => (
          <li key={r.id} className="rounded-md border p-3" style={{ borderColor: 'var(--color-border)' }}>
            <a href={r.url} className="font-semibold no-underline">{r.meta.title}</a>
            <p className="text-sm" style={{ color: 'var(--color-text-soft)' }} dangerouslySetInnerHTML={{ __html: r.excerpt }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
