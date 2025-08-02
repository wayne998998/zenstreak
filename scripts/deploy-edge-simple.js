import { chromium } from 'playwright';

async function openEdgeOneWithEdge() {
  console.log('🌐 启动 Microsoft Edge 浏览器...');
  
  // 使用 Edge 浏览器
  const browser = await chromium.launch({ 
    channel: 'msedge',  // 关键：指定使用 Edge
    headless: false,    // 显示浏览器界面
    args: ['--start-maximized'] // 最大化窗口
  });
  
  const context = await browser.newContext({
    viewport: null // 使用最大化窗口
  });
  
  const page = await context.newPage();
  
  console.log('📍 导航到 EdgeOne 控制台...');
  await page.goto('https://console.cloud.tencent.com/edgeone');
  
  console.log('✅ Edge 浏览器已打开 EdgeOne 控制台');
  console.log('💡 提示：');
  console.log('   - Edge 可能已保存您的登录信息');
  console.log('   - 完成操作后按 Ctrl+C 退出');
  
  // 保持浏览器开启
  await new Promise(() => {});
}

// 运行
openEdgeOneWithEdge().catch(console.error);