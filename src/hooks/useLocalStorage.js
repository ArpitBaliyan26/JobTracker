// useLocalStorage.js – Custom hook to persist state in the browser's localStorage.
// Works just like useState, but saves/loads data automatically.
import { useState } from 'react';

function useLocalStorage(key, initialValue) {
  // Try to read the existing value from localStorage first
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) return JSON.parse(item);
      return initialValue instanceof Function ? initialValue() : initialValue;
    } catch (error) {
      console.error('useLocalStorage read error:', error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  // Wrapper around useState's setter that also saves to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function (same API as useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('useLocalStorage write error:', error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
