#!/bin/bash

# Webflow App Deployment Script
# This script automates the deployment process for the webflow application

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

# Basic environment checks
print_status "Starting deployment process..."

# Check required tools
if ! command_exists node; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
fi

# Get current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

print_status "Working directory: $SCRIPT_DIR"

# Check Node.js version compatibility
check_node_version() {
    local current_version=$(node --version | sed 's/v//')
    local major_version=$(echo $current_version | cut -d. -f1)
    
    print_status "Current Node.js version: v$current_version"
    print_status "Current npm version: $(npm --version)"
    
    # Check if .nvmrc exists and compare
    if [ -f ".nvmrc" ]; then
        local required_version=$(cat .nvmrc)
        print_status "Required Node.js version (from .nvmrc): v$required_version"
        
        if [ "$current_version" != "$required_version" ]; then
            print_warning "Node.js version mismatch!"
            print_warning "Current: v$current_version, Required: v$required_version"
        else
            print_success "Node.js version matches .nvmrc requirement"
        fi
    fi
    
    # Check Backend package.json engines
    if [ -f "Application/Backend/package.json" ]; then
        local backend_engine=$(grep -A 2 '"engines"' Application/Backend/package.json | grep '"node"' | sed 's/.*">=\([0-9]*\).*/\1/' | head -1)
        if [ ! -z "$backend_engine" ]; then
            print_status "Backend requires Node.js >= v$backend_engine"
            if [ "$major_version" -ge "$backend_engine" ]; then
                print_success "Backend Node.js version requirement satisfied"
            else
                print_error "Backend requires Node.js >= v$backend_engine, but current is v$current_version"
                exit 1
            fi
        fi
    fi
    
    # Check Frontend package.json engines
    if [ -f "Application/UI/package.json" ]; then
        local frontend_engine=$(grep -A 2 '"engines"' Application/UI/package.json | grep '"node"' | sed 's/.*">=\([0-9]*\).*/\1/' | head -1)
        if [ ! -z "$frontend_engine" ]; then
            print_status "Frontend requires Node.js >= v$frontend_engine"
            if [ "$major_version" -ge "$frontend_engine" ]; then
                print_success "Frontend Node.js version requirement satisfied"
            else
                print_error "Frontend requires Node.js >= v$frontend_engine, but current is v$current_version"
                exit 1
            fi
        fi
    fi
    
    print_success "Node.js version compatibility check passed"
}

# Run Node.js version check
check_node_version

# Step 2: Install dependencies
install_dependencies() {
    print_status "Step 2: Installing dependencies..."
    
    # Install Backend dependencies
    print_status "Installing Backend dependencies..."
    if [ -d "Application/Backend" ]; then
        cd "Application/Backend"
        print_status "Changed directory to: $(pwd)"
        
        if [ -f "package.json" ]; then
            print_status "Running npm install for Backend..."
            npm install
            if [ $? -eq 0 ]; then
                print_success "Backend dependencies installed successfully"
            else
                print_error "Failed to install Backend dependencies"
                exit 1
            fi
        else
            print_error "Backend package.json not found"
            exit 1
        fi
        
        # Return to project root
        cd "$SCRIPT_DIR"
    else
        print_error "Backend directory not found"
        exit 1
    fi
    
    # Install Frontend dependencies
    print_status "Installing Frontend dependencies..."
    if [ -d "Application/UI" ]; then
        cd "Application/UI"
        print_status "Changed directory to: $(pwd)"
        
        if [ -f "package.json" ]; then
            print_status "Running npm install for Frontend..."
            npm install
            if [ $? -eq 0 ]; then
                print_success "Frontend dependencies installed successfully"
            else
                print_error "Failed to install Frontend dependencies"
                exit 1
            fi
        else
            print_error "Frontend package.json not found"
            exit 1
        fi
        
        # Return to project root
        cd "$SCRIPT_DIR"
    else
        print_error "Frontend directory not found"
        exit 1
    fi
    
    print_success "All dependencies installed successfully"
}

# Run dependency installation
install_dependencies

