import React from 'react';
import { useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import ThemeSelector from '../ThemeSelector';
import AuthStatus from './AuthStatus';
import BookCategoryDropdown from '../AppHeader/BookCategoryDropdown';
import { useAuthContext } from '../../contexts/AuthContext';
import { getBookByPathname } from '../../content';

function BookFloatingActions({
  mobileDrawerOpen = false,
  onToggleMobileDrawer = null
}) {
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();
  const activeBook = getBookByPathname(location.pathname);
  const activeGithubRepo = activeBook?.githubRepo || null;

  return (
    <div className="book-floating-actions">
      {onToggleMobileDrawer && (
        <button
          type="button"
          className="book-fa-menu-toggle"
          onClick={onToggleMobileDrawer}
          aria-label={mobileDrawerOpen ? '关闭目录' : '打开目录'}
        >
          {mobileDrawerOpen ? <HiX /> : <HiMenu />}
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
          className="book-fa-github"
          aria-label={`访问 ${activeBook.title} 的 GitHub 仓库`}
          title={`访问 ${activeBook.title} 的 GitHub 仓库`}
        >
          <FaGithub />
        </a>
      )}

      <ThemeSelector />
    </div>
  );
}

export default BookFloatingActions;
