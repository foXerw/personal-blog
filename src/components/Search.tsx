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
        placeholder="输入关键词…"
        className="search-input"
        autoFocus
      />
      <ul className="search-results">
        {results.map(r => (
          <li key={r.id}>
            <a href={r.url}>{r.meta.title}</a>
            <p className="excerpt" dangerouslySetInnerHTML={{ __html: r.excerpt }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
