import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import BookWorkspaceLayout from './BookWorkspaceLayout';
import { PageTitleProvider } from '../../contexts/PageTitleContext';
import { MetaProvider } from '../../contexts/MetaContext';
import { useSidebarState } from '../../hooks/useSidebarState';
import { buildDocsWorkspaceModel } from '../../domain/docs';

const DocsLayoutInner = ({ meta, children }) => {
  const location = useLocation();
  const {
    mobileDrawerOpen,
    desktopCollapsed,
    closeMobileDrawer,
    toggleMobileDrawer,
    toggleDesktopCollapsed
  } = useSidebarState();
  const { sidebarMeta } = useMemo(() => {
    return buildDocsWorkspaceModel({ meta, pathname: location.pathname });
  }, [location.pathname, meta]);

  return (
    <BookWorkspaceLayout
      rootClassName="docs-layout"
      sidebarMeta={sidebarMeta}
      mobileDrawerOpen={mobileDrawerOpen}
      desktopCollapsed={desktopCollapsed}
      onToggleMobileDrawer={toggleMobileDrawer}
      onCloseMobileDrawer={closeMobileDrawer}
      onToggleDesktopCollapsed={toggleDesktopCollapsed}
    >
      {children}
    </BookWorkspaceLayout>
  );
};

const DocsLayout = ({ meta, children }) => {
  return (
    <PageTitleProvider meta={meta}>
      <MetaProvider meta={meta}>
        <DocsLayoutInner meta={meta}>
          {children}
        </DocsLayoutInner>
      </MetaProvider>
    </PageTitleProvider>
  );
};

export default DocsLayout;
