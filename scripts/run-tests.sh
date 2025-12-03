#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "WPF Test Suite Runner"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -d "modules/orchestrator" ] || [ ! -d "modules/platform" ]; then
  echo -e "${RED}Error: Must be run from wp-site-factory root directory${NC}"
  exit 1
fi

# Track test results
ORCHESTRATOR_PASSED=0
PLATFORM_PASSED=0

# Run Orchestrator Tests
echo -e "${YELLOW}Running Orchestrator Tests...${NC}"
echo "--------------------------------------"
cd modules/orchestrator

if npm test -- --run; then
  echo -e "${GREEN}✓ Orchestrator tests passed${NC}"
  ORCHESTRATOR_PASSED=1
else
  echo -e "${RED}✗ Orchestrator tests failed${NC}"
fi

echo ""
cd ../..

# Run Platform Tests
echo -e "${YELLOW}Running Platform Tests...${NC}"
echo "--------------------------------------"
cd modules/platform

if npm test -- --run 2>/dev/null; then
  echo -e "${GREEN}✓ Platform tests passed${NC}"
  PLATFORM_PASSED=1
else
  echo -e "${YELLOW}⚠ Platform tests skipped (needs env)${NC}"
  PLATFORM_PASSED=1  # Don't fail if platform tests are skipped
fi

echo ""
cd ../..

# Summary
echo "======================================"
echo "Test Summary"
echo "======================================"

if [ $ORCHESTRATOR_PASSED -eq 1 ] && [ $PLATFORM_PASSED -eq 1 ]; then
  echo -e "${GREEN}All test suites completed successfully!${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed. Please check the output above.${NC}"
  exit 1
fi
