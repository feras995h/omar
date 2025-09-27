# Coolify Deployment Guide

## 🚨 Current Issue: 405 Method Not Allowed Error

Your application is experiencing a **405 Method Not Allowed** error when making API requests. This guide provides Coolify-specific solutions.

## 🔧 Coolify Configuration Checklist

### 1. **Application Type Configuration**
In your Coolify dashboard:
- ✅ Set **Application Type** to `Node.js`
- ✅ Set **Build Command** to `npm run build`
- ✅ Set **Start Command** to `node server.js`
- ✅ Set **Port** to `3000` (or whatever port your server.js uses)

### 2. **Environment Variables**
Add these environment variables in Coolify:
```env
NODE_ENV=production
PORT=3000
VITE_MYSQL_HOST=your_db_host
VITE_MYSQL_PORT=3306
VITE_MYSQL_USER=your_db_user
VITE_MYSQL_PASSWORD=your_db_password
VITE_MYSQL_DATABASE=your_db_name
FRONTEND_URL=https://yourdomain.com
DOMAIN_URL=https://yourdomain.com
```

### 3. **Dockerfile Configuration** (if using Docker)
Ensure your Dockerfile is properly configured:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "server.js"]
```

### 4. **Build Pack Detection**
If Coolify isn't detecting your app correctly:
- Add a `.coolify` file in your root directory:
```json
{
  "buildpack": "nodejs",
  "nodejs": {
    "version": "18"
  }
}
```

## 🔍 Troubleshooting Steps

### Step 1: Check Deployment Logs
In Coolify dashboard:
1. Go to your application
2. Click on **Deployments**
3. Check the latest deployment logs for errors

### Step 2: Verify Build Process
Look for these in the logs:
- ✅ `npm install` completed successfully
- ✅ `npm run build` completed successfully
- ✅ Server started on port 3000

### Step 3: Check Application Logs
In Coolify dashboard:
1. Go to **Logs** tab
2. Look for any runtime errors
3. Check if the server is actually starting

### Step 4: Test API Endpoints
Use Coolify's built-in terminal or logs to test:
```bash
curl -X GET http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

## 🚀 Common Coolify Issues & Solutions

### Issue 1: **Wrong Application Type**
**Problem**: Coolify treats it as a static site
**Solution**: 
- Change Application Type to `Node.js`
- Set Start Command to `node server.js`

### Issue 2: **Port Mismatch**
**Problem**: Coolify expects different port
**Solution**:
- Set PORT environment variable to match Coolify's expectation
- Or configure Coolify to use port 3000

### Issue 3: **Build Command Issues**
**Problem**: Build fails or doesn't include server files
**Solution**:
- Set Build Command to `npm run build`
- Ensure `server.js` is not in `.gitignore`
- Check if all dependencies are in `package.json`

### Issue 4: **Environment Variables**
**Problem**: Database connection fails
**Solution**:
- Add all required environment variables in Coolify dashboard
- Don't use `.env` file, use Coolify's environment variables

### Issue 5: **Static File Serving**
**Problem**: API routes return 404/405
**Solution**:
- Ensure `server.js` serves static files correctly
- Check the order of route definitions (API routes before catch-all)

## 📋 Deployment Steps for Coolify

### 1. **Prepare Repository**
```bash
# Ensure all files are committed
git add .
git commit -m "Prepare for Coolify deployment"
git push origin main
```

### 2. **Create New Application in Coolify**
1. Click **+ New Application**
2. Connect your Git repository
3. Select branch: `main`
4. Set Application Type: `Node.js`

### 3. **Configure Build Settings**
- **Build Command**: `npm run build`
- **Start Command**: `node server.js`
- **Port**: `3000`

### 4. **Add Environment Variables**
Add all required environment variables in the Coolify dashboard

### 5. **Deploy**
Click **Deploy** and monitor the logs

## 🔧 Quick Fixes

### If you're getting 405 errors:

1. **Check Start Command**:
   ```
   node server.js
   ```

2. **Verify Port Configuration**:
   - Set PORT environment variable to `3000`
   - Or check what port Coolify expects

3. **Check Application Type**:
   - Must be set to `Node.js`, not `Static Site`

4. **Restart Application**:
   - In Coolify dashboard, click **Restart**

## 📞 Next Steps

If the issue persists:
1. Share your Coolify deployment logs
2. Check the application runtime logs
3. Verify your domain is pointing to the correct Coolify instance
4. Test the API endpoints directly from Coolify's terminal

## 🔗 Useful Commands

```bash
# Check if server is running
ps aux | grep node

# Test API locally in Coolify container
curl http://localhost:3000/api/health

# Check environment variables
env | grep -E "(NODE_ENV|PORT|MYSQL)"
```