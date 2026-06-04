import React from 'react';
import { ASSET_CDN_ORIGIN, ASSET_PROXY_ORIGIN } from '../config/assets';

// 把存储的 jsDelivr 绝对 URL 在渲染时改写到自有反代镜像（host 替换，路径不变）。
// 只命中 ASSET_CDN_ORIGIN 开头的字符串，其它（相对路径、同源、其它外链）原样放行。
function proxyAssetHost(url) {
  return typeof url === 'string' && url.startsWith(ASSET_CDN_ORIGIN)
    ? ASSET_PROXY_ORIGIN + url.slice(ASSET_CDN_ORIGIN.length)
    : url;
}

export function slugifyHeading(text) {
  return encodeURIComponent(
    String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
    .replace(/%20/g, '-')
    .replace(/[!'()*]/g, (char) => char)
    .replace(/%2D/g, '-');
}

export function getTextContent(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => getTextContent(item)).join('');
  }

  if (React.isValidElement(value)) {
    return getTextContent(value.props?.children);
  }

  return '';
}

export function resolvePublicContentUrl(contentPath) {
  if (!contentPath) {
    return '';
  }

  if (/^https?:\/\//.test(contentPath)) {
    return contentPath;
  }

  const publicBase = process.env.PUBLIC_URL || '';
  const normalizedPath = contentPath.startsWith('/') ? contentPath : `/${contentPath}`;

  return `${publicBase}${normalizedPath}`;
}

function isRelativeContentPath(contentPath) {
  return Boolean(contentPath)
    && !/^(?:[a-z]+:)?\/\//i.test(contentPath)
    && !contentPath.startsWith('/')
    && !contentPath.startsWith('#');
}

export function resolveMarkdownAssetUrl(assetPath, markdownUrl) {
  return resolveContentAssetUrl(assetPath, markdownUrl);
}

export function resolveContentAssetUrl(assetPath, baseUrl) {
  if (!assetPath || !isRelativeContentPath(assetPath) || !baseUrl) {
    return proxyAssetHost(assetPath);
  }

  const baseOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';

  try {
    return proxyAssetHost(new URL(assetPath, new URL(baseUrl, baseOrigin)).toString());
  } catch (error) {
    return proxyAssetHost(assetPath);
  }
}
