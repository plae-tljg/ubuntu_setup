#!/bin/bash

# Ubuntu Setup - GitHub Pages 部署脚本
# 使用方法: ./deploy-gh-pages.sh

set -e  # 遇到错误时退出

echo "🚀 开始部署到 GitHub Pages..."

# 检查是否在正确的分支上
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ 错误: 请在 main 分支上运行此脚本"
    echo "当前分支: $CURRENT_BRANCH"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ 错误: 有未提交的更改，请先提交或暂存"
    git status --short
    exit 1
fi

echo "✅ 检查通过，开始构建..."

# 构建 VuePress 文档到外部目录
echo "📦 构建 VuePress 文档到外部目录..."
BUILD_DIR="../ubuntu_setup_build"

# 清理外部构建目录
if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
fi

# 构建到外部目录
npm run docs:build -- --dest "$BUILD_DIR"

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功到外部目录: $BUILD_DIR"

# 检查 gh-pages 分支是否存在
if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    echo "🔄 更新现有的 gh-pages 分支..."
    git checkout gh-pages
    git pull origin gh-pages
else
    echo "🆕 创建新的 gh-pages 分支..."
    git checkout -b gh-pages
fi

# 清理当前分支，但保留 .git 目录
echo "🧹 清理当前分支文件..."
# 使用更安全的方法删除文件
git rm -rf . 2>/dev/null || true

# 从外部构建目录复制文件
echo "📋 从外部构建目录复制文件..."
cp -r "$BUILD_DIR"/* .

# 清理外部构建目录
echo "🧹 清理外部构建目录..."
rm -rf "$BUILD_DIR"

# 添加所有文件
echo "➕ 添加文件到 Git..."
git add .

# 检查是否有更改
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️ 没有文件更改，无需部署"
    git checkout main
    exit 0
fi

# 提交更改
echo "💾 提交更改..."
git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"

# 推送到远程
echo "🚀 推送到远程 gh-pages 分支..."
git push origin gh-pages

# 切换回 main 分支
echo "🔄 切换回 main 分支..."
git checkout main

echo "✅ 部署完成！"
echo ""
echo "📝 下一步操作:"
echo "1. 在 GitHub 仓库设置中启用 Pages"
echo "2. Source 选择 'Deploy from a branch'"
echo "3. Branch 选择 'gh-pages'"
echo "4. 等待几分钟后访问: https://你的用户名.github.io/ubuntu_setup"
echo ""
echo "🔄 下次更新时，只需再次运行: ./deploy-gh-pages.sh"
