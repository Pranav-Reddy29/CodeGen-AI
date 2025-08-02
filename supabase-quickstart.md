# 🚀 Supabase Quick Start Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign Up"
3. Create a new project:
   - **Name**: `codegen-ai` (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
4. Wait for setup (2-3 minutes)

## Step 2: Get Your Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Set Up Database Schema

1. Go to **SQL Editor** in your dashboard
2. Click "New query"
3. Copy and paste the entire content from `supabase-schema.sql`
4. Click "Run" to execute the SQL

## Step 4: Configure Environment

1. Edit `server/config.env`:
```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Step 5: Install Dependencies

```bash
cd server
npm install
```

## Step 6: Start the Application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## Step 7: Test the Setup

1. Open your browser to `http://localhost:5173`
2. Click "Sign Up" to create an account
3. Try creating a project
4. Check your Supabase dashboard → **Table Editor** → **projects** to see the data

## 🎯 What You Get

- ✅ **Free Database**: 500MB storage
- ✅ **Real-time**: Built-in subscriptions
- ✅ **Auth**: User management
- ✅ **Dashboard**: Easy data management
- ✅ **API**: RESTful endpoints
- ✅ **Security**: Row Level Security

## 🔧 Troubleshooting

**Connection Error?**
- Check your SUPABASE_URL and SUPABASE_ANON_KEY
- Ensure your project is active in Supabase dashboard

**SQL Error?**
- Make sure you ran the entire `supabase-schema.sql` file
- Check the SQL Editor for any error messages

**CORS Error?**
- Ensure your backend is running on port 5000
- Check that CORS is enabled in your Express server

---

**🎉 You're all set!** Your CodeGen AI now has cloud storage with Supabase! 