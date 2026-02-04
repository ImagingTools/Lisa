#!/bin/bash
# Example installer script for Puma
# This is a template - modify according to your Puma installation method

set -e

echo "=========================================="
echo "Installing Puma"
echo "=========================================="

# Method 1: If you have a Puma installer in this directory
if [ -f "/app/custom-apps/installers/puma-installer.run" ]; then
    echo "Installing from puma-installer.run..."
    chmod +x /app/custom-apps/installers/puma-installer.run
    /app/custom-apps/installers/puma-installer.run --silent --install-dir=/opt/puma
    echo "Puma installed to /opt/puma"
fi

# Method 2: If you have a Puma package/archive
if [ -f "/app/custom-apps/installers/puma.tar.gz" ]; then
    echo "Extracting Puma from archive..."
    mkdir -p /opt/puma
    tar -xzf /app/custom-apps/installers/puma.tar.gz -C /opt/puma
    echo "Puma extracted to /opt/puma"
fi

# Method 3: Download and install (if URL is provided)
# Uncomment and modify if needed
# if [ -n "${PUMA_DOWNLOAD_URL}" ]; then
#     echo "Downloading Puma from ${PUMA_DOWNLOAD_URL}..."
#     wget -O /tmp/puma-installer.run "${PUMA_DOWNLOAD_URL}"
#     chmod +x /tmp/puma-installer.run
#     /tmp/puma-installer.run --silent --install-dir=/opt/puma
#     rm /tmp/puma-installer.run
# fi

# Set up environment variables
echo "export PATH=\$PATH:/opt/puma/bin" >> /etc/profile.d/puma.sh

# Create log directory
mkdir -p /var/log/puma

echo "Puma installation completed"
echo "=========================================="
