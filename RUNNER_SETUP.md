# PohLang Runner Backend Setup Guide

This guide shows you how to set up a backend server that executes PohLang code for the playground.

## 🎯 What is the Runner?

The runner is a server that:
- Receives PohLang code from the playground
- Executes it using the PohLang CLI
- Returns the output (stdout, stderr, execution time)

**Architecture**: Playground (Cloudflare Pages) → Runner Backend (Your Server) → PohLang CLI

## 📋 Prerequisites

Before setting up the runner, you need:
- ✅ PohLang CLI built and working
- ✅ Node.js 18+ installed
- ✅ A server or hosting platform

## 🚀 Hosting Options (Ranked by Ease)

### Option 1: Firebase Cloud Functions (Recommended - Free Tier!)
**Cost**: **FREE** up to 2M invocations/month  
**Difficulty**: ⭐ Easy  
**Setup Time**: 10 minutes  
**Pros**: Free tier, Google infrastructure, automatic scaling, built-in monitoring  
**Cons**: 540s timeout limit (plenty for our use case)

### Option 2: Railway.app (Very Easy)
**Cost**: $5/month (free trial available)  
**Difficulty**: ⭐ Easy  
**Setup Time**: 5 minutes  
**Pros**: Easiest GitHub integration, instant deployment  
**Cons**: Paid only (after trial)

### Option 3: Google Cloud Run (BEST FOR POHLANG - HIGHLY RECOMMENDED!)
**Cost**: **FREE** up to 2M requests/month, then ~$0.40 per million requests  
**Difficulty**: ⭐⭐ Medium  
**Setup Time**: 15 minutes  
**Pros**: ✅ FREE tier, ✅ Runs native binaries (PohLang CLI), ✅ Scales to zero, ✅ Fast cold starts  
**Cons**: Requires Docker (but we provide the Dockerfile!)  
**Why Cloud Run?** It can run your PohLang binary directly in a container!

### Option 4: DigitalOcean App Platform
**Cost**: ~$5/month  
**Difficulty**: ⭐⭐ Medium  
**Setup Time**: 10 minutes  
**Pros**: Simple, predictable pricing, good docs  
**Cons**: No free tier

### Option 5: Render.com
**Cost**: **FREE** tier available  
**Difficulty**: ⭐⭐ Medium  
**Setup Time**: 15 minutes  
**Pros**: Free tier, simple deployment  
**Cons**: Free tier has cold starts

### Option 6: DigitalOcean Droplet (Traditional VPS)
**Cost**: $4-6/month  
**Difficulty**: ⭐⭐⭐ Advanced  
**Setup Time**: 30 minutes  
**Pros**: Full control, cheaper at scale  
**Cons**: Manual setup required

### Option 7: AWS Lambda / EC2
**Cost**: Variable  
**Difficulty**: ⭐⭐⭐⭐ Advanced  
**Setup Time**: 45 minutes  
**Pros**: AWS ecosystem, highly scalable  
**Cons**: Complex setup, learning curve  

---

## 🔥 Quick Start: Firebase Cloud Functions (FREE & Recommended!)

Firebase is perfect for the playground because:
- ✅ **FREE tier** - 2 million invocations/month
- ✅ **Google infrastructure** - Fast and reliable
- ✅ **Auto-scaling** - Handles traffic spikes
- ✅ **Built-in monitoring** - Firebase Console shows everything
- ✅ **No server management** - Fully serverless

### Important Note About Firebase

**Challenge**: Firebase Cloud Functions run in a Node.js environment and cannot directly execute native binaries like PohLang CLI.

**Solution**: We have 3 approaches:

#### Approach A: Use Firebase + External Binary Host (Hybrid - Recommended)
Firebase function calls a lightweight VPS that has PohLang installed.

**Pros**: Free Firebase tier, simple function code  
**Cons**: Need a small VPS for binary ($4/month)

