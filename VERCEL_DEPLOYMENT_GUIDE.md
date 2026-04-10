# BuildMart Vercel Deployment Guide

## Prerequisites
- Different GitHub account created
- MongoDB Atlas account (for cloud MongoDB)
- Vercel account (vercel.com)

## Step 1: Push to Different GitHub Account

1. Initialize git if not already done:
```powershell
cd c:\BuildMart
git init
git add .
git commit -m "Initial commit: BuildMart full stack app"
git branch -M main
```

2. Create a new repository on your different GitHub account (empty, no README)

3. Add remote and push:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/buildmart.git
git push -u origin main
```

## Step 2: Configure MongoDB Atlas (Cloud Database)

1. Go to mongodb.com and create a cluster
2. Create a database user with username and password
3. Get connection string in format: `mongodb+srv://user:password@cluster.mongodb.net/buildmart?retryWrites=true&w=majority`
4. Add your Vercel deployment IP to IP Whitelist (or allow 0.0.0.0/0 for testing)

## Step 3: Deploy to Vercel

1. Go to vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository from your different account
4. Select the root directory (leave as default ".")
5. Click "Deploy"

## Step 4: Configure Environment Variables in Vercel

After project is imported, go to **Project Settings** → **Environment Variables**

Add the following:

```
MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/buildmart?retryWrites=true&w=majority
JWT_SECRET = your_secure_jwt_secret_key
NODE_ENV = production
PORT = 3001
```

Then redeploy from the "Deployments" tab.

## Step 5: Test Your Deployment

1. Frontend will be available at: `https://your-project.vercel.app`
2. API endpoints should be accessible at: `https://your-project.vercel.app/api/auth`, etc.
3. Check browser console for any CORS or API errors

## Troubleshooting

### CORS Errors
- Backend has CORS enabled for all origins - should work fine

### MongoDB Connection Issues
- Check MONGO_URI is correct
- Ensure MongoDB Atlas IP whitelist includes Vercel servers
- Add `0.0.0.0/0` temporarily to test

### API Not Found
- Check that `vercel.json` exists in root
- Verify backend routes are working locally first
- Check Vercel function logs

### Frontend Can't Find Backend
- Frontend will automatically use `/api` endpoints on Vercel
- For local testing, use `http://localhost:5000`

## Local Development Setup

To test locally before deployment:

```powershell
# Terminal 1 - Backend
cd backend
npm install
$env:MONGO_URI="mongodb://localhost:27017/buildmart"
$env:JWT_SECRET="dev-secret"
npm start

# Terminal 2 - Frontend
cd frontend
npm install
$env:REACT_APP_API_URL="http://localhost:5000"
npm start
```

## Production Checklist

- [ ] Environment variables set in Vercel (MONGO_URI, JWT_SECRET)
- [ ] MongoDB Atlas whitelist configured
- [ ] Frontend can make API calls to `/api` endpoints
- [ ] Authentication working (login/register)
- [ ] Cart functionality working
- [ ] Checkout process complete

## API Endpoints

All endpoints are prefixed with `/api`:

- `/api/auth/login` - POST
- `/api/auth/register` - POST
- `/api/materials` - GET/POST
- `/api/cart` - GET/POST
- `/api/orders` - GET/POST
- `/api/coupons/apply` - POST
- `/api/profile` - GET/PUT
- `/api/seller/*` - Seller endpoints

## Notes

- Frontend is built and served statically
- Backend runs as serverless functions on Vercel
- API routes are automatically proxied via `vercel.json`
- Session data persists in MongoDB Atlas
