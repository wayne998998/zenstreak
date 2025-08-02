import { execSync, exec } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const EDGEONE_CONSOLE_URL = 'https://console.cloud.tencent.com/edgeone';

function deployWithSystemEdge() {
  console.log('🚀 使用系统 Edge 浏览器进行部署\n');
  
  // 构建项目
  console.log('📦 构建项目...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ 构建完成！\n');
  
  // 获取 dist 目录信息
  const distPath = path.join(process.cwd(), 'dist');
  const files = fs.readdirSync(distPath);
  
  console.log('📁 需要上传的文件位于:');
  console.log(`   ${distPath}`);
  console.log(`   共 ${files.length} 个文件\n`);
  
  // 根据操作系统打开 Edge
  console.log('🌐 正在打开 Edge 浏览器...');
  console.log('✅ 这是您平时使用的 Edge（正常模式）：');
  console.log('   • 所有保存的密码可用');
  console.log('   • 保留所有登录状态');
  console.log('   • 所有扩展正常工作\n');
  
  const platform = os.platform();
  let command;
  
  switch (platform) {
    case 'win32':
      // Windows
      command = `start msedge "${EDGEONE_CONSOLE_URL}"`;
      break;
    case 'darwin':
      // macOS
      command = `open -a "Microsoft Edge" "${EDGEONE_CONSOLE_URL}"`;
      break;
    case 'linux':
      // Linux
      command = `microsoft-edge "${EDGEONE_CONSOLE_URL}"`;
      break;
    default:
      console.error('❌ 不支持的操作系统');
      return;
  }
  
  // 执行命令打开 Edge
  exec(command, (error) => {
    if (error) {
      console.error('❌ 打开 Edge 失败:', error.message);
      console.log('\n💡 请手动打开 Edge 并访问:');
      console.log(`   ${EDGEONE_CONSOLE_URL}`);
    } else {
      console.log('✅ Edge 已打开！\n');
      
      console.log('📋 部署步骤：');
      console.log('1. 登录腾讯云（如果需要）');
      console.log('   - Edge 应该记住了您的密码');
      console.log('2. 创建新站点');
      console.log('   - 点击"创建站点"或"接入站点"');
      console.log('   - 选择"静态内容加速"');
      console.log('3. 上传文件');
      console.log('   - 进入文件管理');
      console.log(`   - 上传 ${distPath} 中的所有文件`);
      console.log('4. 配置设置');
      console.log('   - 启用 HTTPS');
      console.log('   - 配置自定义域名\n');
      
      console.log('💡 提示：');
      console.log('• 这就是您平时使用的 Edge，所有功能都可用');
      console.log('• 部署完成后，您的登录状态会保留');
      console.log('• 下次部署可能无需重新登录\n');
      
      console.log('📌 文件位置提醒：');
      console.log(`   ${distPath}`);
      console.log('   请上传此目录中的所有文件\n');
      
      // 列出主要文件
      console.log('📦 主要文件：');
      const mainFiles = ['index.html', 'manifest.json', 'sw.js'];
      mainFiles.forEach(file => {
        if (files.includes(file)) {
          console.log(`   ✓ ${file}`);
        }
      });
      
      // 检查 assets 目录
      const assetsPath = path.join(distPath, 'assets');
      if (fs.existsSync(assetsPath)) {
        const assetFiles = fs.readdirSync(assetsPath);
        console.log(`   ✓ assets/ (${assetFiles.length} 个文件)`);
      }
      
      console.log('\n✨ 祝部署顺利！');
    }
  });
}

// 直接执行
console.clear();
deployWithSystemEdge();