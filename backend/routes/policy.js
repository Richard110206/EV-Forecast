const express = require('express');
const router = express.Router();

// DeepSeek API Key
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// ── PROVINCE DATA (consistent with main.js) ──
const PROVINCES_DATA = {
    '2019': [
        { name: '北京市', value: 42.3 }, { name: '天津市', value: 30.8 },
        { name: '河北省', value: 22.6 }, { name: '山西省', value: 18.9 },
        { name: '内蒙古自治区', value: 12.5 }, { name: '辽宁省', value: 20.8 },
        { name: '吉林省', value: 13.9 }, { name: '黑龙江省', value: 10.8 },
        { name: '上海市', value: 45.5 }, { name: '江苏省', value: 43.4 },
        { name: '浙江省', value: 38.6 }, { name: '安徽省', value: 25.7 },
        { name: '福建省', value: 28.9 }, { name: '江西省', value: 20.2 },
        { name: '山东省', value: 35.6 }, { name: '河南省', value: 27.4 },
        { name: '湖北省', value: 23.9 }, { name: '湖南省', value: 22.7 },
        { name: '广东省', value: 48.2 }, { name: '广西壮族自治区', value: 17.5 },
        { name: '海南省', value: 9.1 }, { name: '重庆市', value: 25.9 },
        { name: '四川省', value: 23.7 }, { name: '贵州省', value: 14.0 },
        { name: '云南省', value: 15.9 }, { name: '西藏自治区', value: 6.0 },
        { name: '陕西省', value: 20.9 }, { name: '甘肃省', value: 10.2 },
        { name: '青海省', value: 7.5 }, { name: '宁夏回族自治区', value: 9.3 },
        { name: '新疆维吾尔自治区', value: 8.2 }
    ],
    '2020': [
        { name: '北京市', value: 52.1 }, { name: '天津市', value: 38.6 },
        { name: '河北省', value: 28.3 }, { name: '山西省', value: 23.7 },
        { name: '内蒙古自治区', value: 15.8 }, { name: '辽宁省', value: 26.2 },
        { name: '吉林省', value: 17.4 }, { name: '黑龙江省', value: 13.5 },
        { name: '上海市', value: 56.8 }, { name: '江苏省', value: 54.3 },
        { name: '浙江省', value: 48.4 }, { name: '安徽省', value: 32.2 },
        { name: '福建省', value: 36.1 }, { name: '江西省', value: 25.3 },
        { name: '山东省', value: 44.5 }, { name: '河南省', value: 34.3 },
        { name: '湖北省', value: 29.9 }, { name: '湖南省', value: 28.4 },
        { name: '广东省', value: 60.3 }, { name: '广西壮族自治区', value: 21.9 },
        { name: '海南省', value: 11.4 }, { name: '重庆市', value: 32.4 },
        { name: '四川省', value: 29.6 }, { name: '贵州省', value: 17.5 },
        { name: '云南省', value: 19.9 }, { name: '西藏自治区', value: 7.5 },
        { name: '陕西省', value: 26.2 }, { name: '甘肃省', value: 12.8 },
        { name: '青海省', value: 9.4 }, { name: '宁夏回族自治区', value: 11.6 },
        { name: '新疆维吾尔自治区', value: 10.2 }
    ],
    '2021': [
        { name: '北京市', value: 68.5 }, { name: '天津市', value: 50.8 },
        { name: '河北省', value: 37.1 }, { name: '山西省', value: 31.0 },
        { name: '内蒙古自治区', value: 20.7 }, { name: '辽宁省', value: 34.2 },
        { name: '吉林省', value: 22.7 }, { name: '黑龙江省', value: 17.7 },
        { name: '上海市', value: 74.6 }, { name: '江苏省', value: 71.1 },
        { name: '浙江省', value: 63.3 }, { name: '安徽省', value: 42.1 },
        { name: '福建省', value: 47.2 }, { name: '江西省', value: 33.1 },
        { name: '山东省', value: 58.3 }, { name: '河南省', value: 44.8 },
        { name: '湖北省', value: 39.1 }, { name: '湖南省', value: 37.1 },
        { name: '广东省', value: 78.9 }, { name: '广西壮族自治区', value: 28.6 },
        { name: '海南省', value: 14.9 }, { name: '重庆市', value: 42.4 },
        { name: '四川省', value: 38.7 }, { name: '贵州省', value: 22.9 },
        { name: '云南省', value: 26.0 }, { name: '西藏自治区', value: 9.8 },
        { name: '陕西省', value: 34.2 }, { name: '甘肃省', value: 16.7 },
        { name: '青海省', value: 12.3 }, { name: '宁夏回族自治区', value: 15.2 },
        { name: '新疆维吾尔自治区', value: 13.3 }
    ],
    '2022': [
        { name: '北京市', value: 85.5 }, { name: '天津市', value: 62.3 },
        { name: '河北省', value: 45.8 }, { name: '山西省', value: 38.2 },
        { name: '内蒙古自治区', value: 25.6 }, { name: '辽宁省', value: 42.5 },
        { name: '吉林省', value: 28.3 }, { name: '黑龙江省', value: 22.1 },
        { name: '上海市', value: 92.7 }, { name: '江苏省', value: 88.4 },
        { name: '浙江省', value: 78.6 }, { name: '安徽省', value: 52.3 },
        { name: '福建省', value: 58.9 }, { name: '江西省', value: 41.2 },
        { name: '山东省', value: 72.5 }, { name: '河南省', value: 55.8 },
        { name: '湖北省', value: 48.6 }, { name: '湖南省', value: 46.3 },
        { name: '广东省', value: 98.2 }, { name: '广西壮族自治区', value: 35.7 },
        { name: '海南省', value: 18.5 }, { name: '重庆市', value: 52.8 },
        { name: '四川省', value: 48.2 }, { name: '贵州省', value: 28.5 },
        { name: '云南省', value: 32.4 }, { name: '西藏自治区', value: 12.3 },
        { name: '陕西省', value: 42.6 }, { name: '甘肃省', value: 20.8 },
        { name: '青海省', value: 15.2 }, { name: '宁夏回族自治区', value: 18.9 },
        { name: '新疆维吾尔自治区', value: 16.7 }
    ],
    '2023': [
        { name: '北京市', value: 92.5 }, { name: '天津市', value: 67.8 },
        { name: '河北省', value: 50.3 }, { name: '山西省', value: 42.1 },
        { name: '内蒙古自治区', value: 28.2 }, { name: '辽宁省', value: 46.8 },
        { name: '吉林省', value: 31.2 }, { name: '黑龙江省', value: 24.4 },
        { name: '上海市', value: 100.5 }, { name: '江苏省', value: 96.8 },
        { name: '浙江省', value: 86.3 }, { name: '安徽省', value: 57.6 },
        { name: '福建省', value: 64.8 }, { name: '江西省', value: 45.4 },
        { name: '山东省', value: 79.8 }, { name: '河南省', value: 61.4 },
        { name: '湖北省', value: 53.5 }, { name: '湖南省', value: 50.9 },
        { name: '广东省', value: 108.5 }, { name: '广西壮族自治区', value: 39.3 },
        { name: '海南省', value: 20.4 }, { name: '重庆市', value: 58.1 },
        { name: '四川省', value: 53.0 }, { name: '贵州省', value: 31.4 },
        { name: '云南省', value: 35.7 }, { name: '西藏自治区', value: 13.6 },
        { name: '陕西省', value: 46.9 }, { name: '甘肃省', value: 22.9 },
        { name: '青海省', value: 16.7 }, { name: '宁夏回族自治区', value: 20.8 },
        { name: '新疆维吾尔自治区', value: 18.4 }
    ],
    '2024': [
        { name: '北京市', value: 98.2 }, { name: '天津市', value: 72.5 },
        { name: '河北省', value: 54.8 }, { name: '山西省', value: 45.6 },
        { name: '内蒙古自治区', value: 30.5 }, { name: '辽宁省', value: 50.3 },
        { name: '吉林省', value: 33.7 }, { name: '黑龙江省', value: 26.3 },
        { name: '上海市', value: 106.8 }, { name: '江苏省', value: 103.5 },
        { name: '浙江省', value: 92.7 }, { name: '安徽省', value: 62.1 },
        { name: '福建省', value: 70.2 }, { name: '江西省', value: 49.3 },
        { name: '山东省', value: 86.4 }, { name: '河南省', value: 66.7 },
        { name: '湖北省', value: 58.2 }, { name: '湖南省', value: 55.4 },
        { name: '广东省', value: 115.8 }, { name: '广西壮族自治区', value: 43.1 },
        { name: '海南省', value: 22.5 }, { name: '重庆市', value: 63.5 },
        { name: '四川省', value: 57.8 }, { name: '贵州省', value: 34.2 },
        { name: '云南省', value: 39.0 }, { name: '西藏自治区', value: 14.8 },
        { name: '陕西省', value: 51.3 }, { name: '甘肃省', value: 25.1 },
        { name: '青海省', value: 18.3 }, { name: '宁夏回族自治区', value: 22.7 },
        { name: '新疆维吾尔自治区', value: 20.1 }
    ]
};

