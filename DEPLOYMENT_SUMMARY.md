# PohLang Playground - Deployment Summary

**Last Updated:** January 24, 2025  
**PohLang Version:** 0.6.7  
**Status:** ✅ FULLY OPERATIONAL

---

## 🌐 Live URLs

| Service | URL | Status |
|---------|-----|--------|
| **Playground (Frontend)** | https://pohlang-playground.pages.dev | ✅ Live |
| **Runner (Backend)** | https://pohlang-runner-fflb6dkurq-uc.a.run.app | ✅ Live |
| **Health Check** | https://pohlang-runner-fflb6dkurq-uc.a.run.app/api/health | ✅ Responding |

---

## 📋 Features Deployed

### Frontend (Cloudflare Pages)
- ✅ Modern, responsive UI with dark theme
- ✅ Welcome modal for first-time users
- ✅ Syntax help panel (Ctrl/Cmd+H)
- ✅ 12 comprehensive examples:
  - tutorial_basics.poh (absolute beginners)
  - hello.poh
  - functions.poh
  - classes.poh
  - web_server.poh
  - error_handling.poh (input validation)
  - file_operations.poh
  - data_processing.poh
  - lists.poh
  - dict.poh
  - control_flow.poh
  - calc.poh
- ✅ Auto-save to localStorage
- ✅ Export/import .poh files
- ✅ Multiple execution modes (Run, Bytecode, Disassemble)
- ✅ Keyboard shortcuts (Ctrl/Cmd+Enter to run, Ctrl/Cmd+S to save)
- ✅ Line and character counters

### Backend (Google Cloud Run)
- ✅ PohLang 0.6.7 runtime
- ✅ Debian slim base (glibc compatible)
- ✅ Rate limiting: 30 requests/minute per IP
- ✅ Execution timeout: 10 seconds
- ✅ Code size limit: 1MB
- ✅ Health check endpoint
- ✅ Non-root user execution
- ✅ Automatic scaling (0-10 instances)
- ✅ 512Mi memory, 1 CPU

---

## 🔄 Automatic Deployment (CI/CD)

### GitHub Actions Workflows

#### Frontend: `.github/workflows/deploy.yml`
- **Trigger:** Push to `main` branch OR manual dispatch
- **Action:** Deploys `web/` directory to Cloudflare Pages
- **Duration:** ~1-2 minutes
- **Requirements:** `CF_API_TOKEN`, `CF_ACCOUNT_ID` secrets

#### Backend: `.github/workflows/deploy-runner.yml`
- **Trigger:** Changes to `server/**` OR manual dispatch
- **Action:** Builds PohLang from main branch, packages in Docker, deploys to Cloud Run
- **Duration:** ~6-8 minutes
- **Requirements:** `GCP_PROJECT_ID`, `GCP_SA_KEY` secrets
- **PohLang Build:** Always uses latest commit from `pohlang/PohLang` main branch

### Recent Deployments
```
✅ Deploy Runner to Cloud Run - Success (PohLang 0.6.7) - Jan 24, 2025
✅ Universal Setup Guide - Success - Jan 24, 2025
✅ error_handling.poh fixes - Success - Jan 24, 2025
✅ Initial deployment - Success - Jan 23, 2025
```

---

## 🛠️ Technical Stack

### Frontend
- **Platform:** Cloudflare Pages (Global CDN)
- **Technologies:** HTML5, CSS3, Vanilla JavaScript
- **Features:** Service Workers, LocalStorage, Responsive Design
- **Build:** None required (static site)

### Backend
- **Platform:** Google Cloud Run (us-central1)
- **Container:** Debian slim + Node.js 18 + PohLang CLI
- **Image Registry:** Artifact Registry (us-central1-docker.pkg.dev)
- **Language:** Node.js 18 + Express.js
- **Security:** Rate limiting, timeout protection, non-root user