#### Approach B: Compile PohLang to WebAssembly (Future)
Run PohLang directly in the browser or Cloud Function via WASM.

**Pros**: Fully serverless, no backend needed  
**Cons**: Requires PohLang WASM compilation (not yet available)

#### Approach C: Use Google Cloud Run Instead
Container-based, can include binary, still has generous free tier.

**Pros**: Can include binary, free tier  
**Cons**: Slightly more complex than Firebase Functions

### Let's Set Up Approach A (Firebase + Small VPS)

This gives you the best of both worlds:
- Firebase handles requests (FREE, scales automatically)
- Small VPS executes code (cheap, always on)

#### Step 1: Deploy Small Execution Server

First, let's deploy a minimal execution server to a VPS:

```bash
# SSH into your $4 DigitalOcean droplet
ssh root@your_droplet_ip

# Quick setup script
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs git
git clone https://github.com/YOUR_USERNAME/pohlang-runner.git
cd pohlang-runner
npm install --production
chmod +x bin/pohlang

# Add API key for security
echo "API_KEY=$(openssl rand -hex 32)" >> .env

# Start with PM2
npm install -g pm2
pm2 start index.js --name pohlang-runner
pm2 startup
pm2 save
```

Get your API key:
```bash
cat .env | grep API_KEY
```

#### Step 2: Create Firebase Project

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Create project directory
mkdir pohlang-firebase-proxy
cd pohlang-firebase-proxy

# Initialize Firebase
firebase init functions

# Select:
# - Use an existing project or create new
# - JavaScript
# - ESLint: Yes
# - Install dependencies: Yes
```

#### Step 3: Create Proxy Function

Edit `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const axios = require('axios');

// Configuration
const RUNNER_URL = 'http://your-droplet-ip:5173';
const API_KEY = 'your-api-key-from-step-1';

// CORS enabled function
exports.run = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '256MB'
  })
  .https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
      return;
    }

    try {
      const { code, mode } = req.body;

      if (!code || typeof code !== 'string') {
        res.status(400).json({ ok: false, error: 'Invalid code' });
        return;
      }

      // Forward to execution server
      const response = await axios.post(
        `${RUNNER_URL}/api/run`,
        { code, mode: mode || 'run' },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
          },
          timeout: 25000 // 25 seconds (function timeout is 30s)
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error('Execution error:', error.message);
      
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else if (error.code === 'ECONNABORTED') {
        res.status(504).json({ 
          ok: false, 
          error: 'Execution timeout' 
        });
      } else {
        res.status(500).json({ 
          ok: false, 
          error: 'Runner unavailable' 
        });
      }
    }
  });

// Health check
exports.health = functions.https.onRequest((req, res) => {
  res.json({ ok: true, service: 'firebase' });
});
```

Install axios:
```bash
cd functions
npm install axios
```

#### Step 4: Secure the Execution Server

Update your VPS server to require API key. Edit `server/index.js`:

```javascript
// Add after other middleware
app.use('/api/run', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.API_KEY;
  
  if (!expectedKey || apiKey !== expectedKey) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  
  next();
});
```

Restart:
```bash
pm2 restart pohlang-runner
```

#### Step 5: Deploy Firebase Function

```bash
# Deploy
firebase deploy --only functions

# You'll get URLs like:
# https://us-central1-your-project.cloudfunctions.net/run
# https://us-central1-your-project.cloudfunctions.net/health
```

#### Step 6: Update Cloudflare Pages

```bash
RUNNER_ORIGIN=https://us-central1-your-project.cloudfunctions.net
```

#### Step 7: Test

```bash
curl -X POST https://us-central1-your-project.cloudfunctions.net/run \
  -H "Content-Type: application/json" \
  -d '{"code":"Start Program\nWrite \"Hello from Firebase!\"\nEnd Program"}'
