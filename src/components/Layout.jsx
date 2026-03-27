// Layout.jsx – Shared wrapper that includes the Sidebar, Navbar, and page content.
// Every page is rendered inside <Outlet /> (from React Router).
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
};

const mainStyle = {
  marginLeft: 'var(--sidebar-width)',
  marginTop: 'var(--navbar-height)',
  flex: 1,
  padding: '24px',
  overflowY: 'auto',
  width: '100%',
};

function Layout() {
  return (
    <div style={layoutStyle}>
      <Sidebar />
      <Navbar />
      {/* Outlet renders whichever page matches the current URL */}
      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
