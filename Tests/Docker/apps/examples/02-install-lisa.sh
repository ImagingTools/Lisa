#!/bin/bash
# Example installer script for Lisa
# This is a template - modify according to your Lisa installation method

set -e

echo "=========================================="
echo "Installing Lisa"
echo "=========================================="

# Method 1: If you have a Lisa installer in resources directory
if [ -f "/app/custom-apps/resources/lisa-installer.run" ]; then
    echo "Installing from resources/lisa-installer.run..."
    chmod +x /app/custom-apps/resources/lisa-installer.run
    /app/custom-apps/resources/lisa-installer.run --silent --install-dir=/opt/lisa
    echo "Lisa installed to /opt/lisa"
fi

# Method 2: If you have a Lisa package/archive in resources
if [ -f "/app/custom-apps/resources/lisa.tar.gz" ]; then
    echo "Extracting Lisa from resources/lisa.tar.gz..."
    mkdir -p /opt/lisa
    tar -xzf /app/custom-apps/resources/lisa.tar.gz -C /opt/lisa
    echo "Lisa extracted to /opt/lisa"
fi

# Method 3: If Lisa binaries are in resources
if [ -d "/app/custom-apps/resources/lisa-binaries" ]; then
    echo "Copying Lisa binaries from resources..."
    mkdir -p /opt/lisa
    cp -r /app/custom-apps/resources/lisa-binaries/* /opt/lisa/
    chmod +x /opt/lisa/bin/*
fi

# Method 4: Apply database migrations from resources
if [ -f "/app/custom-apps/resources/lisa-migrations.sql" ]; then
    echo "Applying database migrations from resources/lisa-migrations.sql..."
    psql -U postgres -d lisa_test -f /app/custom-apps/resources/lisa-migrations.sql || echo "Database migrations skipped (PostgreSQL not running)"
fi

# Method 5: Copy configuration from resources
if [ -f "/app/custom-apps/resources/lisa-config.json" ]; then
    echo "Copying Lisa configuration from resources..."
    mkdir -p /opt/lisa/config
    cp /app/custom-apps/resources/lisa-config.json /opt/lisa/config/config.json
fi

# Set up environment variables
echo "export PATH=\$PATH:/opt/lisa/bin" >> /etc/profile.d/lisa.sh
echo "export LISADIR=/opt/lisa" >> /etc/profile.d/lisa.sh

# Create directories for Lisa
mkdir -p /var/log/lisa
mkdir -p /var/lib/lisa

# Set permissions
chmod -R 755 /opt/lisa

echo "Lisa installation completed"
echo "=========================================="
