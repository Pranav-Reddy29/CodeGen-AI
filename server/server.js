// ==================== SERVER SETUP ====================
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MOCK PASSWORD FUNCTIONS ====================
const mockHashPassword = (password) => `mock-hashed-${password}-${Date.now()}`;
const mockComparePassword = (password, hash) => password === 'password123';

// ==================== CORS CONFIG ====================
// Allow GitHub Pages + localhost origins
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

app.use(express.json());

// ==================== MOCK SUPABASE ====================
const supabase = {
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
    insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
    delete: () => ({ eq: () => ({ data: null, error: null }) })
  })
};

// ==================== AUTH MIDDLEWARE ====================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = { id: decoded.userId || 'local-user-id', name: 'Local User', email: 'local@example.com' };
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// ==================== AUTH ROUTES ====================
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = mockHashPassword(password);

  // Mock user creation
  const user = { id: Date.now().toString(), name, email, password: hashedPassword };

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // Mock validation
  if (password !== 'password123') return res.status(400).json({ error: 'Invalid credentials' });

  const user = { id: 'local-user-id', name: 'Local User', email };
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

  res.json({ user, token });
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  res.json({ user: { ...req.user, name } });
});

// ==================== PROJECT ROUTES ====================
app.get('/api/projects', authenticateToken, async (req, res) => {
  res.json([]); // Mock empty project list
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const project = { id: Date.now().toString(), user_id: req.user.id, name };
  res.status(201).json(project);
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  res.json({ message: 'Project deleted successfully' });
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
