import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import Sidebar from './Sidebar';
import PageShell from '../layout/PageShell';
import BookFloatingActions from './BookFloatingActions';
import { cn } from '../../utils/classNames';

function BookWorkspaceLayout({
  rootClassName = '',
  sidebarMeta = null,
  mobileDrawerOpen = false,
  desktopCollapsed = false,
  onToggleMobileDrawer = null,
  onCloseMobileDrawer = null,
  onToggleDesktopCollapsed = null,
  containerClassName = '',
  mainClassName = '',
  afterMain = null,
  children
}) {
  return (
    <PageShell rootClassName={rootClassName} hideHeader>
      <BookFloatingActions
        mobileDrawerOpen={mobileDrawerOpen}
        onToggleMobileDrawer={onToggleMobileDrawer}
      />

      {sidebarMeta && onToggleDesktopCollapsed && (
        <button
          type="button"
          className={cn('sidebar-toggle-btn', desktopCollapsed && 'collapsed')}
          onClick={onToggleDesktopCollapsed}
          aria-label={desktopCollapsed ? '展开目录' : '收起目录'}
          aria-expanded={!desktopCollapsed}
        >
          {desktopCollapsed ? <HiChevronRight /> : <HiChevronLeft />}
        </button>
      )}

      <div
        className={cn(
          'docs-container',
          desktopCollapsed && 'desktop-sidebar-collapsed',
          containerClassName
        )}
      >
        {sidebarMeta && (
          <Sidebar
            meta={sidebarMeta}
            mobileDrawerOpen={mobileDrawerOpen}
            onMobileLinkClick={onCloseMobileDrawer}
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
