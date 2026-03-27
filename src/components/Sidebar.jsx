// Sidebar.jsx – Left navigation panel with links to all pages
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Sidebar.css';

// Navigation items: icon (emoji), label, and route path
const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '📋', label: 'Applications', path: '/applications' },
  { icon: '📈', label: 'Analytics', path: '/analytics' },
];

function Sidebar() {
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

        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div className="nav-section-label">Quick Actions</div>

        {/* Bookmarks link styled as a nav item */}
        <NavLink
          to="/applications?tab=bookmarks"
          className="sidebar-link"
        >
          <span className="nav-icon">🔖</span>
          Bookmarks
        </NavLink>
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
