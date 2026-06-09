#!/bin/bash

# Webflow App Build Script
# Builds UI and Backend artifacts for deployment

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

print_status "Starting build process..."

if ! command_exists node; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
fi

print_status "Working directory: $SCRIPT_DIR"
print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

build_ui() {
    print_status "Building UI..."
    if [ ! -d "Application/UI" ]; then
        print_error "UI directory not found"
        exit 1
    fi

    cd "Application/UI"
    if [ ! -f "package.json" ]; then
        print_error "UI package.json not found"
        exit 1
    fi

    print_status "Installing UI dependencies..."
    npm install

    npm run build
    if [ ! -d "dist" ]; then
        print_error "UI dist folder not found after build"
        exit 1
    fi

    print_success "UI build completed"
    cd "$SCRIPT_DIR"
}

publish_ui_assets() {
    print_status "Copying UI build to backend public directory..."
    mkdir -p "Application/Backend/public"

    if [ -d "Application/Backend/public" ] && [ "$(ls -A Application/Backend/public)" ]; then
        print_status "Cleaning backend public directory..."
        rm -rf Application/Backend/public/*
    fi

    cp -r Application/UI/dist/* Application/Backend/public/
    print_success "UI build copied to Application/Backend/public"
}

build_backend() {
    print_status "Building Backend..."
    if [ ! -d "Application/Backend" ]; then
        print_error "Backend directory not found"
        exit 1
    fi

    cd "Application/Backend"
    if [ ! -f "package.json" ]; then
        print_error "Backend package.json not found"
        exit 1
    fi

    print_status "Installing Backend dependencies..."
    npm install

    npm run build
    if [ ! -d "dist" ]; then
        print_error "Backend dist folder not found after build"
        exit 1
    fi

    print_success "Backend build completed"
    cd "$SCRIPT_DIR"
}

build_ui
publish_ui_assets
build_backend

print_success "Build process completed successfully"
