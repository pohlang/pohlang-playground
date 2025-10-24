# 🚀 Automatic Deployment Setup

This guide shows how to set up automatic deployment for the PohLang Playground runner backend to Google Cloud Run.

## Overview

The GitHub Actions workflow automatically:
1. **Builds PohLang binary** for Linux from the official repository
2. **Packages it in Docker** with the Node.js server
3. **Deploys to Cloud Run** whenever you push changes
4. **Provides the service URL** for your frontend configuration

## Prerequisites

### 1. Google Cloud Project Setup

```bash
# Create a new project (or use existing)
gcloud projects create pohlang-runner --name="PohLang Runner"

# Set as default project
gcloud config set project pohlang-runner

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  containerregistry.googleapis.com
```

### 2. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deployer"

# Grant necessary roles
gcloud projects add-iam-policy-binding pohlang-runner \
  --member="serviceAccount:github-actions@pohlang-runner.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding pohlang-runner \
  --member="serviceAccount:github-actions@pohlang-runner.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding pohlang-runner \
  --member="serviceAccount:github-actions@pohlang-runner.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@pohlang-runner.iam.gserviceaccount.com
```

### 3. Configure GitHub Secrets

Go to your repository settings → Secrets and variables → Actions → New repository secret:

#### Required Secrets:

1. **GCP_PROJECT_ID**
   - Value: `pohlang-runner` (or your project ID)
   
2. **GCP_SA_KEY**
   - Value: Contents of `key.json` (the entire JSON file)
   - To get the content: `cat key.json` or open in text editor

#### How to Add Secrets:
```
1. Go to: https://github.com/pohlang/Pohlang-PlayGround/settings/secrets/actions
2. Click "New repository secret"
3. Name: GCP_PROJECT_ID
   Value: pohlang-runner
