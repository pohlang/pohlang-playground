# 🚀 Quick Deployment Guide

Get your PohLang Playground deployed in **5 minutes**!

## Prerequisites

- [ ] GitHub account with repo access
- [ ] Google Cloud account (free tier works!)
- [ ] `gcloud` CLI installed ([Download here](https://cloud.google.com/sdk/docs/install))

> **Don't have gcloud CLI?** See [MANUAL_SETUP.md](MANUAL_SETUP.md) for web console setup

## Step 1: Run Setup Script (2 minutes)

### On Windows (PowerShell):
```powershell
cd Pohlang-PlayGround
.\setup-deployment.ps1
```

### On Mac/Linux (Bash):
```bash
cd Pohlang-PlayGround
chmod +x setup-deployment.sh
./setup-deployment.sh
```

The script will:
- ✅ Create/configure GCP project
- ✅ Enable required APIs
- ✅ Create service account
- ✅ Generate credentials
- ✅ Display GitHub secrets

## Step 2: Add GitHub Secrets (1 minute)

1. Go to: `https://github.com/pohlang/Pohlang-PlayGround/settings/secrets/actions`

2. Click **"New repository secret"**

3. Add **GCP_PROJECT_ID**:
   - Name: `GCP_PROJECT_ID`
   - Value: Your project ID (shown in script output)
   - Click "Add secret"

4. Add **GCP_SA_KEY**:
   - Name: `GCP_SA_KEY`
   - Value: Contents of `gcp-key-*.json` file
   - To copy: `Get-Content gcp-key-*.json | Set-Clipboard` (PowerShell)
   - Or: `cat gcp-key-*.json` and copy manually
   - Click "Add secret"

## Step 3: Deploy! (2 minutes)

```bash
# Commit the workflow files
git add .github/workflows/
git commit -m "Add automatic deployment"
git push origin main
```

Watch deployment:
1. Go to: `https://github.com/pohlang/Pohlang-PlayGround/actions`
2. Click on the running workflow
3. Wait for ✅ green checkmark

## Step 4: Configure Frontend (30 seconds)

1. Copy your Cloud Run URL from GitHub Actions summary
2. Go to Cloudflare Pages dashboard
3. Settings → Environment variables
4. Add: `RUNNER_ORIGIN` = `https://your-service-url.run.app`
5. Redeploy frontend

## Done! 🎉

Your playground is live:
- **Frontend**: `https://pohlang-playground.pages.dev`
- **Backend**: `https://your-service-xxxxx-uc.a.run.app`

### Test It

```bash
# Health check
curl https://your-service-xxxxx-uc.a.run.app/api/health

# Run code
curl -X POST https://your-service-xxxxx-uc.a.run.app/api/run \
  -H "Content-Type: application/json" \
  -d '{"code":"Start Program\nWrite \"Hello World!\"\nEnd Program"}'
```

## Troubleshooting

### "gcloud not found"
Install: https://cloud.google.com/sdk/docs/install

### "Permission denied"
Run setup script as administrator/sudo

### "Workflow fails"
Check that both GitHub secrets are added correctly

### "Service unreachable"
Wait 1-2 minutes for Cloud Run to fully deploy

## What Happens Next?

Every time you push changes to `server/`:
1. 🔨 GitHub Actions builds PohLang for Linux
2. 🐳 Docker image is created
3. 📤 Image pushed to Google Container Registry
4. 🚀 Deployed to Cloud Run
5. ✅ Service URL remains the same

**No manual steps needed!**

## Cost

- **Free tier**: 2M requests/month
- **Typical usage**: $0-2/month
- **Scale to zero**: No cost when idle

## Next Steps

- [ ] Share your playground with users
- [ ] Add more examples in `web/examples/`
- [ ] Monitor usage in [GCP Console](https://console.cloud.google.com/run)
- [ ] Check logs: `gcloud run services logs tail pohlang-runner`

## Support

Need help? 
- 📖 Full docs: [AUTOMATIC_DEPLOYMENT.md](AUTOMATIC_DEPLOYMENT.md)
- 🐛 Issues: [GitHub Issues](https://github.com/pohlang/Pohlang-PlayGround/issues)

---

**That's it! You're now running a production-grade PohLang Playground! 🚀**
