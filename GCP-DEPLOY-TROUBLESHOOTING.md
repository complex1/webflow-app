# GCP Deployment Troubleshooting Guide

## Problem
Vite plugin version compatibility error during build on GCP server.

## Root Cause
The error occurs due to version mismatches between:
- Different Vite installations (root vs client folder)
- Vue plugin and Vite core versions
- Cached node_modules with conflicting dependencies

## Solutions (Try in order)

### Solution 1: Use the updated deploy.sh script
```bash
./deploy.sh
```

### Solution 2: Use npm instead of yarn
```bash
./deploy-npm.sh
```

### Solution 3: Manual cleanup and rebuild
```bash
# On your GCP server
cd /path/to/your/webflow-app

# Complete cleanup
rm -rf node_modules package-lock.json yarn.lock
rm -rf application/client/node_modules application/client/package-lock.json application/client/yarn.lock
rm -rf application/server/node_modules application/server/package-lock.json application/server/yarn.lock

# Clear npm/yarn cache
npm cache clean --force
yarn cache clean

# Reinstall everything
npm install
cd application/client && npm install
cd ../server && npm install
cd ../..

# Build
npm run build

# Restart services
pm2 stop server
pm2 start server
```

### Solution 4: Pin specific versions (if above solutions don't work)
Update `application/client/package.json` to use exact versions:

```json
{
  "devDependencies": {
    "@vitejs/plugin-vue": "5.2.2",
    "vite": "6.3.1",
    "vite-plugin-vue-devtools": "7.7.6",
    "vue-tsc": "2.2.8"
  }
}
```

### Solution 5: Use legacy peer deps (last resort)
```bash
cd application/client
npm install --legacy-peer-deps
```

## Prevention
1. Always use the same package manager (npm or yarn) across all environments
2. Commit package-lock.json or yarn.lock files
3. Use exact versions for critical dependencies
4. Clear caches when switching between environments

## Notes
- The error indicates conflicting HotUpdatePluginContext types between different Vite versions
- This is a common issue when mixing package managers or having multiple Vite installations
- The updated deploy scripts ensure clean installation to prevent this issue
