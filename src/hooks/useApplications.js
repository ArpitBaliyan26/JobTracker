// useApplications.js – Main CRUD hook for job applications.
// Stores all data in localStorage via the useLocalStorage hook.
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from './useLocalStorage';

import { generateDynamicSeedData } from '../utils/helpers';

function useApplications() {
  // Pass the generator function itself, NOT the result of calling it.
  // useLocalStorage will lazily evaluate it only if no data exists.
  const [applications, setApplications] = useLocalStorage('job_applications_v2', generateDynamicSeedData);

  // Add a new application; we generate a unique ID using uuid
  const addApplication = (formData) => {
    const newApp = { ...formData, id: uuidv4() };
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  // Update an existing application by its ID
  const updateApplication = (id, updatedData) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updatedData } : app))
    );
  };

  // Delete an application by ID
  const deleteApplication = (id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  // Toggle the bookmark flag on a specific application
  const toggleBookmark = (id) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, bookmarked: !app.bookmarked } : app
      )
    );
  };

  return { applications, addApplication, updateApplication, deleteApplication, toggleBookmark };
}

export default useApplications;
