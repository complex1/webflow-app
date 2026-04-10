#!/bin/bash

# Webflow App Server Stop Script
# This script stops the PM2 managed api-flux server

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

print_status "🛑 Stopping Webflow App Server..."

# Check if PM2 is installed
if ! command_exists pm2; then
    print_error "PM2 is not installed. Cannot stop server."
    print_status "Install PM2 with: npm install -g pm2"
    exit 1
fi

# Check if api-flux process exists
print_status "Checking for api-flux process..."

# Get PM2 process list and check for api-flux
pm2_list=$(pm2 jlist 2>/dev/null)
api_flux_exists=$(echo "$pm2_list" | grep -c '"name":"api-flux"' || true)

if [ "$api_flux_exists" -gt 0 ]; then
    print_status "Found api-flux process, stopping..."
    
    # Stop the api-flux process
    pm2 stop api-flux
    if [ $? -eq 0 ]; then
        print_success "api-flux process stopped successfully"
        
        # Show current PM2 status
        print_status "Current PM2 process status:"
        pm2 status
        
        # Ask if user wants to delete the process entirely
        echo ""
        print_status "Would you like to delete the api-flux process from PM2? (y/N)"
        read -r response
        case "$response" in
            [yY][eE][sS]|[yY])
                print_status "Deleting api-flux process from PM2..."
                pm2 delete api-flux
                if [ $? -eq 0 ]; then
                    print_success "api-flux process deleted from PM2"
                else
                    print_warning "Failed to delete api-flux process"
                fi
                ;;
            *)
                print_status "Process stopped but kept in PM2 (can be restarted with 'pm2 restart api-flux')"
                ;;
        esac
        
        # Save PM2 configuration
        print_status "Saving PM2 configuration..."
        pm2 save
        if [ $? -eq 0 ]; then
            print_success "PM2 configuration saved"
        else
            print_warning "Failed to save PM2 configuration"
        fi
        
    else
        print_error "Failed to stop api-flux process"
        exit 1
    fi
else
    print_warning "No api-flux process found in PM2"
    print_status "Current PM2 processes:"
    pm2 status
fi

print_success "🏁 Server stop operation completed!"
print_status ""
print_status "Useful PM2 commands:"
print_status "  📊 Check status: pm2 status"
print_status "  🔄 Restart: pm2 restart api-flux"
print_status "  🚀 Start: pm2 start api-flux"
print_status "  📋 View logs: pm2 logs api-flux"
print_status "  🖥️  Monitor: pm2 monit"