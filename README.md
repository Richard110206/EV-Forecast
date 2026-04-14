# EV Forecast - 新能源汽车销量预测平台

基于 CNN 卷积神经网络的新能源汽车（NEV）销量预测与数据可视化平台。覆盖全国 31 个省级行政区，集成 3D 地图热力图、多维度数据对比、实时预测等核心功能。

## 项目架构

```
EV-Forecast/
├── frontend/                  # 前端可视化界面
│   ├── index.html            # 数据总览大屏
│   ├── css/style.css         # 全局样式（深色科技风）
│   ├── js/
│   │   ├── main.js           # 大屏图表逻辑 & 3D 地图
│   │   └── china.json        # 中国地图 GeoJSON 数据
│   └── pages/
│       ├── prediction.html   # CNN 销量预测页面
│       ├── model.html        # 模型说明
│       ├── province.html     # 省份详情
│       └── about.html        # 关于
├── backend/                   # Node.js 后端服务
│   ├── server.js             # Express 服务器
│   └── routes/               # API 路由
├── cnn-model/                 # CNN 预测模型 (Python)
│   ├── model.py              # 模型定义与训练
│   ├── predict.py            # 预测接口
│   └── requirements.txt      # Python 依赖
├── data/                      # 数据文件
├── scripts/                   # 数据处理脚本
└── start.sh / start.bat      # 启动脚本
```

## 功能特性

- **3D 中国地图热力图** — 基于 ECharts GL 的 3D 地理可视化，支持旋转、缩放交互
- **多指标切换** — 新能源销量 / 充电桩密度 / 油价 / 空气质量 / 气温 / 降水量
- **时间维度筛选** — 支持 2019-2024 年份与月份的跨期对比
- **CNN 神经网络预测** — 输入多维度特征参数，模型实时推算未来销量
- **多步预测可视化** — 历史趋势 + 预测曲线 + 95% 置信区间
- **区域数据分析** — 七大区域销量排行、占比饼图、TOP10 柱状图
- **年度趋势图** — 6 年跨度的全国销量变化趋势

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | HTML5 / CSS3 / JavaScript (原生) |
| 可视化 | ECharts 5.4 / ECharts GL 2.0 |
| 后端 | Node.js / Express |
| 模型 | Python / TensorFlow / Keras / Scikit-learn |
| 字体 | Orbitron (Display) + Noto Sans SC (Body) |

## 本地运行

### 环境要求

- Node.js >= 16
- Python >= 3.8 (仅 CNN 模型训练需要)

### 快速启动

```bash
# 1. 克隆项目
git clone git@github.com:Richard110206/EV-Forecast.git
cd EV-Forecast

# 2. 安装后端依赖
cd backend
npm install

# 3. 启动服务器
npm start
# 或返回根目录运行
cd .. && bash start.sh
```

访问 http://localhost:3000 即可查看。

### CNN 模型训练（可选）

```bash
cd cnn-model
pip install -r requirements.txt
python model.py          # 训练模型
python predict.py        # 执行预测
```

## 部署

### Vercel（推荐）

本项目前端为纯静态页面，可直接部署到 Vercel：

1. Fork 或克隆本仓库
2. 在 [Vercel](https://vercel.com) 中导入项目
3. Root Directory 设置为 `frontend`
4. 点击 Deploy 即可

或使用 Vercel CLI：

```bash
npm i -g vercel
cd frontend
vercel
```

### 自有服务器

```bash
bash start.sh
# 后台运行
nohup bash start.sh > ev.log 2>&1 &
```

## 预览

| 页面 | 说明 |
|------|------|
| 数据总览 | 3D 地图 + 31 省热力分布 + 区域排行 |
| 销量预测 | CNN 模型输入特征 → 多步预测曲线 |
| 模型说明 | CNN 网络结构、训练流程、特征工程 |
| 省份详情 | 单省销量深度分析 |

## 数据来源

- 国家统计局公开数据
- 中国充电联盟
- 中国气象局
- 部分数据经 CNN 模型模拟生成，仅供展示

## License

MIT
