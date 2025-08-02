# 📤 上传 ZenStreak 到 GitHub

## ✅ 已完成的准备工作
- Git 仓库已初始化
- 所有文件已添加
- 初始提交已创建
- .gitignore 已配置

## 🚀 方法一：使用 GitHub 网页界面

1. **打开 GitHub**
   - 访问 https://github.com
   - 登录您的账户

2. **创建新仓库**
   - 点击右上角的 "+" → "New repository"
   - 仓库名称：`zenstreak`
   - 描述：`A meditation habit tracker PWA with streak tracking, breathing animations, and music integration`
   - 选择 "Public"（公开）
   - **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

3. **推送代码**
   在终端中运行以下命令：
   ```bash
   # 添加远程仓库（替换 YOUR_USERNAME 为您的 GitHub 用户名）
   git remote add origin https://github.com/YOUR_USERNAME/zenstreak.git
   
   # 推送代码
   git branch -M main
   git push -u origin main
   ```

## 🚀 方法二：使用 GitHub CLI

如果您有 GitHub CLI，运行：
```bash
# 安装 GitHub CLI (如果还没有)
brew install gh

# 登录 GitHub
gh auth login

# 创建仓库并推送
gh repo create zenstreak --public --source=. --remote=origin --push
```

## 🚀 方法三：使用 GitHub Desktop

1. 打开 GitHub Desktop
2. 添加本地仓库：File → Add Local Repository
3. 选择：`/Users/wayne/Documents/test/subagent2/zenstreak`
4. 点击 "Publish repository"
5. 仓库名称：`zenstreak`
6. 选择 "Public"
7. 点击 "Publish Repository"

## 📋 仓库信息

**仓库名称**: zenstreak

**描述**: A meditation habit tracker PWA with streak tracking, breathing animations, and music integration

**主要功能**:
- 🧘 每日冥想签到
- 📊 连续打卡统计
- 🌬️ 呼吸动画引导
- 🎵 音乐集成
- 📱 PWA 离线支持
- 🎉 里程碑庆祝
- 📤 社交分享

**技术栈**:
- React + Vite
- Tailwind CSS
- PWA (Service Worker)
- Local Storage

## 🔗 推送后的访问地址

仓库地址：`https://github.com/YOUR_USERNAME/zenstreak`

## 💡 下一步

1. **添加 README 徽章**（可选）
   ```markdown
   ![Deploy to EdgeOne](https://img.shields.io/badge/Deploy-EdgeOne-blue)
   ![PWA](https://img.shields.io/badge/PWA-Ready-green)
   ```

2. **设置 GitHub Pages**（可选）
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, /dist folder

3. **添加 Topics**（推荐）
   - meditation
   - pwa
   - react
   - habit-tracker
   - mindfulness

## 🎯 快速命令总结

```bash
# 如果还没有添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/zenstreak.git

# 推送到 GitHub
git push -u origin main
```

记得将 `YOUR_USERNAME` 替换为您的 GitHub 用户名！