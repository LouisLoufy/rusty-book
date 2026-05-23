import {
  clearMarkdownSourceCache,
  getCachedMarkdownSource,
  loadMarkdownSource,
  preloadMarkdownSource
} from './markdownSourceCache';
import { fetchText } from './http';

jest.mock('./http', () => ({
  fetchText: jest.fn()
}));

function createDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
}

beforeEach(() => {
  clearMarkdownSourceCache();
  fetchText.mockReset();
});

test('deduplicates in-flight markdown requests and reuses fulfilled text', async () => {
  const deferred = createDeferred();
  fetchText.mockReturnValueOnce(deferred.promise);

  const firstLoad = loadMarkdownSource('/docs/article.md');
  const secondLoad = loadMarkdownSource('/docs/article.md');

  expect(fetchText).toHaveBeenCalledTimes(1);
  expect(fetchText).toHaveBeenCalledWith('/docs/article.md');
  expect(secondLoad).toBe(firstLoad);
  expect(getCachedMarkdownSource('/docs/article.md')).toBeUndefined();

  deferred.resolve('# Article');

  await expect(firstLoad).resolves.toBe('# Article');
  expect(getCachedMarkdownSource('/docs/article.md')).toBe('# Article');

  await expect(loadMarkdownSource('/docs/article.md')).resolves.toBe('# Article');
  expect(fetchText).toHaveBeenCalledTimes(1);
});

test('preload swallows failures and allows retrying the same markdown URL', async () => {
  fetchText.mockRejectedValueOnce(new Error('network timeout'));

  await expect(preloadMarkdownSource('/docs/flaky.md')).resolves.toBeUndefined();
  expect(getCachedMarkdownSource('/docs/flaky.md')).toBeUndefined();

  fetchText.mockResolvedValueOnce('# Retried');

  await expect(loadMarkdownSource('/docs/flaky.md')).resolves.toBe('# Retried');
  expect(fetchText).toHaveBeenCalledTimes(2);
  expect(getCachedMarkdownSource('/docs/flaky.md')).toBe('# Retried');
});
