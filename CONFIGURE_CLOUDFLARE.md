# Configure Cloudflare Pages Environment Variable

## Step-by-Step Instructions

### 1. Login to Cloudflare Dashboard
Go to: https://dash.cloudflare.com/

### 2. Navigate to Pages
1. Click on your account
2. In the left sidebar, click **"Workers & Pages"**
3. You'll see a list of your projects

### 3. Select Your Project
- Find and click on **"pohlang-playground"** (or whatever you named it)

### 4. Go to Settings
- Click the **"Settings"** tab at the top

### 5. Add Environment Variable
1. Scroll down to **"Environment variables"** section
2. Click **"Add variable"** button
3. Fill in:
   - **Variable name:** `RUNNER_ORIGIN`
   - **Value:** `https://pohlang-runner-fflb6dkurq-uc.a.run.app`
4. **Important:** Select both **Production** and **Preview** environments
5. Click **"Save"**

### 6. Redeploy
Option A: Trigger automatic redeploy
1. Go to **"Deployments"** tab
2. Click the **⋯** (three dots) next to the latest deployment
3. Click **"Retry deployment"**

Option B: Push a new commit
```powershell
cd C:\Users\habib\POHLANG\Pohlang-PlayGround
echo "# Trigger redeploy" >> web/README.md
git add web/README.md
git commit -m "Trigger redeploy after configuring RUNNER_ORIGIN"
git push origin main
```

### 7. Wait and Test
- Wait 1-2 minutes for deployment to complete
- Refresh https://pohlang-playground.pages.dev
- Try running code - it should work! 🎉

## Troubleshooting

### If it still doesn't work:

1. **Check the variable name is exactly:** `RUNNER_ORIGIN` (case-sensitive, no spaces)

2. **Check the value has no trailing slash:**
   - ✅ Correct: `https://pohlang-runner-fflb6dkurq-uc.a.run.app`
   - ❌ Wrong: `https://pohlang-runner-fflb6dkurq-uc.a.run.app/`

3. **Verify it's set for Production environment**

4. **Check deployment status:**
   - Go to Deployments tab
   - Make sure latest deployment shows "Success"

5. **Clear browser cache:**
   - Press Ctrl+Shift+R (hard refresh)
   - Or open in incognito/private window

6. **Check browser console:**
   - Press F12
   - Go to Console tab
   - Look for any error messages when you click "Run Code"

## Screenshot Guide

If you need visual help:
1. After logging in to Cloudflare
2. Look for: **Workers & Pages** in left menu
3. Click your project name
4. Click **Settings** tab
5. Scroll to **Environment variables**
6. Click **Add variable**

## Why This Can't Be Done Via Code

Cloudflare Pages environment variables are stored in Cloudflare's infrastructure, not in your repository. They're used at build-time and runtime, but must be configured through the dashboard for security reasons (to prevent exposing secrets in git).

## Verify Backend is Working

Before configuring, verify the backend works:
```powershell
curl https://pohlang-runner-fflb6dkurq-uc.a.run.app/api/health
```

Should return:
```json
{"ok":true,"version":"1.0.0","pohlang_bin":"/usr/local/bin/pohlang",...}
```

✅ Backend is working (verified earlier)
⏳ Just need to connect frontend via environment variable