4. Click "Add secret"
5. Repeat for GCP_SA_KEY with the JSON content
```

## How It Works

### Workflow Triggers

The deployment runs automatically when:
- You push changes to the `main` branch that affect `server/**`
- You manually trigger it from Actions tab

### Build Process

```
1. Checkout PohLang Repository
   ↓
2. Build PohLang Binary (Rust)
   ↓
3. Upload Binary as Artifact
   ↓
4. Download Binary to Server Directory
   ↓
5. Build Docker Image with Binary
   ↓
6. Push to Google Container Registry
   ↓
7. Deploy to Cloud Run
   ↓
8. Output Service URL
```

### Deployed Configuration

- **Memory:** 512Mi
- **CPU:** 1
- **Timeout:** 30s
- **Max Instances:** 10
- **Region:** us-central1
- **Access:** Public (unauthenticated)

## Usage

### Automatic Deployment

Just push your changes:

```bash
cd Pohlang-PlayGround
git add server/
git commit -m "Update server configuration"
git push origin main
```

The workflow will automatically:
1. Build everything
2. Deploy to Cloud Run
3. Show the service URL in the Actions summary

### Manual Deployment

1. Go to: https://github.com/pohlang/Pohlang-PlayGround/actions
2. Click "Deploy Runner to Cloud Run"
3. Click "Run workflow" → "Run workflow"
4. Wait for completion
5. Check the summary for the service URL

### Get Your Service URL

After deployment, find your URL in:

1. **GitHub Actions Summary:**
   - Go to Actions tab
   - Click the latest workflow run
   - See the "Deployment Successful" summary

2. **Or via gcloud CLI:**
   ```bash
   gcloud run services describe pohlang-runner \
     --platform managed \
     --region us-central1 \
     --format 'value(status.url)'
   ```

## Configure Frontend

Once deployed, update your Cloudflare Pages environment variable:

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to Settings → Environment variables
4. Add or update:
   - **Variable name:** `RUNNER_ORIGIN`
   - **Value:** `https://pohlang-runner-xxxxx-uc.a.run.app` (your Cloud Run URL)
5. Redeploy your frontend

## Testing

### Health Check

```bash
# Replace with your service URL
curl https://pohlang-runner-xxxxx-uc.a.run.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "pohlangVersion": "v0.6.1",
  "timestamp": "2025-10-24T..."
}
```

### Run Code

```bash
curl -X POST https://pohlang-runner-xxxxx-uc.a.run.app/api/run \
  -H "Content-Type: application/json" \
  -d '{
    "code": "Start Program\nWrite \"Hello from Cloud Run!\"\nEnd Program"
  }'
```

Expected response:
```json
{
  "success": true,
  "output": "Hello from Cloud Run!\n",
  "error": null,
  "executionTime": 45
}
```

## Monitoring

### View Logs

```bash
# Follow logs in real-time
gcloud run services logs tail pohlang-runner \
  --platform managed \
  --region us-central1

# View recent logs
gcloud run services logs read pohlang-runner \
  --platform managed \
  --region us-central1 \
  --limit 50
```

### Check Metrics

```bash
# Service details
gcloud run services describe pohlang-runner \
  --platform managed \
  --region us-central1

# List revisions
gcloud run revisions list \
  --service pohlang-runner \
  --platform managed \
  --region us-central1
```

Or visit: https://console.cloud.google.com/run

## Updating

### Update Server Code

```bash
# Make changes to server/
cd server
nano index.js

# Commit and push
git add .
git commit -m "Updated rate limiting"
git push origin main

# Deployment happens automatically!
```

### Update Environment Variables

```bash
gcloud run services update pohlang-runner \
  --platform managed \
  --region us-central1 \
  --set-env-vars "MAX_CODE_SIZE=2097152,TIMEOUT_MS=15000"
```

### Rollback

```bash
# List revisions
gcloud run revisions list --service pohlang-runner

# Rollback to specific revision
gcloud run services update-traffic pohlang-runner \
  --to-revisions REVISION_NAME=100
```

## Cost Management

### Pricing (as of 2025)

Cloud Run free tier includes:
- **2 million requests** per month
- **360,000 GB-seconds** of memory
- **180,000 vCPU-seconds**

For this configuration (512Mi, 1 CPU):
- Typical cost: **$0-5/month** for moderate traffic
- About **0.05 requests/second** = FREE

### Monitor Costs

```bash
# Enable billing export
gcloud services enable cloudscheduler.googleapis.com
```

Visit: https://console.cloud.google.com/billing

### Reduce Costs

If needed, adjust in `.github/workflows/deploy-runner.yml`:

```yaml
--memory 256Mi \        # Reduce to 256Mi
--cpu 1 \               # Keep at 1
--max-instances 5 \     # Reduce max instances
--min-instances 0 \     # Scale to zero when idle
```

## Troubleshooting

### Build Fails

```bash
# Check workflow logs
# Go to: https://github.com/pohlang/Pohlang-PlayGround/actions

# Common issues:
# 1. Missing secrets → Add GCP_PROJECT_ID and GCP_SA_KEY
# 2. Permission denied → Check service account roles
# 3. API not enabled → Run gcloud services enable commands
```

### Deployment Fails

```bash
# Check Cloud Run logs
gcloud run services logs tail pohlang-runner

# Test locally first
cd server
docker build -t test-runner .
docker run -p 8080:8080 test-runner
```

### Service Unreachable

```bash
# Check service status
gcloud run services describe pohlang-runner

# Ensure it's public
gcloud run services add-iam-policy-binding pohlang-runner \
  --member="allUsers" \
  --role="roles/run.invoker"
```

## Security Notes

1. **Service Account Key:** Keep `key.json` secure, never commit to repo
2. **Rate Limiting:** Server has built-in rate limits (30 req/min per IP)
3. **Execution Timeout:** Code execution limited to 10 seconds
4. **Code Size:** Maximum 1MB per request
5. **Public Access:** Service is public but protected by rate limits

## Next Steps

✅ Secrets configured → Push changes to deploy  
✅ Service deployed → Update RUNNER_ORIGIN in Cloudflare  
✅ Testing complete → Share with users  

## Support

- **GitHub Issues:** https://github.com/pohlang/Pohlang-PlayGround/issues
- **PohLang Docs:** https://github.com/pohlang/PohLang
- **Cloud Run Docs:** https://cloud.google.com/run/docs

---

**You're all set!** Your PohLang Playground will now deploy automatically to Google Cloud Run. 🚀
