# 🚀 Manual Setup Guide (No gcloud CLI needed)

If you don't have `gcloud` CLI installed or prefer manual setup, follow these steps.

## Option 1: Install gcloud CLI (Recommended)

**Download**: https://cloud.google.com/sdk/docs/install

### Windows:
```powershell
# Download and run the installer
# https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe

# After installation, restart PowerShell and run:
gcloud init
cd C:\Users\habib\POHLANG\Pohlang-PlayGround
.\setup-deployment.ps1
```

### Mac:
```bash
# Install via Homebrew
brew install --cask google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install-sdk

# Initialize and run setup
gcloud init
cd ~/Pohlang-PlayGround
./setup-deployment.sh
```

## Option 2: Manual Setup via Web Console

### Step 1: Create GCP Project (2 minutes)

1. Go to: https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Project name: `pohlang-runner`
4. Click "Create"
5. **Copy your Project ID** (e.g., `pohlang-runner-123456`)

### Step 2: Enable APIs (1 minute)

1. Go to: https://console.cloud.google.com/apis/library
2. Search and enable:
   - **Cloud Run API**
   - **Container Registry API**

### Step 3: Create Service Account (3 minutes)

1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Click "Create Service Account"
3. Details:
   - **Name**: `github-actions`
   - **Description**: `GitHub Actions Deployer`
   - Click "Create and Continue"

4. Grant roles (click "Add Another Role" for each):
   - `Cloud Run Admin`
   - `Storage Admin`
   - `Service Account User`
   - Click "Continue" → "Done"

### Step 4: Create Service Account Key (2 minutes)

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose **JSON**
5. Click "Create"
6. **Save the downloaded JSON file** (don't lose it!)

### Step 5: Add GitHub Secrets (2 minutes)

1. Go to: https://github.com/pohlang/Pohlang-PlayGround/settings/secrets/actions
2. Click "New repository secret"

**Secret 1: GCP_PROJECT_ID**
- Name: `GCP_PROJECT_ID`
- Value: Your project ID (e.g., `pohlang-runner-123456`)
- Click "Add secret"

**Secret 2: GCP_SA_KEY**
- Name: `GCP_SA_KEY`
- Value: **Entire contents** of the JSON file you downloaded
- Open the JSON file in Notepad/TextEdit
- Copy everything (starts with `{` and ends with `}`)
- Paste into the secret value
- Click "Add secret"

### Step 6: Verify Secrets

You should see:
- ✅ `GCP_PROJECT_ID` 
- ✅ `GCP_SA_KEY`

### Step 7: Deploy! (2 minutes)

Now push your changes:

```bash
cd Pohlang-PlayGround
git add .
git commit -m "Setup automatic deployment"
git push origin main
```

### Step 8: Monitor Deployment

1. Go to: https://github.com/pohlang/Pohlang-PlayGround/actions
2. Click on the running workflow: "Deploy Runner to Cloud Run"
3. Wait for ✅ (takes ~5-8 minutes first time)
4. Check the summary for your **Service URL**

### Step 9: Configure Cloudflare

1. Copy your Cloud Run URL (e.g., `https://pohlang-runner-xxxxx-uc.a.run.app`)
2. Go to Cloudflare Pages dashboard
3. Select your project → Settings → Environment variables
4. Add variable:
   - **Name**: `RUNNER_ORIGIN`
   - **Value**: Your Cloud Run URL
   - **Environment**: Production
5. Click "Save"
6. Redeploy your site (Deployments tab → click "..." → "Retry deployment")

## Done! 🎉

Test your deployment:

```bash
# Replace with your actual service URL
curl https://pohlang-runner-xxxxx-uc.a.run.app/api/health
```

Expected response:
```json
{"status":"ok","pohlangVersion":"v0.6.1","timestamp":"..."}
```

## Troubleshooting

### "Workflow fails with 'bad credentials'"
- Verify `GCP_SA_KEY` contains the **entire** JSON file contents
- Make sure it starts with `{` and ends with `}`
- No extra spaces or characters

### "Workflow fails with 'permission denied'"
- Verify service account has all 3 roles:
  - Cloud Run Admin
  - Storage Admin  
  - Service Account User

### "Service unreachable after deployment"
- Wait 2-3 minutes for first cold start
- Check Cloud Run console: https://console.cloud.google.com/run
- Look for error messages in logs

### "Can't find project"
- Make sure you copied the correct Project ID
- Not the project name, but the ID (usually has numbers)

## What's Next?

Every time you push to `main`:
- Frontend changes → Cloudflare auto-deploys
- Backend changes → Cloud Run auto-deploys

No manual steps needed anymore! 🚀

## Cost Estimate

- **Cloud Run Free Tier**: 2M requests/month
- **Your config**: 512Mi RAM, 1 CPU
- **Typical cost**: $0-2/month for light traffic
- **Monitoring**: Free in GCP Console

## Alternative: Use Railway (Simpler)

If you prefer a simpler option without GCP:

1. Sign up: https://railway.app (free tier: $5/month credit)
2. Connect GitHub repo
3. Deploy from `server/` directory
4. Set environment variables
5. Get deployment URL

See: `HOSTING_COMPARISON.md` for comparison

## Support

- 📖 Full automation guide: [AUTOMATIC_DEPLOYMENT.md](AUTOMATIC_DEPLOYMENT.md)
- 🐛 Issues: https://github.com/pohlang/Pohlang-PlayGround/issues
- 💬 Help: https://github.com/pohlang/PohLang/discussions

---

**You're all set!** From now on, just push changes and watch them deploy automatically! 🎉
