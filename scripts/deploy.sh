#!/bin/bash

set -e

echo "🚀 Starting MICA Platform Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if service name is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please specify a service to deploy${NC}"
    echo "Usage: ./deploy.sh <service-name>"
    echo "Available services:"
    echo "  - praxiswissen-search"
    echo "  - database-sync"
    echo "  - event-parser"
    exit 1
fi

SERVICE=$1
SERVICE_PATH="services/$SERVICE"

# Check if service exists
if [ ! -d "$SERVICE_PATH" ]; then
    echo -e "${RED}Error: Service $SERVICE not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Deploying $SERVICE...${NC}"

# Navigate to service directory
cd "$SERVICE_PATH"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the project
echo "Building project..."
npm run build

# Deploy to Cloudflare
echo -e "${YELLOW}Deploying to Cloudflare Workers...${NC}"

if [ "$SERVICE" == "praxiswissen-search" ]; then
    # For the main app, deploy directly
    wrangler deploy
    
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo -e "${GREEN}Service available at: https://praxiswissen.mica.franzai.com${NC}"
else
    # For other services, use their specific configs
    wrangler deploy
    
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo -e "${GREEN}Service available at: https://${SERVICE//-/}.mica.franzai.com${NC}"
fi

echo -e "${GREEN}Deployment complete!${NC}"