import React from 'react';
import './DocsLayout.css';
import '../../styles/Background.css';
import '../../styles/3d-effects.css';
import '../../styles/animations.css';
import Sidebar from './Sidebar';
import PageShell from '../layout/PageShell';
import { cn } from '../../utils/classNames';

function BookWorkspaceLayout({
  rootClassName = '',
  spaces = null,
  activeSpace = null,
  onSpaceClick = null,
  categories = [],
  activeCategory = null,
  onCategoryClick = null,
  sidebarMeta = null,
  sidebarOpen = false,
  onMenuToggle = null,
  onSidebarClose = null,
  containerClassName = '',
  mainClassName = '',
  showFooter = true,
  afterMain = null,
  children
}) {
  return (
    <PageShell
      rootClassName={rootClassName}
      spaces={spaces}
      activeSpace={activeSpace}
      onSpaceClick={onSpaceClick}
      categories={categories}
      activeCategory={activeCategory}
      onCategoryClick={onCategoryClick}
      sidebarOpen={sidebarOpen}
      onMenuToggle={onMenuToggle}
      showFooter={showFooter}
    >
      <div className={cn('docs-container', containerClassName)}>
        {sidebarMeta && (
          <Sidebar
            meta={sidebarMeta}
            isOpen={sidebarOpen}
            onClose={onSidebarClose}
          />
        )}

        <main className={cn('docs-main', mainClassName)}>
          {children}
        </main>
      </div>

      {afterMain}
    </PageShell>
  );
}

export default BookWorkspaceLayout;
