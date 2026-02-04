#!/bin/bash
# Example startup script for Puma
# This script starts Puma and waits for it to be ready

set -e

echo "=========================================="
echo "Starting Puma"
echo "=========================================="

# Source environment if available
[ -f /etc/profile.d/puma.sh ] && source /etc/profile.d/puma.sh

# Configuration
PUMA_PORT=${PUMA_PORT:-8080}
PUMA_HOST=${PUMA_HOST:-0.0.0.0}
PUMA_LOG=/var/log/puma/puma.log

# Start Puma in background
echo "Starting Puma on ${PUMA_HOST}:${PUMA_PORT}..."

# Option 1: If Puma has a start script
if [ -x "/opt/puma/bin/puma-start" ]; then
    /opt/puma/bin/puma-start --port ${PUMA_PORT} --host ${PUMA_HOST} > ${PUMA_LOG} 2>&1 &
    PUMA_PID=$!
    echo "Puma started with PID: ${PUMA_PID}"
fi

# Option 2: Direct binary execution (modify as needed)
# if [ -x "/opt/puma/bin/puma" ]; then
#     /opt/puma/bin/puma -p ${PUMA_PORT} -b ${PUMA_HOST} > ${PUMA_LOG} 2>&1 &
#     PUMA_PID=$!
#     echo "Puma started with PID: ${PUMA_PID}"
# fi

# Wait for Puma to be ready
echo "Waiting for Puma to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    # Check if Puma is responding
    if curl -f -s http://localhost:${PUMA_PORT}/health > /dev/null 2>&1; then
        echo "✓ Puma is ready and responding on port ${PUMA_PORT}"
        echo "=========================================="
        exit 0
    fi
    
    # Alternative: Check if process is running
    if [ -n "${PUMA_PID}" ] && ! kill -0 ${PUMA_PID} 2>/dev/null; then
        echo "✗ Puma process died"
        cat ${PUMA_LOG}
        exit 1
    fi
    
    echo "  Attempt ${ATTEMPT}/${MAX_ATTEMPTS}..."
    sleep 2
    ((ATTEMPT++))
done

echo "✗ Puma failed to start within the timeout"
if [ -f ${PUMA_LOG} ]; then
    echo "Last 20 lines of log:"
    tail -20 ${PUMA_LOG}
fi
exit 1
