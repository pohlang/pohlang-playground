# PohLang Playground - Deployment Guide

This guide provides step-by-step instructions for deploying the PohLang Playground to Cloudflare Pages.

## Prerequisites

Before you begin, make sure you have:

1. ✅ A **Cloudflare account** (free tier works!)
2. ✅ A **GitHub account**
3. ✅ The **Pohlang-PlayGround** repository forked or pushed to GitHub
4. ✅ (Optional) A **runner backend** server for code execution

## Deployment Methods

### Method 1: Cloudflare Dashboard (Recommended for First-Time Users)

This is the easiest way to deploy - no command line required!

#### Step 1: Prepare Your Repository

1. Make sure your repository is on GitHub
2. Ensure the following structure exists:
   ```
   Pohlang-PlayGround/
   ├── web/              (your static frontend)
   ├── functions/        (Cloudflare Pages Functions)
   └── wrangler.toml     (Cloudflare config)
   ```

#### Step 2: Connect to Cloudflare Pages

1. Log into your **Cloudflare Dashboard**: https://dash.cloudflare.com
2. Navigate to **Pages** in the left sidebar
3. Click **"Create a project"**
4. Click **"Connect to Git"**
5. Authorize Cloudflare to access your GitHub account
6. Select the **Pohlang-PlayGround** repository

#### Step 3: Configure Build Settings

Configure your project with these settings:

- **Project name**: `pohlang-playground` (or your preferred name)
- **Production branch**: `main`
- **Framework preset**: `None`
- **Build command**: **(Leave completely empty - do NOT enter anything)**
- **Build output directory**: `web`
- **Root directory**: `/` (leave as default)

> **Important**: The build command should be **completely empty**. The playground is a static site with no build step required. If you accidentally entered a command, delete it entirely.

Click **"Save and Deploy"**

#### Step 4: Configure Environment Variables (Optional)

If you want code execution to work, you need a runner backend:

1. Go to your project → **Settings** → **Environment variables**
2. Click **"Add variable"**
3. Add:
   - **Variable name**: `RUNNER_ORIGIN`
   - **Value**: `https://your-runner-backend.com` (URL of your PohLang execution server)
   - **Environment**: Select "Production" and "Preview"
4. Click **"Save"**

> **Note**: Without RUNNER_ORIGIN, the playground will work but code execution will show an error. Users can still browse examples and edit code.

#### Step 5: Deploy!

- Cloudflare will automatically build and deploy your site
- Wait 1-2 minutes for the deployment to complete
- Your playground will be live at: `https://pohlang-playground.pages.dev`

🎉 **Success!** Your playground is now live!

### Method 2: GitHub Actions (Automated CI/CD)

Set up automatic deployments whenever you push to the repository.

#### Step 1: Generate Cloudflare API Token

1. Go to **Cloudflare Dashboard** → **My Profile** → **API Tokens**
2. Click **"Create Token"**
3. Use the **"Edit Cloudflare Workers"** template or create a custom token with:
   - **Permissions**: 
     - Account → Cloudflare Pages → Edit
   - **Account Resources**: Include → Your account
