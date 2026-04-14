#!/bin/bash

echo ""
echo "══════════════════════════════════════════════════════════════════"
echo ""
echo "   🚗 新能源汽车销量预测平台 - 启动脚本"
echo ""
echo "══════════════════════════════════════════════════════════════════"
echo ""

echo "[1/3] 检查环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js 已安装"

echo ""
echo "[2/3] 安装依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "正在安装后端依赖..."
    npm install
fi
echo "✓ 后端依赖已就绪"

echo ""
echo "[3/3] 启动服务器..."
echo ""
echo "══════════════════════════════════════════════════════════════════"
echo " 📊 服务器地址: http://localhost:3000"
echo " 🌐 按 Ctrl+C 可停止服务器"
echo "══════════════════════════════════════════════════════════════════"
echo ""

npm start
