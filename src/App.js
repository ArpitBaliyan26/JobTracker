// App.jsx – Root component: sets up React Router and wraps everything in the Context Provider
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context provider (gives all children access to application data)
import { ApplicationProvider } from './context/ApplicationContext';

// Theme provider (handles light/dark/system mode)
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Shared layout (sidebar + navbar)
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ApplicationForm from './pages/ApplicationForm';
import ApplicationDetail from './pages/ApplicationDetail';
import Analytics from './pages/Analytics';

function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    // ApplicationProvider wraps everything so any page can read/write applications
    <ApplicationProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect root "/" to the dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* All pages share the Layout (sidebar + navbar) via nested routes */}
          <Route element={<Layout />}>
            <Route path="/dashboard"               element={<Dashboard />} />
            <Route path="/applications"            element={<Applications />} />
            <Route path="/applications/new"        element={<ApplicationForm />} />
            <Route path="/applications/:id"        element={<ApplicationDetail />} />
            <Route path="/applications/:id/edit"   element={<ApplicationForm />} />
            <Route path="/analytics"               element={<Analytics />} />
          </Route>

          {/* Catch-all: redirect unknown paths to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        {/* react-toastify container – renders toast notifications dynamically styled */}
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          theme={isDarkMode ? 'dark' : 'light'}
          toastStyle={{ fontSize: '13px' }}
        />
      </BrowserRouter>
    </ApplicationProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
