import React from 'react';
import AppHeader from '../AppHeader/AppHeader';
import Footer from '../Footer/Footer';

function PageShell({
  rootClassName = '',
  spaces = null,
  activeSpace = null,
  onSpaceClick = null,
  categories = [],
  activeCategory = null,
  onCategoryClick = null,
  sidebarOpen = false,
  onMenuToggle = null,
  showFooter = true,
  children
}) {
  const classes = [rootClassName, 'dynamic-background'].filter(Boolean).join(' ');
  const resolvedSpaces = spaces || categories;
  const resolvedActiveSpace = activeSpace || activeCategory;
  const resolvedOnSpaceClick = onSpaceClick || onCategoryClick;

  return (
    <div className={classes}>
      <div className="sailor-moon-bg-layer"></div>

      <AppHeader
        spaces={resolvedSpaces}
        activeSpace={resolvedActiveSpace}
        onSpaceClick={resolvedOnSpaceClick}
        sidebarOpen={sidebarOpen}
        onMenuToggle={onMenuToggle}
      />

      {children}

      {showFooter && <Footer />}
    </div>
  );
}

export default PageShell;
