/**
 * storage.js
 * Simple localStorage persistence for projects.
 */
const STORAGE_KEY = 'paintcalc_projects';

export function saveProject(project) {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return projects;
}

export function getProjects() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function deleteProject(id) {
  let projects = getProjects();
  projects = projects.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return projects;
}

export function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}
