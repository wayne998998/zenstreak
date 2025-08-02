import { chromium } from 'playwright';
import { execSync, spawn } from 'child_process';
import os from 'os';
import path from 'path';

const EDGEONE_CONSOLE_URL = 'https://console.cloud.tencent.com/edgeone';

async function connectToExistingEdge() {
  console.log('🚀 连接到现有 Edge 浏览器进行部署\n');
  
  // 构建项目
  console.log('📦 构建项目...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ 构建完成！\n');
  
  // 启动 Edge 并启用远程调试
  console.log('🌐 启动 Edge 浏览器（远程调试模式）...');
  
  const debugPort = 9222;
  const edgePath = getEdgePath();
  
  // 启动 Edge 的命令
  const edgeArgs = [
    `--remote-debugging-port=${debugPort}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--start-maximized',
    EDGEONE_CONSOLE_URL
  ];
  
  console.log(`📍 Edge 路径: ${edgePath}`);
  console.log('⚠️  这会打开一个新的 Edge 窗口（使用您的默认配置文件）\n');
  
  // 启动 Edge 进程
  const edgeProcess = spawn(edgePath, edgeArgs, {
    detached: true,
    stdio: 'ignore'
  });
  
  // 等待浏览器启动
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    // 连接到运行中的浏览器
    console.log('🔌 连接到 Edge 浏览器...');
    const browser = await chromium.connectOverCDP(`http://localhost:${debugPort}`);
    
    console.log('✅ 已连接到 Edge！');
    console.log('🎯 这是您平时使用的 Edge：');
    console.log('   • 所有密码和登录状态可用');
    console.log('   • 所有扩展和设置正常');
    console.log('   • 就像手动打开 Edge 一样\n');
    
    // 获取当前页面
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    const page = pages.find(p => p.url().includes('tencent.com')) || pages[0];
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    const isLoginPage = page.url().includes('login');
    if (!isLoginPage) {
      console.log('✅ 您已登录！可以直接开始部署');
    } else {
      console.log('🔐 请登录您的腾讯云账户');
      console.log('💡 提示：Edge 应该记住了您的密码');
    }
    
    console.log('\n📋 接下来请在浏览器中：');
    console.log('1. 完成登录（如需要）');
    console.log('2. 创建或选择站点');
    console.log('3. 上传 dist 目录文件');
    console.log('4. 配置域名设置\n');
    
    console.log('⏳ 部署完成后按 Ctrl+C 退出...\n');
    
    // 监听页面关闭
    page.on('close', () => {
      console.log('📄 页面已关闭');
      process.exit(0);
    });
    
    browser.on('disconnected', () => {
      console.log('🔌 浏览器连接断开');
      process.exit(0);
    });
    
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ 连接失败:', error.message);
    console.log('\n💡 Edge 浏览器已打开，您可以手动完成部署');
  }
}

// 获取 Edge 可执行文件路径
function getEdgePath() {
  const platform = os.platform();
  
  switch (platform) {
    case 'win32':
      return 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    case 'darwin':
      return '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';
    case 'linux':
      return '/usr/bin/microsoft-edge';
    default:
      return 'msedge';
  }
}

// 运行
connectToExistingEdge().catch(console.error);