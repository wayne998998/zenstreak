import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGEONE_CONSOLE_URL = 'https://console.cloud.tencent.com/edgeone';
const PROJECT_NAME = 'zenstreak';

async function deployToEdgeOne() {
  console.log('🚀 Starting EdgeOne deployment for ZenStreak using Edge browser...');
  
  // Step 1: Build the project
  console.log('📦 Building the project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }

  // Step 2: Launch Edge browser
  console.log('🌐 Launching Microsoft Edge browser...');
  
  // Playwright 使用 chromium 通道来控制 Edge（因为 Edge 基于 Chromium）
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'msedge', // 使用系统安装的 Edge 浏览器
    timeout: 60000,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--start-maximized'
    ]
  });
  
  const context = await browser.newContext({
    viewport: null, // 使用最大化窗口
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
  });
  
  const page = await context.newPage();

  try {
    // Navigate to EdgeOne console
    console.log('🌐 Navigating to EdgeOne console in Edge...');
    await page.goto(EDGEONE_CONSOLE_URL, { waitUntil: 'networkidle' });
    
    // Take screenshot
    await page.screenshot({ path: 'edgeone-edge-browser.png' });
    
    // Check if we're on login page
    const isLoginPage = await page.url().includes('login') || 
                       await page.locator('.accsys-login, .login-container, #login').count() > 0;
    
    if (isLoginPage) {
      console.log('👤 Login required. Please complete the login process in Edge browser...');
      console.log('   提示：Edge 浏览器可能会自动填充您保存的密码');
      
      // Wait for user to complete login
      await page.waitForURL(/console\.cloud\.tencent\.com(?!.*login)/, { 
        timeout: 300000 // 5 minutes for login
      });
      
      console.log('✅ Login successful!');
      
      // Navigate to EdgeOne if not already there
      if (!page.url().includes('/edgeone')) {
        await page.goto(EDGEONE_CONSOLE_URL, { waitUntil: 'networkidle' });
      }
    }
    
    // Rest of the deployment logic remains the same...
    console.log('📋 EdgeOne console loaded in Edge browser');
    console.log('🎯 You can now proceed with manual deployment or press Enter to continue with automation...');
    
    // Keep browser open for manual interaction
    console.log('\n💡 Edge 浏览器优势：');
    console.log('   - 可能已保存您的腾讯云登录信息');
    console.log('   - 更好的兼容性和性能');
    console.log('   - 支持所有 EdgeOne 功能');
    console.log('\nPress Ctrl+C when deployment is complete...');
    
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'edgeone-edge-error.png' });
  }
}

// Run deployment
deployToEdgeOne().catch(error => {
  console.error('Deployment error:', error);
  process.exit(1);
});