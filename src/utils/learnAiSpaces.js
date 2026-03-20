export const DEFAULT_LEARN_AI_SPACE_SLUG = 'learn-claude-code';

export const LEARN_AI_SPACES = [
  {
    id: 'learn-claude-code',
    slug: 'learn-claude-code',
    title: '从零手搓 Claude Code',
    sidebarKind: 'layered',
    defaultEntry: 'preface',
    layerIds: ['introduction', 'tools', 'planning', 'memory', 'concurrency', 'collaboration'],
    versionIds: ['preface', 's01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10', 's11', 's12']
  },
  {
    id: 'practices',
    slug: 'practices',
    title: '最佳实践',
    sidebarKind: 'flat',
    defaultEntry: 'bp01',
    versionIds: ['bp01']
  }
];

export function getDefaultLearnAiSpace() {
  return LEARN_AI_SPACES.find((space) => space.slug === DEFAULT_LEARN_AI_SPACE_SLUG) || LEARN_AI_SPACES[0] || null;
}

export function getLearnAiSpace(spaceSlug = '') {
  return LEARN_AI_SPACES.find((space) => space.slug === spaceSlug) || null;
}

export function getLearnAiSpaceByVersion(version = '') {
  return LEARN_AI_SPACES.find((space) => space.versionIds.includes(version)) || null;
}

export function isLearnAiSpaceSlug(spaceSlug = '') {
  return Boolean(getLearnAiSpace(spaceSlug));
}
