import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemePanel from './themeSelector/ThemePanel';
import { useThemeSelectorState } from './themeSelector/useThemeSelectorState';

const ThemeSelector = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);

  // 面板打开时拦截 Escape，避免冒泡到阅读模式的退出键监听
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  const {
    currentFontSize,
    currentTheme,
    handleFontSizeChange,
    handleThemeChange,
    isDarkMode,
    isTransitioning
  } = useThemeSelectorState();

  const handleTogglePanel = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPanelPosition({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isTransitioning && <div className="theme-transition-overlay" />}

      <div className="theme-selector">
        <button
          ref={buttonRef}
          className="theme-button"
          onClick={handleTogglePanel}
          aria-label="Select theme"
        >
        </button>

        {isOpen && ReactDOM.createPortal(
          <div className="theme-overlay" onClick={() => setIsOpen(false)}>
            <ThemePanel
              currentFontSize={currentFontSize}
              currentTheme={currentTheme}
              isDarkMode={isDarkMode}
              panelPosition={panelPosition}
              themeMode={theme}
              onFontSizeChange={handleFontSizeChange}
              onThemeChange={handleThemeChange}
              onThemeModeToggle={toggleTheme}
            />
          </div>,
          document.body
        )}
      </div>
    </>
  );
};

export default ThemeSelector;
