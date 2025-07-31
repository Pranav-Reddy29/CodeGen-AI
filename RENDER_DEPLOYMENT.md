# 🚀 CodeGen AI - Render Deployment Guide

## Overview
This guide will help you deploy your CodeGen AI application to Render. We'll deploy both the frontend and backend as separate services.

## 📋 Prerequisites

1. **Render Account** - Sign up at [render.com](https://render.com)
2. **GitHub Repository** - Your code is already on GitHub
3. **Supabase Project** - Already configured

## 🎯 Step-by-Step Deployment

### Step 1: Connect GitHub to Render

1. **Login to Render Dashboard**
2. **Click "New +"**
3. **Select "Blueprint"**
4. **Connect your GitHub repository**
5. **Select your `codegen` repository**

### Step 2: Deploy Backend Service

1. **Create New Web Service**
   - **Name**: `codegen-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (deploy from root)

2. **Build Configuration**
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=i9qnYOg/zL5DKfaN7e3nil3ojdAOJI5QNfPuqaloueHygdOC3mzYxOcffAuOjpD4K98Ez5S5xPrKgOPwMEys1A==
   SUPABASE_URL=https://kflqfwezexgvztqthrqn.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbHFmd2V6ZXhndnp0cXRocnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTY0NzcsImV4cCI6MjA2OTQzMjQ3N30.AvpWUS1-Oh3PbxaKRfj_GzRPuxSGHPRZZOSwY610Uoo
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbHFmd2V6ZXhndnp0cXRocnFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzg1NjQ3NywiZXhwIjoyMDY5NDMyNDc3fQ.bWoTxszQ0dVy68PdiYK_KCOnR5Q0BtN2dknPjP7FWdU
   COHERE_API_KEY=T9J64hNNqYc7YXfjUs8zUh9IyFO4l7TDud81mjsj
   CORS_ORIGIN=https://codegen-frontend.onrender.com
   ```

4. **Click "Create Web Service"**

### Step 3: Deploy Frontend Service

1. **Create New Static Site**
   - **Name**: `codegen-frontend`
   - **Environment**: `Static Site`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: Leave empty

2. **Build Configuration**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://codegen-backend.onrender.com/api
   ```

4. **Click "Create Static Site"**

### Step 4: Update CORS Settings

1. **Go to your backend service**
2. **Navigate to Environment**
3. **Update CORS_ORIGIN** with your actual frontend URL:
   ```
   CORS_ORIGIN=https://your-frontend-name.onrender.com
   ```

## 🔧 Manual Deployment (Alternative)

If you prefer manual deployment:

### Backend Service
1. **Create New Web Service**
2. **Connect GitHub repository**
3. **Configure:**
   - **Name**: `codegen-backend`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**: (see above)

### Frontend Service
1. **Create New Static Site**
2. **Configure:**
   - **Name**: `codegen-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: (see above)

## 🚨 Important Notes

1. **Service Names**: Render will append `.onrender.com` to your service names
2. **CORS**: Update CORS_ORIGIN after both services are deployed
3. **Environment Variables**: Set them in the Render dashboard
4. **Build Time**: First build may take 5-10 minutes
5. **Free Tier**: Services sleep after 15 minutes of inactivity

## 📊 Monitoring Your Deployment

### Backend Monitoring
- **Logs**: Check Render dashboard for build/deployment logs
- **Health**: Monitor service status
- **Performance**: Check response times

### Frontend Monitoring
- **Build Status**: Monitor build process
- **Deployment**: Check if files are served correctly
- **API Calls**: Verify frontend can reach backend

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs in Render dashboard

2. **CORS Errors**
   - Update CORS_ORIGIN with exact frontend URL
   - Ensure backend is running
   - Check browser console for errors

3. **API Connection Issues**
   - Verify environment variables are set
   - Check backend logs for errors
   - Test API endpoints directly

4. **Database Connection**
   - Verify Supabase credentials
   - Check if Supabase project is active
   - Test database connection

## 🎉 Post-Deployment Checklist

- [ ] Backend service is running
- [ ] Frontend is accessible
- [ ] User registration works
- [ ] User login works
- [ ] Project creation works
- [ ] AI code generation works
- [ ] File downloads work
- [ ] CORS is configured correctly

## 📞 Support

If you encounter issues:
1. **Check Render logs** in the dashboard
2. **Verify environment variables** are set correctly
3. **Test locally** first to isolate issues
4. **Check Supabase dashboard** for database issues

## 🔗 Your Deployed URLs

After deployment, your services will be available at:
- **Frontend**: `https://codegen-frontend.onrender.com`
- **Backend**: `https://codegen-backend.onrender.com`

---

**🎉 Congratulations!** Your CodeGen AI is now live on Render! 