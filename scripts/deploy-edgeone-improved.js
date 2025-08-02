import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGEONE_CONSOLE_URL = 'https://console.cloud.tencent.com/edgeone';
const PROJECT_NAME = 'zenstreak';

async function deployToEdgeOne() {
  console.log('🚀 Starting EdgeOne deployment for ZenStreak...');
  
  // Step 1: Build the project
  console.log('📦 Building the project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }

  // Step 2: Launch browser
  const browser = await chromium.launch({ 
    headless: false,
    timeout: 60000,
    args: ['--disable-blink-features=AutomationControlled']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();

  try {
    // Navigate to EdgeOne console
    console.log('🌐 Navigating to EdgeOne console...');
    await page.goto(EDGEONE_CONSOLE_URL, { waitUntil: 'networkidle' });
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'edgeone-login-page.png' });
    
    // Check if we're on login page
    const isLoginPage = await page.url().includes('login') || 
                       await page.locator('.accsys-login, .login-container, #login').count() > 0;
    
    if (isLoginPage) {
      console.log('👤 Login required. Please complete the login process in the browser window...');
      console.log('   Options: WeChat login (微信登录) or Email login (邮箱登录)');
      
      // Wait for user to complete login - check for console elements
      await page.waitForURL(/console\.cloud\.tencent\.com(?!.*login)/, { 
        timeout: 300000 // 5 minutes for login
      });
      
      console.log('✅ Login successful!');
      
      // Navigate to EdgeOne if not already there
      if (!page.url().includes('/edgeone')) {
        await page.goto(EDGEONE_CONSOLE_URL, { waitUntil: 'networkidle' });
      }
    }
    
    // Wait for EdgeOne console to load
    console.log('⏳ Waiting for EdgeOne console to load...');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Extra wait for dynamic content
    
    // Take screenshot of console
    await page.screenshot({ path: 'edgeone-console.png' });
    
    // Look for site list or create button
    console.log('📋 Looking for existing sites or create button...');
    
    // Try different selectors for create site button
    const createSelectors = [
      'button:has-text("创建站点")',
      'button:has-text("新建站点")',
      'button:has-text("Create Site")',
      'button:has-text("添加站点")',
      'a:has-text("创建站点")',
      '[class*="create"]:has-text("站点")',
      '.button-primary:has-text("创建")'
    ];
    
    let createButton = null;
    for (const selector of createSelectors) {
      if (await page.locator(selector).count() > 0) {
        createButton = page.locator(selector).first();
        break;
      }
    }
    
    // Check if site already exists
    const siteExists = await page.locator(`text="${PROJECT_NAME}"`).count() > 0;
    
    if (!siteExists && createButton) {
      console.log('🆕 Creating new site...');
      await createButton.click();
      await page.waitForTimeout(2000);
      
      // Fill site creation form
      console.log('📝 Filling site details...');
      
      // Site name
      await page.fill('input[placeholder*="站点名称"], input[placeholder*="site name"], input[name*="name"]', PROJECT_NAME);
      
      // Domain
      await page.fill('input[placeholder*="域名"], input[placeholder*="domain"], input[name*="domain"]', `${PROJECT_NAME}.edgeone.site`);
      
      // Look for static hosting option
      const staticOptions = [
        'text=/静态网站|Static Website|静态托管/i',
        'label:has-text("静态网站")',
        'input[value="static"]'
      ];
      
      for (const option of staticOptions) {
        if (await page.locator(option).count() > 0) {
          await page.click(option);
          break;
        }
      }
      
      // Submit form
      const submitButtons = [
        'button:has-text("确定")',
        'button:has-text("创建")',
        'button:has-text("Create")',
        'button[type="submit"]'
      ];
      
      for (const button of submitButtons) {
        if (await page.locator(button).count() > 0) {
          await page.click(button);
          break;
        }
      }
      
      console.log('⏳ Waiting for site creation...');
      await page.waitForTimeout(5000);
      
    } else if (siteExists) {
      console.log('📂 Site already exists, clicking to enter...');
      await page.click(`text="${PROJECT_NAME}"`);
      await page.waitForTimeout(3000);
    }
    
    // Navigate to file management
    console.log('📁 Looking for file management section...');
    
    const fileManagementSelectors = [
      'text=/文件管理|File Management/i',
      'text=/文件|Files/i',
      'a[href*="file"]',
      'nav >> text=/文件/i'
    ];
    
    for (const selector of fileManagementSelectors) {
      if (await page.locator(selector).count() > 0) {
        await page.click(selector);
        await page.waitForTimeout(2000);
        break;
      }
    }
    
    // Look for upload button
    console.log('⬆️ Looking for upload option...');
    
    const uploadSelectors = [
      'button:has-text("上传")',
      'button:has-text("Upload")',
      'button:has-text("上传文件")',
      '[class*="upload"]',
      'input[type="file"]'
    ];
    
    let uploadFound = false;
    for (const selector of uploadSelectors) {
      if (await page.locator(selector).count() > 0) {
        uploadFound = true;
        
        if (selector.includes('input[type="file"]')) {
          // Direct file input
          const fileInput = page.locator(selector);
          const files = getAllFiles(path.join(process.cwd(), 'dist'));
          await fileInput.setInputFiles(files);
        } else {
          // Click upload button
          await page.click(selector);
          await page.waitForTimeout(1000);
          
          // Handle file chooser
          const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 5000 }).catch(() => null);
          
          // Try to trigger file dialog
          const fileDialogSelectors = [
            'text=/选择文件|Choose Files/i',
            'button:has-text("浏览")',
            'input[type="file"]'
          ];
          
          for (const dialogSelector of fileDialogSelectors) {
            if (await page.locator(dialogSelector).count() > 0) {
              await page.click(dialogSelector);
              break;
            }
          }
          
          const fileChooser = await fileChooserPromise;
          if (fileChooser) {
            const files = getAllFiles(path.join(process.cwd(), 'dist'));
            await fileChooser.setFiles(files);
          }
        }
        
        break;
      }
    }
    
    if (!uploadFound) {
      console.log('⚠️  Could not find upload button automatically.');
      console.log('📋 Manual steps required:');
      console.log('   1. Navigate to File Management (文件管理)');
      console.log('   2. Click Upload (上传)');
      console.log('   3. Select all files from the "dist" folder');
      console.log('   4. Wait for upload to complete');
    }
    
    console.log('\n🎯 Deployment checklist:');
    console.log('   ✓ Project built successfully');
    console.log('   ✓ Logged into Tencent Cloud');
    console.log('   ✓ Navigated to EdgeOne console');
    console.log('   ? Site creation/selection');
    console.log('   ? File upload');
    console.log('\n💡 Complete any remaining steps in the browser window.');
    console.log('   The dist folder contains all files to upload.');
    console.log('\n🌐 Once deployed, your site will be available at:');
    console.log(`   https://${PROJECT_NAME}.edgeone.site or your custom domain`);
    
    // Keep browser open for manual completion
    console.log('\n⏳ Keeping browser open. Press Ctrl+C when deployment is complete...');
    await new Promise(() => {}); // Wait indefinitely
    
  } catch (error) {
    console.error('❌ Error during deployment:', error.message);
    await page.screenshot({ path: 'edgeone-error.png' });
    
    // Don't close browser on error - let user complete manually
    console.log('\n⚠️  Automated deployment encountered an issue.');
    console.log('   You can complete the deployment manually in the browser.');
    console.log('   Press Ctrl+C to exit when done.');
    
    await new Promise(() => {}); // Wait indefinitely
  }
}

// Helper function to get all files recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });
  
  return arrayOfFiles;
}

// Run deployment
deployToEdgeOne().catch(error => {
  console.error('Deployment error:', error);
  process.exit(1);
});