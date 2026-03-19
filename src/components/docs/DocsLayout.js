import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DocsLayout.css';
import '../../styles/Background.css';
import '../../styles/3d-effects.css';
import '../../styles/animations.css';
import AppHeader from '../AppHeader/AppHeader';
import Sidebar from './Sidebar';
import AIAssistant from './AIAssistant';
import AnnotationSystem from './AnnotationSystem';
import Footer from '../Footer/Footer';
import { AnnotationProvider } from '../../contexts/AnnotationContext';
import { PageTitleProvider } from '../../contexts/PageTitleContext';
import { MetaProvider } from '../../contexts/MetaContext';
import {
  findActiveCategoryByPath,
  getFirstNavigablePathForCategory
} from '../../utils/docsMeta';

// Inner component that uses the context
const DocsLayoutInner = ({ meta, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract categories from meta with useMemo to prevent recreation
  const categories = useMemo(() => meta?.categories || [], [meta]);

  const activeCategory = useMemo(() => {
    return findActiveCategoryByPath(meta, location.pathname);
  }, [meta, location.pathname]);

  const handleCategoryClick = (category) => {
    const path = getFirstNavigablePathForCategory(category);
    if (path) {
      navigate(path);
    }
  };

  // Prepare meta object for Sidebar (using only active category's sections)
  const sidebarMeta = activeCategory ? {
    title: activeCategory.title,
    sections: activeCategory.sections,
    githubRepo: activeCategory.githubRepo,
    repoTitle: activeCategory.repoTitle
  } : null;

  return (
    <div className="docs-layout dynamic-background">
      {/* Sailor Moon Background Layer */}
      <div className="sailor-moon-bg-layer"></div>

      {/* Header with glassmorphism */}
      <AppHeader
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
        sidebarOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="docs-container">
        {/* Sidebar - shows only current category's sections */}
        {sidebarMeta && (
          <Sidebar
            meta={sidebarMeta}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="docs-main">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* AI Assistant */}
      <AIAssistant />

      {/* Annotation System */}
      <AnnotationSystem />
    </div>
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
