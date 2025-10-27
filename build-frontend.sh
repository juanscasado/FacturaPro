#!/bin/bash

# Build script for frontend deployment on Render
echo "==> Starting frontend build process..."

# Debug: Show current directory
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Try to find the frontend directory
if [ -d "frontend" ]; then
    echo "Found frontend directory in current location"
    cd frontend
elif [ -d "../frontend" ]; then
    echo "Found frontend directory one level up"
    cd ../frontend
elif [ -d "../../frontend" ]; then
    echo "Found frontend directory two levels up"
    cd ../../frontend
else
    echo "ERROR: Cannot find frontend directory"
    echo "Current location contents:"
    find . -name "package.json" -type f
    exit 1
fi

# Verify package.json exists
if [ -f "package.json" ]; then
    echo "✅ Found package.json"
    echo "Package.json location: $(pwd)/package.json"
else
    echo "❌ package.json not found in $(pwd)"
    exit 1
fi

# Install dependencies and build
echo "==> Installing dependencies..."
npm install

echo "==> Building frontend..."
npm run build

echo "==> Build completed successfully!"
echo "Build directory contents:"
ls -la build/