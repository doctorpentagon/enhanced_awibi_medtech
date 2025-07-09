# 🚀 AWIBI MEDTECH Deployment Guide

This guide provides step-by-step instructions for deploying the AWIBI MEDTECH application to Vercel (frontend) and Render (backend) with proper CORS configuration.

## 📋 Prerequisites

- GitHub account
- Vercel account
- Render account
- MongoDB Atlas account (recommended for production)

## 🔧 Backend Deployment (Render)

### Step 1: Prepare MongoDB Database

1. Create a MongoDB Atlas cluster at https://cloud.mongodb.com
2. Create a database user with read/write permissions
3. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/awibi-medtech`)

### Step 2: Deploy to Render

1. **Create New Web Service**
   - Go to https://render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Name**: `awibi-medtech-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/awibi-medtech
   JWT_SECRET=your-super-secure-jwt-secret-for-production
   JWT_EXPIRE=30d
   FRONTEND_URL=https://your-app-name.vercel.app
   SESSION_SECRET=your-super-secure-session-secret-for-production
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://awibi-medtech-backend.onrender.com`)

### Step 3: Verify Backend Deployment

1. Visit `https://your-backend-url.onrender.com/health`
2. You should see: `{"status":"OK","message":"AWIBI MEDTECH API is running"}`

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Update the frontend `.env` file:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```

### Step 2: Deploy to Vercel

1. **Import Project**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend/awibi-medtech-frontend`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your frontend URL (e.g., `https://awibi-medtech.vercel.app`)

### Step 3: Update Backend CORS

1. Go back to your Render backend service
2. Update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
3. Redeploy the backend service

## 🔒 CORS Configuration Details

### Backend CORS Settings

The backend is configured to accept requests from:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
];

// Allow any Vercel deployment URL
if (origin.includes('.vercel.app') || allowedOrigins.includes(origin)) {
  return callback(null, true);
}
```

### Important CORS Notes

1. **Automatic Vercel Support**: Any `.vercel.app` domain is automatically allowed
2. **Environment Variable**: Set `FRONTEND_URL` to your exact Vercel URL
3. **Credentials**: CORS is configured with `credentials: true` for authentication
4. **Methods**: All necessary HTTP methods are allowed (GET, POST, PUT, DELETE, OPTIONS)

## 🔧 Troubleshooting CORS Issues

### Common CORS Problems and Solutions

1. **"Access to fetch blocked by CORS policy"**
   - **Solution**: Ensure `FRONTEND_URL` environment variable is set correctly in Render
   - **Check**: Verify the frontend URL matches exactly (including https://)

2. **"Credentials include but CORS not configured"**
   - **Solution**: Backend already has `credentials: true` configured
   - **Check**: Ensure frontend API calls include `credentials: 'include'`

3. **"Preflight request failed"**
   - **Solution**: Backend handles OPTIONS requests automatically
   - **Check**: Ensure all required headers are in `allowedHeaders` array

### Debugging Steps

1. **Check Backend Logs**
   - Go to Render dashboard → Your service → Logs
   - Look for CORS-related errors

2. **Test API Endpoints**
   - Use browser dev tools → Network tab
   - Check if requests are reaching the backend

3. **Verify Environment Variables**
   - Render: Settings → Environment Variables
   - Vercel: Settings → Environment Variables

## 🔐 Google OAuth Setup (Optional)

### Step 1: Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials

### Step 2: Configure OAuth URLs

**Authorized JavaScript Origins:**
```
https://your-app-name.vercel.app
http://localhost:5173
```

**Authorized Redirect URIs:**
```
https://your-backend-url.onrender.com/api/auth/google/callback
http://localhost:5000/api/auth/google/callback
```

### Step 3: Update Environment Variables

**Backend (Render):**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Frontend (Vercel):**
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 📊 Monitoring and Maintenance

### Health Checks

1. **Backend Health**: `https://your-backend-url.onrender.com/health`
2. **Frontend**: Visit your Vercel URL and check if it loads

### Performance Monitoring

1. **Render**: Built-in metrics in dashboard
2. **Vercel**: Analytics and performance insights
3. **MongoDB Atlas**: Database performance monitoring

### Regular Maintenance

1. **Update Dependencies**: Monthly security updates
2. **Monitor Logs**: Check for errors and performance issues
3. **Backup Database**: Regular MongoDB backups
4. **SSL Certificates**: Automatically managed by Render and Vercel

## 🆘 Support and Troubleshooting

### Quick Fixes

1. **App not loading**: Check environment variables
2. **API errors**: Verify backend is running and CORS is configured
3. **Login issues**: Check Google OAuth configuration
4. **Database errors**: Verify MongoDB connection string

### Getting Help

1. Check the main README.md for detailed setup instructions
2. Review error logs in Render and Vercel dashboards
3. Test API endpoints using tools like Postman
4. Verify all environment variables are set correctly

---

🎉 **Congratulations!** Your AWIBI MEDTECH application should now be successfully deployed and accessible worldwide!

