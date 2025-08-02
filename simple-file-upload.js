import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function simpleFileUpload() {
  console.log('🚀 EdgeOne 文件上传助手\n');
  
  // 获取文件列表
  const distPath = path.join(process.cwd(), 'dist');
  const files = [];
  
  function scanFiles(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        scanFiles(fullPath);
      } else {
        files.push(fullPath);
      }
    });
  }
  
  scanFiles(distPath);
  
  console.log(`📦 找到 ${files.length} 个文件需要上传：`);
  files.forEach(file => {
    console.log(`   ✓ ${path.relative(distPath, file)}`);
  });
  
  console.log('\n🌐 启动浏览器...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: false,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  // 设置文件选择器自动处理
  console.log('\n📤 配置自动文件选择...');
  
  page.on('filechooser', async (fileChooser) => {
    console.log('\n🎯 检测到文件选择器！');
    console.log(`📁 自动选择 ${files.length} 个文件...`);
    
    try {
      await fileChooser.setFiles(files);
      console.log('✅ 所有文件已选择！');
      
      console.log('\n📋 已选择的文件：');
      files.forEach(file => {
        const size = fs.statSync(file).size;
        console.log(`   ✓ ${path.basename(file)} (${(size/1024).toFixed(1)}KB)`);
      });
      
    } catch (error) {
      console.error('❌ 选择文件时出错:', error.message);
    }
  });
  
  console.log('\n📍 导航到 EdgeOne...');
  await page.goto('https://console.cloud.tencent.com/edgeone');
  
  console.log('\n💡 使用说明：');
  console.log('1. 如需登录，请先完成登录');
  console.log('2. 进入您的站点（或创建新站点）');
  console.log('3. 找到"文件管理"或"源站管理"');
  console.log('4. 点击"上传文件"按钮');
  console.log('\n✨ 文件选择器出现时会自动选择所有文件！');
  
  console.log('\n📁 文件位置：');
  console.log(`   ${distPath}`);
  
  console.log('\n⏳ 等待您的操作...');
  console.log('完成后按 Ctrl+C 退出');
  
  // 保持运行
  await new Promise(() => {});
}

// 运行
simpleFileUpload().catch(error => {
  console.error('错误:', error.message);
  process.exit(1);
});