// Charging density offsets
const CHARGING_OFFSETS = {
    '北京市': 3.2, '上海市': 3.5, '天津市': 2.8, '广东省': 2.5,
    '浙江省': 2.6, '江苏省': 2.4, '福建省': 2.2, '山东省': 1.8,
    '重庆市': 2.0, '湖北省': 1.9, '安徽省': 1.7, '河南省': 1.5,
    '四川省': 1.6, '湖南省': 1.7, '陕西省': 1.8, '辽宁省': 1.9,
    '江西省': 1.6, '广西壮族自治区': 1.4, '云南省': 1.3,
    '山西省': 1.5, '河北省': 1.4, '贵州省': 1.2, '吉林省': 1.6,
    '黑龙江省': 1.3, '内蒙古自治区': 1.1, '海南省': 1.8,
    '甘肃省': 1.0, '新疆维吾尔自治区': 0.9, '宁夏回族自治区': 1.2,
    '青海省': 1.1, '西藏自治区': 0.8
};

// Regional groupings
const REGION_MAP = {
    '华东': ['上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省'],
    '华南': ['广东省', '广西壮族自治区', '海南省'],
    '华北': ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区'],
    '华中': ['河南省', '湖北省', '湖南省'],
    '西南': ['重庆市', '四川省', '贵州省', '云南省', '西藏自治区'],
    '西北': ['陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'],
    '东北': ['辽宁省', '吉林省', '黑龙江省']
};

