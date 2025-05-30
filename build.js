#!/usr/bin/env node

var execSync = require('child_process').execSync;
var path = require('path');
var fs = require('fs');

/**
 * Execute shell commands in a specified directory
 * @param {string} command - Command to execute
 * @param {string} cwd - Working directory where to execute the command
 * @returns {Buffer} - Command output
 */
function execute(command, cwd) {
  console.log('Executing: ' + command + ' in ' + cwd);
  try {
    return execSync(command, {
      cwd: cwd,
      stdio: 'inherit' // Show output in real-time
    });
  } catch (error) {
    console.error('Error executing ' + command + ': ' + error.message);
    process.exit(1);
  }
}

/**
 * Main build function
 */
function build() {
  try {

    console.log('🚀 Starting build process...');
    execute('yarn', clientDir);

    // Get the root directory
    var rootDir = process.cwd();
    console.log('Root directory: ' + rootDir);

    // Client directory setup
    var clientDir = path.join(rootDir, 'application', 'client');
    console.log('\n📦 Installing client dependencies...');
    execute('yarn', clientDir);

    // Server directory setup
    var serverDir = path.join(rootDir, 'application', 'server');
    console.log('\n📦 Installing server dependencies...');
    execute('yarn', serverDir);

    // Run build from the root directory
    console.log('\n🔨 Building project...');
    execute('yarn build', rootDir);

    console.log('\n✅ Build completed successfully!');
  } catch (error) {
    console.error('\n❌ Build failed: ' + error.message);
    process.exit(1);
  }
}

// Check if yarn is installed
try {
  execSync('yarn --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Yarn is not installed. Please install Yarn before running this script.');
  process.exit(1);
}

// Run the build process
build();
