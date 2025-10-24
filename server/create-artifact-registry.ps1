# Create Artifact Registry repository for PohLang Runner
# Run this in Google Cloud SDK Shell

Write-Host "Creating Artifact Registry repository..." -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = "pohlang-runner"
$REPOSITORY_NAME = "pohlang-runner"
$REGION = "us-central1"

Write-Host "Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "Repository: $REPOSITORY_NAME" -ForegroundColor Yellow
Write-Host "Region: $REGION" -ForegroundColor Yellow
Write-Host ""

# Create the Artifact Registry repository
Write-Host "Creating repository..." -ForegroundColor Green
gcloud artifacts repositories create $REPOSITORY_NAME `
    --repository-format=docker `
    --location=$REGION `
    --description="Docker repository for PohLang Runner" `
    --project=$PROJECT_ID

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Repository created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository URL: $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY_NAME" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You can now retry the GitHub Actions deployment." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Failed to create repository" -ForegroundColor Red
    Write-Host "Error code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host ""
    Write-Host "If repository already exists, you can ignore this error." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "To verify, run:" -ForegroundColor Cyan
Write-Host "gcloud artifacts repositories list --project=$PROJECT_ID --location=$REGION" -ForegroundColor White
