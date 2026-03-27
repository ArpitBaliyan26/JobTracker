// Navbar.jsx – Top navigation bar showing page title and a clickable profile dropdown.
// FIX: Profile avatar now opens a dropdown menu on click.
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/ApplicationContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const PAGE_TITLES = {
  '/dashboard':       { title: 'Dashboard',       subtitle: 'Overview of your job search' },
  '/applications':    { title: 'Applications',    subtitle: 'All your job applications' },
  '/applications/new':{ title: 'Add Application', subtitle: 'Log a new job application' },
  '/analytics':       { title: 'Analytics',       subtitle: 'Insights and trends' },
};

function Navbar() {
  const location = useLocation();
  const { applications } = useAppContext();
  const { theme, setTheme } = useTheme();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pathKey = Object.keys(PAGE_TITLES).find((key) =>
    location.pathname.startsWith(key)
  );
  const pageInfo = PAGE_TITLES[pathKey] || { title: 'Smart Job Tracker', subtitle: '' };
  const totalApps = applications.length;

  // Close dropdown when clicking anywhere outside it
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>{pageInfo.title}</h2>
        {pageInfo.subtitle && <p>{pageInfo.subtitle}</p>}
      </div>

      <div className="navbar-right">
        {/* Theme Segmented Control */}
        <div className="theme-toggle">
          <button 
            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            title="Light Mode"
            aria-label="Light Mode"
          >☀️</button>
          <button 
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            title="Dark Mode"
            aria-label="Dark Mode"
          >🌙</button>
          <button 
            className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
            onClick={() => setTheme('system')}
            title="System Preference"
            aria-label="System Preference"
          >💻</button>
        </div>

        <span className="nav-badge">{totalApps} Applications</span>

        {/* Clickable profile avatar with dropdown */}
        <div className="nav-avatar-wrap" ref={dropdownRef}>
          <div
            className="nav-avatar"
            title="Profile"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Open profile menu"
            aria-expanded={dropdownOpen}
          >
            S
          </div>

          {/* Dropdown menu — visible only when avatar is clicked */}
          {dropdownOpen && (
            <div className="nav-dropdown">
              <div className="nav-dropdown-header">
                <div className="nav-dropdown-name">Student User</div>
                <div className="nav-dropdown-email">student@college.edu</div>
              </div>
              <div className="nav-dropdown-divider" />
              <button className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                👤 Profile
              </button>
              <button className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                ⚙️ Settings
              </button>
              <div className="nav-dropdown-divider" />
              <button
                className="nav-dropdown-item danger"
                onClick={() => {
                  localStorage.removeItem('job_applications_v2');
                  window.location.reload();
                }}
              >
                🗑️ Reset All Data
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
