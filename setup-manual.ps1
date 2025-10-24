# Manual Setup Commands for PohLang Runner
# Run these commands in the terminal where gcloud is available

# 1. Set project
gcloud config set project pohlang-runner

# 2. Enable required APIs
Write-Host "Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# 3. Create service account
Write-Host "Creating service account..." -ForegroundColor Yellow
gcloud iam service-accounts create github-actions --display-name="GitHub Actions Deployer"

# 4. Grant permissions
Write-Host "Granting permissions..." -ForegroundColor Yellow
$SA_EMAIL = "github-actions@pohlang-runner.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding pohlang-runner `
    --member="serviceAccount:$SA_EMAIL" `
    --role="roles/run.admin" --condition=None

gcloud projects add-iam-policy-binding pohlang-runner `
    --member="serviceAccount:$SA_EMAIL" `
    --role="roles/storage.admin" --condition=None

gcloud projects add-iam-policy-binding pohlang-runner `
    --member="serviceAccount:$SA_EMAIL" `
    --role="roles/iam.serviceAccountUser" --condition=None

# 5. Create service account key
Write-Host "Creating service account key..." -ForegroundColor Yellow
gcloud iam service-accounts keys create gcp-key-pohlang-runner.json `
    --iam-account=$SA_EMAIL

# 6. Display instructions
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 GitHub Secrets Configuration" -ForegroundColor Yellow
Write-Host "Add these secrets to your repository:"
Write-Host "https://github.com/pohlang/Pohlang-PlayGround/settings/secrets/actions"
Write-Host ""
Write-Host "1. GCP_PROJECT_ID" -ForegroundColor Cyan
Write-Host "   Value: pohlang-runner"
Write-Host ""
Write-Host "2. GCP_SA_KEY" -ForegroundColor Cyan
Write-Host "   Value: (contents of gcp-key-pohlang-runner.json)"
Write-Host ""
Write-Host "To copy the key:" -ForegroundColor Yellow
Write-Host "  Get-Content gcp-key-pohlang-runner.json | Set-Clipboard"
Write-Host ""
Write-Host "⚠️  Keep gcp-key-pohlang-runner.json secure!" -ForegroundColor Yellow
