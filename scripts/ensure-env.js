/**
 * This script ensures that firebase.config.ts exists in the environments directory
 * before building or running the application.
 *
 * Purpose:
 * - Checks if firebase.config.ts already exists
 * - If not, copies it from firebase.config.template.ts
 * - Prevents build failures due to missing configuration file
 *
 * Usage:
 * This script is typically run as a pre-build or postinstall step in package.json
 * to guarantee the configuration file is present for local development.
 */
const fs = require('fs');
const path = require('path');
const {constants} = require("node:fs");


const projectRoot = process.cwd();

const templatePath = path.join(projectRoot, 'apps/main-app/src/environments/firebase.config.template.ts');
const configPath = path.join(projectRoot, 'apps/main-app/src/environments/firebase.config.ts');

try {
  if (fs.existsSync(configPath)) {
    console.log('firebase.config.ts exists. Skipping copy.');
  } else {
    if (fs.existsSync(templatePath)) {
      fs.copyFileSync(templatePath, configPath, constants.COPYFILE_EXCL);
      console.log('Created firebase.config.ts from template.');
    } else {
      console.error('Error: firebase.config.template.ts not found at:', templatePath);
      process.exit(1);
    }
  }
} catch (error) {
  console.error('Failed to copy firebase config:', error);
  process.exit(1);
}
