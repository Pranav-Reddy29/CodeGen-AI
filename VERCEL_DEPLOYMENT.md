# 🚀 CodeGen AI - Vercel Deployment Guide

## Overview
This guide will help you deploy your CodeGen AI frontend to Vercel, which is perfect for React applications.

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Your code is already on GitHub
3. **Backend URL** - `https://codegen-ai.onrender.com` (already deployed)

## 🎯 Step-by-Step Vercel Deployment

### Step 1: Connect GitHub to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository** (`Pranav-Reddy29/CodeGen-AI`)
5. **Select the repository**

### Step 2: Configure Project Settings

**Framework Preset:** Vite
**Root Directory:** `./` (leave empty)
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### Step 3: Set Environment Variables

**Add this environment variable:**
```
VITE_API_BASE_URL=https://codegen-ai.onrender.com/api
```

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for build to complete** (2-5 minutes)
3. **Your app will be live!**

## 🔧 Manual Deployment (Alternative)

If you prefer using Vercel CLI:

### Install Vercel CLI
```bash
npm install -g vercel
```

### Deploy
```bash
vercel
```

### Set Environment Variables
```bash
vercel env add VITE_API_BASE_URL
# Enter: https://codegen-ai.onrender.com/api
```

## 🚨 Important Configuration

### Environment Variables
- **VITE_API_BASE_URL**: `https://codegen-ai.onrender.com/api`

### Build Settings
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18 (recommended)

## 🎉 Post-Deployment

### Update Backend CORS
After your frontend is deployed, update your backend CORS settings:

1. **Go to Render Dashboard**
2. **Find your backend service** (`codegen-ai`)
3. **Navigate to Environment**
4. **Update CORS_ORIGIN**:
   ```
   CORS_ORIGIN=https://your-frontend-name.vercel.app
   ```

### Test Your Application
1. **Visit your Vercel URL**
2. **Test user registration**
3. **Test user login**
4. **Test project creation**
5. **Test AI code generation**

## 🔗 Your Deployed URLs

- **Backend**: `https://codegen-ai.onrender.com` ✅
- **Frontend**: `https://your-app-name.vercel.app` (after deployment)

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version (use 18)
   - Verify all dependencies are installed
   - Check build logs in Vercel dashboard

2. **API Connection Issues**
   - Verify VITE_API_BASE_URL is set correctly
   - Check if backend is running
   - Test API endpoints directly

3. **CORS Errors**
   - Update CORS_ORIGIN in backend
   - Ensure backend is accessible
   - Check browser console for errors

## 📊 Vercel Advantages

- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Automatic deployments**
- ✅ **Preview deployments**
- ✅ **Analytics included**
- ✅ **Great for React apps**

## 🎯 Expected Result

After deployment, you'll have:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://codegen-ai.onrender.com`
- **Full-stack application** with AI code generation!

---

**🎉 Congratulations!** Your CodeGen AI will be live on Vercel! 