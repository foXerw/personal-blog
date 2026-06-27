import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', p => !p.data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 20);
  return rss({
    title: 'foxerw 的博客',
    description: '技术与生活记录',
    site: context.site!,
    items: posts.map(p => ({
      title: p.data.title,
      description: p.data.excerpt,
      pubDate: p.data.date,
      link: `${import.meta.env.BASE_URL}posts/${p.slug}/`,
    })),
  });
}