```

### Cost Breakdown (Hybrid Approach)

- **Firebase**: FREE (up to 2M requests/month)
- **Small VPS**: $4-6/month (DigitalOcean droplet)
- **Total**: ~$5/month with excellent performance

### Alternative: Google Cloud Run (All-in-One)

If you want everything in one place, use Google Cloud Run instead:

#### Step 1: Create Dockerfile

Already created in `server/Dockerfile`!

#### Step 2: Deploy to Cloud Run

```bash
# Install Google Cloud SDK
# Visit: https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Set project
gcloud config set project your-project-id

# Build and deploy
gcloud run deploy pohlang-runner \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars POHLANG_BIN=/usr/local/bin/pohlang

# You'll get a URL like:
# https://pohlang-runner-xxxxx-uc.a.run.app
```

#### Cloud Run Pricing

- **FREE tier**: 2M requests/month
- **Pay-as-you-go**: $0.00002400 per request after free tier
- **Idles to zero**: No charges when not in use

**For the playground, this will likely stay FREE!**

---

## 🎯 Quick Start: Railway.app (Originally Recommended)

Railway is the fastest way to get started!

### Step 1: Prepare Your Repository

1. Create a new GitHub repository called `pohlang-runner`
2. Copy the runner code:

```bash
# Create project structure
mkdir pohlang-runner
cd pohlang-runner

