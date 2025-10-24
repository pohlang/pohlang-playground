# Add iam.serviceAccounts.actAs permission for Cloud Run deployment
# Run this in Google Cloud SDK Shell

Write-Host "Adding actAs permission..." -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = "pohlang-runner"
$SERVICE_ACCOUNT = "github-actions@pohlang-runner.iam.gserviceaccount.com"
$COMPUTE_SA = "755467759-compute@developer.gserviceaccount.com"

Write-Host "Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "GitHub Actions SA: $SERVICE_ACCOUNT" -ForegroundColor Yellow
Write-Host "Compute Engine SA: $COMPUTE_SA" -ForegroundColor Yellow
Write-Host ""

# Grant Service Account User role on the Compute Engine service account
Write-Host "Granting iam.serviceAccountUser role..." -ForegroundColor Green
gcloud iam service-accounts add-iam-policy-binding $COMPUTE_SA `
    --member="serviceAccount:$SERVICE_ACCOUNT" `
    --role="roles/iam.serviceAccountUser" `
    --project=$PROJECT_ID

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Permission added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "The github-actions service account can now:" -ForegroundColor Cyan
    Write-Host "  - Deploy to Cloud Run" -ForegroundColor White
    Write-Host "  - Act as the Compute Engine service account" -ForegroundColor White
    Write-Host ""
    Write-Host "You can now retry the GitHub Actions deployment." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Failed to add permission" -ForegroundColor Red
    Write-Host "Error code: $LASTEXITCODE" -ForegroundColor Red
}

Write-Host ""
Write-Host "To verify, run:" -ForegroundColor Cyan
Write-Host "gcloud iam service-accounts get-iam-policy $COMPUTE_SA --project=$PROJECT_ID" -ForegroundColor White
