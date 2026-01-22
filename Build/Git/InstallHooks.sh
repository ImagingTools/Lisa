#!/bin/bash

# Check if post-merge file exists
if [ ! -f "./post-merge" ]; then
    echo "Error: post-merge file not found"
    exit 1
fi

# Ensure .git/hooks directory exists
mkdir -p ../../.git/hooks

# Copy and make executable
cp ./post-merge ../../.git/hooks/post-merge || { echo "Failed to copy hook"; exit 1; }
chmod +x ../../.git/hooks/post-merge || { echo "Failed to make hook executable"; exit 1; }

echo "Hook installed!"
