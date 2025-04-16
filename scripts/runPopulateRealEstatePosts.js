#!/usr/bin/env node

// This script runs the TypeScript script to populate the database with real estate posts
// It requires ts-node to be installed

const { execSync } = require('child_process');
const path = require('path');

console.log('Running populate real estate posts script...');

try {
  // Execute the TypeScript script using ts-node
  execSync('npx ts-node ' + path.join(__dirname, 'populateRealEstatePosts.ts'), { 
    stdio: 'inherit' 
  });
  
  console.log('Script completed successfully!');
} catch (error) {
  console.error('Error running script:', error);
  process.exit(1);
} 