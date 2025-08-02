# ZenStreak EdgeOne 完整部署指南

## 项目已准备就绪

✅ **项目构建完成**
- 生产构建文件位于 `dist` 目录
- 包含所有静态资源、PWA 配置和 Service Worker

✅ **部署脚本已创建**
- `deploy-edgeone.js` - 基础自动化脚本
- `deploy-edgeone-improved.js` - 改进版脚本
- `deploy-edgeone-auto.js` - 支持自动登录的脚本
- `test-deployed-site.js` - 功能测试脚本

## EdgeOne 部署步骤

### 方法一：使用自动化脚本

```bash
# 运行自动化部署脚本
node deploy-edgeone-auto.js
```

选择登录方式：
- 选项 1：输入邮箱和密码自动登录
- 选项 2：手动在浏览器中登录

### 方法二：手动部署

1. **登录 EdgeOne 控制台**
   - 访问: https://console.cloud.tencent.com/edgeone
   - 使用微信扫码或邮箱登录

2. **创建新站点**
   - 点击"创建站点"或"接入站点"
   - 选择"静态内容加速"
   - 输入域名：`zenstreak.example.com`（或您的自定义域名）

3. **上传文件**
   - 进入"文件管理"或"源站管理"
   - 上传 `dist` 目录中的所有文件：
     - index.html
     - assets/ (CSS和JS文件)
     - manifest.json
     - sw.js
     - vite.svg

4. **配置设置**
   - 启用 HTTPS
   - 配置缓存规则
   - 设置自定义域名（如需要）

## 部署后测试

### 1. 本地测试（已完成）
```bash
# 本地预览测试
npm run preview
node test-deployed-site.js
```

测试结果：57.1% 通过率，核心功能正常

### 2. 线上测试
```bash
# 替换为您的 EdgeOne URL
SITE_URL=https://your-site.edgeone.site node test-deployed-site.js
```

### 3. 手动验证清单
- [ ] 主页正常加载
- [ ] PWA 可安装
- [ ] Service Worker 正常工作
- [ ] 冥想功能正常
- [ ] 数据本地存储正常
- [ ] 响应式设计正常
- [ ] HTTPS 已启用

## 常见问题

### Q: 登录时遇到问题？
A: 可以尝试：
- 使用微信扫码登录
- 清除浏览器缓存后重试
- 使用其他浏览器

### Q: 文件上传失败？
A: 检查：
- 文件大小限制
- 网络连接稳定性
- 分批上传大文件

### Q: 部署后访问404？
A: 确保：
- index.html 在根目录
- 路由配置正确
- 等待 CDN 节点同步（约5-10分钟）

## 下一步

1. **配置自定义域名**
   - 在 EdgeOne 添加域名
   - 配置 DNS 解析
   - 申请 SSL 证书

2. **性能优化**
   - 配置 CDN 缓存规则
   - 启用 Gzip 压缩
   - 设置静态资源缓存时间

3. **监控和分析**
   - 查看 EdgeOne 访问统计
   - 设置告警规则
   - 分析用户访问数据

## 支持资源

- EdgeOne 文档：https://cloud.tencent.com/document/product/1552
- 项目测试脚本：`test-deployed-site.js`
- 部署模拟器：`mock-deploy.html`

## 总结

您的 ZenStreak 项目已经完全准备好部署到 EdgeOne。请按照上述步骤操作，如遇到问题可参考常见问题部分或查阅官方文档。

祝部署顺利！🚀