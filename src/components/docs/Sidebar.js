import React, { useRef, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { buildArticlePrefetchModel, normalizeDocPath } from '../../domain/docs';
import { preloadMarkdownFile } from '../../utils/markdownPrefetch';
import { preloadRouteForPath } from '../../utils/routePrefetch';

function SidebarTitle({ title }) {
  return (
    <span className="sidebar-title-with-badge">
      <span className="sidebar-title-text">{title}</span>
    </span>
  );
}

const Sidebar = ({ meta, mobileDrawerOpen, onMobileLinkClick }) => {
  const navRef = useRef(null);
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  // Auto-expand parent items based on current location
  useEffect(() => {
    if (!meta || !meta.sections) return;

    const normalizedCurrentPath = normalizeDocPath(location.pathname);

    const findAndExpandParents = (items, currentPath, parents = []) => {
      for (const item of items) {
        const newParents = [...parents, item.path];

        if (normalizeDocPath(item.path) === currentPath) {
          const expandState = {};
          parents.forEach(parentPath => {
            expandState[parentPath] = true;
          });
          if (item.children && item.children.length > 0) {
            expandState[item.path] = true;
          }
          setExpandedItems(expandState);
          return true;
        }

        if (item.children && item.children.length > 0) {
          if (findAndExpandParents(item.children, currentPath, newParents)) {
            return true;
          }
        }
      }
      return false;
    };

    for (const section of meta.sections) {
      if (section.items) {
        findAndExpandParents(section.items, normalizedCurrentPath);
      }
    }
  }, [location.pathname, meta]);

  useEffect(() => {
    if (!navRef.current) return;

    const timer = setTimeout(() => {
      const activeLink = navRef.current.querySelector('.sidebar-link.active');
      if (activeLink) {
        activeLink.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const toggleExpand = (path) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleParentItemClick = (path) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: true
    }));
    onMobileLinkClick?.();
  };

  const preloadMenuItemAssets = (item) => {
    const { file, path } = buildArticlePrefetchModel(item);
    preloadMarkdownFile(file);
    preloadRouteForPath(path);
  };

  const renderMenuItem = (item, level = 1) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.path];
    const isActive = item.highlightable === false
      ? false
      : normalizeDocPath(location.pathname) === normalizeDocPath(item.path);
    const indent = level > 1 ? `${(level - 1) * 16}px` : '0px';

    return (
      <li key={item.path} className="sidebar-item">
        <div className="sidebar-item-wrapper" style={{ paddingLeft: indent }}>
          {hasChildren ? (
            <>
              <NavLink
                to={item.path}
                className={() =>
                  `sidebar-link sidebar-link-with-children ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`
                }
                onMouseEnter={() => preloadMenuItemAssets(item)}
                onFocus={() => preloadMenuItemAssets(item)}
                onTouchStart={() => preloadMenuItemAssets(item)}
                onClick={() => handleParentItemClick(item.path)}
              >
                <SidebarTitle title={item.title} />
                <span
                  className="sidebar-expand-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleExpand(item.path);
                  }}
                >
                  {isExpanded ? '−' : '+'}
                </span>
              </NavLink>
              {isExpanded && (
                <ul className="sidebar-items sidebar-items-nested">
                  {item.children.map((child) => renderMenuItem(child, level + 1))}
                </ul>
              )}
            </>
          ) : (
            <NavLink
              to={item.path}
              className={() =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onMouseEnter={() => preloadMenuItemAssets(item)}
              onFocus={() => preloadMenuItemAssets(item)}
              onTouchStart={() => preloadMenuItemAssets(item)}
              onClick={onMobileLinkClick}
            >
              <SidebarTitle title={item.title} />
              <span className="sidebar-link-indicator"></span>
            </NavLink>
          )}
        </div>
      </li>
    );
  };

  if (!meta) return null;

  return (
    <>
      {mobileDrawerOpen && (
        <div className="sidebar-overlay" onClick={onMobileLinkClick} />
      )}

      <aside
        className={`docs-sidebar ${mobileDrawerOpen ? 'mobile-open' : ''}`.trim()}
        ref={navRef}
      >
        <nav className="sidebar-nav">
          {meta.sections.map((section, idx) => (
            <div key={idx} className="sidebar-section">
              <div className="sidebar-section-header">
                <h3 className="sidebar-section-title">
                  <SidebarTitle title={section.title} />
                </h3>
              </div>
              <ul className="sidebar-items">
                {section.items.map((item) => renderMenuItem(item))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
