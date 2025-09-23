#!/bin/bash

# Alternative deploy script using npm instead of yarn
# Use this if the yarn version continues to have issues

echo "Cleaning node_modules and lock files..."
rm -rf node_modules package-lock.json yarn.lock
rm -rf application/client/node_modules application/client/package-lock.json application/client/yarn.lock
rm -rf application/server/node_modules application/server/package-lock.json application/server/yarn.lock

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd application/client
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd ../server
npm install

# Build the project
echo "Building the project..."
cd ../..
npm run build

# Restart PM2 processes
echo "Restarting PM2 processes..."
pm2 stop server
pm2 start server
