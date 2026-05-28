import { normalizeDocsMeta } from '../../utils/docsMetaNormalizer';
import {
  buildArticlePrefetchModel,
  buildDocArticleHistoryRecord,
  buildDocArticleNavigationModel,
  buildDocArticleRouteModel,
  buildDocsArchiveModel,
  buildDocsRouteValidationModel,
  buildDocsWorkspaceModel,
  buildBookCategoryMeta,
  buildBookRouteValidationModel,
  buildNormalizedArticleMarkdown,
  buildSidebarMeta
} from './docsDomain';

const QUIET = { warn: false };

function createMeta() {
  return normalizeDocsMeta({
    categories: [{
      id: 'ai-insights',
      title: 'AI 前沿学习',
      entryPath: 'ai-insights',
      sections: [{
        title: '2026 年 5 月',
        items: [{
          title: 'First Article',
          path: 'ai-insights/first',
          file: 'docs/ai-insights/2026-05/23/first.md',
          publishedAt: '2026-05-23',
          tags: ['AI', 'Guide']
        }, {
          title: 'Second Article',
          path: 'ai-insights/second',
          file: 'docs/ai-insights/2026-05/23/second.md',
          publishedAt: '2026-05-22',
          tags: ['Guide']
        }]
      }]
    }, {
      id: 'rust-course',
      title: 'Rust Course',
      sections: [{
        title: 'Intro',
        items: [{
          title: 'Ownership',
          path: 'rust-course/ownership',
          file: 'docs/rust-course/ownership.md',
          tags: ['Rust']
        }]
      }]
    }]
  }, QUIET);
}

test('builds an article route model from meta and pathname', () => {
  const route = buildDocArticleRouteModel({
    meta: createMeta(),
    pathname: '/ai-insights/first',
    findTitleByPath: () => 'Fallback Title'
  });

  expect(route).toMatchObject({
    docPath: 'ai-insights/first',
    isArticleEntry: true,
    isAiInsightsArticle: true,
    markdownUrl: '/docs/ai-insights/2026-05/23/first.md',
    titleFromMeta: 'First Article',
    category: { id: 'ai-insights' },
    section: { title: '2026 年 5 月' }
  });
});

test('falls back to conventional markdown path when route is missing', () => {
  const route = buildDocArticleRouteModel({
    meta: createMeta(),
    pathname: '/missing/path',
    findTitleByPath: () => 'Fallback Title'
  });

  expect(route.docMetaEntry).toBe(null);
  expect(route.markdownUrl).toBe('/docs/missing/path.md');
  expect(route.titleFromMeta).toBe('Fallback Title');
});

