#!/bin/bash
# Example startup script for Lisa
# This script starts Lisa and waits for it to be ready

set -e

echo "=========================================="
echo "Starting Lisa"
echo "=========================================="

# Source environment if available
[ -f /etc/profile.d/lisa.sh ] && source /etc/profile.d/lisa.sh

# Configuration
LISA_PORT=${LISA_PORT:-3000}
LISA_HOST=${LISA_HOST:-0.0.0.0}
LISA_LOG=/var/log/lisa/lisa.log

# Set up database connection
export DATABASE_URL=${DATABASE_URL:-"postgresql://postgres@localhost:5432/lisa_test"}

# Set up Puma connection (if Lisa depends on Puma)
export PUMA_URL=${PUMA_URL:-"http://localhost:8080"}

# Load configuration from resources if available
if [ -f "/app/custom-apps/resources/lisa-config.json" ]; then
    echo "Loading configuration from resources/lisa-config.json..."
    export LISA_CONFIG_FILE="/app/custom-apps/resources/lisa-config.json"
fi

# Apply any runtime SQL scripts from resources
if [ -f "/app/custom-apps/resources/lisa-seed-data.sql" ]; then
    echo "Loading seed data from resources/lisa-seed-data.sql..."
    psql -U postgres -d lisa_test -f /app/custom-apps/resources/lisa-seed-data.sql || echo "Seed data loading skipped"
fi

# Start Lisa in background
echo "Starting Lisa on ${LISA_HOST}:${LISA_PORT}..."
echo "Database: ${DATABASE_URL}"
echo "Puma: ${PUMA_URL}"

# Option 1: If Lisa has a server executable
if [ -x "/opt/lisa/bin/LisaServer" ]; then
    /opt/lisa/bin/LisaServer --port ${LISA_PORT} --host ${LISA_HOST} > ${LISA_LOG} 2>&1 &
    LISA_PID=$!
    echo "Lisa started with PID: ${LISA_PID}"
fi

# Option 2: If Lisa needs environment setup first
# if [ -x "/opt/lisa/bin/lisa-start.sh" ]; then
#     /opt/lisa/bin/lisa-start.sh > ${LISA_LOG} 2>&1 &
#     LISA_PID=$!
#     echo "Lisa started with PID: ${LISA_PID}"
# fi

# Wait for Lisa to be ready
echo "Waiting for Lisa to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    # Check if Lisa is responding
    if curl -f -s http://localhost:${LISA_PORT}/health > /dev/null 2>&1; then
        echo "✓ Lisa is ready and responding on port ${LISA_PORT}"
        echo "=========================================="
        exit 0
    fi
    
    # Alternative: Check for specific endpoint
    if curl -f -s http://localhost:${LISA_PORT}/ > /dev/null 2>&1; then
        echo "✓ Lisa is ready and responding on port ${LISA_PORT}"
        echo "=========================================="
        exit 0
    fi
    
    # Check if process is running
    if [ -n "${LISA_PID}" ] && ! kill -0 ${LISA_PID} 2>/dev/null; then
        echo "✗ Lisa process died"
        if [ -f ${LISA_LOG} ]; then
            cat ${LISA_LOG}
        fi
        exit 1
    fi
    
    echo "  Attempt ${ATTEMPT}/${MAX_ATTEMPTS}..."
    sleep 2
    ((ATTEMPT++))
done

echo "✗ Lisa failed to start within the timeout"
if [ -f ${LISA_LOG} ]; then
    echo "Last 20 lines of log:"
    tail -20 ${LISA_LOG}
fi
exit 1
