const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:5173', 
    'http://localhost:5173',
    'http://localhost:5000'
  ],
  credentials: true
}));
app.use(express.json());

// Supabase Client (Admin operations) - with fallback for local development
let supabase;
const isSupabaseConfigured = process.env.SUPABASE_URL && 
  process.env.SUPABASE_URL !== 'your-supabase-url' && 
  process.env.SUPABASE_URL.startsWith('http');

if (isSupabaseConfigured) {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    console.log('Supabase client created successfully');
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    supabase = null;
  }
} else {
  console.log('Supabase not configured - using local development mode');
  // Create a mock supabase client for local development
  supabase = {
    from: () => ({
      select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }) }),
      insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) }),
      delete: () => ({ eq: () => ({ data: null, error: null }) })
    })
  };
}

// Debug Supabase connection
console.log('Supabase URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing');
console.log('Supabase Anon Key:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing');

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // For local development without Supabase, create a mock user
    if (!isSupabaseConfigured || !supabase) {
      req.user = {
        id: decoded.userId || 'local-user-id',
        name: 'Local User',
        email: 'local@example.com'
      };
      return next();
    }
    
    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // For local development without Supabase
    if (!isSupabaseConfigured || !supabase) {
      const mockUserId = 'local-user-' + Date.now();
      const token = jwt.sign(
        { userId: mockUserId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        user: {
          id: mockUserId,
          name,
          email
        },
        token
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashedPassword
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return res.status(500).json({ error: 'Failed to create user', details: error.message });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // For local development without Supabase
    if (!isSupabaseConfigured || !supabase) {
      const mockUserId = 'local-user-' + Date.now();
      const token = jwt.sign(
        { userId: mockUserId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return res.json({
        user: {
          id: mockUserId,
          name: 'Local User',
          email
        },
        token
      });
    }

    // Find user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    if (!isSupabaseConfigured || !supabase) {
      // For local development, just return the updated user
      return res.json({
        user: {
          ...req.user,
          name,
        }
      });
    }

    // Update user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .update({ name })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Project Routes
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    // For local development without Supabase
    if (!isSupabaseConfigured || !supabase) {
      return res.json([]);
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }

    res.json(projects || []);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { name, description, language, code, tags } = req.body;

    // For local development without Supabase
    if (!isSupabaseConfigured || !supabase) {
      const mockProject = {
        id: 'local-project-' + Date.now(),
        user_id: req.user.id,
        name,
        description,
        language,
        code,
        tags: tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return res.status(201).json(mockProject);
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: req.user.id,
          name,
          description,
          language,
          code,
          tags: tags || []
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create project' });
    }

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, language, code, tags } = req.body;
    
    // For local development without Supabase
    if (!isSupabaseConfigured || !supabase) {
      const mockProject = {
        id: req.params.id,
        user_id: req.user.id,
        name,
        description,
        language,
        code,
        tags: tags || [],
        updated_at: new Date().toISOString()
      };
      return res.json(mockProject);
    }
    
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        name,
        description,
        language,
        code,
        tags: tags || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    // For local development without Supabase
    if (!isSupabaseConfigured || !supabase) {
      return res.json({ message: 'Project deleted successfully' });
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/projects/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    
    // For local development without Supabase
    if (!isSupabaseConfigured || !supabase) {
      return res.json([]);
    }
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', req.user.id)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,language.ilike.%${query}%`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to search projects' });
    }

    res.json(projects || []);
  } catch (error) {
    console.error('Search projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// AI Code Generation Routes
app.post('/api/generate', authenticateToken, async (req, res) => {
  try {
    const { prompt, language, projectType } = req.body;

    if (!prompt || !language) {
      return res.status(400).json({ error: 'Prompt and language are required' });
    }

    // Choose AI service based on environment (prioritize Cohere)
    let projectFiles;
    
    if (process.env.COHERE_API_KEY) {
      projectFiles = await generateCompleteProjectWithCohere(prompt, language, projectType);
    } else if (process.env.OPENAI_API_KEY) {
      projectFiles = await generateCompleteProjectWithOpenAI(prompt, language, projectType);
    } else if (process.env.ANTHROPIC_API_KEY) {
      projectFiles = await generateCompleteProjectWithAnthropic(prompt, language, projectType);
    } else {
      // Fallback to mock generation for development
      projectFiles = generateMockCompleteProject(prompt, language, projectType);
    }

    res.json({ 
      projectFiles,
      language,
      projectType,
      prompt 
    });
  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

// Complete Project Generation Functions
async function generateCompleteProjectWithOpenAI(prompt, language, projectType) {
  const { Configuration, OpenAIApi } = require('openai');
  
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const openai = new OpenAIApi(configuration);
  
  const systemPrompt = `You are an expert ${language} developer. Generate a COMPLETE, runnable project based on the user's requirements.

Project Type: ${projectType}
Language: ${language}
User Requirement: ${prompt}

IMPORTANT: Generate a COMPLETE project structure with ALL necessary files. Return ONLY a JSON object with this exact structure:

{
  "projectName": "project-name",
  "description": "Brief project description",
  "files": [
    {
      "path": "file/path/name.ext",
      "content": "file content here"
    }
  ],
  "instructions": "Step-by-step instructions to run the project"
}

Requirements:
- Generate ALL necessary files (package.json, main files, config files, etc.)
- Include proper dependencies and scripts
- Make it immediately runnable
- Follow best practices for ${language}
- Include proper error handling
- Make it production-ready
- Only return the JSON, no other text`;
  
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    max_tokens: 4000,
    temperature: 0.3,
  });
  
  try {
    const result = JSON.parse(response.data.choices[0].message.content);
    return result;
  } catch (error) {
    console.error('Failed to parse OpenAI response:', error);
    return generateMockCompleteProject(prompt, language, projectType);
  }
}

async function generateCompleteProjectWithCohere(prompt, language, projectType) {
  const cohere = require('cohere-ai');
  cohere.init(process.env.COHERE_API_KEY);
  
  // Enhanced prompt for complete project generation
  const systemPrompt = `You are an expert ${language} developer. Generate a COMPLETE, runnable project based on the user's requirements.

Project Type: ${projectType}
Language: ${language}
User Requirement: ${prompt}

IMPORTANT: Generate a COMPLETE project structure with ALL necessary files. Return ONLY a JSON object with this exact structure:

{
  "projectName": "project-name",
  "description": "Brief project description",
  "files": [
    {
      "path": "file/path/name.ext",
      "content": "file content here"
    }
  ],
  "instructions": "Step-by-step instructions to run the project"
}

Requirements:
- Generate ALL necessary files (package.json, main files, config files, etc.)
- Include proper dependencies and scripts
- Make it immediately runnable
- Follow best practices for ${language}
- Include proper error handling
- Make it production-ready
- Only return the JSON, no other text or markdown formatting

Generate the complete project:`;
  
  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: systemPrompt,
      max_tokens: 4000,
      temperature: 0.2, // Lower temperature for more consistent structure
      k: 0,
      stop_sequences: ['```', '---', 'END'],
      return_likelihoods: 'NONE',
      num_generations: 1
    });
    
    let generatedContent = response.body.generations[0].text;
    
    // Clean up the response
    generatedContent = generatedContent.trim();
    
    // Remove markdown code blocks if present
    if (generatedContent.startsWith('```')) {
      generatedContent = generatedContent.replace(/^```\w*\n?/, '').replace(/```$/, '');
    }
    
    try {
      const result = JSON.parse(generatedContent);
      return result;
    } catch (error) {
      console.error('Failed to parse Cohere response:', error);
      return generateMockCompleteProject(prompt, language, projectType);
    }
  } catch (error) {
    console.error('Cohere API error:', error);
    return generateMockCompleteProject(prompt, language, projectType);
  }
}

async function generateCompleteProjectWithAnthropic(prompt, language, projectType) {
  const Anthropic = require('@anthropic-ai/sdk');
  
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  
  const systemPrompt = `You are an expert ${language} developer. Generate a COMPLETE, runnable project based on the user's requirements.

Project Type: ${projectType}
Language: ${language}
User Requirement: ${prompt}

IMPORTANT: Generate a COMPLETE project structure with ALL necessary files. Return ONLY a JSON object with this exact structure:

{
  "projectName": "project-name",
  "description": "Brief project description",
  "files": [
    {
      "path": "file/path/name.ext",
      "content": "file content here"
    }
  ],
  "instructions": "Step-by-step instructions to run the project"
}

Requirements:
- Generate ALL necessary files (package.json, main files, config files, etc.)
- Include proper dependencies and scripts
- Make it immediately runnable
- Follow best practices for ${language}
- Include proper error handling
- Make it production-ready
- Only return the JSON, no other text`;
  
  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 4000,
    messages: [
      { role: 'user', content: `${systemPrompt}\n\nUser requirement: ${prompt}` }
    ],
  });
  
  try {
    const result = JSON.parse(response.content[0].text);
    return result;
  } catch (error) {
    console.error('Failed to parse Anthropic response:', error);
    return generateMockCompleteProject(prompt, language, projectType);
  }
}

