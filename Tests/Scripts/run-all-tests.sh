#!/bin/bash

# Script to run all tests (GUI and API)
# This script can be used both locally and in CI/CD pipelines
#
# Usage:
#   ./run-all-tests.sh [--gui-only | --api-only]

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TESTS_DIR="$(dirname "$SCRIPT_DIR")"

cd "$TESTS_DIR"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
RUN_GUI=true
RUN_API=true

while [[ $# -gt 0 ]]; do
  case $1 in
    --gui-only)
      RUN_API=false
      shift
      ;;
    --api-only)
      RUN_GUI=false
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--gui-only | --api-only]"
      exit 1
      ;;
  esac
done

# Check if npm dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Check if Playwright browsers are installed
if [ "$RUN_GUI" = true ]; then
    if ! npx playwright --version > /dev/null 2>&1; then
        echo -e "${YELLOW}Installing Playwright browsers...${NC}"
        npx playwright install --with-deps
    fi
fi

# Create results directories
mkdir -p test-results/screenshots
mkdir -p test-results/videos

# Run tests
EXIT_CODE=0

if [ "$RUN_GUI" = true ]; then
    echo -e "${GREEN}Running GUI tests with Playwright...${NC}"
    if npm run test:gui; then
        echo -e "${GREEN}✓ GUI tests passed${NC}"
    else
        echo -e "${RED}✗ GUI tests failed${NC}"
        EXIT_CODE=1
    fi
fi

if [ "$RUN_API" = true ]; then
    echo -e "${GREEN}Running API tests with Newman...${NC}"
    if npm run test:api; then
        echo -e "${GREEN}✓ API tests passed${NC}"
    else
        echo -e "${RED}✗ API tests failed${NC}"
        EXIT_CODE=1
    fi
fi

# Summary
echo ""
echo "=================================="
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
else
    echo -e "${RED}Some tests failed!${NC}"
fi
echo "=================================="
echo ""
echo "Test results available in: test-results/"
echo "- Playwright HTML report: test-results/playwright-report/"
echo "- Screenshots: test-results/screenshots/"
echo "- Videos: test-results/videos/"

exit $EXIT_CODE
