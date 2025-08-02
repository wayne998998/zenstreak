import { chromium, firefox, webkit } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const EDGEONE_CONSOLE_URL = 'https://console.cloud.tencent.com/edgeone';
const PROJECT_NAME = 'zenstreak';

// 创建命令行接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function selectBrowser() {
  console.log('\n🌐 选择要使用的浏览器：');
  console.log('1. Microsoft Edge (推荐 - 可能已保存登录信息)');
  console.log('2. Google Chrome');
  console.log('3. Firefox');
  console.log('4. Safari (仅 macOS)');
  
  const choice = await question('请输入选项 (1-4): ');
  
  const browserOptions = {
    headless: false,
    timeout: 60000
  };
  
  let browser;
  let browserName;
  
  switch (choice) {
    case '1':
      // Microsoft Edge
      browserName = 'Microsoft Edge';
      browserOptions.channel = 'msedge';
      browser = await chromium.launch(browserOptions);
      break;
      
    case '2':
      // Google Chrome
      browserName = 'Google Chrome';
      browserOptions.channel = 'chrome';
      browser = await chromium.launch(browserOptions);
      break;
      
    case '3':
      // Firefox
      browserName = 'Firefox';
      browser = await firefox.launch(browserOptions);
      break;
      
    case '4':
      // Safari (WebKit)
      browserName = 'Safari';
      browser = await webkit.launch(browserOptions);
      break;
      
    default:
      // 默认使用 Chromium
      browserName = 'Chromium';
      browser = await chromium.launch(browserOptions);
  }
  
  console.log(`✅ 正在启动 ${browserName}...`);
  return { browser, browserName };
}

async function deployToEdgeOne() {
  console.log('🚀 ZenStreak EdgeOne 部署工具');
  console.log('================================');
  
  // Step 1: Build the project
  console.log('\n📦 构建项目...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ 构建完成！');
  } catch (error) {
    console.error('❌ 构建失败:', error.message);
    process.exit(1);
  }

  // Step 2: Select browser
  const { browser, browserName } = await selectBrowser();
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    // 设置中文语言环境
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai'
  });
  
  const page = await context.newPage();

  try {
    // Navigate to EdgeOne
    console.log(`\n🌐 在 ${browserName} 中打开 EdgeOne 控制台...`);
    await page.goto(EDGEONE_CONSOLE_URL, { waitUntil: 'networkidle' });
    
    // 检测登录状态
    const needsLogin = page.url().includes('login');
    
    if (needsLogin) {
      console.log('\n🔐 需要登录腾讯云账号');
      console.log('提示：');
      console.log(`- ${browserName} 可能已保存您的登录信息`);
      console.log('- 支持微信扫码、邮箱、QQ等多种登录方式');
      console.log('- 登录完成后会自动继续\n');
      
      // 等待登录完成
      await page.waitForURL(/console\.cloud\.tencent\.com(?!.*login)/, { 
        timeout: 600000 // 10分钟超时
      });
      
      console.log('✅ 登录成功！');
    }
    
    // 确保在 EdgeOne 页面
    if (!page.url().includes('/edgeone')) {
      await page.goto(EDGEONE_CONSOLE_URL, { waitUntil: 'networkidle' });
    }
    
    console.log('\n📋 EdgeOne 控制台已加载');
    console.log('\n接下来的步骤：');
    console.log('1. 创建新站点或选择现有站点');
    console.log('2. 进入文件管理/源站管理');
    console.log('3. 上传 dist 目录中的所有文件');
    console.log('4. 配置域名和 HTTPS');
    
    console.log('\n📁 需要上传的文件位于：');
    console.log(`   ${path.join(process.cwd(), 'dist')}`);
    
    // 列出需要上传的文件
    const distPath = path.join(process.cwd(), 'dist');
    const files = getAllFiles(distPath);
    console.log(`\n📦 共 ${files.length} 个文件需要上传：`);
    files.slice(0, 5).forEach(file => {
      console.log(`   - ${path.relative(distPath, file)}`);
    });
    if (files.length > 5) {
      console.log(`   ... 还有 ${files.length - 5} 个文件`);
    }
    
    // 提供自动化选项
    console.log('\n🤖 是否尝试自动化部署？');
    const automate = await question('输入 y 继续自动化，n 手动操作 (y/n): ');
    
    if (automate.toLowerCase() === 'y') {
      console.log('\n🚀 开始自动化部署...');
      // 这里可以添加自动化部署逻辑
      console.log('⚠️  自动化功能开发中，请手动完成部署');
    }
    
    console.log('\n💡 提示：');
    console.log('- 部署完成后，您的网站将通过 EdgeOne CDN 全球加速');
    console.log('- 建议配置自定义域名以获得更好的访问体验');
    console.log('- 可以在 EdgeOne 控制台查看访问统计和性能数据');
    
    console.log('\n⏳ 保持浏览器开启，完成部署后按 Ctrl+C 退出...');
    
    // 保持浏览器开启
    await new Promise(() => {});
    
  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    await page.screenshot({ path: `edgeone-error-${Date.now()}.png` });
    console.log('📸 错误截图已保存');
  } finally {
    rl.close();
  }
}

// Helper function
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

// 检查可用的浏览器
async function checkAvailableBrowsers() {
  console.log('🔍 检查可用的浏览器...\n');
  
  const browsers = [
    { name: 'Microsoft Edge', channel: 'msedge', type: 'chromium' },
    { name: 'Google Chrome', channel: 'chrome', type: 'chromium' },
    { name: 'Chromium', channel: undefined, type: 'chromium' },
    { name: 'Firefox', channel: undefined, type: 'firefox' },
    { name: 'Safari (WebKit)', channel: undefined, type: 'webkit' }
  ];
  
  for (const browser of browsers) {
    try {
      let testBrowser;
      switch (browser.type) {
        case 'chromium':
          testBrowser = await chromium.launch({ 
            headless: true, 
            channel: browser.channel,
            timeout: 5000 
          });
          break;
        case 'firefox':
          testBrowser = await firefox.launch({ headless: true, timeout: 5000 });
          break;
        case 'webkit':
          testBrowser = await webkit.launch({ headless: true, timeout: 5000 });
          break;
      }
      
      await testBrowser.close();
      console.log(`✅ ${browser.name} - 可用`);
    } catch (error) {
      console.log(`❌ ${browser.name} - 不可用`);
    }
  }
  
  console.log('');
}

// Main execution
(async () => {
  try {
    await checkAvailableBrowsers();
    await deployToEdgeOne();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
})();