function generateMockCompleteProject(prompt, language, projectType) {
  // Always return a real, multi-file React project
  const projectName = `${projectType.toLowerCase().replace(/\s+/g, '-')}-project`;
  if (projectType.toLowerCase().includes('react')) {
    return {
      projectName,
      description: `A complete React App project generated based on: ${prompt}`,
      files: [
        {
          path: 'package.json',
          content: `{
  "name": "${projectName}",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}`
        },
        {
          path: 'public/index.html',
          content: `<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id=\"root\"></div>
  </body>
</html>`
        },
        {
          path: 'src/index.js',
          content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
        },
        {
          path: 'src/App.js',
          content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className=\"App\">
      <header className=\"App-header\">
        <h1>Generated React App</h1>
        <p>Based on your prompt: \"${prompt}\"</p>
        <div className=\"project-info\">
          <h2>Project Details</h2>
          <ul>
            <li>Type: React App</li>
            <li>Generated by: CodeGen AI</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;`
        },
        {
          path: 'src/App.css',
          content: `.App {
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.App-header {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.project-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  margin-top: 2rem;
  backdrop-filter: blur(10px);
}

.project-info ul {
  list-style: none;
  padding: 0;
}

.project-info li {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}`
        },
        {
          path: 'README.md',
          content: `# ${projectName}

Generated by CodeGen AI

## Description
React App project based on: ${prompt}

## Installation
\`\`\`bash
npm install
\`\`\`

## Running the Project
\`\`\`bash
npm start
\`\`\`

The app will open on http://localhost:3000
`
        }
      ],
      instructions: `1. Open terminal in the project directory\n2. Run: npm install\n3. Run: npm start\n4. The React app will open automatically in your browser`
    };
  }
  // fallback for other types
  return {
    projectName,
    description: `A complete ${projectType} project generated based on: ${prompt}`,
    files: [
      {
        path: 'README.md',
        content: `# ${projectName}\n\nGenerated by CodeGen AI\n\n## Description\n${projectType} project based on: ${prompt}\n\n## Instructions\nThis is a ${language} project. Please refer to the specific language documentation for setup and running instructions.\n`
      }
    ],
    instructions: `This is a ${language} project. Please refer to the specific language documentation for setup and running instructions.`
  };
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 