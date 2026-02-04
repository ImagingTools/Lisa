#!/bin/bash

# Setup script for Lisa Testing System
# This script installs all dependencies and prepares the testing environment

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TESTS_DIR="$(dirname "$SCRIPT_DIR")"

cd "$TESTS_DIR"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Lisa Testing System Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check Node.js
echo -e "${YELLOW}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 18.x or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION found${NC}"

# Check npm
echo -e "${YELLOW}Checking npm installation...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm $NPM_VERSION found${NC}"
echo ""

# Install npm dependencies
echo -e "${YELLOW}Installing npm dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Install Playwright browsers
echo -e "${YELLOW}Installing Playwright browsers...${NC}"
echo "This may take a few minutes..."
npx playwright install --with-deps
echo -e "${GREEN}✓ Playwright browsers installed${NC}"
echo ""

# Create test results directories
echo -e "${YELLOW}Creating test results directories...${NC}"
mkdir -p test-results/screenshots
mkdir -p test-results/videos
echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Check Docker (optional)
echo -e "${YELLOW}Checking Docker installation (optional)...${NC}"
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ $DOCKER_VERSION found${NC}"
    
    if command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version)
        echo -e "${GREEN}✓ $COMPOSE_VERSION found${NC}"
    else
        echo -e "${YELLOW}⚠ docker-compose not found (needed for Docker tests)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Docker not found (needed for Docker tests)${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Setup complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "You can now run tests:"
echo "  npm test                    - Run all tests"
echo "  npm run test:gui            - Run GUI tests only"
echo "  npm run test:api            - Run API tests only"
echo "  ./Scripts/run-all-tests.sh  - Run all tests (using script)"
echo ""
echo "For Docker tests:"
echo "  ./Scripts/run-docker-tests-linux.sh build-and-run"
echo ""
echo "For more information, see README.md"
echo ""
