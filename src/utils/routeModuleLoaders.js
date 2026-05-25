import { PAGE_IDS } from './pageConfig';

export const ROUTE_MODULE_LOADERS = Object.freeze({
  [PAGE_IDS.genesisLab]: () => import('../pages/Home'),
  [PAGE_IDS.docs]: () => import('../pages/Docs'),
  [PAGE_IDS.tag]: () => import('../pages/TagPage'),
  [PAGE_IDS.square]: () => import('../pages/Square'),
  [PAGE_IDS.logoShowcase]: () => import('../pages/LogoShowcase'),
  [PAGE_IDS.tutorialsHubPage]: () => import('../pages/TutorialsHubPage'),
  [PAGE_IDS.tutorialBook]: () => import('../pages/TutorialBook'),
  [PAGE_IDS.aiContinentDemo]: () => import('../pages/AIContinentDemo'),
  [PAGE_IDS.mapTextureShowcase]: () => import('../pages/MapTextureShowcase'),
  [PAGE_IDS.aiInsights]: () => import('../pages/AiInsightsArchive')
});
