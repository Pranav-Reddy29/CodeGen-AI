import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { projectsAPI } from '../services/api';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load projects from API when user changes
  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const projects = await projectsAPI.getAll();
      setProjects(projects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData) => {
    if (!user) return null;
    
    setIsLoading(true);
    
    try {
      const newProject = await projectsAPI.create(projectData);
      setProjects(prevProjects => [newProject, ...prevProjects]);
      setIsLoading(false);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const updateProject = async (projectId, updates) => {
    if (!user) return null;
    
    setIsLoading(true);
    
    try {
      const updatedProject = await projectsAPI.update(projectId, updates);
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === projectId ? updatedProject : project
        )
      );
      setIsLoading(false);
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const deleteProject = async (projectId) => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      await projectsAPI.delete(projectId);
      setProjects(prevProjects => 
        prevProjects.filter(project => project.id !== projectId)
      );
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const duplicateProject = async (projectId) => {
    if (!user) return null;
    
    const projectToDuplicate = projects.find(p => p.id === projectId);
    if (!projectToDuplicate) return null;
    
    const duplicatedProjectData = {
      ...projectToDuplicate,
      name: `${projectToDuplicate.name} (Copy)`,
      tags: [...(projectToDuplicate.tags || []), 'duplicated']
    };
    
    delete duplicatedProjectData.id;
    delete duplicatedProjectData.created_at;
    delete duplicatedProjectData.updated_at;
    
    try {
      const duplicatedProject = await createProject(duplicatedProjectData);
      return duplicatedProject;
    } catch (error) {
      console.error('Error duplicating project:', error);
      throw error;
    }
  };

  const searchProjects = (query) => {
    if (!query.trim()) return projects;
    
    const lowercaseQuery = query.toLowerCase();
    return projects.filter(project => 
      project.name.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.language.toLowerCase().includes(lowercaseQuery) ||
      project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getProjectById = (projectId) => {
    return projects.find(project => project.id === projectId);
  };

  const value = {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    searchProjects,
    getProjectById,
    loadProjects
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}; 