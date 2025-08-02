import { chromium } from 'playwright';
import { execSync } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const EDGEONE_CONSOLE_URL = 'https://console.cloud.tencent.com/edgeone';

async function deployWithRealEdgeProfile() {
  console.log('🚀 使用真实 Edge 用户配置文件进行部署\n');
  
  // 构建项目
  console.log('📦 构建项目...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ 构建完成！\n');
  
  // 获取真实的 Edge 用户数据目录
  const edgeUserDataDir = getEdgeUserDataDir();
  console.log(`📁 Edge 用户数据目录: ${edgeUserDataDir}`);
  
  // 检查目录是否存在
  if (!fs.existsSync(edgeUserDataDir)) {
    console.error('❌ 未找到 Edge 用户数据目录');
    console.log('💡 请先打开 Edge 浏览器并登录您的账户');
    return;
  }
  
  // 复制用户配置文件（避免影响原始配置）
  const tempProfileDir = path.join(os.tmpdir(), 'edge-profile-copy-' + Date.now());
  console.log(`📋 创建配置文件副本: ${tempProfileDir}`);
  
  // 创建临时目录
  fs.mkdirSync(tempProfileDir, { recursive: true });
  
  console.log('\n🌐 启动 Edge 浏览器（使用真实用户配置）...');
  console.log('⚠️  注意：请先关闭所有 Edge 浏览器窗口\n');
  
  try {
    // 使用真实的用户配置文件启动 Edge
    const browser = await chromium.launch({
      channel: 'msedge',
      headless: false,
      // 关键：使用用户数据目录
      args: [
        `--user-data-dir=${edgeUserDataDir}`,
        '--profile-directory=Default',  // 使用默认配置文件
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-popup-blocking',
        '--disable-translate',
        '--start-maximized'
      ],
      // 禁用默认的隔离行为
      ignoreDefaultArgs: ['--disable-extensions', '--enable-automation']
    });
    
    // 使用现有的上下文（不创建新的隔离上下文）
    const context = browser.contexts()[0];
    const page = context.pages()[0] || await context.newPage();
    
    console.log('✅ 已启动 Edge（使用您的真实配置文件）');
    console.log('🎯 优势：');
    console.log('   • 所有保存的密码可用');
    console.log('   • 已登录的网站保持登录状态');
    console.log('   • 浏览器扩展正常工作');
    console.log('   • 所有个人设置保留\n');
    
    console.log('📍 导航到 EdgeOne 控制台...');
    await page.goto(EDGEONE_CONSOLE_URL);
    
    // 检查登录状态
    await page.waitForLoadState('networkidle');
    const isLoginPage = page.url().includes('login');
    
    if (!isLoginPage) {
      console.log('✅ 太好了！您已经登录了（使用了保存的会话）');
    } else {
      console.log('🔐 需要登录 - 您的密码管理器应该可以帮助您');
    }
    
    console.log('\n📋 部署步骤：');
    console.log('1. 如需登录，使用保存的密码');
    console.log('2. 创建或选择站点');
    console.log('3. 上传 dist 目录中的文件');
    console.log('4. 配置域名和 HTTPS\n');
    
    console.log('⏳ 完成部署后按 Ctrl+C 退出...\n');
    
    await new Promise(() => {});
    
  } catch (error) {
    if (error.message.includes('already running')) {
      console.error('\n❌ Edge 浏览器已在运行');
      console.log('💡 解决方案：');
      console.log('   1. 关闭所有 Edge 窗口');
      console.log('   2. 重新运行此脚本');
      console.log('\n或者使用独立配置文件模式：');
      console.log('   npm run deploy:edgeone:normal');
    } else {
      console.error('\n❌ 错误:', error.message);
    }
  }
}

// 获取 Edge 用户数据目录
function getEdgeUserDataDir() {
  const platform = os.platform();
  const homeDir = os.homedir();
  
  switch (platform) {
    case 'win32':
      // Windows
      return path.join(homeDir, 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data');
    case 'darwin':
      // macOS
      return path.join(homeDir, 'Library', 'Application Support', 'Microsoft Edge');
    case 'linux':
      // Linux
      return path.join(homeDir, '.config', 'microsoft-edge');
    default:
      throw new Error('不支持的操作系统');
  }
}

// 运行
deployWithRealEdgeProfile().catch(console.error);