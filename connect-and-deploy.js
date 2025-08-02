import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const PROJECT_NAME = 'zenstreak';
const DOMAIN = `${PROJECT_NAME}.edgeone.site`;

async function connectAndDeploy() {
  console.log('🔌 连接到已打开的 Edge 浏览器...\n');
  
  try {
    // 尝试连接到已运行的浏览器
    // Edge 需要以调试模式启动：msedge --remote-debugging-port=9222
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    console.log('✅ 成功连接到 Edge 浏览器！\n');
    
    // 获取当前页面
    const contexts = browser.contexts();
    const pages = contexts[0].pages();
    const page = pages.find(p => p.url().includes('edgeone')) || pages[0];
    
    console.log('📍 当前页面:', page.url());
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 获取要上传的文件
    const distPath = path.join(process.cwd(), 'dist');
    const files = getAllFiles(distPath);
    console.log(`\n📦 准备上传 ${files.length} 个文件`);
    
    // 查找并点击创建站点按钮
    console.log('\n🔍 查找站点创建按钮...');
    
    const createButtonSelectors = [
      'button:has-text("接入站点")',
      'button:has-text("创建站点")',
      'button:has-text("新建站点")',
      'button:has-text("添加站点")',
      'a:has-text("创建站点")',
      '.button:has-text("创建")'
    ];
    
    let createButtonClicked = false;
    for (const selector of createButtonSelectors) {
      try {
        const button = page.locator(selector).first();
        if (await button.isVisible({ timeout: 2000 })) {
          await button.click();
          console.log('✅ 点击了创建站点按钮');
          createButtonClicked = true;
          break;
        }
      } catch (e) {
        // 继续尝试下一个选择器
      }
    }
    
    if (!createButtonClicked) {
      // 可能已经在站点内部
      console.log('⚠️  未找到创建按钮，可能已在站点页面');
      
      // 查找文件管理入口
      const fileManagementSelectors = [
        'text=/文件管理/',
        'text=/源站管理/',
        'text=/文件/',
        'a[href*="file"]',
        'button:has-text("文件")'
      ];
      
      for (const selector of fileManagementSelectors) {
        try {
          const link = page.locator(selector).first();
          if (await link.isVisible({ timeout: 2000 })) {
            await link.click();
            console.log('✅ 进入文件管理');
            break;
          }
        } catch (e) {
          // 继续
        }
      }
    } else {
      // 等待表单加载
      await page.waitForTimeout(2000);
      
      // 填写站点信息
      console.log('\n📝 填写站点信息...');
      
      // 站点名称
      try {
        await page.fill('input[placeholder*="站点名称"]', PROJECT_NAME);
        console.log(`✅ 站点名称: ${PROJECT_NAME}`);
      } catch (e) {
        console.log('⚠️  无法自动填写站点名称');
      }
      
      // 域名
      try {
        await page.fill('input[placeholder*="域名"]', DOMAIN);
        console.log(`✅ 域名: ${DOMAIN}`);
      } catch (e) {
        console.log('⚠️  无法自动填写域名');
      }
      
      // 选择静态托管
      try {
        await page.click('text=/静态/');
        console.log('✅ 选择静态托管');
      } catch (e) {
        console.log('⚠️  请手动选择静态托管类型');
      }
      
      // 提交
      const submitSelectors = [
        'button:has-text("确定")',
        'button:has-text("创建")',
        'button:has-text("下一步")',
        'button[type="submit"]'
      ];
      
      for (const selector of submitSelectors) {
        try {
          const button = page.locator(selector).first();
          if (await button.isVisible({ timeout: 1000 })) {
            await button.click();
            console.log('✅ 提交创建请求');
            break;
          }
        } catch (e) {
          // 继续
        }
      }
      
      // 等待创建完成
      await page.waitForTimeout(5000);
    }
    
    // 查找上传按钮
    console.log('\n🔍 查找文件上传功能...');
    
    // 设置文件选择器监听
    page.once('filechooser', async (fileChooser) => {
      console.log('📁 检测到文件选择器！');
      console.log(`📤 正在上传 ${files.length} 个文件...`);
      await fileChooser.setFiles(files);
      console.log('✅ 文件已选择，等待上传...');
    });
    
    // 尝试触发文件上传
    const uploadSelectors = [
      'button:has-text("上传")',
      'button:has-text("上传文件")',
      'button:has-text("Upload")',
      'input[type="file"]',
      '.upload-button',
      '[class*="upload"]'
    ];
    
    let uploadTriggered = false;
    for (const selector of uploadSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 })) {
          if (selector.includes('input[type="file"]')) {
            // 直接设置文件
            await element.setInputFiles(files);
            console.log('✅ 直接设置了文件输入');
          } else {
            // 点击按钮
            await element.click();
            console.log('✅ 点击了上传按钮');
          }
          uploadTriggered = true;
          break;
        }
      } catch (e) {
        // 继续
      }
    }
    
    if (!uploadTriggered) {
      console.log('\n⚠️  无法自动触发上传，请手动操作：');
      console.log('1. 点击"上传文件"按钮');
      console.log('2. 选择以下目录中的所有文件：');
      console.log(`   ${distPath}`);
    } else {
      console.log('\n⏳ 等待文件上传完成...');
      await page.waitForTimeout(10000);
    }
    
    // 显示上传的文件列表
    console.log('\n📋 需要上传的文件：');
    files.forEach(file => {
      console.log(`   - ${path.relative(distPath, file)}`);
    });
    
    console.log('\n✅ 自动化步骤已完成！');
    console.log('\n请检查浏览器中的上传状态，如需手动操作：');
    console.log('1. 确保所有文件都已上传');
    console.log('2. 启用 HTTPS（通常默认启用）');
    console.log('3. 保存设置');
    
    console.log('\n🌐 部署完成后，您的网站将可访问：');
    console.log(`   https://${DOMAIN}`);
    
    // 保持连接
    console.log('\n按 Ctrl+C 断开连接...');
    await new Promise(() => {});
    
  } catch (error) {
    if (error.message.includes('connect ECONNREFUSED')) {
      console.error('❌ 无法连接到 Edge 浏览器');
      console.log('\n请使用以下命令重新启动 Edge：');
      console.log('Windows:');
      console.log('  关闭所有 Edge 窗口，然后运行：');
      console.log('  msedge --remote-debugging-port=9222');
      console.log('\nmacOS:');
      console.log('  关闭所有 Edge 窗口，然后运行：');
      console.log('  /Applications/Microsoft\\ Edge.app/Contents/MacOS/Microsoft\\ Edge --remote-debugging-port=9222');
      console.log('\n然后重新运行此脚本。');
    } else {
      console.error('❌ 错误:', error.message);
    }
  }
}

// 获取所有文件
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

// 运行
connectAndDeploy().catch(console.error);