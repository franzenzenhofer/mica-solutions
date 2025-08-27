#!/bin/bash

set -e

echo "🚀 MICA Platform - Deploying All Services"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Services to deploy
SERVICES=(
  "praxiswissen-search"
  "database-sync"
  "event-parser"
)

# Deploy each service
for SERVICE in "${SERVICES[@]}"; do
  echo -e "\n${YELLOW}Deploying $SERVICE...${NC}"
  
  cd "services/$SERVICE"
  
  # Check if wrangler.toml exists
  if [ ! -f "wrangler.toml" ]; then
    echo -e "${RED}Error: wrangler.toml not found for $SERVICE${NC}"
    cd ../..
    continue
  fi
  
  # Deploy to Cloudflare
  if wrangler deploy; then
    echo -e "${GREEN}✓ $SERVICE deployed successfully${NC}"
  else
    echo -e "${RED}✗ $SERVICE deployment failed${NC}"
  fi
  
  cd ../..
done

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "\n${GREEN}Live Services:${NC}"
echo "  🤖 Neural Knowledge Network: https://praxiswissen.mica.franzai.com"
echo "  🔄 Reality Sync Engine: https://reality.mica.franzai.com"
echo "  📧 Intelligence Harvester: https://harvest.mica.franzai.com"
echo -e "\n${GREEN}GitHub Repository:${NC}"
echo "  https://github.com/franzenzenhofer/mica-solutions"