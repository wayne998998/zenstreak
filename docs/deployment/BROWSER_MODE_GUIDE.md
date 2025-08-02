# 浏览器模式说明 - 正常模式 vs 隐私模式

## ✅ 推荐：正常模式（非隐私模式）

### 使用正常模式部署：
```bash
# 方法1：简单版本
npm run deploy:edgeone:normal

# 方法2：带用户配置文件
npm run deploy:edgeone:profile
```

### 正常模式的优势：
- ✅ **保存登录状态** - 下次无需重新登录
- ✅ **使用密码管理器** - 自动填充密码
- ✅ **保留 Cookies** - 记住用户偏好
- ✅ **浏览器扩展可用** - 如密码管理器插件
- ✅ **同步账户数据** - 使用 Microsoft 账户同步

## ❌ 避免：隐私/无痕模式

### 隐私模式的问题：
- ❌ 不保存登录信息
- ❌ 每次都需要重新登录
- ❌ 无法使用保存的密码
- ❌ 关闭后所有数据丢失
- ❌ 扩展功能受限

### Playwright 中的隐私模式参数（避免使用）：
```javascript
// ❌ 不要使用这些参数
args: [
  '--inprivate',    // Edge 隐私模式
  '--incognito',    // Chrome 隐私模式
  '--guest'         // 访客模式
]

// ❌ 不要使用隐私上下文
const context = await browser.newIncognitoContext();
```

## 正确的配置示例

### 1. 基础配置（推荐）
```javascript
const browser = await chromium.launch({
  channel: 'msedge',
  headless: false,
  // 不添加任何隐私模式参数
});
```

### 2. 保留用户数据
```javascript
const context = await browser.newContext({
  viewport: null,
  acceptDownloads: true,
  locale: 'zh-CN',
  // 不设置会清空数据的选项
});
```

### 3. 使用默认配置文件
```javascript
// 让浏览器使用默认的用户配置文件
const browser = await chromium.launch({
  channel: 'msedge',
  headless: false,
  // Playwright 会使用临时配置，但不是隐私模式
});
```

## 登录体验对比

### 正常模式登录流程：
1. 第一次：输入账号密码
2. 浏览器提示"是否保存密码" → 选择"是"
3. 下次访问：自动填充或一键登录

### 隐私模式登录流程：
1. 每次都需要输入账号密码
2. 无法保存密码
3. 无法使用二步验证记忆

## 最佳实践

1. **始终使用正常模式进行部署**
   ```bash
   npm run deploy:edgeone:normal
   ```

2. **利用浏览器密码管理**
   - Edge/Chrome 内置密码管理器
   - 支持跨设备同步

3. **保存登录会话**
   - 勾选"记住我"或"保持登录"
   - 使用受信任的设备

4. **安全建议**
   - 在个人电脑上使用正常模式
   - 在公共电脑上才使用隐私模式
   - 定期更新密码

## 命令总结

```bash
# ✅ 推荐：正常模式部署
npm run deploy:edgeone:normal

# ✅ 带配置文件的部署
npm run deploy:edgeone:profile

# ✅ 选择浏览器（都是正常模式）
npm run deploy:edgeone:browser

# ❌ 避免手动添加隐私模式参数
```

## 故障排除

### 如果意外进入隐私模式：
1. 关闭浏览器
2. 重新运行脚本
3. 确保没有添加隐私模式参数

### 如果密码未保存：
1. 检查浏览器密码设置
2. 确认使用正常模式
3. 手动保存密码到密码管理器