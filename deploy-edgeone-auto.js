import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const PROJECT_NAME = 'zenstreak';
const DOMAIN_SUFFIX = '.example.com'; // 可以修改为您的域名

// 创建命令行接口用于输入敏感信息
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function deployToEdgeOne() {
  console.log('🚀 Starting EdgeOne deployment for ZenStreak...');
  
  // Step 1: Build the project
  console.log('\n📦 Building the project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }

  // Step 2: Get login credentials
  console.log('\n🔐 EdgeOne Login Required');
  console.log('Please choose login method:');
  console.log('1. Email login');
  console.log('2. Manual login (browser will open)');
  
  const loginChoice = await question('Enter your choice (1 or 2): ');
  
  let email = '';
  let password = '';
  
  if (loginChoice === '1') {
    email = await question('Enter your email/DNSPod account: ');
    password = await question('Enter your password: ');
    console.log('\n');
  }

  // Step 3: Launch browser
  const browser = await chromium.launch({ 
    headless: loginChoice === '1', // 如果自动登录则无头模式
    timeout: 60000
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();

  try {
    // Navigate to EdgeOne
    console.log('🌐 Navigating to EdgeOne console...');
    await page.goto('https://console.cloud.tencent.com/edgeone', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Handle login
    const needsLogin = page.url().includes('login');
    
    if (needsLogin) {
      if (loginChoice === '1' && email && password) {
        console.log('🔑 Attempting automatic login...');
        
        // Click email login tab
        await page.click('text=邮箱登录');
        await page.waitForTimeout(1000);
        
        // Fill in credentials
        await page.fill('input[placeholder*="邮箱地址"]', email);
        await page.fill('input[placeholder*="密码"]', password);
        
        // Click login button
        await page.click('button:has-text("登录")');
        
        // Wait for login to complete
        try {
          await page.waitForURL(/console\.cloud\.tencent\.com/, { 
            timeout: 30000 
          });
          console.log('✅ Login successful!');
        } catch (error) {
          console.error('❌ Login failed. Opening browser for manual login...');
          await browser.close();
          
          // Relaunch with UI
          const uiBrowser = await chromium.launch({ headless: false });
          const uiContext = await uiBrowser.newContext({ viewport: { width: 1920, height: 1080 } });
          const uiPage = await uiContext.newPage();
          await uiPage.goto('https://console.cloud.tencent.com/edgeone');
          
          console.log('Please complete login manually and press Enter when done...');
          await question('');
          
          // Continue with UI browser
          browser = uiBrowser;
          context = uiContext;
          page = uiPage;
        }
      } else {
        console.log('👤 Please complete login in the browser and press Enter when done...');
        await question('');
      }
    }

    // Navigate to EdgeOne if not already there
    if (!page.url().includes('/edgeone')) {
      await page.goto('https://console.cloud.tencent.com/edgeone', { 
        waitUntil: 'networkidle' 
      });
    }

    // Wait for page to stabilize
    await page.waitForTimeout(3000);
    
    console.log('📋 Checking for existing sites...');
    
    // Check if we need to create a new site
    const hasNoSites = await page.locator('text=/暂无数据|No data|暂无站点/').isVisible().catch(() => false);
    const siteExists = await page.locator(`text="${PROJECT_NAME}"`).isVisible().catch(() => false);
    
    if (hasNoSites || (!siteExists && !hasNoSites)) {
      console.log('🆕 Creating new site...');
      
      // Look for create button
      const createButton = await page.locator('button:has-text("接入站点"), button:has-text("创建站点"), button:has-text("新建站点")').first();
      
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForTimeout(2000);
        
        // Fill in site creation form
        console.log('📝 Configuring site...');
        
        // Step through site creation wizard
        // 1. Select acceleration type
        const staticHosting = await page.locator('text=/静态内容加速|Static/').first();
        if (await staticHosting.isVisible()) {
          await staticHosting.click();
        }
        
        // 2. Enter domain
        const domainInput = await page.locator('input[placeholder*="域名"], input[placeholder*="domain"]').first();
        if (await domainInput.isVisible()) {
          await domainInput.fill(`${PROJECT_NAME}${DOMAIN_SUFFIX}`);
        }
        
        // 3. Click next/submit
        await page.click('button:has-text("下一步"), button:has-text("Next"), button:has-text("确定")');
        
        console.log('⏳ Waiting for site creation...');
        await page.waitForTimeout(5000);
      }
    } else if (siteExists) {
      console.log('📂 Site exists, entering site management...');
      await page.click(`text="${PROJECT_NAME}"`);
      await page.waitForTimeout(3000);
    }

    // Upload files
    console.log('📤 Preparing to upload files...');
    
    // Navigate to site management/files
    const fileManagement = await page.locator('text=/源站管理|源文件|文件管理|Origin/').first();
    if (await fileManagement.isVisible()) {
      await fileManagement.click();
      await page.waitForTimeout(2000);
    }

    // Look for upload functionality
    console.log('⬆️ Uploading build files...');
    
    // Get all files from dist
    const distPath = path.join(process.cwd(), 'dist');
    const files = getAllFiles(distPath);
    
    console.log(`📦 Found ${files.length} files to upload`);
    
    // Try to find upload button or area
    const uploadButton = await page.locator('button:has-text("上传"), button:has-text("Upload")').first();
    
    if (await uploadButton.isVisible()) {
      // Set up file chooser listener
      page.on('filechooser', async (fileChooser) => {
        await fileChooser.setFiles(files);
      });
      
      await uploadButton.click();
      
      // Wait for upload dialog
      await page.waitForTimeout(1000);
      
      // Trigger file selection
      const selectFiles = await page.locator('text=/选择文件|Choose files|点击上传/').first();
      if (await selectFiles.isVisible()) {
        await selectFiles.click();
      }
      
      console.log('⏳ Uploading files...');
      await page.waitForTimeout(10000); // Wait for upload
    }

    // Get deployment info
    console.log('\n✅ Deployment process completed!');
    console.log('📋 Next steps:');
    console.log('1. Verify files are uploaded in EdgeOne console');
    console.log('2. Configure DNS settings for your domain');
    console.log('3. Enable HTTPS in EdgeOne settings');
    console.log(`4. Access your site at: https://${PROJECT_NAME}${DOMAIN_SUFFIX}`);
    
    if (loginChoice === '1') {
      // Take screenshot of final state
      await page.screenshot({ path: 'edgeone-deployment-complete.png' });
      console.log('\n📸 Screenshot saved: edgeone-deployment-complete.png');
    } else {
      console.log('\n🌐 Browser window will remain open for verification.');
      console.log('Press Ctrl+C to exit when done.');
      await new Promise(() => {}); // Keep browser open
    }

  } catch (error) {
    console.error('\n❌ Deployment error:', error.message);
    await page.screenshot({ path: 'edgeone-error.png' });
    console.error('📸 Error screenshot saved: edgeone-error.png');
    
    if (loginChoice !== '1') {
      console.log('\n⚠️  You can continue manually in the browser.');
      console.log('Press Ctrl+C to exit.');
      await new Promise(() => {});
    }
  } finally {
    rl.close();
    if (loginChoice === '1') {
      await browser.close();
    }
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

// Alternative: Direct S3-compatible upload if EdgeOne provides it
async function uploadViaAPI(files) {
  console.log('🔧 Attempting API-based upload...');
  // This would require EdgeOne API credentials
  // Implementation depends on EdgeOne's API documentation
}

// Run deployment
deployToEdgeOne().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});