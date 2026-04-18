const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// 导入路由
const dataRoutes = require('./routes/data');
const predictionRoutes = require('./routes/prediction');
const policyRoutes = require('./routes/policy');

// 使用路由
app.use('/api/data', dataRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/policy', policyRoutes);

// 静态文件服务
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🚗 新能源汽车销量预测平台                                      ║
║                                                                ║
║  📊 Server running on: http://localhost:${PORT}                   ║
║                                                                ║
║  🌟 Features:                                                  ║
║     - 全国31省份数据可视化                                      ║
║     - CNN销量预测                                              ║
║     - 多维度数据对比                                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
