import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams
} from 'react-router-dom';
import Sidebar from '../components/docs/Sidebar';
import { LearnRouteNotFound, NotFoundState } from '../components/learnClaudeCode/NotFoundState';
import VersionPage from '../components/learnClaudeCode/VersionPage';
import PageShell from '../components/layout/PageShell';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useSidebarState } from '../hooks/useSidebarState';
import { useDocsMeta } from '../hooks/useDocsMeta';
import './LearnClaudeCode.css';
import '../components/docs/DocContent.css';
import '../styles/prism-custom.css';
import { buildLearnAiSidebarMeta } from '../components/learnClaudeCode/sidebarMeta';
import {
  getLearnAiDefaultPath,
  getLearnAiEntryPath
} from '../utils/learnAiPaths';
import { getLearnAiSpace, getLearnAiSpaceByVersion } from '../utils/learnAiSpaces';

function LearnClaudeCode() {
  const { space: spaceSlug } = useParams();
  const { meta } = useDocsMeta();
  const location = useLocation();
  const handleCategoryClick = useCategoryNavigation();
  const { sidebarOpen, closeSidebar, toggleSidebar } = useSidebarState({
    closeOnChange: location.pathname
  });

  const categories = meta?.categories || [];
  const sidebarMeta = useMemo(() => buildLearnAiSidebarMeta(), []);
  const currentSpace = getLearnAiSpace(spaceSlug);
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentVersion = pathParts.length > 2 ? pathParts[2] : '';

  if (!currentSpace) {
    return <NotFoundState label={spaceSlug || location.pathname} />;
  }

  if (currentVersion) {
    const targetSpace = getLearnAiSpaceByVersion(currentVersion);
    if (targetSpace && targetSpace.slug !== currentSpace.slug) {
      return <Navigate to={getLearnAiEntryPath(currentVersion)} replace />;
    }
  }

  return (
    <>
      <Helmet>
        <title>AI 学习宝典 | BeatAI</title>
        <meta
          name="description"
          content="AI 学习宝典学习路径已接入 BeatAI，包含学习路径、版本详情、文档讲解、模拟器与源码浏览。"
        />
      </Helmet>

      <PageShell
        rootClassName="lcc-page"
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
        sidebarOpen={sidebarOpen}
        onMenuToggle={toggleSidebar}
      >
        <div className="lcc-shell">
          <div className="lcc-workspace">
            <Sidebar
              meta={sidebarMeta}
              isOpen={sidebarOpen}
              onClose={closeSidebar}
            />

            <div className="lcc-content">
              <Routes>
                <Route index element={<Navigate to={getLearnAiDefaultPath(currentSpace.slug)} replace />} />
                <Route path=":version" element={<VersionPage />} />
                <Route path="*" element={<LearnRouteNotFound />} />
              </Routes>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
}

export default LearnClaudeCode;
