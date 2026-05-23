import { useEffect, useState } from 'react';
import {
  getCachedMarkdownSource,
  loadMarkdownSource
} from '../utils/markdownSourceCache';

export function useMarkdownSource({ url = '', inlineContent = '', enabled = true } = {}) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setText('');
      setLoading(false);
      setError(null);
      return undefined;
    }

    if (!url) {
      setText(inlineContent || '');
      setLoading(false);
      setError(null);
      return undefined;
    }

    const cachedText = getCachedMarkdownSource(url);
    if (typeof cachedText !== 'undefined') {
      setText(cachedText);
      setLoading(false);
      setError(null);
      return undefined;
    }

    let cancelled = false;
    setText('');
    setLoading(true);
    setError(null);

    loadMarkdownSource(url)
      .then((value) => {
        if (cancelled) {
          return;
        }

        setText(value);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }

        setText('');
        setLoading(false);
        setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, inlineContent, url]);

  return { text, loading, error };
}