# Copy server files
cp -r /path/to/Pohlang-PlayGround/server/* .

# Initialize git
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pohlang-runner.git
git push -u origin main
```

### Step 2: Build PohLang for Linux

Since most hosting platforms use Linux, you need a Linux binary:

```bash
# On your Windows machine with WSL or use GitHub Actions
cd /path/to/PohLang/runtime
cargo build --release --target x86_64-unknown-linux-musl

# Or use cross-compilation
cargo install cross
cross build --release --target x86_64-unknown-linux-musl
```

### Step 3: Add PohLang Binary to Repository

```bash
cd pohlang-runner
mkdir bin
cp /path/to/PohLang/runtime/target/release/pohlang bin/pohlang
chmod +x bin/pohlang
git add bin/pohlang
git commit -m "Add PohLang binary"
git push
```

### Step 4: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your `pohlang-runner` repository
5. Railway auto-detects Node.js and deploys!

### Step 5: Configure Environment

In Railway dashboard:
1. Go to your project → **Variables**
2. Add:
   - `POHLANG_BIN` = `/app/bin/pohlang`
   - `PORT` = `5173`

### Step 6: Get Your URL

Railway provides a URL like: `https://pohlang-runner.railway.app`

### Step 7: Update Cloudflare Pages

1. Cloudflare Dashboard → Your playground project → **Settings** → **Environment variables**
2. Add: `RUNNER_ORIGIN` = `https://pohlang-runner.railway.app`
3. Redeploy

🎉 **Done!** Your playground can now execute code!

---

## 📦 Detailed Setup: DigitalOcean App Platform

DigitalOcean App Platform is great for production deployments.

### Step 1: Prepare Docker Container

Create `Dockerfile` in your runner repository:

```dockerfile
FROM node:18-alpine

# Install dependencies for PohLang
RUN apk add --no-cache libc6-compat libgcc libstdc++

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application
COPY . .

# Copy PohLang binary
COPY bin/pohlang /usr/local/bin/pohlang
RUN chmod +x /usr/local/bin/pohlang

ENV POHLANG_BIN=/usr/local/bin/pohlang
ENV PORT=8080

EXPOSE 8080

CMD ["node", "index.js"]
```

Create `.dockerignore`:
```
node_modules
.git
.env
*.log
```

### Step 2: Push to GitHub

```bash
git add Dockerfile .dockerignore
git commit -m "Add Docker support"
git push
```

### Step 3: Deploy on DigitalOcean

1. Go to [DigitalOcean](https://cloud.digitalocean.com)
2. **Apps** → **Create App**
3. Connect GitHub repository
4. Select `pohlang-runner`
5. DigitalOcean detects Dockerfile automatically
6. Choose plan: Basic ($5/month)
7. Click **"Create Resources"**

### Step 4: Configure

In App settings:
- **Environment Variables**:
  - `POHLANG_BIN` = `/usr/local/bin/pohlang`
  - `PORT` = `8080`

### Step 5: Get URL

DigitalOcean provides: `https://pohlang-runner-xxxxx.ondigitalocean.app`

Update Cloudflare Pages with this URL!

---

## 🖥️ Traditional VPS Setup (DigitalOcean Droplet)

For full control, use a VPS.

### Step 1: Create Droplet

1. DigitalOcean → **Create** → **Droplets**
2. Choose Ubuntu 22.04 LTS
3. Select plan: Basic $4/month (1GB RAM)
4. Add SSH key
5. Create droplet

### Step 2: Connect and Setup

```bash
# SSH into server
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install git
apt install -y git

# Clone your runner
git clone https://github.com/YOUR_USERNAME/pohlang-runner.git
cd pohlang-runner

# Install dependencies
npm install --production

# Make PohLang executable
chmod +x bin/pohlang

# Test
export POHLANG_BIN=./bin/pohlang
node index.js
```

### Step 3: Setup Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'pohlang-runner',
    script: 'index.js',
    env: {
      PORT: 5173,
      POHLANG_BIN: './bin/pohlang',
      NODE_ENV: 'production'
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Enable startup on boot
pm2 startup
pm2 save
```

### Step 4: Setup Nginx Reverse Proxy

```bash
# Install Nginx
apt install -y nginx

# Configure Nginx
cat > /etc/nginx/sites-available/pohlang-runner << 'EOF'
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/pohlang-runner /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test and restart
nginx -t
systemctl restart nginx
```

### Step 5: Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your_domain.com

# Auto-renewal is configured automatically
```

### Step 6: Setup Firewall

```bash
# Allow SSH, HTTP, HTTPS
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

Your runner is now at: `https://your_domain.com` or `http://your_droplet_ip`

---

## 🔒 Security Best Practices

### 1. Rate Limiting

Add rate limiting to prevent abuse. Update `index.js`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: { ok: false, error: 'Too many requests, please try again later.' }
});

app.use('/api/run', limiter);
```

Install dependency:
```bash
npm install express-rate-limit
```

### 2. Code Execution Timeout

Update `runPohlang` function to add timeout:

```javascript
function runPohlang(code, mode = 'run') {
  return new Promise((resolve) => {
    // ... existing code ...
    
    const TIMEOUT = 10000; // 10 seconds
    const timeout = setTimeout(() => {
      child.kill();
      resolve({ 
        ok: false, 
        error: 'Execution timeout (10s limit)', 
        stdout, 
        stderr, 
        exitCode: -1, 
        ms: TIMEOUT 
      });
    }, TIMEOUT);

    child.on('close', (code) => {
      clearTimeout(timeout);
      resolve({ ok: code === 0, stdout, stderr, exitCode: code, ms: Date.now() - started });
    });
  });
}
```

### 3. Code Size Limit

Already implemented with `limit: '1mb'` in express.json()

### 4. Resource Limits (Linux)

Create a wrapper script `run-limited.sh`:

```bash
#!/bin/bash
# Limit CPU time to 10 seconds, memory to 256MB
ulimit -t 10
ulimit -v 262144
exec "$@"
```

Update spawn call:
```javascript
const child = spawn('./run-limited.sh', [bin, ...args], { shell: true });
```

### 5. Environment Variables

Never commit sensitive data. Use `.env` file:

```bash
# .env
PORT=5173
POHLANG_BIN=./bin/pohlang
NODE_ENV=production
ALLOWED_ORIGINS=https://your-playground.pages.dev
```

Load with:
```bash
npm install dotenv
```

```javascript
require('dotenv').config();
```

---

## 📊 Monitoring

### Health Check Endpoint

Already implemented: `GET /api/health`

Test: `curl https://your-runner.com/api/health`

### Logging

Add logging middleware:

```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});
```

### Monitoring Services

Use one of these:
- **UptimeRobot** (free) - Monitor uptime
- **Sentry** - Error tracking
- **LogTail** - Log aggregation

---

## 🧪 Testing Your Runner

### Test Locally

```bash
cd server
npm install
export POHLANG_BIN=/path/to/pohlang
npm start
```

Test with curl:
```bash
curl -X POST http://localhost:5173/api/run \
  -H "Content-Type: application/json" \
  -d '{"code":"Start Program\nWrite \"Hello\"\nEnd Program","mode":"run"}'
```

Expected response:
```json
{
  "ok": true,
  "stdout": "Hello\n",
  "stderr": "",
  "exitCode": 0,
  "ms": 45
}
```

### Test Remote Runner

```bash
curl -X POST https://your-runner.com/api/run \
  -H "Content-Type: application/json" \
  -d '{"code":"Start Program\nWrite \"Test\"\nEnd Program","mode":"run"}'
```

---

## 🎯 Recommended Setup for Production

### For FREE Hosting: Firebase + Small VPS or Google Cloud Run
**Best for**: Hobby projects, learning, low traffic sites
- ✅ FREE tier (2M requests/month)
- ✅ Google infrastructure
- ✅ Auto-scaling
- ✅ Built-in monitoring

**Options**:
1. **Firebase Functions + $4 VPS** (~$4/month) - Hybrid approach
2. **Google Cloud Run** (FREE tier) - All-in-one, container-based

### For Easy Setup: Railway.app
**Best for**: Quick prototyping, don't want to deal with infrastructure
- ✅ Extremely easy GitHub integration
- ✅ Instant deployment
- ✅ Good developer experience
- 💰 $5/month after trial

### For Production at Scale: DigitalOcean Droplet + Nginx
**Best for**: High traffic, multiple services, full control
- ✅ Full control over environment
- ✅ Better performance
- ✅ Lower cost at scale ($4-6/month)
- ✅ Can run multiple services

---

## 💡 My Recommendation

**Starting out?** → Use **Google Cloud Run** (free, simple, all-in-one)

**Want simplest setup?** → Use **Railway.app** ($5/month, zero config)

**Want FREE + willing to manage a VPS?** → Use **Firebase + $4 DigitalOcean droplet**

**Production ready?** → Use **DigitalOcean Droplet with PM2 and Nginx** (best price/performance)

---

## 📋 Checklist

Before going live:

- [ ] Runner is deployed and accessible
- [ ] Health check endpoint responds
- [ ] Can execute simple PohLang code
- [ ] Rate limiting is enabled
- [ ] Execution timeout is set
- [ ] SSL certificate is configured
- [ ] RUNNER_ORIGIN is set in Cloudflare Pages
- [ ] Test from playground works
- [ ] Monitoring is setup
- [ ] Logs are being captured

---

## 🆘 Troubleshooting

### "Connection refused"
- Check if runner is running: `pm2 status`
- Check firewall: `ufw status`
- Verify PORT is correct

### "PohLang binary not found"
- Verify `POHLANG_BIN` path is correct
- Check file exists: `ls -la $POHLANG_BIN`
- Check permissions: `chmod +x $POHLANG_BIN`

### "Permission denied"
- Make binary executable: `chmod +x bin/pohlang`
- Check file owner: `chown -R $USER:$USER .`

### "Out of memory"
- Increase VPS memory
- Add resource limits (see Security section)

---

## 📚 Next Steps

1. Deploy your runner using one of the methods above
2. Update `RUNNER_ORIGIN` in Cloudflare Pages
3. Test code execution in the playground
4. Monitor performance and adjust resources as needed

**Need Help?** Open an issue on GitHub!
