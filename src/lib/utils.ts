export function formatDate(
  input: Date | string,
  locale: 'zh' | 'iso' = 'zh',
): string {
  let y: number, m: number, d: number;
  if (typeof input === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
    if (match) {
      y = Number(match[1]);
      m = Number(match[2]);
      d = Number(match[3]);
    } else {
      const dt = new Date(input);
      y = dt.getFullYear();
      m = dt.getMonth() + 1;
      d = dt.getDate();
    }
  } else {
    y = input.getFullYear();
    m = input.getMonth() + 1;
    d = input.getDate();
  }
  if (locale === 'iso') {
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return `${y}年${m}月${d}日`;
}

export function readingTime(markdown: string): number {
  if (!markdown) return 1;
  // 去代码块与标记
  const text = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`~\-\[\]\(\)!]/g, '')
    .replace(/\s+/g, '');
  // CJK 字符
  const cjk = (text.match(/[一-鿿]/g) || []).length;
  const nonCjk = text.length - cjk;
  const minutes = cjk / 400 + nonCjk / 200;
  return Math.max(1, Math.ceil(minutes));
}

export function excerptFrom(body: string, max = 100): string {
  const text = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max) + '…';
}
