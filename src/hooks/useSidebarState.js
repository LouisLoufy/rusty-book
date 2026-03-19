import { useEffect, useState } from 'react';

export function useSidebarState(options = {}) {
  const { closeOnChange = null } = options;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (closeOnChange === null || closeOnChange === undefined) {
      return;
    }

    setSidebarOpen(false);
  }, [closeOnChange]);

  return {
    sidebarOpen,
    closeSidebar() {
      setSidebarOpen(false);
    },
    toggleSidebar() {
      setSidebarOpen((prev) => !prev);
    }
  };
}