4. Click **"Continue to summary"** → **"Create Token"**
5. **Copy the token** (you won't be able to see it again!)

#### Step 2: Get Your Cloudflare Account ID

1. Go to **Cloudflare Dashboard**
2. Click on **"Workers & Pages"** or any account section
3. Your **Account ID** is displayed in the right sidebar
4. Copy it

#### Step 3: Add GitHub Secrets

1. Go to your **GitHub repository**
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add two secrets:
   - **Name**: `CF_API_TOKEN`
     **Value**: (paste your Cloudflare API token)
   - **Name**: `CF_ACCOUNT_ID`
     **Value**: (paste your Cloudflare Account ID)

#### Step 4: Configure Workflow (Already Done!)

The repository includes `.github/workflows/deploy.yml` which:
- Triggers on push to `main` branch
- Can be manually triggered via GitHub Actions
- Deploys the `web/` directory to Cloudflare Pages

#### Step 5: Deploy

Simply push to the `main` branch:

```bash
git add .
git commit -m "Deploy playground"
git push origin main
```

GitHub Actions will automatically deploy to Cloudflare Pages!

You can monitor the deployment:
1. Go to your repository → **Actions** tab
2. Click on the latest workflow run
3. Watch the deployment progress

### Method 3: Wrangler CLI (For Developers)

Use the command line for quick deployments.

#### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

#### Step 2: Login to Cloudflare

```bash
wrangler login
```

This opens your browser for authentication.

#### Step 3: Deploy

From the repository root:

```bash
wrangler pages deploy web --project-name=pohlang-playground
```

Your playground will be deployed instantly!

To update:
```bash
# Make changes to files in web/
wrangler pages deploy web --project-name=pohlang-playground
```

## Setting Up a Runner Backend (Optional)

To enable code execution, you need a backend server that can run PohLang code.

### Option 1: Simple Node.js Runner

Deploy the included `server/index.js` to a hosting service:

**Deploy to Heroku**:
```bash
# In the server/ directory
heroku create pohlang-runner
git push heroku main
```

**Deploy to DigitalOcean**:
- Create a Droplet (Ubuntu)
- Install Node.js and PohLang CLI
- Run: `npm install && npm start`
- Configure firewall to allow port 5173

**Deploy to Render.com**:
- Connect your repository
- Set build command: `cd server && npm install`
- Set start command: `cd server && npm start`
- Environment: Add `POHLANG_BIN` if needed

### Option 2: Serverless Runner

Create a serverless function (AWS Lambda, Google Cloud Functions, etc.) that:
- Accepts `POST /api/run` with `{ code, mode }`
- Executes PohLang code
- Returns `{ ok, stdout, stderr, ms, exitCode }`

### Setting RUNNER_ORIGIN

Once your runner is deployed, update Cloudflare Pages:

1. Cloudflare Dashboard → Your project → **Settings** → **Environment variables**
2. Add or update `RUNNER_ORIGIN` = `https://your-runner.com`
3. Redeploy (or wait for automatic rebuild)

## Verification

After deployment, verify everything works:

### 1. Check Static Assets
- Visit `https://your-project.pages.dev`
- Should see the playground UI
- Check browser console for errors (F12)

### 2. Test Examples
- Click on "Example" dropdown
- Select `hello.poh`
- Click "Load"
- Should see example code in editor

### 3. Test Code Execution (if runner configured)
- Click "Run" button
- Should see output (or runner error if not configured)

### 4. Test Help Panel
- Press `Ctrl+H` or click help icon (📚)
- Should see syntax reference panel

## Troubleshooting

### Build Command Error: "Unterminated quoted string"

**Problem**: Deployment fails with error: `/bin/sh: 1: Syntax error: Unterminated quoted string`

**Solution**:
1. Go to Cloudflare Dashboard → Your project → **Settings** → **Builds & deployments**
2. Find the **Build command** field
3. **Delete everything** in the build command field - leave it completely empty
4. The field should be blank (no text at all)
5. Verify **Build output directory** is set to `web`
6. Click **"Save"**
7. Go to **Deployments** → **Retry deployment**

> **Why this happens**: The playground is a static site with no build process. An empty build command tells Cloudflare to just serve the files from the `web/` directory without running any commands.

### "Runner not available" Error

**Problem**: Code execution fails with "Runner not available"

**Solution**:
- Verify `RUNNER_ORIGIN` environment variable is set in Cloudflare Pages
- Check that your runner backend is online and accessible
- Test runner directly: `curl -X POST https://your-runner.com/api/run -d '{"code":"Write \"test\""}'`

### 404 Errors for Examples

**Problem**: Examples fail to load

**Solution**:
- Ensure `web/examples/` directory contains `.poh` files
- Verify `web/examples/index.json` lists all examples
- Check Cloudflare Pages build logs

### CSS/JS Not Loading

**Problem**: Page looks broken, no styling

**Solution**:
- Check build output directory is set to `web`
- Verify `web/styles.css` and `web/main.js` exist
- Check browser console for 404 errors
- Clear Cloudflare cache: Dashboard → Caching → Purge Everything

### GitHub Actions Failing

**Problem**: Workflow fails with authentication error

**Solution**:
- Verify `CF_API_TOKEN` has correct permissions
- Verify `CF_ACCOUNT_ID` is correct
- Check token hasn't expired
- Regenerate token if needed

## Custom Domain (Optional)

Want to use your own domain? (e.g., `playground.pohlang.dev`)

1. **Cloudflare Dashboard** → Your project → **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter your domain: `playground.yourdomain.com`
4. Follow the instructions to:
   - Add domain to Cloudflare (if not already)
   - Update DNS records (automatic if domain is on Cloudflare)
5. Wait for SSL certificate provisioning (5-10 minutes)

Your playground will be accessible at your custom domain!

## Monitoring and Analytics

### Enable Web Analytics

1. Cloudflare Dashboard → Your project → **Analytics**
2. Enable **Web Analytics**
3. View:
   - Page views
   - Unique visitors
   - Top pages
   - Traffic sources

### View Logs

1. Cloudflare Dashboard → Your project → **Functions**
2. Click on **Logs** or **Real-time Logs**
3. See function invocations and errors

## Updating the Playground

### Manual Updates

1. Edit files in `web/` directory
2. Commit and push to GitHub
3. Cloudflare Pages auto-deploys (if connected)

Or use Wrangler:
```bash
wrangler pages deploy web --project-name=pohlang-playground
```

### Rollback

If something goes wrong:

1. Cloudflare Dashboard → Your project → **Deployments**
2. Find a previous working deployment
3. Click **"..."** → **"Rollback to this deployment"**

## Best Practices

✅ **Always test locally** before deploying  
✅ **Use environment variables** for configuration  
✅ **Monitor deployments** via GitHub Actions or Cloudflare Dashboard  
✅ **Enable custom domain** for professional appearance  
✅ **Set up analytics** to track usage  
✅ **Keep runner backend secure** (API keys, rate limiting)  
✅ **Regular backups** of your repository  

## Support

Need help?

- **GitHub Issues**: [Report bugs or request features](https://github.com/pohlang/Pohlang-PlayGround/issues)
- **PohLang Docs**: [Read the documentation](https://github.com/pohlang/PohLang/tree/main/doc)
- **Cloudflare Docs**: [Pages documentation](https://developers.cloudflare.com/pages)

---

**Happy Deploying! 🚀**
