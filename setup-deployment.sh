#!/bin/bash

# PohLang Playground - Automatic Deployment Setup Script
# This script helps you configure Google Cloud and GitHub for automatic deployment

set -e

echo "🚀 PohLang Playground - Automatic Deployment Setup"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found${NC}"
    echo "Please install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo -e "${GREEN}✓ gcloud CLI found${NC}"
echo ""

# Get project ID
read -p "Enter your GCP Project ID (or press Enter to create new): " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    read -p "Enter a new project ID (e.g., pohlang-runner-123): " PROJECT_ID
    echo ""
    echo "Creating project: $PROJECT_ID"
    gcloud projects create "$PROJECT_ID" --name="PohLang Runner"
fi

echo ""
echo "Setting project: $PROJECT_ID"
gcloud config set project "$PROJECT_ID"

echo ""
echo "Enabling required APIs..."
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

echo ""
echo -e "${GREEN}✓ APIs enabled${NC}"
echo ""

# Service account
SA_NAME="github-actions"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "Creating service account: $SA_EMAIL"
gcloud iam service-accounts create "$SA_NAME" \
    --display-name="GitHub Actions Deployer" || echo "Service account already exists"

echo ""
echo "Granting permissions..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/run.admin" --condition=None

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/storage.admin" --condition=None

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/iam.serviceAccountUser" --condition=None

echo ""
echo -e "${GREEN}✓ Permissions granted${NC}"
echo ""

# Create key
KEY_FILE="gcp-key-${PROJECT_ID}.json"
echo "Creating service account key: $KEY_FILE"
gcloud iam service-accounts keys create "$KEY_FILE" \
    --iam-account="$SA_EMAIL"

echo ""
echo -e "${GREEN}✓ Service account key created${NC}"
echo ""

# Display GitHub secrets
echo "=================================================="
echo -e "${YELLOW}📋 GitHub Secrets Configuration${NC}"
echo "=================================================="
echo ""
echo "Add these secrets to your GitHub repository:"
echo "https://github.com/pohlang/Pohlang-PlayGround/settings/secrets/actions"
echo ""
echo "1. GCP_PROJECT_ID"
echo "   Value: $PROJECT_ID"
echo ""
echo "2. GCP_SA_KEY"
echo "   Value: (contents of $KEY_FILE)"
echo ""
echo "To copy the key content:"
echo "  cat $KEY_FILE"
echo ""
echo "=================================================="
echo ""

# Test gcloud auth
echo "Testing authentication..."
gcloud auth application-default print-access-token > /dev/null 2>&1
echo -e "${GREEN}✓ Authentication successful${NC}"
echo ""

# Summary
echo "=================================================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Add GitHub secrets (GCP_PROJECT_ID and GCP_SA_KEY)"
echo "2. Push changes to trigger deployment:"
echo "   git add ."
echo "   git commit -m \"Setup automatic deployment\""
echo "   git push origin main"
echo "3. Check Actions tab for deployment status"
echo ""
echo "📚 Full documentation: AUTOMATIC_DEPLOYMENT.md"
echo ""
echo -e "${YELLOW}⚠️  Important: Keep $KEY_FILE secure and never commit it!${NC}"
echo ""
