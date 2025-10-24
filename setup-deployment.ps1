# PohLang Playground - Automatic Deployment Setup Script (PowerShell)
# This script helps you configure Google Cloud and GitHub for automatic deployment

Write-Host "🚀 PohLang Playground - Automatic Deployment Setup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if gcloud is installed
try {
    $null = Get-Command gcloud -ErrorAction Stop
    Write-Host "✓ gcloud CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ gcloud CLI not found" -ForegroundColor Red
    Write-Host "Please install: https://cloud.google.com/sdk/docs/install"
    exit 1
}

Write-Host ""

# Get project ID
$PROJECT_ID = Read-Host "Enter your GCP Project ID (or press Enter to create new)"

if ([string]::IsNullOrWhiteSpace($PROJECT_ID)) {
    $PROJECT_ID = Read-Host "Enter a new project ID (e.g., pohlang-runner-123)"
    Write-Host ""
    Write-Host "Creating project: $PROJECT_ID" -ForegroundColor Yellow
    gcloud projects create $PROJECT_ID --name="PohLang Runner"
}

Write-Host ""
Write-Host "Setting project: $PROJECT_ID" -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

Write-Host ""
Write-Host "Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

Write-Host ""
Write-Host "✓ APIs enabled" -ForegroundColor Green
Write-Host ""

# Service account
$SA_NAME = "github-actions"
$SA_EMAIL = "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

Write-Host "Creating service account: $SA_EMAIL" -ForegroundColor Yellow
try {
    gcloud iam service-accounts create $SA_NAME --display-name="GitHub Actions Deployer" 2>$null
} catch {
    Write-Host "Service account already exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Granting permissions..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$SA_EMAIL" `
    --role="roles/run.admin" --condition=None

gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$SA_EMAIL" `
    --role="roles/storage.admin" --condition=None

gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$SA_EMAIL" `
    --role="roles/iam.serviceAccountUser" --condition=None

Write-Host ""
Write-Host "✓ Permissions granted" -ForegroundColor Green
Write-Host ""

# Create key
$KEY_FILE = "gcp-key-$PROJECT_ID.json"
Write-Host "Creating service account key: $KEY_FILE" -ForegroundColor Yellow
gcloud iam service-accounts keys create $KEY_FILE `
    --iam-account=$SA_EMAIL

Write-Host ""
Write-Host "✓ Service account key created" -ForegroundColor Green
Write-Host ""

# Display GitHub secrets
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "📋 GitHub Secrets Configuration" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Add these secrets to your GitHub repository:"
Write-Host "https://github.com/pohlang/Pohlang-PlayGround/settings/secrets/actions"
Write-Host ""
Write-Host "1. GCP_PROJECT_ID" -ForegroundColor Cyan
Write-Host "   Value: $PROJECT_ID"
Write-Host ""
Write-Host "2. GCP_SA_KEY" -ForegroundColor Cyan
Write-Host "   Value: (contents of $KEY_FILE)"
Write-Host ""
Write-Host "To copy the key content:" -ForegroundColor Yellow
Write-Host "  Get-Content $KEY_FILE | Set-Clipboard"
Write-Host "  # Or manually open: notepad $KEY_FILE"
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Test gcloud auth
Write-Host "Testing authentication..." -ForegroundColor Yellow
$null = gcloud auth application-default print-access-token 2>$null
Write-Host "✓ Authentication successful" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Add GitHub secrets (GCP_PROJECT_ID and GCP_SA_KEY)"
Write-Host "2. Push changes to trigger deployment:"
Write-Host "   git add ."
Write-Host "   git commit -m 'Setup automatic deployment'"
Write-Host "   git push origin main"
Write-Host "3. Check Actions tab for deployment status"
Write-Host ""
Write-Host "📚 Full documentation: AUTOMATIC_DEPLOYMENT.md"
Write-Host ""
Write-Host "⚠️  Important: Keep $KEY_FILE secure and never commit it!" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Tip: Add $KEY_FILE to .gitignore" -ForegroundColor Cyan
