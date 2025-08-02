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

  // Step 2: Launch browser and navigate to EdgeOne
  const browser = await chromium.launch({ 
    headless: false,
    timeout: 60000 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();

  try {
    // Navigate to EdgeOne console
    console.log('🌐 Navigating to EdgeOne console...');
    await page.goto(EDGEONE_CONSOLE_URL);
    
    // Wait for login if needed
    console.log('⏳ Waiting for login...');
    console.log('Please log in to your Tencent Cloud account if prompted.');
    
    // Wait for either the login page or the console to load
    await page.waitForSelector('text=/EdgeOne|登录|Login/i', { timeout: 30000 });
    
    // Check if we need to login
    const needsLogin = await page.locator('text=/登录|Login/i').isVisible();
    
    if (needsLogin) {
      console.log('👤 Please complete the login process in the browser window...');
      // Wait for successful login - adjust selector based on EdgeOne's actual console
      await page.waitForSelector('text=/控制台|Console|站点|Site/i', { timeout: 120000 });
      console.log('✅ Login successful');
    }
    
    // Navigate to site management or create new site
    console.log('📋 Navigating to site management...');
    
    // Look for existing site or create new button
    const createSiteButton = page.locator('button:has-text("创建站点"), button:has-text("Create Site"), button:has-text("新建站点")');
    const siteExists = await page.locator(`text=${PROJECT_NAME}`).isVisible();
    
    if (!siteExists) {
      console.log('🆕 Creating new site...');
      await createSiteButton.click();
      
      // Fill in site details
      await page.fill('input[placeholder*="站点名称"], input[placeholder*="Site name"]', PROJECT_NAME);
      await page.fill('input[placeholder*="域名"], input[placeholder*="Domain"]', `${PROJECT_NAME}.example.com`);
      
      // Select hosting type - look for static hosting option
      await page.click('text=/静态网站|Static Website|静态托管/i');
      
      // Confirm creation
      await page.click('button:has-text("确定"), button:has-text("Confirm"), button:has-text("创建")');
      
      console.log('✅ Site created successfully');
    } else {
      console.log('📂 Site already exists, updating...');
      await page.click(`text=${PROJECT_NAME}`);
    }
    
    // Wait for site details page
    await page.waitForSelector('text=/文件管理|File Management|上传|Upload/i', { timeout: 30000 });
    
    // Navigate to file management
    console.log('📁 Navigating to file management...');
    await page.click('text=/文件管理|File Management/i');
    
    // Upload files
    console.log('⬆️ Uploading build files...');
    
    // Look for upload button
    const uploadButton = page.locator('button:has-text("上传"), button:has-text("Upload")');
    await uploadButton.click();
    
    // Handle file upload dialog
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=/选择文件|Choose Files|上传文件/i');
    const fileChooser = await fileChooserPromise;
    
    // Get all files from dist directory
    const distPath = path.join(process.cwd(), 'dist');
    const files = getAllFiles(distPath);
    
    console.log(`📦 Found ${files.length} files to upload`);
    
    // Upload files in batches if needed
    await fileChooser.setFiles(files);
    
    // Confirm upload
    await page.click('button:has-text("确认"), button:has-text("Confirm"), button:has-text("上传")');
    
    // Wait for upload to complete
    console.log('⏳ Waiting for upload to complete...');
    await page.waitForSelector('text=/上传成功|Upload successful|完成/i', { timeout: 120000 });
    
    console.log('✅ Files uploaded successfully');
    
    // Get the deployment URL
    const deploymentUrl = await page.locator('text=/访问地址|Access URL|域名/i').locator('..').locator('a').getAttribute('href');
    
    console.log('🎉 Deployment successful!');
    console.log(`🌐 Your site is available at: ${deploymentUrl || 'Check EdgeOne console for URL'}`);
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.log('📸 Taking screenshot for debugging...');
    await page.screenshot({ path: 'edgeone-error.png' });
    throw error;
  } finally {
    console.log('🧹 Cleaning up...');
    await browser.close();
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

// Run the deployment
deployToEdgeOne().catch(error => {
  console.error('Deployment error:', error);
  process.exit(1);
});