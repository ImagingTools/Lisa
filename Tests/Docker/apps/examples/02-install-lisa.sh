#!/bin/bash
# Example installer script for Lisa
# This is a template - modify according to your Lisa installation method

set -e

echo "=========================================="
echo "Installing Lisa"
echo "=========================================="

# Method 1: If you have a Lisa installer in this directory
if [ -f "/app/custom-apps/installers/lisa-installer.run" ]; then
    echo "Installing from lisa-installer.run..."
    chmod +x /app/custom-apps/installers/lisa-installer.run
    /app/custom-apps/installers/lisa-installer.run --silent --install-dir=/opt/lisa
    echo "Lisa installed to /opt/lisa"
fi

# Method 2: If you have a Lisa package/archive
if [ -f "/app/custom-apps/installers/lisa.tar.gz" ]; then
    echo "Extracting Lisa from archive..."
    mkdir -p /opt/lisa
    tar -xzf /app/custom-apps/installers/lisa.tar.gz -C /opt/lisa
    echo "Lisa extracted to /opt/lisa"
fi

# Method 3: If Lisa binaries are already built
if [ -d "/app/custom-apps/installers/lisa-binaries" ]; then
    echo "Copying Lisa binaries..."
    mkdir -p /opt/lisa
    cp -r /app/custom-apps/installers/lisa-binaries/* /opt/lisa/
    chmod +x /opt/lisa/bin/*
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
