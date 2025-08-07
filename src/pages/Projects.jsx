import React, { useState, useRef, useEffect } from 'react';
import { 
  FolderKanban, Plus, Search, Code, Calendar, Tag, MoreVertical, 
  Edit, Trash2, Copy, Eye, Cloud, Download, Share2, Filter,
  FileCode2, CheckCircle2, Clock, X, Save, Globe
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

function Projects() {
  const { projects, isLoading, createProject, updateProject, deleteProject, duplicateProject, searchProjects } = useProjects();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tabsRef = useRef(null);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    language: 'JavaScript',
    code: '',
    tags: []
  });

  const [editProject, setEditProject] = useState({
    name: '',
    description: '',
    language: 'JavaScript',
    code: '',
    tags: []
  });

  const filteredProjects = searchProjects(searchQuery).filter(project => 
    filterLanguage === 'all' || project.language === filterLanguage
  );

  const getProjectsByTab = () => {
    switch (activeTab) {
      case 'recent':
        return filteredProjects.slice(0, 6); // Show only recent 6 projects
      case 'favorites':
        return filteredProjects.filter(project => project.tags?.includes('favorite'));
      case 'generated':
        return filteredProjects.filter(project => project.tags?.includes('Generated'));
      default:
        return filteredProjects;
    }
  };

  const projectsToShow = getProjectsByTab();

  const languages = ['all', ...Array.from(new Set(projects.map(p => p.language)))];

  // Handle scroll indicators for tabs (mobile only)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkScrollIndicators = () => {
      if (tabsRef.current && isMobile) {
        const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
        setShowLeftIndicator(scrollLeft > 0);
        setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    checkMobile();
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      checkScrollIndicators();
      // Only add scroll listeners on mobile
      if (isMobile) {
        tabsElement.addEventListener('scroll', checkScrollIndicators);
        window.addEventListener('resize', checkScrollIndicators);
        
        return () => {
          tabsElement.removeEventListener('scroll', checkScrollIndicators);
          window.removeEventListener('resize', checkScrollIndicators);
        };
      }
    }
  }, [isMobile]);

  // Handle resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreateProject = async () => {
    if (!newProject.name.trim() || !newProject.code.trim()) return;
    
    const created = await createProject(newProject);
    if (created) {
      setShowCreateModal(false);
      setNewProject({ name: '', description: '', language: 'JavaScript', code: '', tags: [] });
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject || !editProject.name.trim() || !editProject.code.trim()) return;
    
    const updated = await updateProject(editingProject.id, editProject);
    if (updated) {
      setShowEditModal(false);
      setEditingProject(null);
      setEditProject({ name: '', description: '', language: 'JavaScript', code: '', tags: [] });
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
      setOpenDropdown(null);
    }
  };

  const handleDuplicateProject = async (projectId) => {
    await duplicateProject(projectId);
    setOpenDropdown(null);
  };

  const handleToggleFavorite = async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const updatedTags = project.tags || [];
    const isFavorite = updatedTags.includes('favorite');
    
    if (isFavorite) {
      // Remove favorite tag
      const newTags = updatedTags.filter(tag => tag !== 'favorite');
      await updateProject(projectId, { tags: newTags });
    } else {
      // Add favorite tag
      const newTags = [...updatedTags, 'favorite'];
      await updateProject(projectId, { tags: newTags });
    }
    setOpenDropdown(null);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setEditProject({
      name: project.name,
      description: project.description,
      language: project.language,
      code: project.code,
      tags: project.tags
    });
    setShowEditModal(true);
    setOpenDropdown(null);
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
    setOpenDropdown(null);
  };

  const toggleDropdown = (projectId) => {
    setOpenDropdown(openDropdown === projectId ? null : projectId);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': 'text-yellow-400',
      'Python': 'text-blue-400',
      'Java': 'text-red-400',
      'C++': 'text-purple-400',
      'TypeScript': 'text-blue-500',
      'React': 'text-cyan-400',
      'Node.js': 'text-green-400'
    };
    return colors[language] || 'text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#1e1b4b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#1e1b4b] py-12 px-4 animate-fade-in-up" onClick={closeDropdown}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <FolderKanban className="w-8 h-8 text-fuchsia-400" />
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-blue-500 bg-clip-text text-transparent">
              My Projects
            </h1>
            <div className="flex items-center gap-2 bg-[#23232a] px-3 py-1 rounded-lg border border-purple-700">
              <Cloud className="w-4 h-4 text-fuchsia-400" />
              <span className="text-sm text-gray-300">Cloud Sync</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:from-fuchsia-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
                 </div>

         {/* Tabbed Interface */}
         <div className="flex justify-center mb-8">
           <div className="bg-[#23232a] rounded-xl p-1 border border-purple-700 w-full max-w-md md:max-w-none relative">
             {/* Scroll Indicators - Only on Mobile */}
             {showLeftIndicator && isMobile && (
               <div className="absolute left-0 top-0 bottom-0 w-8 scroll-indicator-left pointer-events-none z-10 md:hidden"></div>
             )}
             {showRightIndicator && isMobile && (
               <div className="absolute right-0 top-0 bottom-0 w-8 scroll-indicator-right pointer-events-none z-10 md:hidden"></div>
             )}
             
             {/* Mobile: Scrollable tabs, Desktop: Centered tabs */}
             <div className="flex md:justify-center overflow-x-auto md:overflow-visible hide-scrollbar scroll-smooth" ref={tabsRef}>
               {[
                 { id: 'all', label: 'All Projects', icon: '📁' },
                 { id: 'recent', label: 'Recent', icon: '🕒' },
                 { id: 'favorites', label: 'Favorites', icon: '⭐' },
                 { id: 'generated', label: 'Generated', icon: '🤖' }
               ].map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center gap-2 px-3 md:px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                     activeTab === tab.id
                       ? 'bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white shadow-lg'
                       : 'text-gray-300 hover:text-white hover:bg-purple-900/40'
                   }`}
                 >
                   <span className="text-lg">{tab.icon}</span>
                   <span className="text-sm md:text-base">{tab.label}</span>
                 </button>
               ))}
             </div>
             
             {/* Scroll Hint - Only on Mobile */}
             <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 scroll-hint md:hidden">
               <div className="flex items-center gap-1">
                 <span>←</span>
                 <span>Scroll</span>
                 <span>→</span>
               </div>
             </div>
           </div>
         </div>

         {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#23232a] border border-purple-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="bg-[#23232a] border border-purple-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang === 'all' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>
        </div>

                 {/* Projects Grid */}
         {projectsToShow.length === 0 ? (
          <div className="text-center py-16">
            <FolderKanban className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No projects found</h3>
                         <p className="text-gray-500 mb-6">
               {activeTab === 'favorites' 
                 ? 'No favorite projects found. Mark projects as favorites to see them here.'
                 : activeTab === 'generated'
                 ? 'No AI-generated projects found. Generate some code to see them here.'
                 : activeTab === 'recent'
                 ? 'No recent projects found.'
                 : searchQuery || filterLanguage !== 'all' 
                 ? 'Try adjusting your search or filter criteria'
                 : 'Create your first project to get started'
               }
             </p>
            {!searchQuery && filterLanguage === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-fuchsia-600 hover:to-blue-600 transition-all duration-200 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Create First Project
              </button>
            )}
          </div>
        ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {projectsToShow.map((project, idx) => (
              <div
                key={project.id}
                className="bg-[#23232a] rounded-xl p-6 border border-purple-800 hover:border-fuchsia-500 transition-all duration-200 hover:scale-105 shadow-lg animate-pop-fade"
                style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
              >
                                 {/* Project Header */}
                 <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center gap-3">
                     <Code className={`w-6 h-6 ${getLanguageColor(project.language)}`} />
                     <div>
                       <div className="flex items-center gap-2">
                         <h3 className="font-semibold text-white text-lg">{project.name}</h3>
                         {project.tags?.includes('favorite') && (
                           <span className="text-yellow-400 text-sm">⭐</span>
                         )}
                       </div>
                       <p className="text-sm text-gray-400">{project.language}</p>
                     </div>
                   </div>
                  
                  <div className="relative">
                    <button 
                      className={`p-1 rounded transition-colors ${
                        openDropdown === project.id 
                          ? 'bg-purple-900/60 text-fuchsia-400' 
                          : 'hover:bg-purple-900/60 text-gray-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(project.id);
                      }}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                                         {openDropdown === project.id && (
                       <div className="absolute right-0 top-full mt-2 bg-[#18181b]/95 border border-purple-700/50 rounded-xl shadow-2xl py-2 min-w-[140px] z-10 animate-dropdown-pop backdrop-blur-md">
                         {/* Arrow indicator */}
                         <div className="absolute -top-1 right-3 w-2 h-2 bg-[#18181b]/95 border-l border-t border-purple-700/50 transform rotate-45"></div>
                                                 <button
                           onClick={(e) => {
                             e.stopPropagation();
                             openProjectModal(project);
                           }}
                           className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-fuchsia-900/40 hover:text-white transition-all duration-200 group"
                         >
                           <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                           <span className="font-medium">View</span>
                         </button>
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             openEditModal(project);
                           }}
                           className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-fuchsia-900/40 hover:text-white transition-all duration-200 group"
                         >
                           <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                           <span className="font-medium">Edit</span>
                         </button>
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleDuplicateProject(project.id);
                           }}
                           className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-fuchsia-900/40 hover:text-white transition-all duration-200 group"
                         >
                           <Copy className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                           <span className="font-medium">Duplicate</span>
                         </button>
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleToggleFavorite(project.id);
                           }}
                           className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-all duration-200 group ${
                             project.tags?.includes('favorite')
                               ? 'text-yellow-400 hover:bg-gradient-to-r hover:from-yellow-900/40 hover:to-orange-900/40'
                               : 'text-gray-300 hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-fuchsia-900/40 hover:text-white'
                           }`}
                         >
                           <span className={`text-lg group-hover:scale-110 transition-transform duration-200 ${
                             project.tags?.includes('favorite') ? 'text-yellow-400' : ''
                           }`}>
                             {project.tags?.includes('favorite') ? '⭐' : '☆'}
                           </span>
                           <span className="font-medium">
                             {project.tags?.includes('favorite') ? 'Unfavorite' : 'Favorite'}
                           </span>
                         </button>
                         <div className="border-t border-purple-700/50 my-1"></div>
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleDeleteProject(project.id);
                           }}
                           className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-gradient-to-r hover:from-red-900/40 hover:to-pink-900/40 hover:text-red-300 transition-all duration-200 group"
                         >
                           <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                           <span className="font-medium">Delete</span>
                         </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {project.description || 'No description provided'}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-900/40 text-purple-300 text-xs rounded-full border border-purple-700"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Project Footer */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                                         {formatDate(project.updated_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    <span>Cloud</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#23232a] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Create New Project</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-purple-900/60 rounded transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
                    placeholder="Enter project name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
                    placeholder="Enter project description"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Language</label>
                  <select
                    value={newProject.language}
                    onChange={(e) => setNewProject({...newProject, language: e.target.value})}
                    className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Code</label>
                  <textarea
                    value={newProject.code}
                    onChange={(e) => setNewProject({...newProject, code: e.target.value})}
                    className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200 font-mono text-sm"
                    placeholder="Enter your code here..."
                    rows="10"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateProject}
                  className="flex-1 bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-fuchsia-600 hover:to-blue-600 transition-all duration-200"
                >
                  Create Project
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-[#18181b] text-gray-300 rounded-lg border border-purple-700 hover:bg-purple-900/60 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#23232a] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Edit Project</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-purple-900/60 rounded transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Project Name</label>
                  <input
                    type="text"
                    value={editProject.name}
                    onChange={(e) => setEditProject({...editProject, name: e.target.value})}
                    className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
                    placeholder="Enter project name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Description</label>
                  <textarea
                    value={editProject.description}
                    onChange={(e) => setEditProject({...editProject, description: e.target.value})}
                    className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
                    placeholder="Enter project description"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Language</label>
                  <select
                    value={editProject.language}
                    onChange={(e) => setEditProject({...editProject, language: e.target.value})}
                    className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Code</label>
                  <textarea
                    value={editProject.code}
                    onChange={(e) => setEditProject({...editProject, code: e.target.value})}
                    className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200 font-mono text-sm"
                    placeholder="Enter your code here..."
                    rows="10"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateProject}
                  className="flex-1 bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-fuchsia-600 hover:to-blue-600 transition-all duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 bg-[#18181b] text-gray-300 rounded-lg border border-purple-700 hover:bg-purple-900/60 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Project Modal */}
        {showProjectModal && selectedProject && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#23232a] rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Code className={`w-6 h-6 ${getLanguageColor(selectedProject.language)}`} />
                  <h2 className="text-xl font-semibold text-white">{selectedProject.name}</h2>
                </div>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="p-1 hover:bg-purple-900/60 rounded transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300">{selectedProject.description || 'No description provided'}</p>
                </div>
                
                {selectedProject.tags && selectedProject.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-900/40 text-purple-300 text-sm rounded-full border border-purple-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Code</h3>
                  <div className="bg-[#18181b] border border-purple-700 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-white font-mono text-sm whitespace-pre-wrap">
                      {selectedProject.code}
                    </pre>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>Created: {formatDate(selectedProject.created_at)}</span>
                    <span>Updated: {formatDate(selectedProject.updated_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Synced to Cloud</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowProjectModal(false);
                    openEditModal(selectedProject);
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-fuchsia-600 hover:to-blue-600 transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                  Edit Project
                </button>
                <button
                  onClick={() => handleDuplicateProject(selectedProject.id)}
                  className="flex items-center gap-2 bg-[#18181b] text-gray-300 px-6 py-3 rounded-lg border border-purple-700 hover:bg-purple-900/60 transition-all duration-200"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="px-6 py-3 bg-[#18181b] text-gray-300 rounded-lg border border-purple-700 hover:bg-purple-900/60 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects; 