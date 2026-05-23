import { parseMarkdownFrontmatter } from './markdownFrontmatter';

test('parses simple frontmatter and returns markdown content', () => {
  expect(parseMarkdownFrontmatter([
    '---',
    'title: "Quoted title"',
    'description: Plain description',
    'url: https://example.com/article',
    'translated: 2026-05-23',
    'featured: true',
    'tags:',
    '  - AI',
    '  - Machine Learning',
    '---',
    '# Heading'
  ].join('\n'))).toEqual({
    data: {
      title: 'Quoted title',
      description: 'Plain description',
      url: 'https://example.com/article',
      translated: '2026-05-23',
      featured: true,
      tags: ['AI', 'Machine Learning']
    },
    content: '# Heading'
  });
});

test('returns the original content when frontmatter is absent or incomplete', () => {
  expect(parseMarkdownFrontmatter('# Heading')).toEqual({
    data: {},
    content: '# Heading'
  });

  expect(parseMarkdownFrontmatter('---\ntitle: Draft')).toEqual({
    data: {},
    content: '---\ntitle: Draft'
  });
});

test('supports inline arrays and stripped bom', () => {
  expect(parseMarkdownFrontmatter('\uFEFF---\ntags: [AI, "LLM"]\n---\nBody')).toEqual({
    data: {
      tags: ['AI', 'LLM']
    },
    content: 'Body'
  });
});
