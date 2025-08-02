# 🚀 推送到 GitHub 的命令

## 快速推送（替换 YOUR_USERNAME）

```bash
# 1. 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/zenstreak.git

# 2. 设置主分支
git branch -M main

# 3. 推送代码
git push -u origin main
```

## 或者运行脚本

```bash
./push-to-github.sh
```

## 如果遇到认证问题

GitHub 现在需要使用 Personal Access Token：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 选择权限：
   - ✅ repo（全部）
4. 生成 token
5. 推送时使用：
   - 用户名：您的 GitHub 用户名
   - 密码：刚才生成的 token

## 验证推送成功

推送成功后，访问：
```
https://github.com/YOUR_USERNAME/zenstreak
```

您应该能看到所有代码文件！