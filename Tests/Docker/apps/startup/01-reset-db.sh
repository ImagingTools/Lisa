#!/bin/bash
set -euo pipefail

export PGUSER="postgres"
export PGPASSWORD="${PGPASSWORD:-root}"
export PGHOST="${PGHOST:-localhost}"
export PGPORT="${PGPORT:-5432}"

LISA_BACKUP_FILE="/app/custom-apps/resources/backups/lisa.backup"
PUMA_BACKUP_FILE="/app/custom-apps/resources/backups/puma.backup"

LISA_DB_NAME="lisa"
PUMA_DB_NAME="puma"

echo "[startup] Using: $(psql --version)"
echo "[startup] Using: $(pg_restore --version)"

psql -h "$PGHOST" -p "$PGPORT" -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS ${LISA_DB_NAME};"
psql -h "$PGHOST" -p "$PGPORT" -v ON_ERROR_STOP=1 -c "CREATE DATABASE ${LISA_DB_NAME} OWNER ${PGUSER};"

psql -h "$PGHOST" -p "$PGPORT" -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS ${PUMA_DB_NAME};"
psql -h "$PGHOST" -p "$PGPORT" -v ON_ERROR_STOP=1 -c "CREATE DATABASE ${PUMA_DB_NAME} OWNER ${PGUSER};"

pg_restore -h "$PGHOST" -p "$PGPORT" -d "$LISA_DB_NAME" --verbose "$LISA_BACKUP_FILE"
pg_restore -h "$PGHOST" -p "$PGPORT" -d "$PUMA_DB_NAME" --verbose "$PUMA_BACKUP_FILE"