# 🚀 Deployment Guide: Trending AI PDFs

## Overview

This guide will help you deploy your full-stack Trending AI PDFs application to production with a public URL.

**Architecture:**
- **Frontend (Vite)** → Vercel (Free)
- **Backend (Express API)** → Railway or Render (Free tier available)
- **Database** → Neon PostgreSQL (Already configured)

**Estimated Setup Time:** 15-20 minutes  
**Cost:** FREE (using free tiers)

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account
- ✅ All code committed and pushed to GitHub
- ✅ Neon database already created (you have this!)
- ✅ Google Sheets API credentials (you have this!)

---

## 🎯 Deployment Steps

### Part 1: Deploy Backend (Railway - Recommended)

#### Step 1: Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Click "Login" → Sign in with GitHub
3. Authorize Railway to access your repositories

#### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `Trending-AI-PDFs`
4. Railway will detect it's a Node.js project automatically

#### Step 3: Add Environment Variables
Click on your project → **Variables** tab → Add these:

```
DATABASE_URL = your_neon_connection_string_here
GOOGLE_SHEETS_ID = your_sheet_id
GOOGLE_API_KEY = your_google_api_key
GITHUB_TOKEN = your_github_token (optional)
GITHUB_REPO_OWNER = MohammedNasserAhmed
GITHUB_REPO_NAME = Trending-AI-PDFs
NODE_ENV = production
PORT = 3000
ALLOWED_ORIGINS = https://trending-ai-pdfs.vercel.app
```

#### Step 4: Deploy!
1. Railway will automatically deploy your backend
2. Wait for deployment to complete (~2-3 minutes)
3. Copy your backend URL (looks like: `https://xyz.railway.app`)
4. Test it: Visit `https://your-url.railway.app/health`
   - Should show: `{"status":"ok",...}`

✅ **Backend is live!**

---

### Part 2: Deploy Frontend (Vercel)

#### Step 1: Sign Up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → Continue with GitHub
3. Authorize Vercel

#### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import your `Trending-AI-PDFs` repository
3. Vercel will detect it's a Vite project

#### Step 3: Configure Build Settings
Vercel should auto-detect these, but verify:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### Step 4: Add Environment Variable
Click **Environment Variables** → Add:

```
Name: VITE_API_URL
Value: https://your-railway-backend-url.railway.app
```

(Replace with your actual Railway URL from Part 1, Step 4)

#### Step 5: Deploy!
1. Click "Deploy"
2. Wait for deployment (~2-3 minutes)
3. Vercel will give you a URL like: `https://trending-ai-pdfs.vercel.app`

✅ **Frontend is live!**

---

### Part 3: Connect Frontend & Backend

#### Update Backend CORS
1. Go back to Railway dashboard
2. Click on your project → **Variables**
3. Update `ALLOWED_ORIGINS` to include your Vercel URL:
   ```
   ALLOWED_ORIGINS = https://trending-ai-pdfs.vercel.app
   ```
4. Railway will auto-redeploy

#### Test the Connection
1. Visit your Vercel URL: `https://trending-ai-pdfs.vercel.app`
2. Check that:
   - ✅ Catalog loads with your 15 PDFs
   - ✅ Images display
   - ✅ Download buttons work
   - ✅ GitHub stats show (if configured)

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Vercel dashboard → Your project → **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~24 hours)

---

## 🔧 Troubleshooting

### Frontend shows blank page
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Hard refresh: Ctrl+Shift+R

### Backend not responding
- Check Railway logs: Dashboard → View Logs
- Verify all environment variables are set
- Check health endpoint: `https://your-backend.railway.app/health`

### No PDFs showing
- Verify catalog.json exists in your repository
- Check backend logs for errors
- Ensure database is connected

### Images not loading
- Verify Google Drive images are public
- Check browser Network tab for 403/404 errors
- Test image URLs directly in browser

### CORS errors
- Verify `ALLOWED_ORIGINS` includes your Vercel URL
- Check for typos in the URL
- Ensure no trailing slash

---

## 📊 Monitoring & Maintenance

### View Logs

**Railway (Backend):**
- Dashboard → Your Project → **View Logs**

**Vercel (Frontend):**
- Dashboard → Your Project → **Deployments** → Click deployment → **Function Logs**

### Update Catalog
Run locally, then push to GitHub:
```bash
npm run sync-catalog
git add docs/catalog.json
git commit -m "Update catalog"
git push
```

Both Vercel and Railway will auto-deploy!

### Check Analytics
Visit: `https://your-vercel-url.vercel.app/stats`

---

## 💰 Cost Breakdown

**Free Tier Limits:**
- **Vercel:** 100GB bandwidth/month, unlimited deployments
- **Railway:** $5/month credit (enough for hobby projects)
- **Neon:** 0.5GB storage, 1 project

**When to upgrade:**
- High traffic (>100K visits/month)
- Need more database storage
- Want custom support

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Frontend accessible at public URL
- [ ] Backend API responding at `/health`
- [ ] All 15 PDFs display in catalog
- [ ] Images load from Google Drive
- [ ] Download tracking works
- [ ] Summary column shows data
- [ ] Search and filters work
- [ ] GitHub stats display (if configured)
- [ ] Analytics page loads
- [ ] Mobile responsive

---

## 🆘 Need Help?

**Common Issues:**
1. **Build fails on Vercel:** Check build logs for npm errors
2. **Backend crashes:** Check Railway logs, verify DATABASE_URL
3. **CORS errors:** Double-check ALLOWED_ORIGINS

**Resources:**
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Neon Documentation](https://neon.tech/docs/introduction)

---

## 🚀 Your URLs

After deployment, fill these in:

**Frontend (Vercel):**
```
https://trending-ai-pdfs.vercel.app
```

**Backend API (Railway):**
```
https://your-project-name.railway.app
```

**Share your live site:** Copy the Vercel URL and share it with anyone! 🎊

---

**Congratulations! Your Trending AI PDFs app is now live on the internet!** 🌐
