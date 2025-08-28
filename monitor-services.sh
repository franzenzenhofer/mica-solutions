#!/bin/bash

# MICA Services Live Monitor
# This script continuously monitors the deployment status of all MICA services

SERVICES=(
    "mica.franzai.com|Main Dashboard"
    "praxiswissen.mica.franzai.com|Neural Knowledge Network"
    "reality.mica.franzai.com|Reality Sync Engine"
    "harvest.mica.franzai.com|Intelligence Harvester"
)

clear
echo "🎯 MICA Services Live Monitor"
echo "================================"
echo "Started at: $(date)"
echo "Checking every 30 seconds..."
echo ""

check_service() {
    local url=$1
    local name=$2
    local response=$(curl -s -o /dev/null -w "%{http_code}" "https://$url" 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo "✅ $name"
        echo "   URL: https://$url"
        echo "   Status: LIVE (HTTP $response)"
    elif [ "$response" = "000" ]; then
        echo "⏳ $name"
        echo "   URL: https://$url"
        echo "   Status: SSL certificate provisioning..."
    else
        echo "⚠️  $name"
        echo "   URL: https://$url"
        echo "   Status: HTTP $response"
    fi
    echo ""
}

while true; do
    clear
    echo "🎯 MICA Services Live Monitor"
    echo "================================"
    echo "Last check: $(date)"
    echo ""
    
    for service in "${SERVICES[@]}"; do
        IFS='|' read -r url name <<< "$service"
        check_service "$url" "$name"
    done
    
    echo "--------------------------------"
    echo "Press Ctrl+C to exit"
    echo "Next check in 30 seconds..."
    
    sleep 30
done