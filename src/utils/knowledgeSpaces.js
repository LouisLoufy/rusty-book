import {
  findActiveCategoryByPath,
  getFirstNavigablePathForCategory
} from './docsMeta';
import { getLearnAiDefaultPath, LEARN_AI_BASE_PATH } from './learnAiPaths';

export function getLearnAiHubSpace() {
  return {
    id: 'learn-ai',
    title: 'AI 学习宝典',
    entryPath: getLearnAiDefaultPath(),
    kind: 'learn-ai'
  };
}

function buildDocKnowledgeSpace(category) {
  if (!category) {
    return null;
  }

  return {
    id: category.id,
    title: category.title,
    entryPath: category.entryPath || getFirstNavigablePathForCategory(category),
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

  return [...docSpaces, getLearnAiHubSpace()];
}

export function findActiveKnowledgeSpace(meta, path) {
  if (path.startsWith(LEARN_AI_BASE_PATH) || path.startsWith('/learn-claude-code/')) {
    return getLearnAiHubSpace();
  }

  const activeCategory = findActiveCategoryByPath(meta, path);

  return buildDocKnowledgeSpace(activeCategory);
}
