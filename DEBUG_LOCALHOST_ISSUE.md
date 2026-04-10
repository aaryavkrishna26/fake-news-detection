# 🐛 Localhost:5000 Bug - Instant Diagnosis Guide

**Use this when:** You see "ERR_CONNECTION_REFUSED" or "localhost:5000" in browser console

---

## ⚡ 30-Second Diagnosis

### Step 1: Check Console Logs (Open DevTools: F12)

```javascript
// In Browser Console, type and press Enter:
API_URL
```

**Expected Output (✅ FIXED):**
```
'https://build-mart-production-a9e7.up.railway.app'
```

**Bad Output (❌ NOT FIXED):**
```
'http://localhost:5000'
```

---

### Step 2: Check Startup Logs

In DevTools Console, look for message that appears on page load:

**✅ GOOD:**
```
API Base URL: https://build-mart-production-a9e7.up.railway.app
Using production Railway backend: https://build-mart-production-a9e7.up.railway.app
```

**❌ BAD:**
```
API Base URL: http://localhost:5000
Detected localhost - using development backend
```

---

### Step 3: Quick Network Check

In DevTools → Network tab:
1. Refresh page
2. Try to login or load data
3. Look at the requests URLs

**✅ GOOD URLs:**
```
https://build-mart-production-a9e7.up.railway.app/api/auth/login
https://build-mart-production-a9e7.up.railway.app/api/materials
```

**❌ BAD URLs:**
```
http://localhost:5000/api/auth/login ← Won't work!
http://localhost:5000/api/materials ← Won't work!
```

---

## 🔧 If Still Broken - Fixes to Try

### Fix #1: Hard Refresh Cache (Do This First!)
- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`
- **Or:** Open DevTools → Settings → Network → Check "Disable cache"

### Fix #2: Clear LocalStorage
In Browser Console, run:
```javascript
localStorage.clear();
location.reload();
```

### Fix #3: Force Incognito Mode
Open your app in incognito/private window (bypasses all cache)

### Fix #4: Check Vercel Deployment Status
1. Go to https://vercel.com/dashboard
2. Click your Build-Mart project
3. Go to **Deployments**
4. Is latest deployment **READY**? ✅ (Green checkmark)
5. Or is it still **BUILDING**? ⏳

**If building:** Wait for it to finish, then refresh browser

### Fix #5: Verify Vercel Environment Variable
1. Go to Vercel Dashboard → Your project
2. Click **Settings** → **Environment Variables**
3. Look for `REACT_APP_API_URL`
4. Is it there? ✅
5. Does it show: `https://build-mart-production-a9e7.up.railway.app`? ✅

**If missing:** Add it! Follow [VERCEL_ENVIRONMENT_SETUP.md](VERCEL_ENVIRONMENT_SETUP.md)

---

## 🎯 Root Cause Checklist

Mark each with ✅ or ❌:

| Item | Status | Notes |
|------|--------|-------|
| Environment var `REACT_APP_API_URL` set in Vercel | | Settings → Environment Variables |
| Vercel build cache cleared | | Settings → Git → Clear Build Cache |
| Latest deployment shows READY status | | Go to Deployments |
| Browser cache cleared | | Ctrl+Shift+R |
| Railway backend is running | | Check Railway dashboard |
| Railway backend URL is accessible | | Try in postman/curl |

---

## 🧪 Manual Testing

### Test 1: Can you reach Railway backend directly?

Open browser and visit:
```
https://build-mart-production-a9e7.up.railway.app
```

**Should show:** "Backend is running!"  
**If shows:** Error page → Backend is down, contact Railway support

### Test 2: Can you make an auth request?

In Browser Console:
```javascript
fetch('https://build-mart-production-a9e7.up.railway.app/api/auth', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
  .then(r => r.json())
  .then(d => console.log('Success:', d))
  .catch(e => console.error('Error:', e.message))
```

**Should show:** Response data (or 401 error - that's OK!)  
**Should NOT show:** `ERR_CONNECTION_REFUSED`

### Test 3: Does apiClient have the right URL?

In Browser Console:
```javascript
// First, make sure apiClient is available
import apiClient from './api/apiClient.js' // If needed

// Check the actual request being made
// Make a login request and check Network tab
// Should show baseURL = https://build-mart-production-a9e7.up.railway.app
```

Or just watch Network tab when clicking Login button.

---

## 📊 Expected vs Actual

### ✅ Expected Behavior (FIXED)

```
1. User goes to: https://your-app.vercel.app/login
2. Browser loads React app
3. Console shows: "Using production Railway backend: https://build-mart-production-a9e7.up.railway.app"
4. User enters email/password
5. Click Login
6. Network tab shows: Request to https://build-mart-production-a9e7.up.railway.app/api/auth/login
7. Response: 200 OK (or 401 Unauthorized)
8. User is logged in
```

### ❌ Actual Behavior (BROKEN)

```
1. User goes to: https://your-app.vercel.app/login
2. Browser loads React app
3. Console shows: "Using development backend: http://localhost:5000"
4. User enters email/password
5. Click Login
6. Network tab shows: Request to http://localhost:5000/api/auth/login
7. Response: ERR_CONNECTION_REFUSED (because localhost is not running)
8. Error: "Failed to load resource"
```

---

## 🚨 Emergency Debug Command

Copy and run this in Browser Console - it shows everything:

```javascript
console.log('=== BUILD MART DEBUG ===');
console.log('Current URL:', window.location.href);
console.log('API Base URL:', typeof API_URL !== 'undefined' ? API_URL : 'Not imported');
console.log('Environment:', process.env.NODE_ENV);
console.log('React App API URL Env Var:', process.env.REACT_APP_API_URL);
console.log('Localhost Check:', window.location.hostname);
console.log('Token in Storage:', !!localStorage.getItem('token'));
console.log('=== END DEBUG ===');
```

**Share this output** if asking for help!

---

## 📞 Getting Help

If you're still stuck:

1. **Run the debug command above** ↑
2. **Check screenshots:**
   - Vercel deployment status
   - Railway deployment status
   - Browser console logs
3. **Share:**
   - The debug output
   - Screenshots
   - Error message

---

## ✅ You're Fixed When...

- ✅ Console shows correct Railway URL
- ✅ Network tab shows requests to Railway (not localhost)
- ✅ Login works without ERR_CONNECTION_REFUSED
- ✅ Materials load successfully
- ✅ Can add to cart
- ✅ Can checkout
- ✅ Orders show up in dashboard

---

**Last Updated:** April 11, 2026  
**Related Files:** [API_LOCALHOST_FIX_REPORT.md](API_LOCALHOST_FIX_REPORT.md), [VERCEL_ENVIRONMENT_SETUP.md](VERCEL_ENVIRONMENT_SETUP.md)
