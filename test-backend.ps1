# Test Cloud Run Backend
$url = "https://pohlang-runner-fflb6dkurq-uc.a.run.app/api/run"

$body = @{
    code = @"
Start Program
Write "Hello from Cloud Run!"
End Program
"@
} | ConvertTo-Json

Write-Host "Testing Cloud Run backend..." -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Yellow
Write-Host ""

$response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"

Write-Host "Response:" -ForegroundColor Green
$response | ConvertTo-Json -Depth 10
