// ApplicationContext.js – Provides job application state to the entire app.
// Any component can access the data without prop drilling using useContext.
import React, { createContext, useContext } from 'react';
import useApplications from '../hooks/useApplications';

// 1. Create the context (starts as null; the Provider fills it in)
const ApplicationContext = createContext(null);

/**
 * ApplicationProvider wraps the app and gives all children access to
 * the applications array and CRUD functions.
 */
export function ApplicationProvider({ children }) {
  // All the logic lives in the custom hook
  const appData = useApplications();

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
