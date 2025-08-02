import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const PROJECT_NAME = 'zenstreak';
const DOMAIN = `${PROJECT_NAME}.edgeone.site`;
const EDGEONE_URL = 'https://console.cloud.tencent.com/edgeone';

async function autoDeployNow() {
  console.log('🚀 自动部署 ZenStreak 到 EdgeOne\n');
  
  // 获取要上传的文件
  const distPath = path.join(process.cwd(), 'dist');
  const files = getAllFiles(distPath);
  console.log(`📦 准备上传 ${files.length} 个文件：`);
  files.forEach(file => {
    console.log(`   - ${path.relative(distPath, file)}`);
  });
  
  console.log('\n🌐 启动 Edge 浏览器...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: false,
    args: ['--start-maximized']
  });
  
  const context = await browser.newContext({
    viewport: null,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📍 导航到 EdgeOne...');
    await page.goto(EDGEONE_URL);
    
    // 检查是否需要登录
    await page.waitForLoadState('networkidle');
    
    if (page.url().includes('login')) {
      console.log('\n🔐 请在浏览器中登录');
      console.log('✅ 登录完成后会自动继续\n');
      
      // 等待登录完成（URL不再包含login）
      await page.waitForURL(/^((?!login).)*$/, { timeout: 600000 });
      console.log('✅ 登录成功！\n');
    }
    
    // 确保在EdgeOne页面
    if (!page.url().includes('/edgeone')) {
      await page.goto(EDGEONE_URL);
      await page.waitForLoadState('networkidle');
    }
    
    console.log('🔍 查找操作按钮...\n');
    
    // 等待页面稳定
    await page.waitForTimeout(3000);
    
    // 自动处理文件上传
    console.log('📤 设置文件上传监听器...');
    
    // 监听文件选择器
    page.on('filechooser', async (fileChooser) => {
      console.log('✅ 检测到文件选择器！');
      console.log(`📁 选择 ${files.length} 个文件...`);
      await fileChooser.setFiles(files);
      console.log('✅ 文件已选择！');
    });
    
    // 查找创建站点或文件管理
    const actions = [
      { selector: 'button:has-text("接入站点")', action: '创建新站点' },
      { selector: 'button:has-text("创建站点")', action: '创建新站点' },
      { selector: 'button:has-text("新建站点")', action: '创建新站点' },
      { selector: 'text=/文件管理/', action: '进入文件管理' },
      { selector: 'text=/源站管理/', action: '进入源站管理' },
      { selector: `text="${PROJECT_NAME}"`, action: '进入现有站点' }
    ];
    
    let actionTaken = false;
    
    for (const { selector, action } of actions) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 3000 })) {
          console.log(`🎯 ${action}`);
          await element.click();
          actionTaken = true;
          
          if (action.includes('创建')) {
            // 等待表单
            await page.waitForTimeout(2000);
            
            console.log('\n📝 自动填写站点信息...');
            
            // 填写站点名称
            try {
              const nameInput = page.locator('input[placeholder*="站点名称"], input[placeholder*="名称"]').first();
              await nameInput.fill(PROJECT_NAME);
              console.log(`✅ 站点名称: ${PROJECT_NAME}`);
            } catch (e) {
              console.log('⚠️  请手动输入站点名称');
            }
            
            // 填写域名
            try {
              const domainInput = page.locator('input[placeholder*="域名"]').first();
              await domainInput.fill(DOMAIN);
              console.log(`✅ 域名: ${DOMAIN}`);
            } catch (e) {
              console.log('⚠️  请手动输入域名');
            }
            
            // 选择静态托管
            try {
              await page.click('text=/静态/');
              console.log('✅ 类型: 静态托管');
            } catch (e) {
              // 忽略
            }
            
            console.log('\n💡 请完成以下操作：');
            console.log('1. 确认站点信息');
            console.log('2. 点击"创建"或"确定"');
            console.log('3. 等待站点创建完成');
            console.log('4. 进入"文件管理"');
            console.log('5. 点击"上传文件"');
            console.log('\n✨ 文件选择器会自动处理！');
          }
          
          break;
        }
      } catch (e) {
        // 继续尝试
      }
    }
    
    if (!actionTaken) {
      console.log('⚠️  请手动操作：');
      console.log('1. 如果需要创建站点，点击"创建站点"');
      console.log('2. 如果站点已存在，进入站点并找到"文件管理"');
      console.log('3. 点击"上传文件"按钮');
      console.log('\n✨ 当文件选择器出现时，会自动选择所有文件！');
    }
    
    // 尝试自动点击上传按钮
    console.log('\n🔍 查找上传按钮...');
    
    const uploadSelectors = [
      'button:has-text("上传文件")',
      'button:has-text("上传")',
      'button:has-text("Upload")',
      '[class*="upload"]',
      'input[type="file"]'
    ];
    
    // 定期尝试点击上传按钮
    const tryUpload = async () => {
      for (const selector of uploadSelectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            if (selector.includes('input[type="file"]')) {
              await element.setInputFiles(files);
              console.log('✅ 直接设置了文件！');
            } else {
              await element.click();
              console.log('✅ 点击了上传按钮！');
            }
            return true;
          }
        } catch (e) {
          // 继续
        }
      }
      return false;
    };
    
    // 尝试多次查找上传按钮
    let uploadFound = false;
    for (let i = 0; i < 10; i++) {
      if (await tryUpload()) {
        uploadFound = true;
        break;
      }
      await page.waitForTimeout(3000);
    }
    
    console.log('\n📋 部署信息：');
    console.log(`站点名称: ${PROJECT_NAME}`);
    console.log(`域名: ${DOMAIN}`);
    console.log(`文件数量: ${files.length}`);
    console.log(`文件位置: ${distPath}`);
    
    console.log('\n⏳ 等待操作完成...');
    console.log('完成所有操作后，您的网站将可以访问：');
    console.log(`🌐 https://${DOMAIN}`);
    
    console.log('\n💡 提示：');
    console.log('- 文件上传可能需要几分钟');
    console.log('- 上传完成后等待 CDN 同步');
    console.log('- 确保 index.html 在根目录');
    
    console.log('\n按 Ctrl+C 退出...');
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    await page.screenshot({ path: 'deploy-error.png' });
  }
}

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
autoDeployNow().catch(console.error);