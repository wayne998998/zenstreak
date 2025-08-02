# Playwright 浏览器支持说明

## 支持的浏览器

Playwright 支持所有现代浏览器的自动化：

### 1. **Microsoft Edge** ✅
```bash
npm run deploy:edgeone:edge
```
- **优势**：
  - 可能已保存腾讯云登录信息
  - Windows 系统默认浏览器
  - 基于 Chromium，性能优秀
  - 完美支持所有 EdgeOne 功能

### 2. **Google Chrome** ✅
```bash
npm run deploy:edgeone:browser
# 然后选择选项 2
```
- **优势**：
  - 开发者最常用的浏览器
  - 可能已有登录会话
  - 最佳的开发者工具

### 3. **Firefox** ✅
```bash
npm run deploy:edgeone:browser
# 然后选择选项 3
```
- **优势**：
  - 独立的浏览器引擎
  - 良好的隐私保护
  - 跨平台一致性

### 4. **Safari (WebKit)** ✅
```bash
npm run deploy:edgeone:browser
# 然后选择选项 4
```
- **优势**：
  - macOS 原生浏览器
  - 可能已有 iCloud 钥匙串保存的密码
  - 最佳的 macOS 集成

## 使用方法

### 方法一：指定 Edge 浏览器
```bash
# 直接使用 Edge 浏览器
npm run deploy:edgeone:edge
```

### 方法二：选择浏览器
```bash
# 运行时选择浏览器
npm run deploy:edgeone:browser
```

### 方法三：在代码中指定
```javascript
// 使用 Edge
const browser = await chromium.launch({ 
  channel: 'msedge',
  headless: false 
});

// 使用 Chrome
const browser = await chromium.launch({ 
  channel: 'chrome',
  headless: false 
});

// 使用 Firefox
const browser = await firefox.launch({ 
  headless: false 
});

// 使用 Safari (仅 macOS)
const browser = await webkit.launch({ 
  headless: false 
});
```

## 浏览器安装

### 安装 Playwright 浏览器
```bash
# 安装所有浏览器
npx playwright install

# 仅安装特定浏览器
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### 使用系统浏览器
Playwright 可以使用系统已安装的浏览器：
- Edge: 使用 `channel: 'msedge'`
- Chrome: 使用 `channel: 'chrome'`

## 常见问题

### Q: 哪个浏览器最适合部署？
A: 推荐使用 **Microsoft Edge** 或 **Google Chrome**：
- 如果您经常使用 Edge 并已保存密码，使用 Edge
- 如果您是开发者并常用 Chrome，使用 Chrome

### Q: 浏览器启动失败？
A: 检查：
1. 浏览器是否已安装
2. 运行 `npx playwright install` 安装浏览器
3. 检查系统权限

### Q: 可以使用无头模式吗？
A: 不建议用于部署，因为需要手动登录。但可以用于测试：
```javascript
const browser = await chromium.launch({ 
  headless: true // 无头模式
});
```

## 浏览器特性对比

| 特性 | Edge | Chrome | Firefox | Safari |
|------|------|--------|---------|--------|
| 密码管理器 | ✅ | ✅ | ✅ | ✅ |
| 开发者工具 | ✅ | ✅ | ✅ | ✅ |
| 跨平台 | ✅ | ✅ | ✅ | ❌ (仅 macOS) |
| 性能 | 优秀 | 优秀 | 良好 | 优秀 |
| 腾讯云兼容性 | ✅ | ✅ | ✅ | ✅ |

## 最佳实践

1. **使用您常用的浏览器** - 可能已有保存的登录信息
2. **保持浏览器更新** - 确保最佳兼容性
3. **使用密码管理器** - 简化登录流程
4. **测试多个浏览器** - 确保跨浏览器兼容性