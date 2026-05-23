import { resolvePublicContentUrl } from './markdown';
import { preloadMarkdownSource } from './markdownSourceCache';

export function preloadMarkdownFile(file) {
  if (!file) {
    return Promise.resolve(undefined);
  }

  return preloadMarkdownSource(resolvePublicContentUrl(file));
}
