import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, FolderKanban, BookText, Settings, UserPlus, Bot, Menu, X, LogOut, User, Cloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import ImageOptimizer from './ImageOptimizer';

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { projects } = useProjects();
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5 mr-1" /> },
    { name: 'Generator', path: '/generator', icon: <Sparkles className="w-5 h-5 mr-1" /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban className="w-5 h-5 mr-1" /> },
    { name: 'Docs', path: '/docs', icon: <BookText className="w-5 h-5 mr-1" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 mr-1" /> },
  ];
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-[#18181b] px-4 md:px-6 py-3 shadow-md w-full">
      {/* Left: Logo and Brand */}
      <div className="flex items-center flex-shrink-0">
        <div className="flex items-center">
          <Bot className="w-8 h-8 text-fuchsia-400 mr-2" />
          <span className="font-extrabold text-xl text-white tracking-wide">CodeGen AI</span>
        </div>
      </div>
      {/* Center: Nav Links (hidden on mobile) */}
      <div className="hidden md:flex flex-1 justify-center">
        <div className="flex gap-2 md:gap-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-200 text-base relative
                ${location.pathname === item.path ? 'text-white' : 'text-gray-300 hover:text-white'}
              `}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              {item.name}
              <span
                className={`absolute left-2 right-2 -bottom-1 h-0.5 rounded transition-all duration-200
                  ${location.pathname === item.path ? 'bg-gradient-to-r from-fuchsia-500 to-blue-500 w-[90%] opacity-100' : 'bg-gradient-to-r from-fuchsia-500 to-blue-500 w-0 opacity-0 group-hover:w-[90%] group-hover:opacity-100'}`}
              />
            </Link>
          ))}
        </div>
      </div>
      {/* Right: User Menu or Sign Up */}
      <div className="flex items-center gap-2">
                 {user ? (
           <div className="flex items-center gap-2">
             <div className="hidden md:flex items-center gap-2 bg-[#23232a] px-3 py-2 rounded-lg border border-purple-700">
               <User className="w-4 h-4 text-fuchsia-400" />
               <span className="text-sm text-gray-300">{user.name || user.email}</span>
             </div>
             <div className="hidden md:flex items-center gap-2 bg-[#23232a] px-3 py-2 rounded-lg border border-purple-700">
               <Cloud className="w-4 h-4 text-green-400" />
               <span className="text-sm text-gray-300">{projects.length} Projects</span>
             </div>
             <button
               onClick={logout}
               className="flex items-center bg-[#23232a] text-white px-3 py-2 rounded-lg font-semibold border border-purple-700 hover:bg-purple-900/60 hover:border-fuchsia-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
             >
               <LogOut className="w-4 h-4 mr-1" />
               <span className="hidden md:inline">Logout</span>
             </button>
           </div>
        ) : (
          <Link
            to="/signup"
            className="flex items-center bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 transform hover:scale-105 hover:from-fuchsia-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            onClick={() => setMobileOpen(false)}
          >
            <UserPlus className="w-5 h-5 mr-1" />
            Sign Up
          </Link>
        )}
        {/* Hamburger menu for mobile */}
        <button
          className="ml-2 md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-7 h-7 text-white" /> : <Menu className="w-7 h-7 text-white" />}
        </button>
      </div>
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-[#18181b] shadow-lg flex flex-col p-6 animate-slide-in">
            <button
              className="self-end mb-6 p-2 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-7 h-7 text-white" />
            </button>
            <div className="flex flex-col gap-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors duration-200 text-base ${location.pathname === item.path ? 'bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white shadow' : 'text-gray-300 hover:bg-[#23232a] hover:text-white'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
                         {user ? (
               <>
                 <div className="mt-6 p-3 bg-[#23232a] rounded-lg border border-purple-700">
                   <div className="flex items-center gap-2 mb-2">
                     <User className="w-4 h-4 text-fuchsia-400" />
                     <span className="text-sm text-gray-300">{user.name || user.email}</span>
                   </div>
                   <div className="flex items-center gap-2 mb-3">
                     <Cloud className="w-4 h-4 text-green-400" />
                     <span className="text-sm text-gray-300">{projects.length} Projects Synced</span>
                   </div>
                   <button
                     onClick={() => {
                       logout();
                       setMobileOpen(false);
                     }}
                     className="flex items-center w-full bg-[#18181b] text-white px-3 py-2 rounded-lg font-semibold border border-purple-700 hover:bg-purple-900/60 hover:border-fuchsia-500 transition-all duration-200"
                   >
                     <LogOut className="w-4 h-4 mr-1" />
                     Logout
                   </button>
                 </div>
               </>
            ) : (
              <Link
                to="/signup"
                className="mt-6 flex items-center bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition duration-300"
                onClick={() => setMobileOpen(false)}
              >
                <UserPlus className="w-5 h-5 mr-1" />
                Sign Up
              </Link>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}

export default Navbar; 