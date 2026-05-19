import React, { useEffect, useRef, useState } from 'react';
import './ReadingModeToc.css';

const HEADING_SELECTOR = 'article h2, article h3, article h4';

function extractHeadings() {
  if (typeof document === 'undefined') return [];
  const elements = document.querySelectorAll(HEADING_SELECTOR);
  return Array.from(elements)
    .map((el, index) => ({
      id: el.id,
      uniqueKey: `${el.id || 'h'}-${index}`,
      text: el.textContent || '',
      level: parseInt(el.tagName.substring(1), 10),
    }))
    .filter((h) => h.id);
}

function ReadingModeToc() {
  const [headings, setHeadings] = useState(() => extractHeadings());
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef(null);
  const userClickedRef = useRef(false);
  const listRef = useRef(null);

  // 打开 popover 时重新扫一次 DOM——文章可能晚于挂载渲染出来
  useEffect(() => {
    const next = extractHeadings();
    if (next.length !== headings.length) setHeadings(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!headings.length) return undefined;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (userClickedRef.current) return;
        const visible = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.push({
              id: entry.target.id,
              top: entry.boundingClientRect.top,
            });
          }
        });
        if (visible.length > 0) {
          visible.sort((a, b) => a.top - b.top);
          setActiveId(visible[0].id);
        }
      },
      {
        rootMargin: '-100px 0px -66% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    const handleScroll = () => {
      if (userClickedRef.current) return;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const atBottom = scrollTop + windowHeight >= documentHeight - 100;
      if (atBottom && headings.length > 0) {
        setActiveId(headings[headings.length - 1].id);
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [headings]);

  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const el = listRef.current.querySelector(`[href="#${activeId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeId]);

  const handleClick = (event, id) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    userClickedRef.current = true;
    setActiveId(id);
    window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    setTimeout(() => {
      userClickedRef.current = false;
    }, 1000);
  };

  if (!headings.length) {
    return <div className="rm-toc-empty">该文章暂无目录</div>;
  }

  return (
    <nav className="rm-toc" aria-label="文章目录">
      <ul className="rm-toc-list" ref={listRef}>
        {headings.map(({ id, uniqueKey, text, level }) => (
          <li
            key={uniqueKey}
            className={`rm-toc-item rm-toc-level-${level} ${
              activeId === id ? 'is-active' : ''
            }`}
          >
            <a
              href={`#${id}`}
              className="rm-toc-link"
              onClick={(e) => handleClick(e, id)}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default ReadingModeToc;
