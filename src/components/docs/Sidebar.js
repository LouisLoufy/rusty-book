import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import '../../styles/3d-effects.css';

const Sidebar = ({ meta, isOpen, onClose }) => {
  const sectionRefs = useRef({});

  if (!meta) return null;

  // Mouse tracking for 3D tilt effect
  const handleMouseMove = (e, idx) => {
    const card = sectionRefs.current[idx];
    if (!card || window.innerWidth <= 968) return; // Disable on mobile

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 degrees
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  };

  const handleMouseLeave = (idx) => {
    const card = sectionRefs.current[idx];
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`docs-sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          {meta.sections.map((section, idx) => (
            <div
              key={idx}
              ref={(el) => (sectionRefs.current[idx] = el)}
              className="sidebar-section card-3d glass-morphism"
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
            >
              <div className="sidebar-section-header">
                <h3 className="sidebar-section-title">{section.title}</h3>
              </div>
              <ul className="sidebar-items">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="float-up-delay-1">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'active' : ''}`
                      }
                      onClick={onClose}
                    >
                      <span className="sidebar-link-text">{item.title}</span>
                      <span className="sidebar-link-indicator"></span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
