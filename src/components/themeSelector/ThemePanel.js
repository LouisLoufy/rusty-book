import React from 'react';
import { FONTS, FONT_WEIGHTS } from './config';
import FontSizeControl from './FontSizeControl';
import ThemeGridSection from './ThemeGridSection';
import ThemeModeSection from './ThemeModeSection';
import ThemeOptionSection from './ThemeOptionSection';
import { ensureFontStylesheet } from './themeSelectorUtils';

export default function ThemePanel({
  currentFont,
  currentFontSize,
  currentFontWeight,
  currentTheme,
  isDarkMode,
  panelPosition,
  themeMode,
  onFontChange,
  onFontSizeChange,
  onFontWeightChange,
  onThemeChange,
  onThemeModeToggle
}) {
  return (
    <div
      className="theme-panel slide-in-bottom"
      onClick={(event) => event.stopPropagation()}
      style={{
        position: 'fixed',
        top: `${panelPosition.top}px`,
        right: `${panelPosition.right}px`
      }}
    >
      <ThemeModeSection themeMode={themeMode} toggleTheme={onThemeModeToggle} />

      <ThemeGridSection
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
        onThemeChange={onThemeChange}
      />

      <ThemeOptionSection
        buttonClassName="font-option"
        checkClassName="font-option-check"
        currentValue={currentFont}
        getButtonStyle={(font) => ({ fontFamily: font.family })}
        labelClassName="font-option-name"
        listClassName="font-list"
        onChange={onFontChange}
        onPreview={(font) => ensureFontStylesheet(font.id)}
        options={FONTS}
        title="Font Family"
      />

      <ThemeOptionSection
        buttonClassName="font-weight-option"
        checkClassName="font-weight-check"
        currentValue={currentFontWeight}
        getButtonStyle={(weight) => ({ fontWeight: weight.value })}
        labelClassName="font-weight-name"
        listClassName="font-weight-list"
        onChange={onFontWeightChange}
        options={FONT_WEIGHTS}
        title="Font Weight"
      />

      <FontSizeControl
        currentValue={currentFontSize}
        onChange={onFontSizeChange}
        title="Font Size"
      />
    </div>
  );
}
