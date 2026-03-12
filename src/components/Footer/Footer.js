import React from 'react';
import { FaGithub, FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Left Section - Brand */}
          <div className="footer-section footer-brand">
            <h3 className="footer-logo">BeatAI</h3>
            <p className="footer-description">
              Build better AI applications with modern tools
            </p>
          </div>

          {/* Middle Section - Links */}
          <div className="footer-section footer-links">
            <h4 className="footer-title">Resources</h4>
            <ul className="footer-list">
              <li>
                <a href="/getting-started/introduction" className="footer-link">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/guides/first-bot" className="footer-link">
                  Guides
                </a>
              </li>
              <li>
                <a href="/api/core" className="footer-link">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Right Section - Social */}
          <div className="footer-section footer-social">
            <h4 className="footer-title">Community</h4>
            <a
              href="https://github.com/beatai-org"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-github-link"
            >
              <FaGithub className="footer-github-icon" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <span>© {currentYear} BeatAI. All rights reserved.</span>
          </div>
          <div className="footer-made-with">
            Made with <FaHeart className="footer-heart-icon" /> by BeatAI Team
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
