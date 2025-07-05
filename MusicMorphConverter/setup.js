#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎵 MIDI Studio Setup Script');
console.log('===========================\n');

// Check Node.js version
const nodeVersion = process.version;
console.log(`✓ Node.js version: ${nodeVersion}`);

// Create necessary directories
const directories = ['uploads', 'public'];
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  } else {
    console.log(`✓ Directory exists: ${dir}`);
  }
});

// Check if config.json exists
if (!fs.existsSync('config.json')) {
  console.log('❌ config.json not found');
  console.log('   Please copy the config template from README.md');
} else {
  console.log('✓ Configuration file found');
  
  // Check YouTube API key
  try {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    if (config.youtube && config.youtube.apiKey && config.youtube.apiKey !== 'YOUR_YOUTUBE_API_KEY_HERE') {
      console.log('✓ YouTube API key configured');
    } else {
      console.log('⚠️  YouTube API key not configured (search will be limited)');
      console.log('   See README.md for setup instructions');
    }
  } catch (error) {
    console.log('❌ Error reading config.json:', error.message);
  }
}

// Check FFmpeg installation
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
  console.log('✓ FFmpeg is installed');
} catch (error) {
  console.log('❌ FFmpeg not found');
  console.log('   Install instructions:');
  console.log('   - Windows: Download from https://ffmpeg.org/download.html');
  console.log('   - macOS: brew install ffmpeg');
  console.log('   - Linux: sudo apt install ffmpeg');
}

// Check dependencies
try {
  require('ytdl-core');
  require('youtube-sr');
  require('fluent-ffmpeg');
  console.log('✓ Core dependencies installed');
} catch (error) {
  console.log('❌ Missing dependencies, run: npm install');
}

console.log('\n🚀 Setup Status:');
console.log('================');
console.log('1. Run "npm run dev" to start the application');
console.log('2. Open http://localhost:5000 in your browser');
console.log('3. For full YouTube search, add API key to config.json');
console.log('4. Upload MIDI files or search YouTube videos to start converting');

console.log('\n📚 Need help? Check README.md for detailed instructions');