// Province geo-proximity mapping for demand flow
const NEIGHBOR_MAP = {
    '上海市': ['江苏省', '浙江省', '安徽省', '江西省'],
    '广东省': ['广西壮族自治区', '福建省', '湖南省', '江西省', '海南省'],
    '江苏省': ['安徽省', '浙江省', '山东省', '上海市', '江西省'],
    '浙江省': ['安徽省', '福建省', '江西省', '上海市', '江苏省'],
    '山东省': ['河北省', '河南省', '安徽省', '江苏省'],
    '北京市': ['河北省', '天津市', '山西省', '内蒙古自治区'],
    '河南省': ['安徽省', '湖北省', '陕西省', '山西省', '河北省', '山东省'],
    '四川省': ['重庆市', '贵州省', '云南省', '陕西省', '甘肃省'],
    '湖北省': ['河南省', '湖南省', '安徽省', '江西省', '重庆市', '陕西省'],
    '福建省': ['浙江省', '江西省', '广东省'],
};

// ── HELPER: Calculate health metrics ──
function calculateRegionalHealth(year) {
    const currentData = PROVINCES_DATA[year] || PROVINCES_DATA['2024'];
    const prevYear = (parseInt(year) - 1).toString();
    const prevData = PROVINCES_DATA[prevYear];

    const totalSales = currentData.reduce((s, d) => s + d.value, 0);
    const avgSales = totalSales / currentData.length;

    return currentData.map(prov => {
        const prev = prevData ? prevData.find(d => d.name === prov.name) : null;
        const growthRate = prev ? ((prov.value - prev.value) / prev.value * 100) : 15;
        const chargingDensity = (prov.value * (CHARGING_OFFSETS[prov.name] || 1.0) * 0.08).toFixed(1);

        // Growth stability: variance across years
        const yearlyValues = ['2019', '2020', '2021', '2022', '2023', '2024'].map(y => {
            const d = PROVINCES_DATA[y];
            const p = d ? d.find(x => x.name === prov.name) : null;
            return p ? p.value : 0;
        });
        const mean = yearlyValues.reduce((s, v) => s + v, 0) / yearlyValues.length;
        const variance = yearlyValues.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / yearlyValues.length;
        const stability = Math.max(0, 100 - Math.sqrt(variance) / mean * 100);

        // Health score (0-100)
        const salesRatio = prov.value / avgSales;
        const chargeScore = Math.min(parseFloat(chargingDensity) / 30 * 100, 100);
        const growthScore = Math.min(Math.abs(growthRate) / 25 * 100, 100);
        const healthScore = Math.round(
            chargeScore * 0.3 +
            growthScore * 0.3 +
            stability * 0.2 +
            (100 - Math.abs(100 - salesRatio * 100)) * 0.2
        );

        // Status determination
        let status = 'healthy';
        let riskLevel = 'low';
        if (salesRatio > 1.8 && growthRate > 25) {
            status = 'overheated';
            riskLevel = salesRatio > 2.2 ? 'high' : 'medium';
        } else if (salesRatio < 0.6 && parseFloat(chargingDensity) < 12) {
            status = 'underdeveloped';
            riskLevel = salesRatio < 0.4 ? 'high' : 'medium';
        }

        return {
            name: prov.name,
            value: prov.value,
            avgSales: parseFloat(avgSales.toFixed(1)),
            growthRate: parseFloat(growthRate.toFixed(1)),
            chargingDensity: parseFloat(chargingDensity),
            stability: parseFloat(stability.toFixed(1)),
            healthScore,
            status,
            riskLevel
        };
    });
}

