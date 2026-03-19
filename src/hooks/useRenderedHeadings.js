import { useEffect, useState } from 'react';

export function useRenderedHeadings(rootRef, observedValue, options = {}) {
  const { enabled = true, selector = 'h2, h3, h4' } = options;
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (!enabled) {
      setHeadings([]);
      return undefined;
    }

    const timer = setTimeout(() => {
      const article = rootRef.current;
      const headingElements = article?.querySelectorAll(selector);
      const extractedHeadings = Array.from(headingElements || []).map((el, index) => ({
        id: el.id,
        originalId: el.id,
        uniqueKey: `${el.id}-${index}`,
        text: el.textContent,
        level: parseInt(el.tagName.substring(1), 10)
      }));
      setHeadings(extractedHeadings);
    }, 100);

    return () => clearTimeout(timer);
  }, [enabled, observedValue, rootRef, selector]);

  return headings;
}
