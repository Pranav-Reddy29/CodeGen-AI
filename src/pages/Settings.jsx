import React, { useState, useEffect } from 'react';
import { 
  Settings, User, Crown, Code2, Bell, ShieldCheck, Save, RotateCcw, 
  Eye, EyeOff, Trash2, Download, Cloud, Database, Key, LogOut,
  CheckCircle, AlertCircle, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { authAPI } from '../services/api';

function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const { projects } = useProjects();
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  
  const [settings, setSettings] = useState({
    defaultLanguage: 'JavaScript',
    defaultFramework: 'React',
    includeComments: true,
    autoSaveProjects: true,
    browserNotifications: true,
    weeklyDigest: true,
    analytics: true,
    shareUsageData: false
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('codegen-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('codegen-settings', JSON.stringify(settings));
    showMessage('success', 'Settings saved successfully!');
  };

  const resetSettings = () => {
    const defaultSettings = {
      defaultLanguage: 'JavaScript',
      defaultFramework: 'React',
      includeComments: true,
      autoSaveProjects: true,
      browserNotifications: true,
      weeklyDigest: true,
      analytics: true,
      shareUsageData: false
    };
    setSettings(defaultSettings);
    localStorage.setItem('codegen-settings', JSON.stringify(defaultSettings));
    showMessage('success', 'Settings reset to defaults!');
  };

  const updateProfile = async () => {
    if (!profileData.name.trim()) {
      showMessage('error', 'Name is required');
      return;
    }

    setIsLoading(true);
    try {
      // Call backend API to update profile
      const response = await authAPI.updateProfile({ name: profileData.name });
      if (response && response.user) {
        await updateUser({ ...user, name: response.user.name });
        showMessage('success', 'Profile updated successfully!');
      } else {
        showMessage('error', 'Failed to update profile');
      }
    } catch (error) {
      showMessage('error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showMessage('error', 'All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'New password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you'd call an API here
      setTimeout(() => {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showMessage('success', 'Password changed successfully!');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      showMessage('error', 'Failed to change password');
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const exportData = {
      user: user,
      projects: projects,
      settings: settings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codegen-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportModal(false);
    showMessage('success', 'Data exported successfully!');
  };

  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd call an API here
      setTimeout(() => {
        logout();
        showMessage('success', 'Account deleted successfully');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      showMessage('error', 'Failed to delete account');
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Save All Changes should update profile and settings
  const saveAllChanges = async () => {
    await updateProfile();
    saveSettings();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#1e1b4b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#1e1b4b] py-12 px-4 animate-fade-in-up">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-blue-500 bg-clip-text text-transparent flex items-center justify-center gap-2 mb-2">
            <Settings className="w-8 h-8 text-fuchsia-400 animate-pulse" /> Settings
          </h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-900/20 border border-green-700 text-green-300' 
              : 'bg-red-900/20 border border-red-700 text-red-300'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
            <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <div className="bg-[#23232a] rounded-xl p-6 border border-purple-800 animate-pop-fade">
              <h2 className="text-lg font-bold mb-4 text-fuchsia-400 flex items-center gap-2">
                <User className="w-6 h-6" /> Profile Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                  <input 
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                  <input 
                    type="email"
                    value={profileData.email}
                    className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 text-white opacity-50 cursor-not-allowed"
                    readOnly
                  />
                  <span className="text-xs text-gray-500 mt-1">Email cannot be changed at this time</span>
                </div>
                <button
                  onClick={updateProfile}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 hover:scale-105 hover:from-fuchsia-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-[#23232a] rounded-xl p-6 border border-purple-800 animate-pop-fade">
              <h2 className="text-lg font-bold mb-4 text-red-400 flex items-center gap-2">
                <Key className="w-6 h-6" /> Change Password
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
                      placeholder="Enter current password"
                    />
                    <button
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
                      placeholder="Enter new password"
                    />
                    <button
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
                      placeholder="Confirm new password"
                    />
                    <button
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={changePassword}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 hover:scale-105 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>

            {/* Code Generation Preferences */}
            <div className="bg-[#23232a] rounded-xl p-6 border border-purple-800 animate-pop-fade">
              <h2 className="text-lg font-bold mb-4 text-blue-400 flex items-center gap-2">
                <Code2 className="w-6 h-6" /> Code Generation Preferences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Default Language</label>
                  <select 
                    value={settings.defaultLanguage}
                    onChange={(e) => setSettings({...settings, defaultLanguage: e.target.value})}
                    className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Default Framework</label>
                  <select 
                    value={settings.defaultFramework}
                    onChange={(e) => setSettings({...settings, defaultFramework: e.target.value})}
                    className="w-full bg-[#18181b] border border-purple-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-200"
                  >
                    <option value="React">React</option>
                    <option value="Next.js">Next.js</option>
                    <option value="Vue.js">Vue.js</option>
                    <option value="Angular">Angular</option>
                    <option value="Express">Express</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-gray-300 text-sm">
                    <input 
                      type="checkbox" 
                      checked={settings.includeComments}
                      onChange={(e) => setSettings({...settings, includeComments: e.target.checked})}
                      className="accent-fuchsia-500" 
                    />
                    Include Comments in Generated Code
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 text-sm">
                    <input 
                      type="checkbox" 
                      checked={settings.autoSaveProjects}
                      onChange={(e) => setSettings({...settings, autoSaveProjects: e.target.checked})}
                      className="accent-fuchsia-500" 
                    />
                    Auto-save Projects
                  </label>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-[#23232a] rounded-xl p-6 border border-purple-800 animate-pop-fade">
              <h2 className="text-lg font-bold mb-4 text-yellow-400 flex items-center gap-2">
                <Bell className="w-6 h-6" /> Notifications
              </h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-300 text-sm">
                  <input 
                    type="checkbox" 
                    checked={settings.browserNotifications}
                    onChange={(e) => setSettings({...settings, browserNotifications: e.target.checked})}
                    className="accent-fuchsia-500" 
                  />
                  Browser Notifications
                </label>
                <label className="flex items-center gap-2 text-gray-300 text-sm">
                  <input 
                    type="checkbox" 
                    checked={settings.weeklyDigest}
                    onChange={(e) => setSettings({...settings, weeklyDigest: e.target.checked})}
                    className="accent-fuchsia-500" 
                  />
                  Weekly Digest Email
                </label>
              </div>
            </div>

            {/* Privacy & Data */}
            <div className="bg-[#23232a] rounded-xl p-6 border border-purple-800 animate-pop-fade">
              <h2 className="text-lg font-bold mb-4 text-pink-400 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" /> Privacy & Data
              </h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-300 text-sm">
                  <input 
                    type="checkbox" 
                    checked={settings.analytics}
                    onChange={(e) => setSettings({...settings, analytics: e.target.checked})}
                    className="accent-fuchsia-500" 
                  />
                  Allow Analytics
                </label>
                <label className="flex items-center gap-2 text-gray-300 text-sm">
                  <input 
                    type="checkbox" 
                    checked={settings.shareUsageData}
                    onChange={(e) => setSettings({...settings, shareUsageData: e.target.checked})}
                    className="accent-fuchsia-500" 
                  />
                  Share Usage Data for Improvements
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Plan */}
            <div className="bg-[#23232a] rounded-xl p-6 border border-purple-800 animate-pop-fade">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-7 h-7 text-yellow-400" />
                <div>
                  <div className="font-bold text-white">Account Plan</div>
                  <div className="text-sm text-gray-400">Your current subscription</div>
                </div>
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white text-xs font-semibold mb-4">Pro Plan</span>
              <div className="text-xs text-gray-400 space-y-1">
                <div>✓ Unlimited Projects</div>
                <div>✓ Cloud Sync</div>
                <div>✓ Priority Support</div>
                <div>✓ Advanced AI Models</div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-[#23232a] rounded-xl p-6 border border-purple-800 animate-pop-fade">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" /> Account Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Projects:</span>
                  <span className="text-white font-semibold">{projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Member Since:</span>
                  <span className="text-white font-semibold">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Login:</span>
                  <span className="text-white font-semibold">Today</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#23232a] rounded-xl p-6 border border-purple-800 animate-pop-fade">
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="w-full flex items-center gap-2 bg-[#18181b] text-gray-300 px-4 py-2 rounded-lg border border-purple-700 hover:bg-purple-900/60 hover:border-fuchsia-500 transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center gap-2 bg-red-900/20 text-red-400 px-4 py-2 rounded-lg border border-red-700 hover:bg-red-900/40 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 bg-[#18181b] text-gray-300 px-4 py-2 rounded-lg border border-purple-700 hover:bg-purple-900/60 hover:border-fuchsia-500 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save/Reset Buttons */}
        <div className="flex gap-4 justify-end mt-8">
          <button
            onClick={resetSettings}
            className="bg-[#23232a] text-white px-6 py-3 rounded-lg font-semibold border border-purple-700 hover:bg-purple-900/60 hover:border-fuchsia-500 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button
            onClick={saveAllChanges}
            className="bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow transition-all duration-200 hover:scale-105 hover:from-fuchsia-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save All Changes
          </button>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#23232a] rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-400" />
                Export Your Data
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                This will export all your projects, settings, and account data as a JSON file.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={exportData}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                >
                  Export
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-6 py-2 bg-[#18181b] text-gray-300 rounded-lg border border-purple-700 hover:bg-purple-900/60 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#23232a] rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Delete Account
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                This action cannot be undone. All your projects and data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={deleteAccount}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Deleting...' : 'Delete Account'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 bg-[#18181b] text-gray-300 rounded-lg border border-purple-700 hover:bg-purple-900/60 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage; 