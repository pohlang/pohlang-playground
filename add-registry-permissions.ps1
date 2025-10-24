# Add missing permissions for GitHub Actions to push Docker images
Write-Host "Adding Container Registry permissions..." -ForegroundColor Yellow

# Artifact Registry Writer (for new Artifact Registry)
gcloud projects add-iam-policy-binding pohlang-runner `
    --member="serviceAccount:github-actions@pohlang-runner.iam.gserviceaccount.com" `
    --role="roles/artifactregistry.writer"

# Storage Admin is already added, but let's ensure it's there
gcloud projects add-iam-policy-binding pohlang-runner `
    --member="serviceAccount:github-actions@pohlang-runner.iam.gserviceaccount.com" `
    --role="roles/storage.admin"

Write-Host ""
Write-Host "✅ Permissions added!" -ForegroundColor Green
Write-Host ""
Write-Host "The deployment should now succeed." -ForegroundColor Cyan
Write-Host "Check: https://github.com/pohlang/Pohlang-PlayGround/actions" -ForegroundColor Cyan
