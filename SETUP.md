# CodeGen AI - Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- AI service API key (OpenAI, Cohere, or Anthropic)

## Quick Start

### 1. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd codegen
npm run install:all
```

### 2. Set Up Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Get your project URL and API keys from Settings > API

### 3. Configure Environment Variables

#### Frontend (.env)
```bash
cp env.production.template .env
```
Edit `.env` and add:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Backend (server/.env)
```bash
cp server/config.env server/.env
```
Edit `server/.env` and add your actual values:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OPENAI_API_KEY=your-openai-api-key
CORS_ORIGIN=http://localhost:3000
```

### 4. Start Development Servers
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server:dev
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## AI Service Setup

### Option 1: OpenAI
1. Get API key from [OpenAI Platform](https://platform.openai.com)
2. Add to `server/.env`: `OPENAI_API_KEY=your-key`

### Option 2: Cohere
1. Get API key from [Cohere](https://cohere.ai)
2. Add to `server/.env`: `COHERE_API_KEY=your-key`

### Option 3: Anthropic
1. Get API key from [Anthropic](https://console.anthropic.com)
2. Add to `server/.env`: `ANTHROPIC_API_KEY=your-key`

## Production Deployment

### 1. Build the Application
```bash
npm run build:all
```

### 2. Deploy Backend
- Deploy `server/` folder to your hosting service
- Set production environment variables
- Ensure CORS is configured for your frontend domain

### 3. Deploy Frontend
- Deploy the `dist/` folder to your hosting service
- Update `VITE_API_BASE_URL` to point to your backend

## Features

### ✅ Implemented
- User authentication (signup/login)
- Project management (CRUD operations)
- Code generation with AI
- Modern React UI with Tailwind CSS
- Responsive design
- Real-time project search
- Code syntax highlighting

### 🔧 Configuration Options
- Multiple AI providers (OpenAI, Cohere, Anthropic)
- Customizable code generation prompts
- Project categorization and tagging
- User preferences and settings

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` in backend matches frontend URL
   - Check that both servers are running

2. **AI Generation Fails**
   - Verify API key is correct
   - Check API service status
   - Ensure sufficient API credits

3. **Database Connection Issues**
   - Verify Supabase credentials
   - Check if database schema is properly set up
   - Ensure RLS policies are configured

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT secret configuration
   - Verify user exists in database

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs for errors
3. Verify all environment variables are set
4. Ensure all dependencies are installed

## Security Notes

- Change default JWT secret in production
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Regularly update dependencies
- Monitor API usage and costs 