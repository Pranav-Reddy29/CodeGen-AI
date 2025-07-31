# 🚀 CodeGen AI Cloud Storage Setup Guide (Supabase)

## Overview
This guide will help you set up a real cloud-based storage system for CodeGen AI using Supabase, allowing users to access their projects from any browser/device.

## 🛠️ Prerequisites

1. **Node.js** (v14 or higher)
2. **Supabase Account** (free tier available)
3. **Git** (for version control)

## 📋 Setup Steps

### 1. Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Wait for the project to be set up (takes a few minutes)

### 2. Get Supabase Credentials
1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. Copy your **Project URL** and **anon public key**

### 3. Set Up Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL script to create tables and policies

### 4. Install Backend Dependencies
```bash
cd server
npm install
```

### 5. Configure Environment Variables
Edit `server/config.env`:
```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-from-supabase
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 6. Start the Backend Server
```bash
cd server
npm run dev
```

### 7. Start the Frontend
```bash
# In a new terminal
npm run dev
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/search?query=...` - Search projects

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)
1. Deploy backend to Railway:
   ```bash
   cd server
   # Connect to Railway and deploy
   ```
2. Deploy frontend to Vercel
3. Update environment variables in Railway dashboard

### Option 2: Heroku
1. Create Heroku account
2. Install Heroku CLI
3. Deploy backend:
   ```bash
   cd server
   heroku create your-app-name
   heroku config:set SUPABASE_URL=your-supabase-url
   heroku config:set SUPABASE_ANON_KEY=your-supabase-key
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform
1. Create DigitalOcean account
2. Deploy both frontend and backend using App Platform
3. Configure environment variables

## 🔒 Security Features

- ✅ **Row Level Security (RLS)** - Database-level security
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt for password security
- ✅ **CORS Protection** - Cross-origin request handling
- ✅ **Input Validation** - Server-side validation
- ✅ **User Isolation** - Users can only access their own projects

## 📱 Cross-Device Access

Once deployed, users can:
- ✅ Access projects from any browser
- ✅ Use on mobile devices
- ✅ Share projects across devices
- ✅ Real-time synchronization

## 🚨 Important Notes

1. **Change JWT Secret**: Update the JWT_SECRET in production
2. **Use HTTPS**: Always use HTTPS in production
3. **Supabase Limits**: Free tier has generous limits
4. **Environment Variables**: Never commit sensitive data to Git
5. **Database Backups**: Supabase handles backups automatically

## 🐛 Troubleshooting

### Common Issues:
1. **Supabase Connection Error**: Check SUPABASE_URL and SUPABASE_ANON_KEY
2. **CORS Error**: Ensure backend is running on correct port
3. **JWT Error**: Check JWT_SECRET is set correctly
4. **Port Already in Use**: Change PORT in config.env

### Debug Commands:
```bash
# Check Node.js version
node --version

# Check if ports are in use
netstat -an | findstr :5000

# Test Supabase connection
curl -X GET "https://your-project.supabase.co/rest/v1/" \
  -H "apikey: your-anon-key"
```

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure Supabase project is active
4. Check network connectivity

## 🎯 Supabase Advantages

- ✅ **Free Tier**: 500MB database, 50MB file storage
- ✅ **Real-time**: Built-in real-time subscriptions
- ✅ **Auth**: Built-in authentication system
- ✅ **Dashboard**: Easy-to-use web interface
- ✅ **Auto-scaling**: Handles traffic automatically
- ✅ **Backups**: Automatic daily backups

---

**🎉 Congratulations!** Your CodeGen AI now has enterprise-level cloud storage with Supabase! 