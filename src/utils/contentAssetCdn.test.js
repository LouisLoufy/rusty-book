jest.mock('../config/assetsRepos.json', () => ({
  repos: {
    primary: { owner: 'beatai-org', name: 'beatai-assets' },
    archive: { owner: 'beatai-org', name: 'beatai-assets-archive' }
  },
  routes: [
    { match: '/docs/ai-insights/2027-', repo: 'archive' },
    { match: '/docs/', repo: 'primary' }
  ]
}), { virtual: true });

jest.mock('../config/assetsPin.json', () => ({
  primary: 'abc123',
  archive: 'def456'
}), { virtual: true });

const { rewriteContentAssetToCdn } = require('./contentAssetCdn');

test('rewrites a /docs/ image path to the primary repo', () => {
  expect(rewriteContentAssetToCdn('/docs/ai-insights/2026-05/19/images/02.webp'))
    .toBe('https://cdn.jsdelivr.net/gh/beatai-org/beatai-assets@abc123/ai-insights/2026-05/19/images/02.webp');
});

test('rewrites a full URL with same-site /docs/ path', () => {
  expect(rewriteContentAssetToCdn('https://beatai.org/docs/learn-ai/deep-learning/imgs/0101.png'))
    .toBe('https://cdn.jsdelivr.net/gh/beatai-org/beatai-assets@abc123/learn-ai/deep-learning/imgs/0101.png');
});

test('uses the more specific route for /docs/ai-insights/2027-* (archive repo)', () => {
  expect(rewriteContentAssetToCdn('/docs/ai-insights/2027-01/05/images/cover.webp'))
    .toBe('https://cdn.jsdelivr.net/gh/beatai-org/beatai-assets-archive@def456/ai-insights/2027-01/05/images/cover.webp');
});

test('returns null for non-image extensions', () => {
  expect(rewriteContentAssetToCdn('/docs/rust-course/about-book.md')).toBeNull();
  expect(rewriteContentAssetToCdn('/docs/_meta.json')).toBeNull();
});

test('returns null for paths outside any routed prefix', () => {
  expect(rewriteContentAssetToCdn('/images/site-logo.png')).toBeNull();
  expect(rewriteContentAssetToCdn('https://example.com/foo.png')).toBeNull();
});

test('returns null when input is falsy or non-string', () => {
  expect(rewriteContentAssetToCdn('')).toBeNull();
  expect(rewriteContentAssetToCdn(null)).toBeNull();
  expect(rewriteContentAssetToCdn(undefined)).toBeNull();
  expect(rewriteContentAssetToCdn(42)).toBeNull();
});

test('preserves URL-encoded unicode in image filenames', () => {
  const encoded = '/docs/rust-course/assets/studyrust%E5%85%AC%E4%BC%97%E5%8F%B7.png';
  expect(rewriteContentAssetToCdn(encoded))
    .toBe(`https://cdn.jsdelivr.net/gh/beatai-org/beatai-assets@abc123/rust-course/assets/studyrust%E5%85%AC%E4%BC%97%E5%8F%B7.png`);
});

describe('with SHA unset for a repo', () => {
  beforeAll(() => {
    jest.resetModules();
    jest.doMock('../config/assetsRepos.json', () => ({
      repos: { primary: { owner: 'beatai-org', name: 'beatai-assets' } },
      routes: [{ match: '/docs/', repo: 'primary' }]
    }), { virtual: true });
    jest.doMock('../config/assetsPin.json', () => ({ primary: null }), { virtual: true });
  });

  test('returns null so callers fall back to the local path', () => {
    const { rewriteContentAssetToCdn: rewriteNoSha } = require('./contentAssetCdn');
    expect(rewriteNoSha('/docs/ai-insights/2026-05/19/images/foo.webp')).toBeNull();
  });
});
