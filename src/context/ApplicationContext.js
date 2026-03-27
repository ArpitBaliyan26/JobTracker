// ApplicationContext.js – Provides job application state to the entire app.
// Any component can access the data without prop drilling using useContext.
import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateDynamicSeedData } from '../utils/helpers';

// 1. Create the context (starts as null; the Provider fills it in)
const ApplicationContext = createContext(null);

/**
 * ApplicationProvider wraps the app and gives all children access to
 * the applications array and CRUD functions.
 */
export function ApplicationProvider({ children }) {
  // Inline useLocalStorage logic here:
  const [applications, setApplications] = useState(() => {
    try {
      const item = window.localStorage.getItem('job_applications_v2');
      if (item) return JSON.parse(item);
      return generateDynamicSeedData();
    } catch (error) {
      console.error('LocalStorage read error:', error);
      return generateDynamicSeedData();
    }
  });

  // Custom setter that also saves to localStorage
  const setAppsWithStorage = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(applications) : value;
      setApplications(valueToStore);
      window.localStorage.setItem('job_applications_v2', JSON.stringify(valueToStore));
    } catch (error) {
      console.error('LocalStorage write error:', error);
    }
  };

  // Add a new application
  const addApplication = (formData) => {
    const newApp = { ...formData, id: uuidv4() };
    setAppsWithStorage((prev) => [newApp, ...prev]);
    return newApp;
  };

  // Update an existing application by its ID
  const updateApplication = (id, updatedData) => {
    setAppsWithStorage((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updatedData } : app))
    );
  };

  // Delete an application by ID
  const deleteApplication = (id) => {
    setAppsWithStorage((prev) => prev.filter((app) => app.id !== id));
  };

  // Toggle the bookmark flag on a specific application
  const toggleBookmark = (id) => {
    setAppsWithStorage((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, bookmarked: !app.bookmarked } : app
      )
    );
  };

  const appData = {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    toggleBookmark
  };

  return (
    <ApplicationContext.Provider value={appData}>
      {children}
    </ApplicationContext.Provider>
  );
}

/**
 * useAppContext – convenience hook so components don't need to import both
 * useContext and ApplicationContext every time.
 * Usage: const { applications, addApplication } = useAppContext();
 */
export function useAppContext() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useAppContext must be used inside ApplicationProvider');
  }
  return context;
}
