import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Robot eye refs and effect
  const eyeRef = useRef(null);
  const eye2Ref = useRef(null);
  const robotRef = useRef(null);

  useEffect(() => {
    function handleMouseMove(e) {
      if (!robotRef.current || !eyeRef.current || !eye2Ref.current) return;
      const robot = robotRef.current.getBoundingClientRect();
      const eye = eyeRef.current.getBoundingClientRect();
      const eye2 = eye2Ref.current.getBoundingClientRect();
      // Center of each eye
      const eyeCenter = {
        x: eye.left + eye.width / 2,
        y: eye.top + eye.height / 2,
      };
      const eye2Center = {
        x: eye2.left + eye2.width / 2,
        y: eye2.top + eye2.height / 2,
      };
      // Mouse position
      const mouse = { x: e.clientX, y: e.clientY };
      // Calculate angle for each eye
      const getAngle = (center) => Math.atan2(mouse.y - center.y, mouse.x - center.x);
      const angle1 = getAngle(eyeCenter);
      const angle2 = getAngle(eye2Center);
      // Calculate distance from eye center to mouse
      const getDist = (center) => Math.sqrt(Math.pow(mouse.x - center.x, 2) + Math.pow(mouse.y - center.y, 2));
      const dist1 = getDist(eyeCenter);
      const dist2 = getDist(eye2Center);
      // Move eyes (max 8px from center, but less if mouse is close)
      const maxDist = 8;
      const threshold = 30; // px, within which eyes stay mostly centered
      const moveRatio1 = Math.min(dist1 / threshold, 1);
      const moveRatio2 = Math.min(dist2 / threshold, 1);
      eyeRef.current.style.transform = `translate(${Math.cos(angle1) * maxDist * moveRatio1}px, ${Math.sin(angle1) * maxDist * moveRatio1}px)`;
      eye2Ref.current.style.transform = `translate(${Math.cos(angle2) * maxDist * moveRatio2}px, ${Math.sin(angle2) * maxDist * moveRatio2}px)`;
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#1e1b4b] min-h-screen text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center pt-20 pb-12 animate-fade-in-up">
        <span className="mb-4 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-xs font-semibold shadow-lg animate-pulse flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          Powered by Pranav
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-4 bg-gradient-to-r from-fuchsia-500 via-purple-400 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
          A Fast AI. <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Scalable Code.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-8 animate-fade-in">
          Our technology performing fast AI generation and it has guaranteed AI-based code generation. Proof of Quality, its algorithm enables unlimited speeds.
        </p>
        <div className="flex gap-4 mb-8">
          {user ? (
            <>
              <button
                className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 hover:shadow-lg hover:from-purple-600 hover:to-blue-600 transition duration-300"
                onClick={() => navigate('/generator')}
              >
                Start Generating
              </button>
              <button
                className="bg-[#23232a] text-white px-6 py-2 rounded-lg font-semibold border border-purple-700 hover:bg-purple-900/60 hover:border-fuchsia-500 transition duration-300"
                onClick={() => navigate('/projects')}
              >
                View Projects
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 hover:shadow-lg hover:from-purple-600 hover:to-blue-600 transition duration-300"
                onClick={() => navigate('/signup')}
              >
                Get started
              </button>
              <button
                className="bg-[#23232a] text-white px-6 py-2 rounded-lg font-semibold border border-purple-700 hover:bg-purple-900/60 hover:border-fuchsia-500 transition duration-300"
                onClick={() => navigate('/docs')}
              >
                Documentation
              </button>
            </>
          )}
        </div>
        {/* Stats Section - clean, no lighting */}
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {[
            { value: '10M+', label: 'Lines Generated', color: 'text-fuchsia-400' },
            { value: '50K+', label: 'Developers', color: 'text-blue-400' },
            { value: '25+', label: 'Languages', color: 'text-green-400' },
            { value: '99.5%', label: 'Success Rate', color: 'text-yellow-400' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="bg-[#23232a] rounded-xl p-6 min-w-[180px] text-center border border-purple-800 shadow-lg hover:scale-105 hover:border-fuchsia-500 transition duration-300 animate-pop-fade"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className={`text-2xl font-bold ${stat.color} animate-bounce`}>{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Copilot-like Glowing Window Section */}
      <section className="flex justify-center items-center py-16">
        <div className="relative w-full max-w-5xl rounded-3xl p-1 bg-gradient-to-r from-fuchsia-500 via-blue-500 to-purple-500 shadow-2xl animate-glow">
          <div className="rounded-3xl bg-[#18181b] flex flex-row min-h-[400px]">
            {/* Code Editor Area */}
            <div className="flex-1 p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <pre className="bg-[#23232a] rounded-xl p-6 text-sm text-left text-gray-200 font-mono overflow-x-auto shadow-inner min-h-[220px]">
{`export interface RunnerService {
  getById(id: number): Promise<Runner | null>;
}

const runnerService: RunnerService = {
  getById: async (id: number) => {
    return await prisma.runner.findUnique({
      where: { id },
    });
  },
};

export default runnerService;`}
              </pre>
            </div>
            {/* Robot Mascot */}
            <div className="absolute top-6 right-8 z-20" ref={robotRef} style={{ filter: 'drop-shadow(0 0 32px #7c3aed)' }}>
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="45" cy="50" rx="32" ry="30" fill="#23232a" stroke="#7c3aed" strokeWidth="4"/>
                <ellipse cx="45" cy="30" rx="12" ry="8" fill="#7c3aed" opacity="0.3"/>
                {/* Eyes */}
                <ellipse ref={eyeRef} cx="33" cy="52" rx="6" ry="7" fill="#fff"/>
                <ellipse ref={eye2Ref} cx="57" cy="52" rx="6" ry="7" fill="#fff"/>
                {/* Pupils (centered, will move with eyes) */}
                <ellipse cx="33" cy="52" rx="2.5" ry="3" fill="#7c3aed" style={{ pointerEvents: 'none' }}/>
                <ellipse cx="57" cy="52" rx="2.5" ry="3" fill="#7c3aed" style={{ pointerEvents: 'none' }}/>
                {/* Antenna */}
                <rect x="42" y="10" width="6" height="18" rx="3" fill="#7c3aed"/>
                <circle cx="45" cy="8" r="5" fill="#fff" stroke="#7c3aed" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          {/* Glow effect behind window */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-3xl bg-gradient-to-r from-fuchsia-500 via-blue-500 to-purple-500 opacity-30 blur-3xl z-0 pointer-events-none" />
        </div>
        <style>{`
          .animate-glow {
            box-shadow: 0 0 40px 8px #7c3aed55, 0 0 0 4px #23232a;
          }
        `}</style>
      </section>

      {/* Features Section - clean, no lighting */}
      <section className="max-w-5xl mx-auto py-12 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-fuchsia-400 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
          Why Choose <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">CodeGen AI?</span>
        </h2>
        <p className="text-center text-gray-300 mb-10 animate-fade-in">
          Experience the future of code generation with our cutting-edge AI technology
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: '< /> Smart Code Generation', desc: `Generate clean, production-ready code in multiple programming languages with Cohere's advanced AI models.`, color: 'text-fuchsia-400' },
            { title: '⚡ Lightning Fast', desc: 'Get your code generated in seconds, not hours. Optimized for speed and efficiency.', color: 'text-blue-400' },
            { title: '🛡️ Secure & Private', desc: 'Your code and data are protected with enterprise-grade security and privacy measures.', color: 'text-green-400' },
            { title: '🎯 Customizable Output', desc: 'Tailor the generated code to match your coding style and project requirements.', color: 'text-yellow-400' },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="bg-[#23232a] rounded-xl p-6 border border-purple-800 shadow-lg hover:scale-105 hover:shadow-lg hover:border-fuchsia-500 transition duration-300 animate-pop-fade"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className={`font-bold mb-2 ${feature.color}`}>{feature.title}</div>
              <div className="text-gray-300">{feature.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-fuchsia-400 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
          Ready to Generate Your <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">First Code?</span>
        </h2>
        <p className="text-center text-gray-300 mb-6 max-w-xl animate-fade-in">
          Join thousands of developers who are already using CodeGen AI to accelerate their development workflow.
        </p>
        <button
          className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:scale-110 hover:shadow-lg hover:from-purple-600 hover:to-blue-600 transition duration-300 text-lg"
          onClick={() => navigate(user ? '/generator' : '/signup')}
        >
          {user ? 'Start Generating Now' : 'Get Started Now'}
        </button>
      </section>
    </div>
  );
}

export default Home; 