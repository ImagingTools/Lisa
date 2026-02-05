#!/bin/bash
set -euo pipefail

BIN="/app/custom-apps/resources/LisaServer"
LOG="/tmp/lisa.log"

export LD_LIBRARY_PATH="/app/custom-apps/resources:${LD_LIBRARY_PATH:-}"
export QT_PLUGIN_PATH="/app/custom-apps/resources/plugins"

echo "[startup] Starting LisaServer..."
"$BIN" >"$LOG" 2>&1 &
PID=$!

# Give it a moment to crash if deps are missing
sleep 0.5

if ! kill -0 "$PID" 2>/dev/null; then
  echo "[startup] LisaServer failed to start (pid $PID exited). Log:"
  sed -n '1,200p' "$LOG" || true
  exit 1
fi

echo "[startup] LisaServer started, pid=$PID"