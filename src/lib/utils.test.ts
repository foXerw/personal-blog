import { describe, it, expect } from 'vitest';
import { formatDate, readingTime, excerptFrom } from './utils';

describe('formatDate', () => {
  it('zh 格式', () => {
    expect(formatDate('2026-03-07', 'zh')).toBe('2026年3月7日');
  });
  it('iso 格式', () => {
    expect(formatDate('2026-03-07', 'iso')).toBe('2026-03-07');
  });
  it('Date 对象入参', () => {
    expect(formatDate(new Date('2026-03-07'), 'zh')).toBe('2026年3月7日');
  });
});

describe('readingTime', () => {
  it('空文本至少 1 分钟', () => {
    expect(readingTime('')).toBe(1);
  });
  it('400 字中文约 1 分钟', () => {
    const cjk = '字'.repeat(400);
    expect(readingTime(cjk)).toBe(1);
  });
  it('401 字中文约 2 分钟', () => {
    const cjk = '字'.repeat(401);
    expect(readingTime(cjk)).toBe(2);
  });
});

describe('excerptFrom', () => {
  it('剥离 markdown 标记', () => {
    expect(excerptFrom('## 标题\n**粗体** 正文')).toBe('标题 粗体 正文');
  });
  it('截断并加省略号', () => {
    const body = 'a'.repeat(120);
    expect(excerptFrom(body, 100)).toBe('a'.repeat(100) + '…');
  });
  it('短文本不加省略号', () => {
    expect(excerptFrom('短文本', 100)).toBe('短文本');
  });
});
