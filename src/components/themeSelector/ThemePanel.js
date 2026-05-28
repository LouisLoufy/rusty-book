import React from 'react';
import FontSizeControl from './FontSizeControl';
import ThemeGridSection from './ThemeGridSection';
import ThemeModeSection from './ThemeModeSection';

export default function ThemePanel({
  currentFontSize,
  currentTheme,
  isDarkMode,
  panelPosition,
  themeMode,
  onFontSizeChange,
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

      <FontSizeControl
        currentValue={currentFontSize}
        onChange={onFontSizeChange}
        title="Font Size"
      />
    </div>
  );
}
