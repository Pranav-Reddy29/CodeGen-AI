// ==================== SERVER SETUP ====================
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// ==================== CORS CONFIG ====================
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://localhost:5000',
  'https://pranav-reddy29.github.io'
];

app.use(cors({
  origin: function(origin, callback){
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  credentials: true
}));

// ==================== IN-MEMORY USERS ====================
const users = []; // Store users here for demo

// ==================== AUTH MIDDLEWARE ====================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = users.find(u => u.id === decoded.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// ==================== AUTH ROUTES ====================
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const user = { id: Date.now().toString(), name, email, password }; // simple store
  users.push(user);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  req.user.name = name;
  res.json({ user: req.user });
});

// ==================== PROJECT ROUTES ====================
const projects = [];

app.get('/api/projects', authenticateToken, async (req, res) => {
  const userProjects = projects.filter(p => p.user_id === req.user.id);
  res.json(userProjects);
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const project = { id: Date.now().toString(), user_id: req.user.id, name };
  projects.push(project);
  res.status(201).json(project);
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  const project = projects.find(p => p.id === req.params.id && p.user_id === req.user.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  project.name = req.body.name || project.name;
  res.json(project);
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id && p.user_id === req.user.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });
  projects.splice(index, 1);
  res.status(204).send();
});

// ==================== AI CODE GENERATION ====================
app.post('/api/generate', authenticateToken, async (req, res) => {
  const { prompt, language, projectType } = req.body;
  res.json({
    projectFiles: [{ path: 'README.md', content: `Mock ${projectType} project based on: ${prompt}` }],
    language,
    projectType,
    prompt
  });
});

// ==================== START SERVER ====================
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
