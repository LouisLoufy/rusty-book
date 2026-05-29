import React from 'react';
import { useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import ThemeSelector from '../ThemeSelector';
import ReadingModeToggleButton from './ReadingModeToggleButton';
import AuthStatus from './AuthStatus';
import BookCategoryDropdown from '../AppHeader/BookCategoryDropdown';
import { useAuthContext } from '../../contexts/AuthContext';
import { getBookByPathname } from '../../content';

function BookFloatingActions({
  sidebarOpen = false,
  onMenuToggle = null,
  showReadingModeToggle = true
}) {
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();
  const activeBook = getBookByPathname(location.pathname);
  const activeGithubRepo = activeBook?.githubRepo || null;

  return (
    <div className="book-floating-actions">
      {onMenuToggle && (
        <button
          type="button"
          className="book-fa-menu-toggle"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <HiX /> : <HiMenu />}
        </button>
      )}

      <BookCategoryDropdown
        compact
        className="book-fa-category"
        showInlineGithub={false}
      />

      {isAuthenticated && (
        <div className="book-fa-auth">
          <AuthStatus />
        </div>
      )}

      {activeGithubRepo && (
        <a
          href={activeGithubRepo}
          target="_blank"
          rel="noopener noreferrer"
          className="book-fa-github reading-mode-toggle-btn"
          aria-label={`访问 ${activeBook.title} 的 GitHub 仓库`}
          title={`访问 ${activeBook.title} 的 GitHub 仓库`}
        >
          <FaGithub />
        </a>
      )}

      {showReadingModeToggle && <ReadingModeToggleButton />}
      <ThemeSelector />
    </div>
  );
}

export default BookFloatingActions;
