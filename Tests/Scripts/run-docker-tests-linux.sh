#!/bin/bash

# Script to run tests in Linux Docker container
# 
# Usage:
#   ./run-docker-tests-linux.sh [build|run|build-and-run]
#
# Options:
#   build          - Build the Docker image only
#   run            - Run tests in existing Docker image
#   build-and-run  - Build image and run tests (default)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TESTS_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$TESTS_DIR")"

cd "$PROJECT_ROOT"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ACTION="${1:-build-and-run}"

case $ACTION in
    build)
        echo -e "${GREEN}Building Linux Docker image...${NC}"
        docker build -f Tests/Docker/Dockerfile.linux -t lisa-tests:linux .
        echo -e "${GREEN}✓ Build complete${NC}"
        ;;
    run)
        echo -e "${GREEN}Running tests in Linux Docker container...${NC}"
        docker-compose -f Tests/Docker/docker-compose.linux.yml up --abort-on-container-exit
        EXIT_CODE=$?
        docker-compose -f Tests/Docker/docker-compose.linux.yml down
        exit $EXIT_CODE
        ;;
    build-and-run)
        echo -e "${GREEN}Building Linux Docker image...${NC}"
        docker build -f Tests/Docker/Dockerfile.linux -t lisa-tests:linux .
        echo -e "${GREEN}Running tests in Linux Docker container...${NC}"
        docker-compose -f Tests/Docker/docker-compose.linux.yml up --abort-on-container-exit
        EXIT_CODE=$?
        docker-compose -f Tests/Docker/docker-compose.linux.yml down
        exit $EXIT_CODE
        ;;
    *)
        echo "Unknown action: $ACTION"
        echo "Usage: $0 [build|run|build-and-run]"
        exit 1
        ;;
esac
