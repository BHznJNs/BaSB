#!/usr/bin/env node
import { platform, arch } from 'process';
import { execSync } from 'child_process';

// 检查是否是 darwin arm64
const isDarwinArm64 = platform === 'darwin' && arch === 'arm64';

if (!isDarwinArm64) {
  console.log('Installing utimes package for non-ARM64 Mac platforms...');
  try {
    execSync('npm install utimes@^5.2.1', { stdio: 'inherit' });
  } catch (error) {
    console.warn('Failed to install utimes, but continuing anyway');
    console.warn('File timestamp restoration will be limited to mtime only');
  }
} else {
  console.log('Skipping utimes installation on darwin arm64');
  console.log('Using Node.js built-in fs.utimesSync for timestamp restoration');
}
