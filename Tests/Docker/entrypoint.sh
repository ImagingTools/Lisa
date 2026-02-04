#!/bin/bash
# Docker entrypoint script for test environment
# Handles startup sequence: PostgreSQL -> Custom Apps -> Tests
#
# This script allows users to customize the startup sequence by adding
# their own initialization scripts in /app/custom-apps/

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Starting Test Environment${NC}"
echo -e "${GREEN}========================================${NC}"

# Function to wait for a service to be ready
wait_for_service() {
    local service_name=$1
    local check_command=$2
    local max_attempts=${3:-30}
    local attempt=1
    
    echo -e "${YELLOW}Waiting for ${service_name} to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if eval "$check_command" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ ${service_name} is ready${NC}"
            return 0
        fi
        echo -e "  Attempt $attempt/$max_attempts..."
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}✗ ${service_name} failed to start${NC}"
    return 1
}

# Step 1: Start PostgreSQL if needed
if [ "${START_POSTGRESQL:-false}" = "true" ]; then
    echo -e "${YELLOW}Step 1: Starting PostgreSQL...${NC}"
    
    # Initialize PostgreSQL data directory if it doesn't exist
    if [ ! -d "/var/lib/postgresql/data" ]; then
        mkdir -p /var/lib/postgresql/data
        chown -R postgres:postgres /var/lib/postgresql
        su - postgres -c "/usr/lib/postgresql/*/bin/initdb -D /var/lib/postgresql/data"
    fi
    
    # Start PostgreSQL
    su - postgres -c "/usr/lib/postgresql/*/bin/pg_ctl -D /var/lib/postgresql/data -l /var/log/postgresql/postgresql.log start"
    
    # Wait for PostgreSQL to be ready
    wait_for_service "PostgreSQL" "su - postgres -c 'psql -c \"SELECT 1\"'"
    
    # Create test database if specified
    if [ -n "${POSTGRES_DB}" ]; then
        echo -e "${YELLOW}Creating database: ${POSTGRES_DB}${NC}"
        su - postgres -c "psql -c \"CREATE DATABASE ${POSTGRES_DB}\"" || echo "Database may already exist"
    fi
else
    echo -e "${YELLOW}Step 1: PostgreSQL startup skipped (START_POSTGRESQL not set to true)${NC}"
fi

# Step 2: Run custom application installers and startup scripts
if [ -d "/app/custom-apps" ]; then
    echo -e "${YELLOW}Step 2: Running custom application scripts...${NC}"
    
    # Run installer scripts first (if any)
    if [ -d "/app/custom-apps/installers" ]; then
        for installer in /app/custom-apps/installers/*.sh; do
            if [ -f "$installer" ] && [ -x "$installer" ]; then
                echo -e "${YELLOW}Running installer: $(basename $installer)${NC}"
                "$installer"
            fi
        done
    fi
    
    # Run startup scripts in order (01-*, 02-*, etc.)
    if [ -d "/app/custom-apps/startup" ]; then
        for startup_script in /app/custom-apps/startup/*.sh; do
            if [ -f "$startup_script" ] && [ -x "$startup_script" ]; then
                echo -e "${YELLOW}Running startup script: $(basename $startup_script)${NC}"
                "$startup_script"
            fi
        done
    fi
    
    echo -e "${GREEN}✓ Custom applications initialized${NC}"
else
    echo -e "${YELLOW}Step 2: No custom applications to start (/app/custom-apps not found)${NC}"
fi

# Step 3: Run tests or custom command
echo -e "${YELLOW}Step 3: Starting tests...${NC}"
echo -e "${GREEN}========================================${NC}"

# Execute the main command (defaults to running tests)
cd /app/tests
exec "$@"
