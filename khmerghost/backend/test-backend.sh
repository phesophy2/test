#!/bin/bash
# test-backend.sh - Complete backend verification

echo "🔧 KHMERGHOST BACKEND VERIFICATION"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:5001"

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local expected=$4
    local data=$5
    
    echo -n "Testing $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    if [ "$response" = "$expected" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (got $response, expected $expected)"
        ((FAILED++))
    fi
}

# Health check
test_endpoint "Health" "GET" "/health" "200"

# Mail stock (expect 200)
test_endpoint "Mail Stock" "GET" "/api/mail/stock" "200"

# Farm stats
test_endpoint "Farm Stats" "GET" "/api/farm/stats" "200"

# Accounts list (should be 200)
test_endpoint "Accounts List" "GET" "/api/farm/accounts" "200"

# System containers (optional, expect 200)
test_endpoint "System Containers" "GET" "/api/system/containers" "200"

# Batch creation (optional, expect 200)
# Uncomment if you want to test batch creation
#test_endpoint "Batch Creation" "POST" "/api/farm/batch" "200" '{"quantity":2,"delay":3000,"otpMode":"skip"}'

echo "\nSummary: $PASSED passed, $FAILED failed."
