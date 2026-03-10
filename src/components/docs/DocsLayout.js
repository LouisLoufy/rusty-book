import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DocsLayout.css';
import '../../styles/Background.css';
import '../../styles/3d-effects.css';
import '../../styles/animations.css';
import ThemeToggle from '../ThemeToggle';
import ThemeSelector from '../ThemeSelector';
import Sidebar from './Sidebar';
import AIAssistant from './AIAssistant';
import AnnotationSystem from './AnnotationSystem';
import { HiMenu, HiX } from 'react-icons/hi';
import logo from '../../assets/logo.jpg';

const DocsLayout = ({ meta, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="docs-layout dynamic-background">
      {/* Header with glassmorphism */}
      <header className="docs-header glass-morphism">
        <div className="docs-header-content">
          <Link to="/" className="docs-logo">
            <img src={logo} alt="LoongBot" className="logo-image" />
            <span className="logo-text">LoongBot</span>
            <span className="docs-badge">Docs</span>
          </Link>

          <div className="docs-header-actions">
            <ThemeToggle />
            <ThemeSelector />
            <button
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </header>

      <div className="docs-container">
        {/* Sidebar */}
        <Sidebar
          meta={meta}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="docs-main">
          {children}
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Annotation System */}
      <AnnotationSystem />
    </div>
  );
};

export default DocsLayout;
