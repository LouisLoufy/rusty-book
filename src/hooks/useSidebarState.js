import { useState } from 'react';

// Sidebar state is intentionally split into two flags so mobile and
// desktop interactions don't bleed into each other:
//  - mobileDrawerOpen: drives the fixed/transform drawer below 968px
//  - desktopCollapsed: drives the in-flow CSS collapse above 968px
// Neither flag's actions touch the other one.
export function useSidebarState() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  return {
    mobileDrawerOpen,
    desktopCollapsed,
    closeMobileDrawer() {
      setMobileDrawerOpen(false);
    },
    toggleMobileDrawer() {
      setMobileDrawerOpen((prev) => !prev);
    },
    toggleDesktopCollapsed() {
      setDesktopCollapsed((prev) => !prev);
    }
  };
}
