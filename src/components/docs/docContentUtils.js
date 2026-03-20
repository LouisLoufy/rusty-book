export function formatPublishedDate(publishedAt) {
  if (!publishedAt) {
    return '';
  }

  const [year, month, day] = publishedAt.split('-').map(Number);
  if (!year || !month || !day) {
    return publishedAt;
  }

  return `${year}年${month}月${day}日`;
}

const CONTRIBUTOR_ROLE_LABELS = {
  reviewer: '辣评',
  author: '作者',
  translator: '译者',
  editor: '编辑'
};

export function formatContributors(contributors) {
  if (!Array.isArray(contributors)) {
    return [];
  }

  return contributors
    .filter((contributor) => contributor?.name && contributor?.role)
    .map((contributor) => ({
      key: `${contributor.role}:${contributor.name}`,
      label: CONTRIBUTOR_ROLE_LABELS[contributor.role] || contributor.role,
      name: contributor.name,
      link: typeof contributor.link === 'string' && /^https?:\/\//.test(contributor.link)
        ? contributor.link
        : ''
    }));
}

export function formatDocErrorMessage(error) {
  if (!error?.message) {
    return 'Document not found';
  }

  return error.message === 'HTTP error! status: 404' ? 'Document not found' : error.message;
}

export function buildFallbackTitleFromPath(docPath) {
  return docPath.split('/').pop()?.split('-').map((word) =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Untitled';
}

export function buildDocPageTitle(docPath, titleFromMeta, frontmatterTitle) {
  return titleFromMeta || frontmatterTitle || buildFallbackTitleFromPath(docPath);
}

export function buildDocPageDescription(frontmatterDescription, pageTitle) {
  return frontmatterDescription || `Documentation for ${pageTitle}`;
}

export function stripAiInsightsTitle(content, isAiInsightsArticle) {
  if (!isAiInsightsArticle) {
    return content;
  }

  return content
    .replace(/^\s*#\s+.+?(?:\r?\n){1,2}/, '')
    .replace(/\r?\n---\r?\n\r?\n(?=##\s+原文链接)/g, '\n\n')
    .replace(/\r?\n(?:---\r?\n)?\r?\n\*\*(?:\s*#[^\r\n*]+)+\s*\*\*\s*$/u, '');
}
