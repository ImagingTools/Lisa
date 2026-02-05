#!/bin/bash
# Example installer script for Puma
# This is a template - modify according to your Puma installation method

set -e

echo "=========================================="
echo "Installing Puma"
echo "=========================================="

# Method 1: If you have a Puma installer in resources directory
if [ -f "/app/custom-apps/resources/puma-installer.run" ]; then
    echo "Installing from resources/puma-installer.run..."
    chmod +x /app/custom-apps/resources/puma-installer.run
    /app/custom-apps/resources/puma-installer.run --silent --install-dir=/opt/puma
    echo "Puma installed to /opt/puma"
fi

# Method 2: If you have a Puma package/archive in resources
if [ -f "/app/custom-apps/resources/puma.tar.gz" ]; then
    echo "Extracting Puma from resources/puma.tar.gz..."
    mkdir -p /opt/puma
    tar -xzf /app/custom-apps/resources/puma.tar.gz -C /opt/puma
    echo "Puma extracted to /opt/puma"
fi

# Method 3: Using SQL script from resources for database setup
if [ -f "/app/custom-apps/resources/puma-setup.sql" ]; then
    echo "Running database setup from resources/puma-setup.sql..."
    psql -U postgres -f /app/custom-apps/resources/puma-setup.sql || echo "Database setup skipped (PostgreSQL not running)"
    echo "Database setup completed"
fi

# Method 4: Download and install (if URL is provided)
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
