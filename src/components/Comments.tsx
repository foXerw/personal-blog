import { useEffect, useRef } from 'react';

interface Props { repo?: string; repoId?: string; category?: string; categoryId?: string; }

export default function Comments({
  repo = 'foxerw/personal-blog',
  repoId = '',            // TODO 部署后到 https://giscus.app 生成填入
  category = 'Announcements',
  categoryId = '',        // TODO 同上
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!repoId || !categoryId || !ref.current) return;
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.crossOrigin = 'anonymous';
    s.async = true;
    s.setAttribute('data-repo', repo);
    s.setAttribute('data-repo-id', repoId);
    s.setAttribute('data-category', category);
    s.setAttribute('data-category-id', categoryId);
    s.setAttribute('data-mapping', 'pathname');
    s.setAttribute('data-theme', 'preferred_color_scheme');
    s.setAttribute('data-lang', 'zh-CN');
    ref.current.innerHTML = '';
    ref.current.appendChild(s);
  }, [repo, repoId, category, categoryId]);

  return <div ref={ref} className="mt-10" />;
}
