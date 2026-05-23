import { fetchText } from './http';

const markdownSourceCache = new Map();

export function getCachedMarkdownSource(url) {
  const entry = url ? markdownSourceCache.get(url) : null;
  return entry?.status === 'fulfilled' ? entry.value : undefined;
}

export function loadMarkdownSource(url) {
  if (!url) {
    return Promise.resolve('');
  }

  const cached = markdownSourceCache.get(url);
  if (cached?.status === 'fulfilled') {
    return Promise.resolve(cached.value);
  }

  if (cached?.status === 'pending') {
    return cached.promise;
  }

  const promise = fetchText(url)
    .then((value) => {
      markdownSourceCache.set(url, { status: 'fulfilled', value });
      return value;
    })
    .catch((error) => {
      markdownSourceCache.delete(url);
      throw error;
    });

  markdownSourceCache.set(url, { status: 'pending', promise });
  return promise;
}

export function preloadMarkdownSource(url) {
  return loadMarkdownSource(url).catch(() => undefined);
}

export function clearMarkdownSourceCache() {
  markdownSourceCache.clear();
}