### Integration
- **Communication:** Cloudflare Pages Function → Cloud Run API
- **Environment Variable:** `RUNNER_ORIGIN` (configured in wrangler.toml)
- **API Endpoint:** `POST /api/run` (proxied via Cloudflare Pages Function)

---

## 🔐 Configuration

### Cloudflare Pages Settings
```toml
# wrangler.toml
[env.production.vars]
RUNNER_ORIGIN = "https://pohlang-runner-fflb6dkurq-uc.a.run.app"

[env.preview.vars]
RUNNER_ORIGIN = "https://pohlang-runner-fflb6dkurq-uc.a.run.app"
```

### GCP Project Details
- **Project ID:** pohlang-runner
- **Project Number:** 755467759
- **Service Account:** github-actions@pohlang-runner.iam.gserviceaccount.com
- **Permissions:** 
  - `roles/artifactregistry.writer`
  - `roles/artifactregistry.repoAdmin`
  - `roles/storage.admin`
  - `roles/run.admin`
  - `roles/iam.serviceAccountUser`

### Cloud Run Configuration
```yaml
Service: pohlang-runner
Region: us-central1
Memory: 512Mi
CPU: 1
Timeout: 30s
Max Instances: 10
Min Instances: 0 (scales to zero)
Concurrency: 80
```

---

## 📊 Performance & Limits

### Frontend (Cloudflare Pages)
- **Global Availability:** Yes (200+ cities)
- **Response Time:** <50ms (cached)
- **Bandwidth:** Unlimited
- **Requests:** Unlimited
- **Build Time:** None (static site)

### Backend (Cloud Run)
- **Cold Start:** ~2-3 seconds (first request)
- **Warm Response:** ~50-100ms
- **Execution Timeout:** 10 seconds per request
- **Rate Limit:** 30 requests/minute per IP
- **Code Size Limit:** 1MB
- **Concurrent Requests:** Up to 80 per instance
- **Auto-scaling:** 0-10 instances

---

## 🧪 Testing & Verification

### Health Check
```powershell
curl https://pohlang-runner-fflb6dkurq-uc.a.run.app/api/health
```
Expected response:
```json
{
  "ok": true,
  "version": "1.0.0",
  "pohlang_bin": "/usr/local/bin/pohlang",
  "node_version": "v18.20.8",
  "uptime": 419.29
}
```

### Code Execution Test
```powershell
$body = @{
    code = "Start Program`nWrite `"Hello, World!`"`nEnd Program"
    mode = "run"
} | ConvertTo-Json

curl -X POST -H "Content-Type: application/json" -d $body https://pohlang-runner-fflb6dkurq-uc.a.run.app/api/run
```
Expected response:
```json
{
  "ok": true,
  "stdout": "Hello, World!\n",
  "stderr": "",
  "exitCode": 0,
  "ms": 29
}
```

### Frontend Verification
1. Visit https://pohlang-playground.pages.dev
2. Welcome modal should appear for first-time users
3. Load any example from the dropdown
4. Click "Run" or press Ctrl/Cmd+Enter
5. Output should appear within 1-2 seconds

---

## 📚 Documentation

All documentation has been updated with playground links:

- ✅ [PohLang/README.md](https://github.com/pohlang/PohLang/blob/main/README.md)
- ✅ [PohLang/INSTALL.md](https://github.com/pohlang/PohLang/blob/main/INSTALL.md)
- ✅ [PohLang/doc/PohLang_Guide.md](https://github.com/pohlang/PohLang/blob/main/doc/PohLang_Guide.md)
- ✅ [PLHub/README.md](https://github.com/pohlang/PLHub/blob/main/README.md)
- ✅ [PohLang-VS_code_extention/README.md](https://github.com/pohlang/PohLang-VS_code_extention/blob/main/README.md)
- ✅ [UNIVERSAL_SETUP_GUIDE.md](UNIVERSAL_SETUP_GUIDE.md) (New!)

---

## 🚀 How to Update

### Update Frontend
```bash
# Make changes to web/ directory
git add web/
git commit -m "Update frontend"
git push origin main
# Cloudflare Pages deploys automatically in ~1-2 minutes
```

### Update Backend
```bash
# Make changes to server/ directory
git add server/
git commit -m "Update backend"
git push origin main
# Cloud Run deploys automatically in ~6-8 minutes
```

### Update PohLang Version
```bash
# The backend always builds from pohlang/PohLang main branch
# To deploy a new PohLang version:
# 1. Wait for new commit to pohlang/PohLang main branch
# 2. Trigger backend deployment (any change to server/ or manual workflow dispatch)
# 3. New PohLang version will be built and deployed automatically
```

### Manual Deployment Trigger
```bash
# Go to GitHub Actions → Deploy Runner to Cloud Run → Run workflow
# Or add a comment to server/README.md and commit
```

---

## 🐛 Troubleshooting

### Backend Not Responding
1. Check Cloud Run logs: https://console.cloud.google.com/run/detail/us-central1/pohlang-runner/logs
2. Verify service is running: `curl https://pohlang-runner-fflb6dkurq-uc.a.run.app/api/health`
3. Check GitHub Actions for failed deployments

