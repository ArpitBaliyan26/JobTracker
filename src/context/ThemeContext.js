import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 1. Initialize state from localStorage, default to 'system'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('job_tracker_theme') || 'system';
  });

  // 2. Side effect: Apply the correct class to <body> and listen for OS changes
  useEffect(() => {
    localStorage.setItem('job_tracker_theme', theme);

    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to physically change the DOM classes
    const applyTheme = () => {
      // Remove any existing theme classes
      root.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        // If system mode, check matchMedia dynamically
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        // Otherwise force light or dark
        root.classList.add(theme);
      }
    };

    // Apply immediately on mount or theme change
    applyTheme();

    // Listener for real-time OS theme toggling (e.g. if user changes Windows settings)
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    // Attach listener
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  // Derived helper variable if any component needs to know the exact active color scheme
  const isDarkMode = 
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
