import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './DocsLayout.css';
import '../../styles/Background.css';
import '../../styles/3d-effects.css';
import '../../styles/animations.css';
import Sidebar from './Sidebar';
import AnnotationSystem from './AnnotationSystem';
import PageShell from '../layout/PageShell';
import { AnnotationProvider } from '../../contexts/AnnotationContext';
import { PageTitleProvider } from '../../contexts/PageTitleContext';
import { MetaProvider } from '../../contexts/MetaContext';
import { useCategoryNavigation } from '../../hooks/useCategoryNavigation';
import { useSidebarState } from '../../hooks/useSidebarState';
import { findActiveCategoryByPath } from '../../utils/docsMeta';
import { buildKnowledgeSpaces, findActiveKnowledgeSpace } from '../../utils/knowledgeSpaces';

// Inner component that uses the context
const DocsLayoutInner = ({ meta, children }) => {
  const location = useLocation();
  const handleCategoryClick = useCategoryNavigation();
  const { sidebarOpen, closeSidebar, toggleSidebar } = useSidebarState();

  // Extract categories from meta with useMemo to prevent recreation
  const categories = useMemo(() => meta?.categories || [], [meta]);
  const spaces = useMemo(() => buildKnowledgeSpaces(meta), [meta]);

  const activeCategory = useMemo(() => {
    return findActiveCategoryByPath(meta, location.pathname);
  }, [meta, location.pathname]);

  const activeSpace = useMemo(() => {
    return findActiveKnowledgeSpace(meta, location.pathname);
  }, [meta, location.pathname]);

  // Prepare meta object for Sidebar (using only active category's sections)
  const sidebarMeta = activeCategory ? {
    title: activeCategory.title,
    sections: activeCategory.sections,
    githubRepo: activeCategory.githubRepo,
    repoTitle: activeCategory.repoTitle
  } : null;

  return (
    <PageShell
      rootClassName="docs-layout"
      spaces={spaces}
      activeSpace={activeSpace}
      onSpaceClick={handleCategoryClick}
      categories={categories}
      activeCategory={activeCategory}
      onCategoryClick={handleCategoryClick}
      sidebarOpen={sidebarOpen}
      onMenuToggle={toggleSidebar}
    >
      <div className="docs-container">
        {/* Sidebar - shows only current category's sections */}
        {sidebarMeta && (
          <Sidebar
            meta={sidebarMeta}
            isOpen={sidebarOpen}
            onClose={closeSidebar}
          />
        )}

        {/* Main Content */}
        <main className="docs-main">
          {children}
        </main>
      </div>

      {/* Annotation System */}
      <AnnotationSystem />
    </PageShell>
  );
};

// Main component with provider
const DocsLayout = ({ meta, children }) => {
  return (
    <AnnotationProvider>
      <PageTitleProvider meta={meta}>
        <MetaProvider meta={meta}>
          <DocsLayoutInner meta={meta}>
            {children}
          </DocsLayoutInner>
        </MetaProvider>
      </PageTitleProvider>
    </AnnotationProvider>
  );
};

export default DocsLayout;
