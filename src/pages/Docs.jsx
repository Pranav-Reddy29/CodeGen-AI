import React, { useState, useRef, useEffect } from 'react';
import { 
  BookText, BookOpenCheck, Layers, Lightbulb, FileText, 
  Code, Zap, Download, Cloud, CheckCircle, ArrowRight,
  Terminal, FileCode, Settings, Globe, Sparkles
} from 'lucide-react';

const tabs = [
  { name: 'Getting Started', icon: <BookOpenCheck className="w-5 h-5 mr-1" /> },
  { name: 'Project Types', icon: <Layers className="w-5 h-5 mr-1" /> },
  { name: 'Best Practices', icon: <Lightbulb className="w-5 h-5 mr-1" /> },
  { name: 'Examples', icon: <FileText className="w-5 h-5 mr-1" /> },
];

const tabContent = {
  'Getting Started': (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-[#23232a] rounded-xl p-6 text-white border border-purple-800 animate-pop-fade">
        <h3 className="text-xl font-bold mb-4 text-fuchsia-400 flex items-center gap-2">
          <BookOpenCheck className="w-6 h-6" /> Welcome to CodeGen AI
        </h3>
        <p className="text-gray-300 mb-4 text-lg">
          Generate complete, production-ready projects with AI-powered code generation
        </p>
        <p className="text-gray-400 mb-6">
          CodeGen AI is a powerful project generator that creates complete, executable applications based on your descriptions. Unlike simple code snippet generators, our platform creates entire project structures with multiple files, proper organization, and all the necessary configuration to run immediately.
        </p>
        
        <h4 className="text-lg font-semibold mb-3 text-blue-400">Key Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Complete Project Generation</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Multiple Project Types</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Production Ready</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Download & Execute</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Modern Technologies</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Cloud Sync</span>
          </div>
        </div>
      </div>

      <div className="bg-[#23232a] rounded-xl p-6 text-white border border-purple-800 animate-pop-fade mb-8">
        <div className="bg-yellow-900/80 border-l-4 border-yellow-400 text-yellow-200 px-6 py-4 rounded shadow animate-fade-in text-sm">
          <strong>Note:</strong> The generated projects and code samples shown here are for demonstration purposes only and may not represent a complete, production-ready application. Please review and modify the code as needed for your use case.
        </div>
      </div>
      {/* Quick Setup Guide */}
      <div className="bg-[#23232a] rounded-xl p-6 text-white border border-purple-800 animate-pop-fade">
        <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
          <Terminal className="w-6 h-6" /> Quick Setup Guide
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-fuchsia-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Generate Your Project</h4>
              <p className="text-gray-400 mb-2">Use the project generator to create your application</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Enter a detailed project description</li>
                <li>• Select your preferred project type</li>
                <li>• Click 'Generate Project'</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-fuchsia-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Download Project Files</h4>
              <p className="text-gray-400 mb-2">Download the complete project structure</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Review the generated files</li>
                <li>• Download the project JSON</li>
                <li>• Extract all file contents</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-fuchsia-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Create Local Project</h4>
              <p className="text-gray-400 mb-2">Set up the project on your local machine</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Create a new React project with create-react-app</li>
                <li>• Replace generated files with downloaded content</li>
                <li>• Install dependencies</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-fuchsia-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              4
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Run Your Application</h4>
              <p className="text-gray-400 mb-2">Start developing and customizing</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Run npm start to launch development server</li>
                <li>• Open localhost:3000 in browser</li>
                <li>• Begin customizing and extending the code</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  
  'Project Types': (
    <div className="space-y-6">
      <div className="bg-[#23232a] rounded-xl p-6 text-white border border-purple-800 animate-pop-fade">
        <h3 className="text-xl font-bold mb-6 text-blue-400 flex items-center gap-2">
          <Layers className="w-6 h-6" /> Available Project Types
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* React App */}
          <div className="bg-[#18181b] rounded-lg p-4 border border-purple-700 hover:border-fuchsia-500 transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">react-app</span>
            </div>
            <h4 className="font-semibold text-white mb-2">React App</h4>
            <p className="text-gray-400 text-sm mb-3">Modern React applications with TypeScript and Tailwind CSS</p>
            <div className="space-y-1 mb-4">
              <div className="text-xs text-gray-500">• TypeScript support</div>
              <div className="text-xs text-gray-500">• Tailwind CSS styling</div>
              <div className="text-xs text-gray-500">• Component structure</div>
              <div className="text-xs text-gray-500">• Modern hooks</div>
            </div>
            <div className="bg-[#23232a] rounded p-2 text-xs text-gray-300 font-mono">
              "Create a todo list app with React and TypeScript"
            </div>
          </div>

          {/* Next.js App */}
          <div className="bg-[#18181b] rounded-lg p-4 border border-purple-700 hover:border-fuchsia-500 transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">next.js-app</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Next.js App</h4>
            <p className="text-gray-400 text-sm mb-3">Full-stack Next.js applications with routing and API routes</p>
            <div className="space-y-1 mb-4">
              <div className="text-xs text-gray-500">• Server-side rendering</div>
              <div className="text-xs text-gray-500">• API routes</div>
              <div className="text-xs text-gray-500">• File-based routing</div>
              <div className="text-xs text-gray-500">• Built-in optimization</div>
            </div>
            <div className="bg-[#23232a] rounded p-2 text-xs text-gray-300 font-mono">
              "Build a blog platform with Next.js and dynamic routing"
            </div>
          </div>

          {/* Vue.js App */}
          <div className="bg-[#18181b] rounded-lg p-4 border border-purple-700 hover:border-fuchsia-500 transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">vue.js-app</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Vue.js App</h4>
            <p className="text-gray-400 text-sm mb-3">Vue.js applications with composition API and modern tooling</p>
            <div className="space-y-1 mb-4">
              <div className="text-xs text-gray-500">• Composition API</div>
              <div className="text-xs text-gray-500">• Single file components</div>
              <div className="text-xs text-gray-500">• Reactive data</div>
              <div className="text-xs text-gray-500">• Vue ecosystem</div>
            </div>
            <div className="bg-[#23232a] rounded p-2 text-xs text-gray-300 font-mono">
              "Create a dashboard app with Vue.js and charts"
            </div>
          </div>

          {/* Vanilla JavaScript */}
          <div className="bg-[#18181b] rounded-lg p-4 border border-purple-700 hover:border-fuchsia-500 transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">vanilla-javascript</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Vanilla JavaScript</h4>
            <p className="text-gray-400 text-sm mb-3">Pure JavaScript applications with modern ES6+ features</p>
            <div className="space-y-1 mb-4">
              <div className="text-xs text-gray-500">• ES6+ syntax</div>
              <div className="text-xs text-gray-500">• Module system</div>
              <div className="text-xs text-gray-500">• Clean architecture</div>
              <div className="text-xs text-gray-500">• No framework dependencies</div>
            </div>
            <div className="bg-[#23232a] rounded p-2 text-xs text-gray-300 font-mono">
              "Build a calculator app with vanilla JavaScript"
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  
  'Best Practices': (
    <div className="space-y-6">
      <div className="bg-[#23232a] rounded-xl p-6 text-white border border-purple-800 animate-pop-fade">
        <h3 className="text-xl font-bold mb-6 text-yellow-400 flex items-center gap-2">
          <Lightbulb className="w-6 h-6" /> Writing Effective Prompts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Be Specific */}
          <div className="bg-[#18181b] rounded-lg p-4 border border-purple-700">
            <h4 className="font-semibold text-white mb-2">Be Specific</h4>
            <p className="text-gray-400 text-sm mb-3">Provide detailed requirements including functionality, styling, and user interactions.</p>
            <div className="bg-[#23232a] rounded p-3 text-xs text-gray-300">
              <div className="text-gray-500 mb-1">Example:</div>
              "Instead of 'make a website', try 'create a portfolio website with dark theme, project gallery, and contact form'"
            </div>
          </div>

          {/* Mention Key Features */}
          <div className="bg-[#18181b] rounded-lg p-4 border border-purple-700">
            <h4 className="font-semibold text-white mb-2">Mention Key Features</h4>
            <p className="text-gray-400 text-sm mb-3">List the main features you want in your application.</p>
            <div className="bg-[#23232a] rounded p-3 text-xs text-gray-300">
              <div className="text-gray-500 mb-1">Example:</div>
              "Include user authentication, data persistence, responsive design, animations"
            </div>
          </div>

          {/* Specify Technology Preferences */}
          <div className="bg-[#18181b] rounded-lg p-4 border border-purple-700">
            <h4 className="font-semibold text-white mb-2">Specify Technology Preferences</h4>
            <p className="text-gray-400 text-sm mb-3">Mention if you need specific libraries or patterns.</p>
            <div className="bg-[#23232a] rounded p-3 text-xs text-gray-300">
              <div className="text-gray-500 mb-1">Example:</div>
              "Use React hooks, include routing with React Router, add form validation"
            </div>
          </div>

          {/* Describe User Experience */}
          <div className="bg-[#18181b] rounded-lg p-4 border border-purple-700">
            <h4 className="font-semibold text-white mb-2">Describe User Experience</h4>
            <p className="text-gray-400 text-sm mb-3">Explain how users should interact with your application.</p>
            <div className="bg-[#23232a] rounded p-3 text-xs text-gray-300">
              <div className="text-gray-500 mb-1">Example:</div>
              "Users should be able to drag and drop items, see real-time updates, get visual feedback"
            </div>
          </div>
        </div>
      </div>

      {/* Command Line Setup */}
      <div className="bg-[#23232a] rounded-xl p-6 text-white border border-purple-800 animate-pop-fade">
        <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
          <Terminal className="w-6 h-6" /> Command Line Setup
        </h3>
        <p className="text-gray-400 mb-4">Steps to set up your generated project locally</p>
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              1
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Create New Project</h4>
              <div className="bg-[#18181b] rounded p-2 text-sm text-gray-300 font-mono">
                npx create-react-app my-project --template typescript
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              2
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Navigate to Directory</h4>
              <div className="bg-[#18181b] rounded p-2 text-sm text-gray-300 font-mono">
                cd my-project
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              3
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Replace Generated Files</h4>
              <p className="text-gray-400 text-sm">Copy the downloaded file contents into their respective locations</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              4
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Install Dependencies</h4>
              <div className="bg-[#18181b] rounded p-2 text-sm text-gray-300 font-mono">
                npm install
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              5
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Start Development Server</h4>
              <div className="bg-[#18181b] rounded p-2 text-sm text-gray-300 font-mono">
                npm start
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  
  'Examples': (
    <div className="space-y-6">
      <div className="bg-[#23232a] rounded-xl p-6 text-white border border-purple-800 animate-pop-fade">
        <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
          <FileText className="w-6 h-6" /> Example Project Prompts
        </h3>
        <p className="text-gray-400 mb-6">Real examples of effective prompts and their results</p>
        
        <div className="space-y-6">
          {/* Todo List Application */}
          <div className="bg-[#18181b] rounded-lg p-4 border border-purple-700">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Todo List Application
            </h4>
            <div className="bg-[#23232a] rounded p-3 text-sm text-gray-300 mb-3 font-mono">
              "Create a todo list app with React and TypeScript. It should have the ability to add, edit, delete, and mark tasks as complete. Include local storage persistence, task filtering (all, active, completed), and a modern dark theme with smooth animations. Add a task counter and clear completed functionality."
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-green-400 font-semibold">Generated:</span> Complete React app with TypeScript, local storage, filtering, animations, and responsive design.
            </div>
          </div>

          {/* Weather Dashboard */}
          <div className="bg-[#18181b] rounded-lg p-4 border border-purple-700">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-400" />
              Weather Dashboard
            </h4>
            <div className="bg-[#23232a] rounded p-3 text-sm text-gray-300 mb-3 font-mono">
              "Build a weather dashboard app with React that shows current weather and 5-day forecast. Include location search, geolocation support, weather icons, temperature unit toggle (C/F), and detailed weather information like humidity, wind speed, and UV index. Use a clean, modern interface with weather-appropriate background colors."
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-green-400 font-semibold">Generated:</span> Full weather app with API integration, location services, dynamic theming, and comprehensive weather data display.
            </div>
          </div>

          {/* E-commerce Product Page */}
          <div className="bg-[#18181b] rounded-lg p-4 border border-purple-700">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-purple-400" />
              E-commerce Product Page
            </h4>
            <div className="bg-[#23232a] rounded p-3 text-sm text-gray-300 mb-3 font-mono">
              "Create an e-commerce product page with React. Include product image gallery with zoom, product details, size/color selection, quantity picker, add to cart functionality, customer reviews section, related products, and responsive design. Use a professional, clean design with proper form validation."
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-green-400 font-semibold">Generated:</span> Complete product page with interactive gallery, form handling, state management, and professional e-commerce styling.
            </div>
          </div>

          {/* Portfolio Website */}
          <div className="bg-[#18181b] rounded-lg p-4 border border-purple-700">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Portfolio Website
            </h4>
            <div className="bg-[#23232a] rounded p-3 text-sm text-gray-300 mb-3 font-mono">
              "Build a personal portfolio website with React. Include hero section with animated text, about section, skills showcase with progress bars, project gallery with filtering, contact form with validation, smooth scrolling navigation, and dark/light theme toggle. Make it fully responsive with modern animations and micro-interactions."
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-green-400 font-semibold">Generated:</span> Professional portfolio with animations, theme switching, form handling, and responsive design across all devices.
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

function Docs() {
  const [activeTab, setActiveTab] = useState('Getting Started');
  
  // Scroll detection for indicators
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const tabsRef = useRef(null);

  const handleScroll = () => {
    if (tabsRef.current && isMobile) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftIndicator(scrollLeft > 0);
      setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      handleScroll(); // Initial check
      // Only add scroll listeners on mobile
      if (isMobile) {
        tabsElement.addEventListener('scroll', handleScroll);
        return () => tabsElement.removeEventListener('scroll', handleScroll);
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#1e1b4b] py-12 px-4 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-blue-500 bg-clip-text text-transparent flex items-center justify-center gap-2 mb-2">
            <BookText className="w-8 h-8 text-fuchsia-400 animate-pulse" /> Documentation
          </h1>
          <p className="text-gray-400 text-lg">Learn how to generate complete, executable projects with AI</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#23232a] rounded-xl p-1 border border-purple-700 w-full max-w-md md:max-w-none relative">
            {/* Scroll Indicators - Only on Mobile */}
            {showLeftIndicator && isMobile && (
              <div className="absolute left-0 top-0 bottom-0 w-8 scroll-indicator-left pointer-events-none z-10 md:hidden"></div>
            )}
            {showRightIndicator && isMobile && (
              <div className="absolute right-0 top-0 bottom-0 w-8 scroll-indicator-right pointer-events-none z-10 md:hidden"></div>
            )}
            
            <div className="flex md:justify-center overflow-x-auto md:overflow-visible hide-scrollbar scroll-smooth" ref={tabsRef}>
              {tabs.map(tab => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 px-3 md:px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.name
                      ? 'bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-purple-900/40'
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm md:text-base">{tab.name}</span>
                </button>
              ))}
            </div>
            
            {/* Scroll Hint */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 scroll-hint md:hidden">
              <div className="flex items-center gap-1">
                <span>←</span>
                <span>Scroll</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-pop-fade">
          {tabContent[activeTab]}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:from-fuchsia-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 flex items-center gap-2 mx-auto">
            <Sparkles className="w-5 h-5" />
            Generate Your First Project
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Docs;