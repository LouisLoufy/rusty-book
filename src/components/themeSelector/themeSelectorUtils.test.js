import {
  applyFont,
  applySavedThemeSelectorState,
  ensureFontStylesheet
} from './themeSelectorUtils';

function getFontLoaderLinks() {
  return Array.from(document.head.querySelectorAll('[data-font-loader]'));
}

beforeEach(() => {
  getFontLoaderLinks().forEach((link) => link.remove());
  document.documentElement.removeAttribute('style');
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
});

test('uses local system fonts without injecting external font stylesheets', () => {
  applyFont('pingfang');

  expect(document.documentElement.style.getPropertyValue('--font-family')).toContain('PingFang SC');
  expect(getFontLoaderLinks()).toHaveLength(0);
});

test('loads an external font stylesheet once with provider preconnects', () => {
  ensureFontStylesheet('noto-sans');
  ensureFontStylesheet('noto-sans');

  const stylesheets = document.head.querySelectorAll('[data-font-loader="stylesheet"]');
  const preconnects = document.head.querySelectorAll('[data-font-loader="preconnect"]');

  expect(stylesheets).toHaveLength(1);
  expect(stylesheets[0].href).toContain('Noto+Sans+SC');
  expect(preconnects).toHaveLength(2);
  expect(Array.from(preconnects).map((link) => link.href)).toEqual(
    expect.arrayContaining([
      'https://fonts.googleapis.com/',
      'https://fonts.gstatic.com/'
    ])
  );
});

test('applies saved external font preference through the lazy font loader', () => {
  applySavedThemeSelectorState({
    themeId: 'kindle-paper',
    fontId: 'lxgw-wenkai',
    fontWeightId: 'normal',
    fontSizeId: '18'
  });

  const stylesheet = document.head.querySelector('[data-font-loader="stylesheet"]');

  expect(document.documentElement.style.getPropertyValue('--font-family')).toContain('LXGW WenKai');
  expect(stylesheet.href).toContain('lxgw-wenkai-webfont');
  expect(document.documentElement.getAttribute('data-theme')).toBe('kindle-paper');
});