// ── 1. Regional Health Assessment ──
router.get('/regional-health', (req, res) => {
    try {
        const { year = '2024' } = req.query;
        const healthData = calculateRegionalHealth(year);

        const overheated = healthData.filter(d => d.status === 'overheated');
        const underdeveloped = healthData.filter(d => d.status === 'underdeveloped');
        const healthy = healthData.filter(d => d.status === 'healthy');

        // Regional aggregation
        const regionalHealth = {};
        for (const [region, provinces] of Object.entries(REGION_MAP)) {
            const regionData = healthData.filter(d => provinces.includes(d.name));
            regionalHealth[region] = {
                avgHealthScore: parseFloat((regionData.reduce((s, d) => s + d.healthScore, 0) / regionData.length).toFixed(1)),
                overheatedCount: regionData.filter(d => d.status === 'overheated').length,
                underdevelopedCount: regionData.filter(d => d.status === 'underdeveloped').length,
                avgGrowthRate: parseFloat((regionData.reduce((s, d) => s + d.growthRate, 0) / regionData.length).toFixed(1)),
                totalSales: parseFloat(regionData.reduce((s, d) => s + d.value, 0).toFixed(1))
            };
        }

        // Overall balance index (Gini coefficient simplified)
        const values = healthData.map(d => d.value).sort((a, b) => a - b);
        const n = values.length;
        const total = values.reduce((s, v) => s + v, 0);
        let giniSum = 0;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                giniSum += Math.abs(values[i] - values[j]);
            }
        }
        const giniIndex = parseFloat((giniSum / (2 * n * total)).toFixed(3));
        const balanceIndex = parseFloat(((1 - giniIndex) * 100).toFixed(1));

        res.json({
            success: true,
            data: {
                provinces: healthData,
                summary: {
                    overheatedCount: overheated.length,
                    underdevelopedCount: underdeveloped.length,
                    healthyCount: healthy.length,
                    balanceIndex,
                    giniIndex
                },
                regionalHealth,
                overheated: overheated.map(d => d.name),
                underdeveloped: underdeveloped.map(d => d.name)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── 2. Demand Flow Analysis ──
router.get('/demand-flow', (req, res) => {
    try {
        const { year = '2024' } = req.query;
        const healthData = calculateRegionalHealth(year);
        const overheated = healthData.filter(d => d.status === 'overheated');
        const underdeveloped = healthData.filter(d => d.status === 'underdeveloped');

        const avgSales = healthData.reduce((s, d) => s + d.value, 0) / healthData.length;
        const flows = [];

        overheated.forEach(source => {
            const overflow = parseFloat(((source.value - avgSales * 1.5) * 0.15).toFixed(1));
            if (overflow <= 0) return;

            // Find nearby underdeveloped provinces
            const neighbors = NEIGHBOR_MAP[source.name] || [];
            const targets = underdeveloped.filter(d =>
                neighbors.includes(d.name) || d.chargingDensity < 15
            ).sort((a, b) => {
                // Prefer closer provinces with lower charging density
                const aScore = (neighbors.includes(a.name) ? 100 : 0) + (15 - a.chargingDensity) * 5;
                const bScore = (neighbors.includes(b.name) ? 100 : 0) + (15 - b.chargingDensity) * 5;
                return bScore - aScore;
            }).slice(0, 3);

            if (targets.length === 0) return;

            const perTarget = parseFloat((overflow / targets.length).toFixed(1));

            targets.forEach(target => {
                flows.push({
                    source: source.name,
                    sourceValue: source.value,
                    sourceGrowth: source.growthRate,
                    target: target.name,
                    targetValue: target.value,
                    transferVolume: perTarget,
                    distance: neighbors.includes(target.name) ? 'proximate' : 'regional',
                    measures: [
                        `${target.name}充电桩建设加速，目标密度提升至${(target.chargingDensity * 1.5).toFixed(0)}个/万人`,
                        `${source.name}限购指标适度收紧，引导需求外溢`,
                        `${target.name}购车补贴上浮15%，叠加地方消费券`,
                        `跨省换电网络互联互通，降低使用门槛`
                    ]
                });
            });
        });

        // Calculate total overflow
        const totalOverflow = flows.reduce((s, f) => s + f.transferVolume, 0);

        res.json({
            success: true,
            data: {
                flows,
                summary: {
                    totalOverflow: parseFloat(totalOverflow.toFixed(1)),
                    flowCount: flows.length,
                    overheatedCount: overheated.length,
                    underdevelopedCount: underdeveloped.length
                },
                avgSales: parseFloat(avgSales.toFixed(1))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── 3. Stakeholder Game Theory Analysis ──
router.post('/stakeholder-analysis', (req, res) => {
    try {
        const { year = '2024' } = req.body;
        const healthData = calculateRegionalHealth(year);

        // Government perspective
        const government = {
            name: '政府',
            goals: {
                '税收增长': 75,
                '碳减排达标': 82,
                '产业安全': 70,
                '区域均衡': 45,
                '就业稳定': 78
            },
            actual: {
                '税收增长': 68,
                '碳减排达标': 71,
                '产业安全': 73,
                '区域均衡': 38,
                '就业稳定': 80
            },
            keyActions: [
                '优化双积分政策，向中西部倾斜',
                '设定区域充电桩建设最低标准',
                '差异化的购车补贴梯度',
                '碳排放权跨省交易机制',
                '新能源下乡专项补贴'
            ]
        };

        // OEM (automaker) perspective
        const oem = {
            name: '车企',
            goals: {
                '市场份额': 80,
                '利润率': 65,
                '技术研发': 70,
                '渠道下沉': 50,
                '品牌溢价': 60
            },
            actual: {
                '市场份额': 72,
                '利润率': 45,
                '技术研发': 68,
                '渠道下沉': 35,
                '品牌溢价': 55
            },
            keyActions: [
                '一二线城市产品矩阵优化',
                '三四线城市渠道网络扩张',
                '换电/电池银行模式探索',
                '智能化差异化竞争',
                '出口与国内双循环'
            ]
        };

        // Charging operator perspective
        const chargingOp = {
            name: '充电运营',
            goals: {
                '利用率': 55,
                '覆盖密度': 70,
                '投资回报': 60,
                '技术升级': 65,
                '盈利平衡': 50
            },
            actual: {
                '利用率': 42,
                '覆盖密度': 58,
                '投资回报': 38,
                '技术升级': 55,
                '盈利平衡': 32
            },
            keyActions: [
                '超充站核心城市布局',
                '高速服务区快充覆盖',
                '社区慢充桩渗透',
                '光储充一体化模式',
                '跨运营商互联互通'
            ]
        };

        // Conflict matrix
        const conflicts = [
            {
                parties: ['政府', '车企'],
                dimension: '补贴分配',
                governmentView: '希望补贴向低线市场倾斜，促进均衡',
                oemView: '希望补贴集中在一二线高销量市场',
                tensionLevel: 65,
                nashEquilibrium: '差异化阶梯补贴，一二线适度退坡、三四线加大力度'
            },
            {
                parties: ['政府', '充电运营'],
                dimension: '建设标准',
                governmentView: '强制要求偏远地区最低建设密度',
                oemView: '市场导向，优先高利用率区域',
                tensionLevel: 55,
                nashEquilibrium: '基础保底+超额奖励的混合机制'
            },
            {
                parties: ['车企', '充电运营'],
                dimension: '技术标准',
                governmentView: '车企主导快充标准制定',
                oemView: '充电运营商需要统一标准降低成本',
                tensionLevel: 45,
                nashEquilibrium: '国家标准框架下允许差异化创新'
            },
            {
                parties: ['政府', '车企'],
                dimension: '产能管控',
                governmentView: '防止产能过剩，引导有序竞争',
                oemView: '自主决定产能布局',
                tensionLevel: 70,
                nashEquilibrium: '产能预警+市场化优胜劣汰结合'
            },
            {
                parties: ['车企', '充电运营'],
                dimension: '换电模式',
                governmentView: '车企自建换电网络构筑壁垒',
                oemView: '希望共享换电网络降低投入',
                tensionLevel: 50,
                nashEquilibrium: '联盟化共享换电平台'
            },
            {
                parties: ['政府', '充电运营'],
                dimension: '电价管制',
                governmentView: '终端电价需控制在合理水平',
                oemView: '峰谷价差不足，难以回收投资',
                tensionLevel: 60,
                nashEquilibrium: '分时电价+运营补贴组合'
            }
        ];

        res.json({
            success: true,
            data: {
                stakeholders: { government, oem, chargingOp },
                conflicts,
                gameInsight: {
                    totalTension: parseFloat((conflicts.reduce((s, c) => s + c.tensionLevel, 0) / conflicts.length).toFixed(1)),
                    highestTension: conflicts.sort((a, b) => b.tensionLevel - a.tensionLevel).slice(0, 2),
                    keyFinding: '当前三方博弈核心矛盾集中在产能管控和补贴分配领域。建议采用激励相容机制：通过差异化政策和市场化手段，使三方在追求自身利益的同时，客观上促进区域均衡和产业健康发展。'
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── 4. DeepSeek AI Policy Advice ──
router.post('/ai-advice', async (req, res) => {
    try {
        const { year = '2024', preference = 'balanced', context } = req.body;

        // Build context from existing data
        const healthData = calculateRegionalHealth(year);
        const overheated = healthData.filter(d => d.status === 'overheated').map(d => `${d.name}(销量${d.value}万,增速${d.growthRate}%)`);
        const underdeveloped = healthData.filter(d => d.status === 'underdeveloped').map(d => `${d.name}(销量${d.value}万,充电密度${d.chargingDensity})`);

        const systemPrompt = `你是一位资深的新能源汽车产业政策分析师，服务于国家发改委。你需要基于数据提供精准、专业、可落地的政策建议。
你的分析需要兼顾政府、车企、充电运营三方利益诉求，实现激励与约束并重、发展与安全协同的双向决策。
回答使用中文，格式化为JSON。`;

        const userPrompt = `基于以下2024年新能源汽车市场数据，请提供${preference === 'aggressive' ? '激进型' : preference === 'conservative' ? '保守型' : '稳健型'}政策建议方案。

【过热省份】${overheated.join('、') || '无'}
【待扶持省份】${underdeveloped.join('、') || '无'}
【全国均值销量】${(healthData.reduce((s, d) => s + d.value, 0) / healthData.length).toFixed(1)}万辆
${context ? '【用户补充背景】' + context : ''}

请返回严格JSON格式，包含3套方案：
{
  "schemes": [
    {
      "name": "方案名称（如：区域协同均衡发展方案）",
      "type": "aggressive/ balanced/ conservative",
      "description": "100字以内方案概述",
      "policies": [
        {"title": "政策名称", "detail": "具体措施描述", "target": "政府/车企/充电运营", "impact": "预期效果量化", "timeline": "实施周期"}
      ],
      "predictedEffect": {
        "salesGrowth": "预计全国销量变化率(%)",
        "balanceImprovement": "区域均衡度改善幅度(%)",
        "chargingCoverage": "充电桩覆盖率变化(%)"
      },
      "riskAssessment": {
        "level": "high/medium/low",
        "description": "风险评估描述"
      },
      "stakeholderImpact": {
        "government": "对政府影响",
        "oem": "对车企影响",
        "chargingOp": "对充电运营影响"
      }
    }
  ],
  "overallRecommendation": "综合建议100字以内"
}

确保返回纯JSON，不要包含\`\`\`标记或其他文本。`;

        // Use setTimeout-based timeout for broader Node.js compatibility
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        let response;
        try {
            response = await fetch(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 3000
                }),
                signal: controller.signal
            });
        } finally {
            clearTimeout(timeoutId);
        }

        if (!response.ok) {
            const errText = await response.text().catch(() => '');
            console.error('DeepSeek API HTTP error:', response.status, errText);
            throw new Error('DeepSeek API returned ' + response.status);
        }

        const aiResult = await response.json();

        if (aiResult.choices && aiResult.choices[0]) {
            const content = aiResult.choices[0].message.content;
            try {
                const parsed = JSON.parse(content);
                res.json({ success: true, data: parsed, cached: false });
            } catch (parseErr) {
                // If JSON parsing fails, return raw content
                res.json({ success: true, data: { raw: content, schemes: [] }, cached: false });
            }
        } else {
            // Fallback with pre-built suggestions
            res.json({
                success: true,
                data: getFallbackSuggestions(healthData, preference),
                cached: false,
                fallback: true
            });
        }
    } catch (error) {
        console.error('DeepSeek API error:', error.message);
        // Return fallback data on error
        const healthData = calculateRegionalHealth('2024');
        res.json({
            success: true,
            data: getFallbackSuggestions(healthData, req.body.preference),
            cached: false,
            fallback: true,
            error: 'AI服务暂不可用，已返回预设方案'
        });
    }
});

// Fallback suggestions when AI is unavailable
function getFallbackSuggestions(healthData, preference) {
    const overheated = healthData.filter(d => d.status === 'overheated').map(d => d.name);
    const underdeveloped = healthData.filter(d => d.status === 'underdeveloped').map(d => d.name);
    const ohStr = overheated.length > 0 ? overheated.slice(0, 3).join('、') : '广东、上海、江苏';
    const udStr = underdeveloped.length > 0 ? underdeveloped.slice(0, 3).join('、') : '西藏、青海、甘肃';

    return {
        schemes: [
            {
                name: '区域协同均衡发展方案',
                type: preference === 'aggressive' ? 'aggressive' : 'balanced',
                description: `通过差异化补贴和需求引导，将${ohStr}等过热区域的购车需求有序引导至${udStr}等待扶持区域，实现全国均衡发展。`,
                policies: [
                    { title: '跨区域购车补贴转移', detail: `${ohStr}等过热省份补贴退坡10%，将释放资金定向补贴${udStr}等省份，补贴额度上浮30%`, target: '政府', impact: '待扶持省份销量提升15-20%', timeline: '6个月' },
                    { title: '充电桩建设西进计划', detail: `在${udStr}优先建设高速公路快充走廊和社区慢充网络，目标密度提升50%`, target: '充电运营', impact: '充电覆盖密度提升40%', timeline: '12个月' },
                    { title: '车企渠道下沉激励', detail: `对在待扶持省份新增销售渠道的车企给予双积分奖励加成20%`, target: '车企', impact: '待扶持省份渠道增长30%', timeline: '9个月' },
                    { title: '碳配额跨省交易', detail: `建立新能源碳配额跨省交易市场，允许过热省份向待扶持省份购买碳配额`, target: '政府', impact: '区域碳效率提升12%', timeline: '12个月' }
                ],
                predictedEffect: { salesGrowth: '+8.5%', balanceImprovement: '+15%', chargingCoverage: '+22%' },
                riskAssessment: { level: 'medium', description: '跨省协调难度较大，需中央层面政策推动。执行过程中可能出现地方保护主义反弹。' },
                stakeholderImpact: { government: '短期财政收入下降，长期区域均衡发展', oem: '渠道成本增加，但新市场增量空间大', chargingOp: '西部投资回报周期较长，需政策托底' }
            },
            {
                name: '基础设施先行激活方案',
                type: 'balanced',
                description: `以充电基础设施为抓手，优先在待扶持区域构建完善的充换电网络，从根本上消除消费者购车顾虑。`,
                policies: [
                    { title: '超充走廊建设', detail: `在主要高速服务区间隔50公里建设超充站，覆盖东西部主要通道`, target: '充电运营', impact: '高速充电等待时间降低60%', timeline: '18个月' },
                    { title: '社区充电桩强制配套', detail: `新建住宅小区100%预留充电条件，既有小区改造率达到60%`, target: '政府', impact: '社区充电便利性提升80%', timeline: '24个月' },
                    { title: '换电模式推广', detail: `在公交、出租、物流等营运车辆领域推广换电模式，降低初始购车成本`, target: '车企', impact: '营运车辆电动化率提升35%', timeline: '12个月' },
                    { title: '光储充一体化补贴', detail: `对建设光储充一体化充电站的运营商给予30%建设补贴`, target: '充电运营', impact: '绿色充电占比提升至25%', timeline: '18个月' }
                ],
                predictedEffect: { salesGrowth: '+6.2%', balanceImprovement: '+10%', chargingCoverage: '+35%' },
                riskAssessment: { level: 'low', description: '政策方向明确，风险较低。主要挑战在于建设资金筹措和土地资源协调。' },
                stakeholderImpact: { government: '基建投资拉动GDP，长期收益显著', oem: '基础设施改善直接利好销量', chargingOp: '明确补贴方向，投资意愿增强' }
            },
            {
                name: '市场机制调节方案',
                type: preference === 'conservative' ? 'conservative' : 'aggressive',
                description: `减少行政干预，主要依靠市场化手段（碳交易、积分交易、电价机制）引导资源优化配置。`,
                policies: [
                    { title: '双积分交易市场化', detail: `放开双积分交易价格管制，允许跨年度结转，由市场供需决定积分价格`, target: '政府', impact: '积分交易效率提升40%', timeline: '6个月' },
                    { title: '峰谷电价深化', detail: `拉大充电峰谷价差至3:1，引导用户低谷充电，降低运营成本`, target: '充电运营', impact: '电网负荷均衡度提升25%', timeline: '3个月' },
                    { title: '新能源车险差异化', detail: `基于驾驶行为数据推出UBI车险，降低安全驾驶用户保费支出`, target: '车企', impact: '用车成本降低10-15%', timeline: '12个月' },
                    { title: '电池回收再利用', detail: `建立动力电池回收溯源平台，梯次利用电池用于储能和低速车`, target: '车企', impact: '电池全生命周期成本降低20%', timeline: '18个月' }
                ],
                predictedEffect: { salesGrowth: '+4.8%', balanceImprovement: '+5%', chargingCoverage: '+12%' },
                riskAssessment: { level: 'low', description: '市场化手段见效较慢，但对市场扭曲最小。短期内区域差距可能继续扩大。' },
                stakeholderImpact: { government: '行政成本降低，监管难度减小', oem: '市场化竞争加剧，头部企业受益', chargingOp: '电价机制改善运营效益' }
            }
        ],
        overallRecommendation: `建议综合采用三套方案的优点：短期通过区域协同方案缓解过热问题，中期以基础设施方案夯实待扶持区域基础，长期建立市场化调节机制实现可持续发展。`
    };
}

// ── 5. Policy Simulation ──
router.get('/simulation', (req, res) => {
    try {
        const {
            subsidyLevel = 50,
            purchaseLimit = 50,
            chargingInvestment = 50,
            carbonQuota = 50,
            year = '2024'
        } = req.query;

        const healthData = calculateRegionalHealth(year);
        const avgSales = healthData.reduce((s, d) => s + d.value, 0) / healthData.length;

        // Simulate 12 months forward
        const months = [];
        const baseProjection = [];
        const policyProjection = [];
        const overheatedProjection = [];
        const underdevelopedProjection = [];

        const sl = parseInt(subsidyLevel) / 100;
        const pl = parseInt(purchaseLimit) / 100;
        const ci = parseInt(chargingInvestment) / 100;
        const cq = parseInt(carbonQuota) / 100;

        for (let i = 0; i < 12; i++) {
            const date = new Date(2025, i, 1);
            months.push(`${date.getFullYear()}-${String(i + 1).padStart(2, '0')}`);

            // Base projection (natural growth)
            const seasonal = 1 + Math.sin(i / 3) * 0.06;
            const naturalGrowth = 1 + 0.02 * (1 + i * 0.002);
            const base = avgSales * 12 * naturalGrowth * seasonal;
            baseProjection.push(parseFloat(base.toFixed(1)));

            // Policy-adjusted projection
            const subsidyBoost = sl * 0.08;
            const limitEffect = pl > 0.5 ? -0.02 : 0.03;
            const chargingBoost = ci * 0.05;
            const carbonBoost = cq * 0.03;
            const policyMultiplier = 1 + subsidyBoost + limitEffect + chargingBoost + carbonBoost;
            const policyVal = base * policyMultiplier;
            policyProjection.push(parseFloat(policyVal.toFixed(1)));

            // Overheated provinces: dampened by purchase limits
            const ohDampen = 1 + (sl * 0.04 - pl * 0.06 + 0.015);
            overheatedProjection.push(parseFloat((base * 0.6 * ohDampen * seasonal).toFixed(1)));

            // Underdeveloped provinces: boosted by subsidies and charging
            const udBoost = 1 + (sl * 0.1 + ci * 0.08 + 0.02);
            underdevelopedProjection.push(parseFloat((base * 0.3 * udBoost * seasonal).toFixed(1)));
        }

        // Province-level impact
        const provinceImpact = healthData.map(prov => {
            let multiplier = 1;
            if (prov.status === 'overheated') {
                multiplier = 1 + (sl * -0.03 + pl * -0.05 + ci * 0.02);
            } else if (prov.status === 'underdeveloped') {
                multiplier = 1 + (sl * 0.1 + ci * 0.08 + cq * 0.04);
            } else {
                multiplier = 1 + (sl * 0.04 + ci * 0.03);
            }
            return {
                name: prov.name,
                currentValue: prov.value,
                projectedValue: parseFloat((prov.value * multiplier * 1.15).toFixed(1)),
                change: parseFloat(((multiplier * 1.15 - 1) * 100).toFixed(1)),
                status: prov.status
            };
        });

        // KPI impacts
        const overallGrowth = ((policyProjection[11] / baseProjection[0] - 1) * 100).toFixed(1);
        const balanceChange = (parseInt(subsidyLevel) * 0.15 + parseInt(chargingInvestment) * 0.12 - parseInt(purchaseLimit) * 0.05).toFixed(1);

        res.json({
            success: true,
            data: {
                timeline: { months, baseProjection, policyProjection, overheatedProjection, underdevelopedProjection },
                provinceImpact,
                kpiImpact: {
                    overallGrowth: parseFloat(overallGrowth),
                    balanceImprovement: parseFloat(balanceChange),
                    chargingCoverageBoost: parseFloat((parseInt(chargingInvestment) * 0.4).toFixed(1)),
                    carbonReduction: parseFloat((parseInt(carbonQuota) * 0.35).toFixed(1))
                },
                parameters: {
                    subsidyLevel: parseInt(subsidyLevel),
                    purchaseLimit: parseInt(purchaseLimit),
                    chargingInvestment: parseInt(chargingInvestment),
                    carbonQuota: parseInt(carbonQuota)
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
