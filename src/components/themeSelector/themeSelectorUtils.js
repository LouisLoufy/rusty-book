import {
  DEFAULT_FONT_ID,
  DEFAULT_FONT_SIZE_ID,
  DEFAULT_FONT_WEIGHT_ID,
  DEFAULT_THEME_ID,
  FONTS,
  FONT_SIZES,
  FONT_WEIGHTS,
  THEMES
} from './config';

const STORAGE_KEYS = {
  theme: 'docs-theme',
  font: 'docs-font',
  fontWeight: 'docs-font-weight',
  fontSize: 'docs-font-size'
};

const LEGACY_FONT_SIZE_IDS = {
  small: '16',
  normal: '18',
  large: '20',
  xlarge: '22'
};

function getStoredValue(key, options, fallback) {
  const savedValue = localStorage.getItem(key);
  return options.some((option) => option.id === savedValue) ? savedValue : fallback;
}

function getFontStylesheetId(fontId) {
  return `font-stylesheet-${fontId}`;
}

function getFontPreconnectId(href) {
  return `font-preconnect-${href.replace(/[^a-z0-9]/gi, '-')}`;
}

function ensureFontPreconnect({ href, crossOrigin }) {
  if (!href || document.getElementById(getFontPreconnectId(href))) {
    return;
  }

  const link = document.createElement('link');
  link.id = getFontPreconnectId(href);
  link.rel = 'preconnect';
  link.href = href;
  if (crossOrigin) {
    link.crossOrigin = crossOrigin;
  }
  link.setAttribute('data-font-loader', 'preconnect');
  document.head.appendChild(link);
}

export function ensureFontStylesheet(fontId) {
  const font = FONTS.find((item) => item.id === fontId);
  if (!font?.stylesheet || document.getElementById(getFontStylesheetId(font.id))) {
    return;
  }

  (font.preconnects || []).forEach(ensureFontPreconnect);

  const link = document.createElement('link');
  link.id = getFontStylesheetId(font.id);
  link.rel = 'stylesheet';
  link.href = font.stylesheet;
  link.setAttribute('data-font-loader', 'stylesheet');
  document.head.appendChild(link);
}

export function setThemeAttribute(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
}

export function getIsDarkMode() {
  return document.documentElement.getAttribute('data-theme-mode') === 'dark';
}

export function applyFont(fontId) {
  const font = FONTS.find((item) => item.id === fontId);
  if (font) {
    ensureFontStylesheet(font.id);
    document.documentElement.style.setProperty('--font-family', font.family);
  }
}

export function applyFontWeight(weightId) {
  const weight = FONT_WEIGHTS.find((item) => item.id === weightId);
  if (weight) {
    document.documentElement.style.setProperty('--font-weight', weight.value);
  }
}

export function applyFontSize(sizeId) {
  const size = FONT_SIZES.find((item) => item.id === sizeId);
  if (size) {
    document.documentElement.style.setProperty('--user-font-size', size.value);
  }
}

function getStoredFontSizeValue() {
  const savedValue = localStorage.getItem(STORAGE_KEYS.fontSize);
  const normalizedValue = LEGACY_FONT_SIZE_IDS[savedValue] || savedValue;

  return FONT_SIZES.some((option) => option.id === normalizedValue)
    ? normalizedValue
    : DEFAULT_FONT_SIZE_ID;
}

export function getSavedThemeSelectorState() {
  return {
    themeId: getStoredValue(STORAGE_KEYS.theme, THEMES, DEFAULT_THEME_ID),
    fontId: getStoredValue(STORAGE_KEYS.font, FONTS, DEFAULT_FONT_ID),
    fontWeightId: getStoredValue(STORAGE_KEYS.fontWeight, FONT_WEIGHTS, DEFAULT_FONT_WEIGHT_ID),
    fontSizeId: getStoredFontSizeValue()
  };
}

export function applySavedThemeSelectorState(savedState) {
  setThemeAttribute(savedState.themeId);
  applyFont(savedState.fontId);
  applyFontWeight(savedState.fontWeightId);
  applyFontSize(savedState.fontSizeId);
}

export function persistTheme(themeId) {
  localStorage.setItem(STORAGE_KEYS.theme, themeId);
}

export function persistFont(fontId) {
  localStorage.setItem(STORAGE_KEYS.font, fontId);
}

export function persistFontWeight(weightId) {
  localStorage.setItem(STORAGE_KEYS.fontWeight, weightId);
}

export function persistFontSize(sizeId) {
  localStorage.setItem(STORAGE_KEYS.fontSize, sizeId);
}