### Frontend Shows "Connection Failed"
1. Verify `RUNNER_ORIGIN` is set in Cloudflare Pages settings
2. Check if backend is responding (health check)
3. Look at browser console for errors (F12)

### Rate Limiting Issues
- Rate limit: 30 requests/minute per IP
- Solution: Wait 1 minute or deploy your own backend instance

### Example Code Not Working
1. Verify syntax matches PohLang 0.6.7 requirements
2. Check for comments before "Start Program" (not allowed)
3. Check for colons after function/if statements (not allowed)
4. Verify "Otherwise" is used instead of "Else If"

---

## 📈 Analytics & Monitoring

### Cloudflare Pages
- Dashboard: https://dash.cloudflare.com → Pages → pohlang-playground
- View: Requests, bandwidth, errors, deployments

### Google Cloud Run
- Dashboard: https://console.cloud.google.com/run
- Metrics: Request count, latency, CPU usage, memory usage, instance count
- Logs: Execution logs, error traces, startup logs

---

## 🎯 Success Metrics

- ✅ **Uptime:** 99.9%+ (Cloudflare + Cloud Run SLAs)
- ✅ **Response Time:** <2s for code execution (warm instance)
- ✅ **Global Availability:** 200+ Cloudflare edge locations
- ✅ **Cost:** ~$0/month (within free tier for both platforms)
- ✅ **Security:** Rate limiting, timeout protection, non-root execution
- ✅ **Scalability:** Auto-scales to 10 instances (handles thousands of requests)

---

## 🔮 Future Enhancements

### Planned Features
- [ ] WebAssembly-based PohLang VM (eliminate backend requirement)
- [ ] Share code via URLs (permalink generation)
- [ ] Syntax highlighting with CodeMirror or Monaco
- [ ] Multi-file project support
- [ ] Real-time collaboration
- [ ] Mobile app (PWA)
- [ ] VS Code web integration

### Infrastructure Improvements
- [ ] Multiple backend regions (Europe, Asia)
- [ ] CDN caching for example files
- [ ] Rate limiting per user (not just IP)
- [ ] Analytics dashboard
- [ ] A/B testing framework

---

## 🤝 Contributing

Want to improve the playground?

1. Fork the repository: https://github.com/pohlang/Pohlang-PlayGround
2. Make your changes
3. Test locally: `cd server && npm start`
4. Submit a pull request
5. CI/CD will automatically deploy after merge

---

## 📞 Support

- **Issues:** https://github.com/pohlang/Pohlang-PlayGround/issues
- **PohLang Community:** https://github.com/pohlang/PohLang/discussions
- **Documentation:** https://github.com/pohlang/PohLang/tree/main/doc

---

**Built with ❤️ by the PohLang Community**  
**Last Verified:** January 24, 2025  
**Status:** ✅ All Systems Operational
