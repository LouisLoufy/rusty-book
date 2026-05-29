import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiChevronDown, HiOutlineBookOpen } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import { preloadRouteForPath } from '../../utils/routePrefetch';
import { SITE_CONFIG } from '../../utils/siteConfig';
import {
  getActiveTopNavItem,
  getBookByPathname,
  getTopNavItems
} from '../../content';

function BookCategoryDropdown({
  showInlineGithub = true,
  className = '',
  compact = false
}) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = useMemo(() => getTopNavItems(), []);
  const activeNavItem = getActiveTopNavItem(location.pathname);
  const activeBook = getBookByPathname(location.pathname);
  const activeGithubRepo = activeBook?.githubRepo || null;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    const handleScroll = () => {
      setOpen(false);
    };

    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open]);

  const preloadNavItem = (item) => {
    preloadRouteForPath(item.href);
  };

  const menu = open && (
    <div className="mobile-category-menu" role="menu">
      {navItems.map((item) => (
        <Link
          key={item.id}
          to={item.href}
          role="menuitem"
          className={`mobile-category-item ${activeNavItem?.id === item.id ? 'active' : ''}`}
          onMouseEnter={() => preloadNavItem(item)}
          onFocus={() => preloadNavItem(item)}
          onTouchStart={() => preloadNavItem(item)}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );

  if (compact) {
    const label = activeNavItem?.label || SITE_CONFIG.labels.selectBook;
    return (
      <div
        ref={dropdownRef}
        className={`book-category-compact ${open ? 'open' : ''} ${className}`.trim()}
      >
        <button
          type="button"
          className="book-category-compact-toggle"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={`切换书籍 — 当前:${label}`}
          title={label}
          onClick={() => setOpen(!open)}
        >
          <HiOutlineBookOpen />
        </button>
        {menu}
      </div>
    );
  }

  return (
    <div className={`mobile-category-wrapper ${className}`.trim()}>
      <div
        ref={dropdownRef}
        className={`mobile-category-dropdown ${open ? 'open' : ''}`}
      >
        <button
          type="button"
          className="mobile-category-toggle"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen(!open)}
        >
          <span>{activeNavItem?.label || SITE_CONFIG.labels.selectBook}</span>
          <HiChevronDown className={`dropdown-icon ${open ? 'open' : ''}`} />
        </button>
        {menu}
      </div>
      {showInlineGithub && activeGithubRepo && (
        <a
          href={activeGithubRepo}
          target="_blank"
          rel="noopener noreferrer"
          className="github-link-mobile"
          title={`访问 ${activeBook.title} 的 GitHub 仓库`}
        >
          <FaGithub />
        </a>
      )}
    </div>
  );
}

export default BookCategoryDropdown;
