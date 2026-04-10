# 🔑 Vercel Environment Variables Setup Guide

**Last Updated:** April 11, 2026

## Quick Setup (2 minutes)

### Option 1: Vercel Dashboard (Easiest) ✅ RECOMMENDED

1. **Go to:** https://vercel.com/dashboard
2. **Select:** Your "Build-Mart" project
3. **Click:** Settings → Environment Variables
4. **Add these variables:**

| Variable Name | Value | Environments | Instructions |
|---|---|---|---|
| `REACT_APP_API_URL` | `https://build-mart-production-a9e7.up.railway.app` | Production, Preview | Copy the Railway backend URL exactly |

5. **Click:** "Save"
6. **Redeploy:** Go to Deployments → Click "Redeploy" on latest deployment
   - OR: Push a commit to trigger redeploy: `git add . && git commit -m "Update env vars" && git push`

---

### Option 2: Vercel CLI (Command Line)

If you have Vercel CLI installed, run in your project directory:

```bash
# Set environment variable
vercel env add REACT_APP_API_URL

# Then enter: https://build-mart-production-a9e7.up.railway.app
# Select: Production, Preview, Development
```

---

### Option 3: Using .env.local (Development Only)

For testing locally before committing:

**File:** `frontend/.env.local`
```
REACT_APP_API_URL=http://localhost:5000
```

Or for testing production behavior locally:
```
REACT_APP_API_URL=https://build-mart-production-a9e7.up.railway.app
```

**Note:** Do NOT commit `.env.local` - it's already in `.gitignore`

---

## Verification Checklist

After setting environment variables:

### ✅ Step 1: Clear Build Cache
1. Go to **Settings** → **Git**
2. Click **"Clear Build Cache"**

### ✅ Step 2: Redeploy
1. Go to **Deployments**
2. Click **"Redeploy"** on the latest deployment
3. **Wait** for build to complete (2-3 minutes)

### ✅ Step 3: Test in Browser
1. Open your Vercel app URL (e.g., https://your-app.vercel.app)
2. Open **DevTools** (F12 or Cmd+Option+I)
3. Go to **Console** tab
4. Look for these log messages:

**Expected (GOOD) ✅:**
```
API Base URL: https://build-mart-production-a9e7.up.railway.app
Environment: production
Using production Railway backend: https://build-mart-production-a9e7.up.railway.app
```

**Not Expected (BAD) ❌:**
```
API Base URL: http://localhost:5000
Detected localhost - using development backend
```

### ✅ Step 4: Test Critical Flows

**Test Login:**
1. Go to login page
2. Open DevTools → Network tab
3. Enter credentials and submit
4. Look for request to: `https://build-mart-production-a9e7.up.railway.app/api/auth/login`
5. Should return ✅ Status 200 (or 401 if wrong credentials)
6. Should NOT show error: `net::ERR_CONNECTION_REFUSED`

**Test Material Listing:**
1. Go to HomePage or browse materials
2. Check Network tab
3. Should see requests to: `https://build-mart-production-a9e7.up.railway.app/api/materials`

**Test Checkout:**
1. Add items to cart
2. Go to checkout
3. Check Network tab
4. Should see requests to: `https://build-mart-production-a9e7.up.railway.app/api/profile` and `/api/orders`

---

## Troubleshooting

### Problem: Still seeing localhost:5000 after changes

**Solution:**
1. Hard refresh the page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache and cookies
3. Try in incognito/private mode
4. Verify you actually pushed the code to GitHub (check Vercel logs)

### Problem: Getting 401/403 errors

**Likely Cause:** API backend on Railway requires authentication  
**Check:**
1. Is your Railway backend running? (Check Railway dashboard)
2. Are your MongoDB credentials correct? (Check Railway env vars)
3. Is JWT_SECRET set on Railway? (Check Railway env vars)

### Problem: Getting CORS errors

**This means:**
- Frontend request is reaching backend
- But backend is rejecting due to CORS policy

**Check backend `server.js`:**
```javascript
// Should include:
const cors = require('cors');
app.use(cors()); // Allow all origins
```

### Problem: Build fails in Vercel

**Check Vercel build logs:**
1. Go to Deployments
2. Click failed deployment
3. Look for error messages
4. Common issues:
   - Missing npm dependencies
   - Syntax errors in code
   - Environment variable not used in build

---

## Environment Variables Explained

### `REACT_APP_API_URL`
- **What:** Base URL for API calls
- **Example:** `https://build-mart-production-a9e7.up.railway.app`
- **Used by:** Frontend React app to make API requests
- **How to check:** Open DevTools Console, type `process.env.REACT_APP_API_URL`

### `MONGO_URI`
- **What:** MongoDB connection string
- **Used by:** Backend server (Node.js)
- **Should be:** In Railway environment, NOT Vercel

### `JWT_SECRET`
- **What:** Secret key for authentication tokens
- **Used by:** Backend server (Node.js)
- **Should be:** In Railway environment, NOT Vercel

### `PORT`
- **What:** Port number for backend
- **Default:** 5000 (local) or provided by Railway
- **Should be:** In Railway environment, NOT Vercel

---

## Architecture Reminder

```
┌─────────────────────────────────────────────────────────┐
│ User's Browser                                          │
│ (Running your React app)                                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ Uses apiClient.js with baseURL:
                       │ REACT_APP_API_URL
                       │
              ┌────────▼────────┐
              │   Vercel        │
              │ (Frontend only) │ ← Uses REACT_APP_API_URL
              │   (your app)    │
              └────────┬────────┘
                       │
           Makes HTTP request to:
         https://build-mart-production-a9e7.up.railway.app
                       │
              ┌────────▼────────────────────┐
              │   Railway                   │
              │ (Backend + Database)        │
              │ - Node.js Server            │
              │ - Express Routes (/api/*) │
              │ - MongoDB Database          │
              └─────────────────────────────┘
```

---

## Quick Reference

**If you forget the Railway URL:**
1. Go to https://railway.app/dashboard
2. Select your "Build-Mart" project
3. Click "Deployments"
4. Find the latest successful deployment
5. Copy the URL shown under "URL"
6. It should be: `https://build-mart-production-a9e7.up.railway.app`

---

## After Setting Up Environment Variables

Your app will:
1. ✅ Use the Railway backend in production
2. ✅ Use localhost:5000 in development (on your machine)
3. ✅ Show helpful logs in browser console
4. ✅ Properly handle authentication
5. ✅ Load materials, process orders, manage carts

---

## Still Having Issues?

1. **Check Vercel Logs:**
   - Deployments → Failed build → View logs

2. **Check Railway Logs:**
   - Railway Dashboard → Your project → Deployments → Logs

3. **Check Frontend Logs:**
   - Browser DevTools → Console → Check for errors

4. **Test Directly:**
   - Open: `https://build-mart-production-a9e7.up.railway.app/api/auth`
   - Should respond (not timeout or error)

---

**Next Step:** Follow "Quick Setup" above to add the environment variable to Vercel.
