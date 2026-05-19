import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { resolveMarkdownAssetUrl, resolvePublicContentUrl } from '../../utils/markdown';

const EXCERPT_MAX_CHARS = 100;
const COLLECT_BUFFER = 60;
const previewCache = new Map();
const inflightFetches = new Map();

// 以"文字"（codepoint）为单位计数与裁剪，而不是 UTF-16 字符长度。
// 对于纯中文 .length 与 codepoint 结果一致；对含 emoji/代理对的内容才有差异。
function charLen(s) {
  return Array.from(s).length;
}

function sliceChars(s, n) {
  return Array.from(s).slice(0, n).join('');
}

function extractPreview(markdown) {
  let body = markdown;
  const fm = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (fm) body = markdown.slice(fm[0].length);

  const lines = body.split('\n');
  let inCodeBlock = false;
  let paragraph = '';
  let imageUrl = '';
  const collectCap = EXCERPT_MAX_CHARS + COLLECT_BUFFER;

  for (const raw of lines) {
    const line = raw.trim();

    if (line.startsWith('```') || line.startsWith('~~~')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    if (!imageUrl) {
      const imgMatch = line.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
      if (imgMatch) imageUrl = imgMatch[1];
    }

    if (charLen(paragraph) >= collectCap && imageUrl) break;

    if (!line) continue;

    // 跳过：标题、纯图片行、列表项、水平线
    if (/^#+\s/.test(line)) continue;
    if (/^!\[/.test(line)) continue;
    if (/^[-*+]\s/.test(line)) continue;
    if (/^---+$/.test(line)) continue;

    if (charLen(paragraph) >= collectCap) continue;

    // 引用块通常是文章 teaser，保留并去掉前缀
    const cleaned = line.replace(/^>\s?/, '');
    if (!cleaned) continue;

    paragraph += (paragraph ? ' ' : '') + cleaned;
  }

  paragraph = paragraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  if (charLen(paragraph) > EXCERPT_MAX_CHARS) {
    paragraph = sliceChars(paragraph, EXCERPT_MAX_CHARS).trimEnd() + '…';
  }

  return { excerpt: paragraph, imageUrl };
}

function fetchPreview(url) {
  if (previewCache.has(url)) return Promise.resolve(previewCache.get(url));
  if (inflightFetches.has(url)) return inflightFetches.get(url);

  const p = fetch(url)
    .then((res) => (res.ok ? res.text() : ''))
    .then((text) => {
      const preview = extractPreview(text);
      previewCache.set(url, preview);
      inflightFetches.delete(url);
      return preview;
    })
    .catch(() => {
      inflightFetches.delete(url);
      return { excerpt: '', imageUrl: '' };
    });

  inflightFetches.set(url, p);
  return p;
}

const ArchiveCard = ({ article }) => {
  const cardRef = useRef(null);
  const url = resolvePublicContentUrl(article.file);
  const cached = previewCache.get(url);
  const [preview, setPreview] = useState(() => cached || { excerpt: '', imageUrl: '' });
  const [visible, setVisible] = useState(() => Boolean(cached));

  const resolvedImage = preview.imageUrl
    ? resolveMarkdownAssetUrl(preview.imageUrl, url)
    : '';

  useEffect(() => {
    if (visible || !cardRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible || preview.excerpt || !url) return undefined;
    let cancelled = false;
    fetchPreview(url).then((next) => {
      if (!cancelled) setPreview(next);
    });
    return () => {
      cancelled = true;
    };
  }, [visible, preview.excerpt, url]);

  return (
    <Link
      ref={cardRef}
      to={{ pathname: article.path, search: '?mode=read' }}
      className="archive-card"
    >
      {resolvedImage && (
        <div className="archive-card-thumb">
          <img src={resolvedImage} alt="" loading="lazy" />
        </div>
      )}
      <div className="archive-card-body">
        <h3 className="archive-card-title">{article.title}</h3>
        {preview.excerpt && (
          <p className="archive-card-excerpt">{preview.excerpt}</p>
        )}
      </div>
    </Link>
  );
};

export default ArchiveCard;
