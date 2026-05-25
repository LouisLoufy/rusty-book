import { LEARN_AI_BASE_PATH, getLearnAiDefaultPath } from './learnAiPaths';
import { getLearnAiSpace, LEARN_AI_SPACES } from './learnAiSpaces';
import { MBA_BASE_PATH, getMbaDefaultPath } from './mbaPaths';
import { getMbaSpace, MBA_SPACES } from './mbaSpaces';

// Tutorial hubs are top-level destinations that group a set of books.
// Each hub has its own URL prefix, hub page, and slug-based dispatcher.
// Adding a hub = append one entry here + register routes in pageConfig/App.
export const TUTORIAL_HUBS = Object.freeze([
  {
    id: 'learn-ai',
    basePath: LEARN_AI_BASE_PATH,
    title: 'AI 学习教程',
    description: '集中浏览收录的 AI 学习教程，目前包含 Learn Claude Code、深度学习指南、Agent Harness。',
    spaces: LEARN_AI_SPACES,
    getSpace: getLearnAiSpace,
    getDefaultPath: getLearnAiDefaultPath,
    allowsLccContentSource: true
  },
  {
    id: 'mba',
    basePath: MBA_BASE_PATH,
    title: '组织管理教程',
    description: '组织、管理、领导力相关的书籍合集；首批收录《埃隆之书》。',
    spaces: MBA_SPACES,
    getSpace: getMbaSpace,
    getDefaultPath: getMbaDefaultPath,
    allowsLccContentSource: false
  }
]);

export function getTutorialHub(hubId) {
  return TUTORIAL_HUBS.find((hub) => hub.id === hubId) || null;
}

// Longest-prefix match so /mba-foo wouldn't accidentally hit /mba.
export function getTutorialHubByPathname(pathname = '') {
  return TUTORIAL_HUBS
    .filter((hub) => pathname === hub.basePath || pathname.startsWith(`${hub.basePath}/`))
    .sort((a, b) => b.basePath.length - a.basePath.length)[0] || null;
}

export function getHubOfSpace(space) {
  if (!space) {
    return null;
  }
  const slug = typeof space === 'string' ? space : space.slug;
  return TUTORIAL_HUBS.find((hub) => hub.spaces.some((s) => s.slug === slug)) || null;
}
