# Quick Fix: Cloudflare Pages Build Error

## Error Message
```
/bin/sh: 1: Syntax error: Unterminated quoted string
Failed: build command exited with code: 1
```

## Solution (2 Minutes)

### Step 1: Go to Build Settings
1. Open [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click on your **pohlang-playground** project
3. Go to **Settings** → **Builds & deployments**

### Step 2: Fix Build Command
1. Find the **Build command** field
2. **DELETE** everything in it
3. Leave it **completely empty** (blank field)
4. Confirm **Build output directory** is: `web`

### Step 3: Retry Deployment
1. Go to **Deployments** tab
2. Click on the failed deployment
3. Click **"Retry deployment"**

## Correct Settings

✅ **Build command**: *(empty - nothing entered)*  
✅ **Build output directory**: `web`  
✅ **Root directory**: `/`  
✅ **Framework preset**: `None`  

## Why This Works

The PohLang Playground is a **static site** - it doesn't need any build process. The files in the `web/` directory are ready to serve directly.

When you leave the build command empty, Cloudflare Pages simply serves the files without trying to run any shell commands.

## What Went Wrong

The build command had: `echo "Static deployment` (missing the closing quote `"`)

This caused a shell syntax error because the string wasn't properly terminated.

## Verification

After redeploying, you should see:
- ✅ Build step shows: "No build command specified"
- ✅ Deployment succeeds
- ✅ Site is live at `https://your-project.pages.dev`

## Still Having Issues?

1. **Clear the build cache**: Settings → General → Delete cache
2. **Try a fresh deployment**: Deployments → Create deployment
3. **Check the logs**: Deployments → View build logs

---

**That's it!** Your playground should now deploy successfully. 🎉
