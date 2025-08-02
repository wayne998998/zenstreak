#!/bin/bash

echo "🚀 推送 ZenStreak 到 GitHub"
echo ""

# 检查是否已有远程仓库
if git remote -v | grep -q "origin"; then
    echo "✅ 远程仓库已存在"
else
    echo "请输入您的 GitHub 用户名："
    read username
    
    if [ -z "$username" ]; then
        echo "❌ 用户名不能为空"
        exit 1
    fi
    
    echo "添加远程仓库..."
    git remote add origin "https://github.com/$username/zenstreak.git"
    echo "✅ 远程仓库已添加"
fi

# 设置主分支
echo ""
echo "设置主分支..."
git branch -M main

# 推送代码
echo ""
echo "推送代码到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码推送成功！"
    echo ""
    echo "🌐 您的仓库地址："
    git remote -v | grep push | awk '{print $2}'
    echo ""
    echo "🎉 恭喜！ZenStreak 已成功上传到 GitHub！"
else
    echo ""
    echo "❌ 推送失败，可能的原因："
    echo "1. 网络连接问题"
    echo "2. 认证失败（需要输入 GitHub 用户名和密码/token）"
    echo "3. 仓库权限问题"
    echo ""
    echo "💡 如果需要认证，GitHub 现在要求使用 Personal Access Token 而不是密码："
    echo "   1. 访问 https://github.com/settings/tokens"
    echo "   2. 生成新的 token"
    echo "   3. 使用 token 作为密码"
fi