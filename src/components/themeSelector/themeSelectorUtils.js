import {
  DEFAULT_FONT_SIZE_ID,
  DEFAULT_THEME_ID,
  FONT_SIZES,
  THEMES
} from './config';

const STORAGE_KEYS = {
  theme: 'docs-theme',
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

export function setThemeAttribute(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
}

export function getIsDarkMode() {
  return document.documentElement.getAttribute('data-theme-mode') === 'dark';
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
    fontSizeId: getStoredFontSizeValue()
  };
}

export function applySavedThemeSelectorState(savedState) {
  setThemeAttribute(savedState.themeId);
  applyFontSize(savedState.fontSizeId);
}

export function persistTheme(themeId) {
  localStorage.setItem(STORAGE_KEYS.theme, themeId);
}

export function persistFontSize(sizeId) {
  localStorage.setItem(STORAGE_KEYS.fontSize, sizeId);
}
