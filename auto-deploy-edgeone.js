import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const EDGEONE_CONSOLE_URL = 'https://console.cloud.tencent.com/edgeone';
const PROJECT_NAME = 'zenstreak';
const DOMAIN = `${PROJECT_NAME}.edgeone.site`;

// 创建命令行接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function autoDeployToEdgeOne() {
  console.log('🚀 ZenStreak 自动部署到 EdgeOne\n');
  
  // Step 1: 构建项目
  console.log('📦 Step 1: 构建项目...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ 构建完成！\n');
  } catch (error) {
    console.error('❌ 构建失败:', error.message);
    process.exit(1);
  }

  // 获取要上传的文件
  const distPath = path.join(process.cwd(), 'dist');
  const files = getAllFiles(distPath);
  console.log(`📁 准备上传 ${files.length} 个文件\n`);

  // Step 2: 启动浏览器
  console.log('🌐 Step 2: 启动浏览器...');
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'msedge', // 使用 Edge
    args: ['--start-maximized']
  });
  
  const context = await browser.newContext({
    viewport: null,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai'
  });
  
  const page = await context.newPage();

  try {
    // Step 3: 导航到 EdgeOne
    console.log('📍 Step 3: 导航到 EdgeOne 控制台...');
    await page.goto(EDGEONE_CONSOLE_URL, { waitUntil: 'networkidle' });
    
    // Step 4: 处理登录
    console.log('\n🔐 Step 4: 检查登录状态...');
    const needsLogin = page.url().includes('login');
    
    if (needsLogin) {
      console.log('需要登录，请在浏览器中完成登录');
      console.log('登录完成后，按 Enter 继续...');
      await question('');
      
      // 等待登录完成
      if (page.url().includes('login')) {
        await page.waitForURL(/console\.cloud\.tencent\.com(?!.*login)/, { 
          timeout: 300000 
        });
      }
      console.log('✅ 登录成功！\n');
    } else {
      console.log('✅ 已登录！\n');
    }

    // 确保在 EdgeOne 页面
    if (!page.url().includes('/edgeone')) {
      await page.goto(EDGEONE_CONSOLE_URL, { waitUntil: 'networkidle' });
    }

    // Step 5: 检查是否有现有站点
    console.log('📋 Step 5: 检查现有站点...');
    await page.waitForTimeout(3000);
    
    // 尝试自动创建站点
    try {
      // 查找创建站点按钮
      const createButtons = [
        page.locator('button:has-text("接入站点")'),
        page.locator('button:has-text("创建站点")'),
        page.locator('button:has-text("新建站点")'),
        page.locator('a:has-text("创建站点")')
      ];
      
      let createButtonFound = false;
      for (const button of createButtons) {
        if (await button.isVisible({ timeout: 5000 })) {
          console.log('🆕 创建新站点...');
          await button.click();
          createButtonFound = true;
          break;
        }
      }
      
      if (createButtonFound) {
        // 等待创建站点表单
        await page.waitForTimeout(2000);
        
        // Step 6: 填写站点信息
        console.log('\n📝 Step 6: 配置站点信息...');
        
        // 尝试自动填写表单
        try {
          // 输入站点名称
          const nameInputs = await page.locator('input[placeholder*="站点名称"], input[placeholder*="名称"]').all();
          if (nameInputs.length > 0) {
            await nameInputs[0].fill(PROJECT_NAME);
            console.log(`✅ 站点名称: ${PROJECT_NAME}`);
          }
          
          // 输入域名
          const domainInputs = await page.locator('input[placeholder*="域名"]').all();
          if (domainInputs.length > 0) {
            await domainInputs[0].fill(DOMAIN);
            console.log(`✅ 域名: ${DOMAIN}`);
          }
          
          // 选择站点类型（静态托管）
          const staticOptions = await page.locator('text=/静态|Static/').all();
          if (staticOptions.length > 0) {
            await staticOptions[0].click();
            console.log('✅ 类型: 静态网站托管');
          }
          
          // 提交表单
          const submitButtons = [
            page.locator('button:has-text("确定")'),
            page.locator('button:has-text("创建")'),
            page.locator('button:has-text("下一步")')
          ];
          
          for (const button of submitButtons) {
            if (await button.isVisible()) {
              await button.click();
              console.log('✅ 提交站点创建请求');
              break;
            }
          }
          
          // 等待站点创建
          await page.waitForTimeout(5000);
          
        } catch (error) {
          console.log('⚠️  自动填写表单失败，请手动完成');
          console.log('请在浏览器中：');
          console.log(`  1. 输入站点名称: ${PROJECT_NAME}`);
          console.log(`  2. 输入域名: ${DOMAIN}`);
          console.log('  3. 选择"静态网站托管"类型');
          console.log('  4. 点击创建');
          console.log('\n完成后按 Enter 继续...');
          await question('');
        }
      }
      
    } catch (error) {
      console.log('⚠️  无法自动创建站点');
    }

    // Step 7: 文件上传
    console.log('\n📤 Step 7: 准备上传文件...');
    console.log('请在浏览器中：');
    console.log('  1. 进入站点管理页面');
    console.log('  2. 找到"文件管理"或"源站管理"');
    console.log('  3. 点击"上传文件"按钮');
    console.log('\n准备好后按 Enter 继续...');
    await question('');
    
    // 尝试自动处理文件上传
    try {
      // 设置文件选择器监听
      page.on('filechooser', async (fileChooser) => {
        console.log('📁 检测到文件选择器，正在上传文件...');
        await fileChooser.setFiles(files);
        console.log(`✅ 已选择 ${files.length} 个文件`);
      });
      
      console.log('⏳ 等待文件上传完成...');
      console.log('如果看到文件选择对话框，请选择以下目录中的所有文件：');
      console.log(`   ${distPath}`);
      
      // 等待上传完成
      await page.waitForTimeout(10000);
      
    } catch (error) {
      console.log('⚠️  自动上传失败，请手动上传文件');
    }

    // Step 8: 配置设置
    console.log('\n⚙️  Step 8: 最后配置...');
    console.log('请在浏览器中完成以下设置：');
    console.log('  1. 启用 HTTPS');
    console.log('  2. 配置缓存规则（可选）');
    console.log('  3. 设置自定义域名（可选）');
    console.log('\n完成所有配置后按 Enter 继续...');
    await question('');

    // Step 9: 获取访问地址
    console.log('\n🎉 Step 9: 部署完成！');
    console.log('\n您的网站应该可以通过以下地址访问：');
    console.log(`  🌐 https://${DOMAIN}`);
    console.log('\n如果配置了自定义域名，也可以通过自定义域名访问');
    
    // 保存部署信息
    const deployInfo = {
      projectName: PROJECT_NAME,
      domain: DOMAIN,
      deployTime: new Date().toISOString(),
      filesCount: files.length
    };
    
    fs.writeFileSync('edgeone-deploy-info.json', JSON.stringify(deployInfo, null, 2));
    console.log('\n📄 部署信息已保存到 edgeone-deploy-info.json');

    console.log('\n✨ 部署流程完成！');
    console.log('按 Ctrl+C 退出...');
    
    await new Promise(() => {});
    
  } catch (error) {
    console.error('\n❌ 部署错误:', error.message);
    await page.screenshot({ path: 'deploy-error.png' });
    console.log('📸 错误截图已保存');
  } finally {
    rl.close();
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

// 运行自动部署
autoDeployToEdgeOne().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});