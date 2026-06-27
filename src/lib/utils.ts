export function formatDate(
  input: Date | string,
  locale: 'zh' | 'iso' = 'zh',
): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if (locale === 'iso') {
    const mm = String(m).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  }
  return `${y}年${m}月${day}日`;
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
