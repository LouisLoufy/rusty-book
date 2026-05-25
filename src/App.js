import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { HistoryProvider } from './contexts/HistoryContext';
import PageTransitionLoader from './components/PageTransitionLoader';
import { lazyWithMinLoadTime } from './utils/lazyWithMinLoadTime';
import { ROUTE_MODULE_LOADERS } from './utils/routeModuleLoaders';
import {
  rewriteLegacyLearnClaudeCodePath
} from './utils/learnAiPaths';
import { APP_ROUTE_PATHS, PAGE_CONFIG, PAGE_IDS } from './utils/pageConfig';
import { TUTORIAL_HUBS } from './utils/tutorialHubs';
import { HOME_PATH } from './utils/siteRoutes';

// Lazy-load route components; avoid adding artificial delay to navigation.
const Home = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.genesisLab]));
const Docs = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.docs]));
const TagPage = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.tag]));
const Square = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.square]));
const LogoShowcase = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.logoShowcase]));
const TutorialsHubPage = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.tutorialsHubPage]));
const TutorialBook = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.tutorialBook]));
const AIContinentDemo = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.aiContinentDemo]));
const MapTextureShowcase = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.mapTextureShowcase]));
const AiInsightsArchive = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.aiInsights]));

const ROUTER_FUTURE_FLAGS = Object.freeze({
  v7_startTransition: true,
  v7_relativeSplatPath: true
});

function LegacyLearnClaudeCodeRedirect() {
  const location = useLocation();
  const nextPath = rewriteLegacyLearnClaudeCodePath(location.pathname);

  return <Navigate to={`${nextPath}${location.search}${location.hash}`} replace />;
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <HistoryProvider>
            <BrowserRouter future={ROUTER_FUTURE_FLAGS}>
              <div className="App dynamic-background">
                <Suspense fallback={<PageTransitionLoader />}>
                  <Routes>
                    {/* 根目录跳转到 ai-insights 档案页 */}
                    <Route path={APP_ROUTE_PATHS.root} element={<Navigate to={HOME_PATH} replace />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.genesisLab].path} element={<Home />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.square].path} element={<Square />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.aiContinentDemo].path} element={<AIContinentDemo />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.mapTextureShowcase].path} element={<MapTextureShowcase />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.logoShowcase].path} element={<LogoShowcase />} />
                    <Route path={APP_ROUTE_PATHS.legacyLearnClaudeCode} element={<LegacyLearnClaudeCodeRedirect />} />
                    {TUTORIAL_HUBS.flatMap((hub) => [
                      <Route key={`${hub.id}-hub`} path={hub.basePath} element={<TutorialsHubPage hub={hub} />} />,
                      <Route key={`${hub.id}-book`} path={`${hub.basePath}/:space/*`} element={<TutorialBook />} />
                    ])}
                    <Route path={APP_ROUTE_PATHS.tags} element={<TagPage />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.aiInsights].path} element={<AiInsightsArchive />} />
                    <Route path={APP_ROUTE_PATHS.catchAll} element={<Docs />} />
                  </Routes>
                </Suspense>
              </div>
            </BrowserRouter>
          </HistoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