test('builds normalized markdown and history records at the domain boundary', () => {
  const route = buildDocArticleRouteModel({
    meta: createMeta(),
    pathname: '/ai-insights/first'
  });

  const markdown = buildNormalizedArticleMarkdown('# First Article\n\nbody text', {
    isAiInsightsArticle: route.isAiInsightsArticle,
    stripTitle: (content, enabled) => enabled ? content.replace(/^# .+\n\n/, '') : content
  });

  expect(markdown).toBe('body text');
  expect(buildDocArticleHistoryRecord({
    articleRoute: route,
    pathname: '/ai-insights/first',
    frontmatter: { title: 'Frontmatter Title' },
    rawDoc: '# First Article',
    error: null
  })).toEqual({
    path: '/ai-insights/first',
    title: 'First Article',
    categoryId: 'ai-insights',
    category: 'AI 前沿学习',
    section: '2026 年 5 月'
  });
});

test('builds adjacent navigation and archive projections', () => {
  const meta = createMeta();
  const route = buildDocArticleRouteModel({ meta, pathname: '/ai-insights/second' });

  expect(buildDocArticleNavigationModel({
    meta,
    pathname: '/ai-insights/second',
    docMetaEntry: route.docMetaEntry
  })).toEqual({
    adjacentChapters: {
      prev: {
        title: 'First Article',
        path: '/ai-insights/first',
        file: '/docs/ai-insights/2026-05/23/first.md',
        category: 'AI 前沿学习',
        section: '2026 年 5 月'
      },
      next: null
    },
    articleTags: ['Guide']
  });

  expect(buildDocsArchiveModel(meta.categories[0], 'Guide')).toMatchObject({
    filteredCount: 2,
    tagList: [
      { tag: 'Guide', count: 2 },
      { tag: 'AI', count: 1 }
    ],
    groups: [
      { date: '2026-05-23' },
      { date: '2026-05-22' }
    ]
  });
});

test('builds workspace and route validation models for page shells', () => {
  const meta = createMeta();

  expect(buildDocsWorkspaceModel({
    meta,
    pathname: '/rust-course/ownership'
  })).toMatchObject({
    sidebarMeta: {
      title: 'Rust Course',
      sections: expect.any(Array)
    }
  });

  expect(buildDocsRouteValidationModel(meta, '/ai-insights/first')).toMatchObject({
    defaultPath: '/ai-insights/first',
    isValidDocsPath: true
  });
  expect(buildDocsRouteValidationModel(meta, '/missing')).toMatchObject({
    isValidDocsPath: false
  });
});

test('builds shared navigation, prefetch, and book category models', () => {
  const meta = createMeta();
  const book = {
    slug: 'deep-learning',
    docsCategoryId: 'learn-ai/deep-learning',
    bookTitle: 'Deep Learning',
    githubRepo: 'https://example.com/deep-learning',
    repoTitle: 'Deep Learning Repo'
  };
  const tutorialMeta = buildBookCategoryMeta({
    bookMeta: meta.categories[0],
    book,
    parentTitle: 'AI Tutorials'
  });

  expect(buildArticlePrefetchModel(meta.categories[0].sections[0].items[0])).toEqual({
    file: '/docs/ai-insights/2026-05/23/first.md',
    path: '/ai-insights/first'
  });
  expect(tutorialMeta).toMatchObject({
    categories: [{
      id: 'learn-ai/deep-learning',
      title: 'Deep Learning',
      githubRepo: 'https://example.com/deep-learning',
      bookPath: {
        parentTitle: 'AI Tutorials',
        currentTitle: 'Deep Learning'
      }
    }]
  });
  expect(buildBookRouteValidationModel(
    tutorialMeta,
    '/ai-insights/first',
    '/learn-ai/deep-learning'
  )).toMatchObject({
    isBasePath: false,
    isValidPath: true,
    normalizedPathname: '/ai-insights/first'
  });
});

test('buildSidebarMeta returns a flat reverse-chronological list for ai-insights', () => {
  const meta = normalizeDocsMeta({
    categories: [{
      id: 'ai-insights',
      title: 'AI 前沿学习',
      entryPath: 'ai-insights',
      sections: [
        {
          title: '2026 年 5 月',
          items: [
            { title: 'B', path: 'ai-insights/b', file: 'docs/ai-insights/b.md', publishedAt: '2026-05-22', tags: ['t'] },
            { title: 'A', path: 'ai-insights/a', file: 'docs/ai-insights/a.md', publishedAt: '2026-05-22', tags: [] }
          ]
        },
        {
          title: '2026 年 4 月',
          items: [
            { title: 'C', path: 'ai-insights/c', file: 'docs/ai-insights/c.md', publishedAt: '2026-04-10', tags: [] },
            { title: 'D', path: 'ai-insights/d', file: 'docs/ai-insights/d.md', publishedAt: '2026-06-01', tags: [] }
          ]
        }
      ]
    }]
  }, QUIET);

  const sidebar = buildSidebarMeta(meta.categories[0]);

  expect(sidebar.title).toBe('AI 前沿学习');
  expect(sidebar.sections).toHaveLength(1);
  expect(sidebar.sections[0].title).toBe('最新文章');
  expect(sidebar.sections[0].items.map((item) => item.title)).toEqual(['D', 'A', 'B', 'C']);
  expect(sidebar.sections[0].items[0]).toEqual({
    title: 'D',
    path: '/ai-insights/d',
    file: '/docs/ai-insights/d.md'
  });
  expect(sidebar.sections[0].items[0]).not.toHaveProperty('publishedAt');
  expect(sidebar.sections[0].items[0]).not.toHaveProperty('tags');
});

test('buildSidebarMeta preserves the raw section tree for non ai-insights categories', () => {
  const meta = createMeta();
  const rust = meta.categories.find((c) => c.id === 'rust-course');
  const sidebar = buildSidebarMeta(rust);

  expect(sidebar.title).toBe('Rust Course');
  expect(sidebar.sections).toBe(rust.sections);
});
