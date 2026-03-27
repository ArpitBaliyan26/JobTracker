// Sidebar.jsx – Left navigation panel with links to all pages
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Navigation items: icon (emoji), label, and route path
const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '📋', label: 'Applications', path: '/applications' },
  { icon: '📈', label: 'Analytics', path: '/analytics' },
];

function Sidebar() {
  const location = useLocation();
  const isBookmarksActive = location.pathname === '/applications' && location.search.includes('tab=bookmarks');

  return (
    <aside className="sidebar">
      {/* Brand / Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">💼</div>
        <div className="sidebar-logo-text">
          JobTracker
          <span>Smart Dashboard</span>
        </div>
      </div>

      {/* Main nav links */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>

        {NAV_ITEMS.map((item) => {
          // If it's the generic applications route, it's only active if bookmarks is NOT active
          const isItemActive = location.pathname === item.path && !(item.path === '/applications' && isBookmarksActive);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isItemActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        <div className="nav-section-label">Quick Actions</div>

        {/* Bookmarks link styled as a nav item */}
        <Link
          to="/applications?tab=bookmarks"
          className={`sidebar-link ${isBookmarksActive ? 'active' : ''}`}
        >
          <span className="nav-icon">🔖</span>
          Bookmarks
        </Link>
      </nav>

      {/* Add new application button at the bottom */}
      <div className="sidebar-footer">
        <Link to="/applications/new" className="sidebar-add-btn">
          <span>＋</span> Add Application
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
