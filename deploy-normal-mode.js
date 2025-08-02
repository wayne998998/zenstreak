import { chromium } from 'playwright';
import { execSync } from 'child_process';

async function deployInNormalMode() {
  console.log('🚀 启动 Edge 浏览器（正常模式）进行 EdgeOne 部署\n');
  
  // 构建项目
  console.log('📦 构建项目...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ 构建完成！\n');
  
  // 启动 Edge - 正常模式，不是隐私模式
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: false,
    // 重要：不添加任何隐私模式参数
    args: [
      '--start-maximized',
      // 不要添加这些参数：
      // '--inprivate'     ❌ Edge 隐私模式
      // '--incognito'     ❌ Chrome 隐私模式  
      // '--guest'         ❌ 访客模式
    ]
  });
  
  // 创建正常的浏览器上下文（不是隐私上下文）
  const context = browser.contexts()[0] || await browser.newContext({
    viewport: null,
    // 保留所有 cookies 和存储
    acceptDownloads: true,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    // 不设置这些会清空数据的选项：
    // userDataDir: undefined,  // 使用默认用户数据
    // storageState: undefined, // 保留存储状态
  });
  
  const page = await context.newPage();
  
  console.log('🌐 正在打开 EdgeOne 控制台...');
  console.log('✅ 正常浏览模式 - 可以使用：');
  console.log('   • 保存的密码');
  console.log('   • 已登录的会话');
  console.log('   • 浏览器扩展');
  console.log('   • 密码管理器\n');
  
  await page.goto('https://console.cloud.tencent.com/edgeone');
  
  console.log('📋 部署步骤：');
  console.log('1. 登录腾讯云（如需要）');
  console.log('2. 创建/选择站点');
  console.log('3. 上传 dist 目录文件');
  console.log('4. 配置域名和 HTTPS\n');
  
  console.log('💡 提示：正常模式下，您的登录信息会被保存');
  console.log('⏳ 完成后按 Ctrl+C 退出...\n');
  
  // 保持运行
  await new Promise(() => {});
}

deployInNormalMode().catch(console.error);