# Step 3: Build UI and move to backend public directory
build_and_deploy_ui() {
    print_status "Step 3: Building UI and deploying to backend..."
    
    # Build the UI application
    print_status "Building UI application..."
    if [ -d "Application/UI" ]; then
        cd "Application/UI"
        print_status "Changed directory to: $(pwd)"
        
        if [ -f "package.json" ]; then
            print_status "Running npm run build for UI..."
            npm run build
            if [ $? -eq 0 ]; then
                print_success "UI build completed successfully"
            else
                print_error "Failed to build UI application"
                exit 1
            fi
        else
            print_error "UI package.json not found"
            exit 1
        fi
        
        # Check if dist folder exists
        if [ -d "dist" ]; then
            print_status "UI dist folder found, preparing to move files..."
            
            # Return to project root
            cd "$SCRIPT_DIR"
            
            # Create backend public directory if it doesn't exist
            mkdir -p "Application/Backend/public"
            print_status "Ensured backend public directory exists"
            
            # Remove old files from backend public directory
            if [ -d "Application/Backend/public" ] && [ "$(ls -A Application/Backend/public)" ]; then
                print_status "Removing old files from backend public directory..."
                rm -rf Application/Backend/public/*
            fi
            
            # Copy UI dist files to backend public directory
            print_status "Copying UI build files to backend public directory..."
            cp -r Application/UI/dist/* Application/Backend/public/
            if [ $? -eq 0 ]; then
                print_success "UI files copied to backend public directory successfully"
                
                # List the copied files for verification
                print_status "Files in backend public directory:"
                ls -la Application/Backend/public/
            else
                print_error "Failed to copy UI files to backend public directory"
                exit 1
            fi
        else
            print_error "UI dist folder not found after build"
            exit 1
        fi
    else
        print_error "UI directory not found"
        exit 1
    fi
    
    print_success "UI build and deployment completed successfully"
}

# Run UI build and deployment
build_and_deploy_ui

# Step 4: Build Backend application
build_backend() {
    print_status "Step 4: Building Backend application..."
    
    # Build the Backend application
    if [ -d "Application/Backend" ]; then
        cd "Application/Backend"
        print_status "Changed directory to: $(pwd)"
        
        if [ -f "package.json" ]; then
            print_status "Running npm run build for Backend..."
            npm run build
            if [ $? -eq 0 ]; then
                print_success "Backend build completed successfully"
                
                # Check if dist folder exists and show its contents
                if [ -d "dist" ]; then
                    print_status "Backend dist folder contents:"
                    ls -la dist/
                    
                    # Check if main entry file exists
                    if [ -f "dist/index.js" ]; then
                        print_success "Backend entry file (dist/index.js) created successfully"
                    else
                        print_warning "Backend entry file (dist/index.js) not found"
                    fi
                else
                    print_error "Backend dist folder not found after build"
                    exit 1
                fi
            else
                print_error "Failed to build Backend application"
                exit 1
            fi
        else
            print_error "Backend package.json not found"
            exit 1
        fi
        
        # Return to project root
        cd "$SCRIPT_DIR"
    else
        print_error "Backend directory not found"
        exit 1
    fi
    
    print_success "Backend build completed successfully"
}

# Run Backend build
build_backend

# Step 5: Manage server with PM2
manage_pm2_server() {
    print_status "Step 5: Managing server with PM2..."
    
    # Check if PM2 is installed
    if ! command_exists pm2; then
        print_warning "PM2 is not installed globally"
        print_status "Installing PM2 globally..."
        npm install -g pm2
        if [ $? -eq 0 ]; then
            print_success "PM2 installed successfully"
        else
            print_error "Failed to install PM2"
            exit 1
        fi
    else
        print_success "PM2 is already installed"
        print_status "PM2 version: $(pm2 --version)"
    fi
    
    # Check if api-flux process exists
    print_status "Checking for existing api-flux process..."
    
    # Get PM2 process list and check for api-flux
    pm2_list=$(pm2 jlist 2>/dev/null)
    api_flux_exists=$(echo "$pm2_list" | grep -c '"name":"api-flux"' || true)
    
    if [ "$api_flux_exists" -gt 0 ]; then
        print_status "Found existing api-flux process"
        print_status "Stopping and restarting api-flux server..."
        
        # Stop the existing process
        pm2 stop api-flux
        if [ $? -eq 0 ]; then
            print_success "api-flux process stopped successfully"
        else
            print_warning "Failed to stop api-flux process, continuing..."
        fi
        
        # Restart the process
        pm2 restart api-flux
        if [ $? -eq 0 ]; then
            print_success "api-flux process restarted successfully"
        else
            print_error "Failed to restart api-flux process"
            exit 1
        fi
    else
        print_status "No existing api-flux process found"
        print_status "Starting new api-flux server..."
        
        # Navigate to backend directory
        cd "Application/Backend"
        
        # Start new PM2 process
        pm2 start dist/index.js --name api-flux --env NODE_ENV=production
        if [ $? -eq 0 ]; then
            print_success "api-flux server started successfully"
        else
            print_error "Failed to start api-flux server"
            exit 1
        fi
        
        # Return to project root
        cd "$SCRIPT_DIR"
    fi
    
    # Show PM2 status
    print_status "Current PM2 process status:"
    pm2 status
    
    # Show PM2 logs for verification
    print_status "Recent logs from api-flux:"
    pm2 logs api-flux --lines 10 --nostream
    
    # Save PM2 configuration for auto-restart
    print_status "Saving PM2 configuration..."
    pm2 save
    if [ $? -eq 0 ]; then
        print_success "PM2 configuration saved"
    else
        print_warning "Failed to save PM2 configuration"
    fi
    
    print_success "Server management with PM2 completed successfully"
    print_status "Server is running at: http://localhost:3000"
    print_status "Health check: http://localhost:3000/api/health"
    print_status "API docs: http://localhost:3000/api-docs"
}

# Run PM2 server management
manage_pm2_server

# Final deployment summary
print_success "🎉 Deployment completed successfully!"
print_status "Summary of completed steps:"
print_status "  ✅ Step 1: Node.js version compatibility check"
print_status "  ✅ Step 2: Dependencies installation"
print_status "  ✅ Step 3: UI build and deployment"
print_status "  ✅ Step 4: Backend build"
print_status "  ✅ Step 5: PM2 server management"
print_status ""
print_status "🚀 Your application is now deployed and running!"
print_status "📊 Monitor with: pm2 monit"
print_status "📋 View logs with: pm2 logs api-flux"
print_status "🔄 Restart with: pm2 restart api-flux"