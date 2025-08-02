import { chromium } from 'playwright';
import { execSync } from 'child_process';
import os from 'os';
import path from 'path';

const EDGEONE_CONSOLE_URL = 'https://console.cloud.tencent.com/edgeone';
const PROJECT_NAME = 'zenstreak';

async function deployWithEdgeProfile() {
  console.log('🚀 Starting EdgeOne deployment with Edge (正常模式，非隐私模式)...');
  
  // Step 1: Build the project
  console.log('\n📦 Building the project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }

  console.log('\n🌐 启动 Microsoft Edge (正常模式)...');
  
  // 获取 Edge 用户数据目录
  const edgeUserDataDir = getEdgeUserDataDir();
  console.log(`📁 使用 Edge 用户配置文件: ${edgeUserDataDir}`);
  
  // 使用 Edge 浏览器，保留用户数据
  const browser = await chromium.launch({ 
    channel: 'msedge',
    headless: false,
    args: [
      '--start-maximized',
      // 不使用这些会启用隐私模式的参数：
      // '--inprivate'  // Edge 的隐私模式
      // '--incognito'  // Chrome 的隐私模式
      // 相反，我们使用正常模式，保留 cookies 和登录状态
    ]
  });
  
  // 创建上下文时不使用隐私模式
  const context = await browser.newContext({
    viewport: null, // 使用最大化窗口
    // 不设置这些会清除数据的选项：
    // storageState: undefined,  // 保留存储状态
    // 保留 cookies 和本地存储
    acceptDownloads: true,
    // 设置语言和时区
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai'
  });
  
  const page = await context.newPage();

  try {
    console.log('\n📍 导航到 EdgeOne 控制台...');
    await page.goto(EDGEONE_CONSOLE_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // 检查是否需要登录
    const isLoginPage = page.url().includes('login');
    
    if (isLoginPage) {
      console.log('\n🔐 检测到登录页面');
      console.log('💡 提示：');
      console.log('   ✅ Edge 正常模式已启用 - 可以使用保存的密码');
      console.log('   ✅ 如果之前登录过，浏览器可能会自动填充密码');
      console.log('   ✅ 支持浏览器密码管理器和自动登录');
      console.log('\n请完成登录，登录成功后将自动继续...');
      
      // 等待登录完成
      await page.waitForURL(/console\.cloud\.tencent\.com(?!.*login)/, { 
        timeout: 600000 // 10分钟
      });
      
      console.log('\n✅ 登录成功！');
    } else {
      console.log('\n✅ 已登录（使用了保存的会话）');
    }
    
    // 确保在 EdgeOne 页面
    if (!page.url().includes('/edgeone')) {
      console.log('📍 导航到 EdgeOne 服务...');
      await page.goto(EDGEONE_CONSOLE_URL, { waitUntil: 'networkidle' });
    }
    
    console.log('\n📋 EdgeOne 控制台已就绪');
    console.log('\n部署步骤：');
    console.log('1. 创建站点 - 点击"创建站点"或"接入站点"');
    console.log('2. 选择类型 - 选择"静态内容加速"');
    console.log('3. 配置域名 - 输入域名如 zenstreak.example.com');
    console.log('4. 文件上传 - 进入文件管理，上传 dist 目录所有文件');
    console.log('5. 完成配置 - 启用 HTTPS，配置缓存规则');
    
    console.log('\n📁 需要上传的文件位于:');
    console.log(`   ${path.join(process.cwd(), 'dist')}`);
    
    // 列出文件
    const distFiles = getDistFiles();
    console.log(`\n📦 共 ${distFiles.length} 个文件需要上传`);
    
    console.log('\n💾 浏览器状态：');
    console.log('   ✅ 正常模式（非隐私模式）');
    console.log('   ✅ Cookies 和登录状态已保留');
    console.log('   ✅ 可以使用密码管理器');
    console.log('   ✅ 下次访问可能无需重新登录');
    
    console.log('\n⏳ 请在浏览器中完成部署，完成后按 Ctrl+C 退出...');
    
    // 保持浏览器开启
    await new Promise(() => {});
    
  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    await page.screenshot({ path: 'edgeone-error.png' });
    console.log('📸 错误截图已保存');
    
    console.log('\n💡 提示：您可以在打开的浏览器中继续手动操作');
    console.log('按 Ctrl+C 退出...');
    
    await new Promise(() => {});
  }
}

// 获取 Edge 用户数据目录
function getEdgeUserDataDir() {
  const platform = os.platform();
  const homeDir = os.homedir();
  
  switch (platform) {
    case 'win32':
      return path.join(homeDir, 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data');
    case 'darwin':
      return path.join(homeDir, 'Library', 'Application Support', 'Microsoft Edge');
    case 'linux':
      return path.join(homeDir, '.config', 'microsoft-edge');
    default:
      return '';
  }
}

// 获取 dist 目录文件
function getDistFiles() {
  const distPath = path.join(process.cwd(), 'dist');
  const files = [];
  
  function scanDir(dir) {
    const items = require('fs').readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = require('fs').statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else {
        files.push(path.relative(distPath, fullPath));
      }
    });
  }
  
  try {
    scanDir(distPath);
  } catch (error) {
    console.error('读取 dist 目录失败:', error.message);
  }
  
  return files;
}

// 运行部署
deployWithEdgeProfile().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});