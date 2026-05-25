export const MBA_SPACES = [
  {
    id: 'elon-book',
    slug: 'elon-book',
    title: '埃隆之书',
    bookTitle: '埃隆之书',
    contentSource: 'docs',
    docsMetaFile: '/docs/mba/elon-book/_meta.json',
    docsCategoryId: 'mba/elon-book',
    defaultPath: '/mba/elon-book/about',
    description: '目标与成功指南，基于埃隆·马斯克原话整理的中文书籍版 Docs。',
    cardLabel: '已上线',
    cardMeta: '若干篇章',
    cardCta: '开始阅读'
  }
];

export function getMbaSpace(spaceSlug = '') {
  return MBA_SPACES.find((space) => space.slug === spaceSlug) || null;
}
