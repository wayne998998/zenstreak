import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const PROJECT_NAME = 'zenstreak';
const EDGEONE_CONSOLE_URL = 'https://console.cloud.tencent.com/edgeone';

async function setupEdgeOneProject() {
  console.log('🚀 Setting up EdgeOne deployment for ZenStreak...');
  
  // Step 1: Build the project
  console.log('📦 Building the project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }

  // Step 2: Create deployment configuration
  console.log('📝 Creating EdgeOne deployment configuration...');
  
  const edgeoneConfig = {
    name: PROJECT_NAME,
    type: 'static',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    routes: [
      {
        src: '/(.*)',
        dest: '/$1'
      }
    ],
    headers: [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  };

  fs.writeFileSync('edgeone.json', JSON.stringify(edgeoneConfig, null, 2));
  console.log('✅ Configuration file created');

  // Step 3: Create deployment script
  const deployScript = `#!/bin/bash
# EdgeOne Deployment Script for ZenStreak

echo "🚀 Deploying ZenStreak to EdgeOne..."

# Check if EdgeOne CLI is installed
if ! command -v edgeone &> /dev/null; then
    echo "❌ EdgeOne CLI not found. Please install it first:"
    echo "npm install -g @tencent/edgeone-cli"
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to EdgeOne
echo "🌐 Deploying to EdgeOne..."
edgeone deploy --dir dist --name ${PROJECT_NAME}

echo "✅ Deployment complete!"
`;

  fs.writeFileSync('deploy.sh', deployScript);
  execSync('chmod +x deploy.sh');
  console.log('✅ Deployment script created');

  // Step 4: Launch browser for manual steps
  console.log('\n📋 Next steps:');
  console.log('1. Install EdgeOne CLI: npm install -g @tencent/edgeone-cli');
  console.log('2. Login to EdgeOne: edgeone login');
  console.log('3. Run deployment: ./deploy.sh');
  console.log('\nAlternatively, opening EdgeOne console for manual deployment...\n');

  const browser = await chromium.launch({ 
    headless: false,
    timeout: 60000 
  });
  
  const page = await browser.newPage();
  
  try {
    await page.goto(EDGEONE_CONSOLE_URL);
    console.log('🌐 EdgeOne console opened. You can:');
    console.log('1. Create a new static website');
    console.log('2. Upload the contents of the "dist" folder');
    console.log('3. Configure custom domain if needed');
    
    // Keep browser open for manual interaction
    console.log('\nPress Ctrl+C when you\'re done with the deployment...');
    
    // Wait indefinitely
    await new Promise(() => {});
    
  } catch (error) {
    if (error.message.includes('Target closed')) {
      console.log('✅ Browser closed by user');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the setup
setupEdgeOneProject().catch(error => {
  console.error('Setup error:', error);
  process.exit(1);
});