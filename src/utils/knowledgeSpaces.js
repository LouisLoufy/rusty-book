import {
  findActiveCategoryByPath,
  findMetaEntryByPath,
  getFirstNavigableFileForCategory,
  getFirstNavigablePathForCategory
} from './docsMetaSelectors';
import { getLearnAiDefaultPath, LEARN_AI_BASE_PATH } from './learnAiPaths';
import { getTutorialHub, getTutorialHubByPathname } from './tutorialHubs';

export const AI_TUTORIALS_PATH = LEARN_AI_BASE_PATH;

export function getAiTutorialSpace() {
  const hub = getTutorialHub('learn-ai');
  return {
    id: 'ai-tutorials',
    title: hub?.title || 'AI 学习教程',
    entryPath: AI_TUTORIALS_PATH,
    kind: 'tutorial-hub'
  };
}

export function getLearnAiHubSpace() {
  return {
    id: 'learn-ai',
    title: 'Learn Claude Code',
    entryPath: getLearnAiDefaultPath(),
    kind: 'learn-ai'
  };
}

function getDocKnowledgeSpaceEntryFile(category, entryPath) {
  if (!entryPath) {
    return getFirstNavigableFileForCategory(category);
  }

  return findMetaEntryByPath({ categories: [category] }, entryPath)?.item?.file
    || getFirstNavigableFileForCategory(category);
}

function buildDocKnowledgeSpace(category) {
  if (!category) {
    return null;
  }

  const entryPath = category.entryPath || getFirstNavigablePathForCategory(category);

  return {
    id: category.id,
    title: category.title,
    entryPath,
    entryFile: getDocKnowledgeSpaceEntryFile(category, entryPath),
    githubRepo: category.githubRepo,
    repoTitle: category.repoTitle,
    kind: 'docs',
    source: category
  };
}

export function buildKnowledgeSpaces(meta) {
  const docSpaces = (meta?.categories || [])
    .map((category) => buildDocKnowledgeSpace(category))
    .filter(Boolean);

  return [...docSpaces, getAiTutorialSpace()];
}

export function findActiveKnowledgeSpace(meta, path) {
  if (path.startsWith('/learn-claude-code/')) {
    return getAiTutorialSpace();
  }

  const hub = getTutorialHubByPathname(path);
  if (hub) {
    return {
      id: hub.id,
      title: hub.title,
      entryPath: hub.basePath,
      kind: 'tutorial-hub'
    };
  }

  const activeCategory = findActiveCategoryByPath(meta, path);

  return buildDocKnowledgeSpace(activeCategory);
}
