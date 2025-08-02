#!/usr/bin/env node

import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  console.log('Starting Vite build...');
  
  await build({
    configFile: join(__dirname, 'vite.config.js'),
    mode: 'production'
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 