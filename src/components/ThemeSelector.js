import React, { useState, useEffect } from 'react';
import { HiColorSwatch } from 'react-icons/hi';
import './ThemeSelector.css';

const THEMES = [
  {
    id: 'purple-pink',
    name: 'Purple Pink',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    colors: ['#8b5cf6', '#ec4899']
  },
  {
    id: 'blue-green',
    name: 'Blue Green',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
    colors: ['#3b82f6', '#10b981']
  },
  {
    id: 'orange-red',
    name: 'Orange Red',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    colors: ['#f97316', '#ef4444']
  },
  {
    id: 'aurora',
    name: 'Aurora',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #10b981 100%)',
    colors: ['#8b5cf6', '#06b6d4', '#10b981']
  }
];

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('purple-pink');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('docs-theme');
    if (savedTheme && THEMES.some(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Set default theme
      document.documentElement.setAttribute('data-theme', 'purple-pink');
    }
  }, []);

  const handleThemeChange = (themeId) => {
    if (themeId === currentTheme) {
      setIsOpen(false);
      return;
    }

    // Show transition overlay
    setIsTransitioning(true);

    // Apply theme
    setTimeout(() => {
      setCurrentTheme(themeId);
      document.documentElement.setAttribute('data-theme', themeId);
      localStorage.setItem('docs-theme', themeId);
    }, 250);

    // Hide overlay
    setTimeout(() => {
      setIsTransitioning(false);
      setIsOpen(false);
    }, 500);
  };

  const currentThemeData = THEMES.find(t => t.id === currentTheme);

  return (
    <>
      {/* Theme transition overlay */}
      {isTransitioning && <div className="theme-transition-overlay" />}

      <div className="theme-selector">
        <button
          className="theme-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select theme"
          style={{ background: currentThemeData.gradient }}
        >
          <HiColorSwatch />
        </button>

        {isOpen && (
          <>
            <div
              className="theme-overlay"
              onClick={() => setIsOpen(false)}
            />
            <div className="theme-panel slide-in-bottom">
              <h3 className="theme-panel-title">Choose Theme</h3>
              <div className="theme-grid">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    className={`theme-card ${currentTheme === theme.id ? 'active' : ''}`}
                    onClick={() => handleThemeChange(theme.id)}
                    aria-label={`Switch to ${theme.name} theme`}
                  >
                    <div
                      className="theme-card-gradient"
                      style={{ background: theme.gradient }}
                    >
                      {currentTheme === theme.id && (
                        <div className="theme-card-check">✓</div>
                      )}
                    </div>
                    <span className="theme-card-name">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ThemeSelector;
