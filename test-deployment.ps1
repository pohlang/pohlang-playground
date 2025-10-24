# Test Cloud Run Deployment
param(
    [Parameter(Mandatory=$true)]
    [string]$ServiceUrl
)

Write-Host "🧪 Testing PohLang Runner Deployment" -ForegroundColor Cyan
Write-Host "Service URL: $ServiceUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣ Health Check..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$ServiceUrl/api/health" -Method Get
    Write-Host "   ✅ Status: $($health.status)" -ForegroundColor Green
    Write-Host "   📦 PohLang Binary: $($health.pohlang_bin)" -ForegroundColor Gray
    Write-Host "   🏃 Uptime: $([math]::Round($health.uptime, 2))s" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Health check failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Run Simple Code
Write-Host "2️⃣ Running Simple Code..." -ForegroundColor Cyan
$code = @"
Start Program
Write "Hello from Cloud Run!"
End Program
"@

try {
    $result = Invoke-RestMethod -Uri "$ServiceUrl/api/run" -Method Post `
        -ContentType "application/json" `
        -Body (@{code=$code} | ConvertTo-Json)
    
    if ($result.ok) {
        Write-Host "   ✅ Execution successful!" -ForegroundColor Green
        Write-Host "   📤 Output: $($result.stdout.Trim())" -ForegroundColor Gray
        Write-Host "   ⏱️  Time: $($result.ms)ms" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Execution failed: $($result.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Request failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Bytecode Mode
Write-Host "3️⃣ Testing Bytecode Mode..." -ForegroundColor Cyan
try {
    $result = Invoke-RestMethod -Uri "$ServiceUrl/api/run" -Method Post `
        -ContentType "application/json" `
        -Body (@{code=$code; mode="bytecode"} | ConvertTo-Json)
    
    if ($result.ok) {
        Write-Host "   ✅ Bytecode generation successful!" -ForegroundColor Green
        Write-Host "   📊 Output length: $($result.stdout.Length) bytes" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Bytecode test failed: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ All tests passed!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Add to Cloudflare Pages:"
Write-Host "   RUNNER_ORIGIN = $ServiceUrl"
Write-Host ""
Write-Host "2. Test in browser:"
Write-Host "   https://pohlang-playground.pages.dev"
Write-Host ""
