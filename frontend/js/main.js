/* =========================================================
   NEV MONITORING CENTER - MAIN DASHBOARD LOGIC
   ========================================================= */

// ── GLOBAL STATE ──
let mapChart = null;
let salesBarChart = null;
let salesPieChart = null;
let chargeBarChart = null;
let chargePieChart = null;
let trendChart = null;
let currentYear = '2024';
let currentMonth = 12;
let currentMetric = 'ev_sales';

// ── COLOR PALETTE ──
const CYAN = '#00f0ff';
const TEAL = '#00d4aa';
const ORANGE = '#ff6b35';
const RED = '#ff3d5a';
const GREEN = '#00ff88';
const PURPLE = '#a855f7';
const YELLOW = '#fbbf24';
const PINK = '#f472b6';

// ── METRIC CONFIG ──
const METRIC_CONFIG = {
    ev_sales:     { name: '新能源汽车销量', unit: '万辆',   mapTitle: '全国新能源销量热力分布' },
    charging:     { name: '充电桩密度',     unit: '个/万人', mapTitle: '全国充电桩密度热力分布' },
    oil_price:    { name: '省级月度油价',   unit: '元/升',   mapTitle: '全国油价热力分布' },
    air_quality:  { name: '空气质量指数',   unit: 'AQI',     mapTitle: '全国空气质量热力分布' },
    avg_temp:     { name: '平均气温',       unit: '℃',      mapTitle: '全国平均气温热力分布' },
    precipitation:{ name: '月度降水量',     unit: 'mm',      mapTitle: '全国降水量热力分布' }
};

// ── REGIONAL GROUPING ──
const REGION_MAP = {
    '华东': ['上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省'],
    '华南': ['广东省', '广西壮族自治区', '海南省'],
    '华北': ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区'],
    '华中': ['河南省', '湖北省', '湖南省'],
    '西南': ['重庆市', '四川省', '贵州省', '云南省', '西藏自治区'],
    '西北': ['陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'],
    '东北': ['辽宁省', '吉林省', '黑龙江省']
};

const REGION_COLORS = {
    '华东': CYAN, '华南': TEAL, '华北': PURPLE,
    '华中': ORANGE, '西南': GREEN, '西北': YELLOW, '东北': PINK
};

// ── PROVINCE DATA (2019-2024) ──
const provincesDataByYear = {
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

// ── PROVINCE CENTERS (for map 3D bars) ──
const provinceCenters = {
    '北京市': [116.4, 39.9], '天津市': [117.2, 39.1], '河北省': [114.5, 38.0],
    '山西省': [112.5, 37.9], '内蒙古自治区': [111.7, 40.8], '辽宁省': [123.4, 41.8],
    '吉林省': [125.3, 43.8], '黑龙江省': [126.7, 45.7], '上海市': [121.5, 31.2],
    '江苏省': [118.8, 32.1], '浙江省': [120.2, 30.3], '安徽省': [117.2, 31.8],
    '福建省': [119.3, 26.1], '江西省': [115.9, 28.7], '山东省': [117.1, 36.7],
    '河南省': [113.7, 34.7], '湖北省': [114.3, 30.6], '湖南省': [113.0, 28.2],
    '广东省': [113.3, 23.1], '广西壮族自治区': [108.3, 22.8], '海南省': [110.3, 20.0],
    '重庆市': [106.6, 29.6], '四川省': [104.1, 30.6], '贵州省': [106.7, 26.6],
    '云南省': [102.7, 25.0], '西藏自治区': [91.1, 29.6], '陕西省': [109.0, 34.3],
    '甘肃省': [103.8, 36.1], '青海省': [101.8, 36.6], '宁夏回族自治区': [106.3, 38.5],
    '新疆维吾尔自治区': [87.6, 43.8]
};

// ── MULTI-INDICATOR DATA GENERATION ──
// Seasonal multipliers per month (index 0=Jan)
const SEASONAL = {
    ev_sales:      [0.7, 0.65, 0.85, 0.95, 1.0, 1.1, 0.95, 1.05, 1.15, 1.0, 1.1, 1.3],
    charging:      [1.0, 1.0, 1.05, 1.05, 1.1, 1.1, 1.15, 1.15, 1.1, 1.05, 1.05, 1.0],
    oil_price:     [7.2, 7.1, 7.3, 7.5, 7.6, 7.8, 8.0, 8.1, 7.9, 7.7, 7.5, 7.4],
    air_quality:   [85, 78, 72, 65, 58, 52, 48, 45, 55, 62, 70, 80],
    avg_temp:      [-2, 2, 8, 16, 22, 28, 32, 30, 24, 16, 8, 0],
    precipitation: [5, 10, 25, 50, 80, 120, 160, 140, 90, 55, 25, 8]
};

// Provincial multiplier offsets per indicator (some provinces higher/lower)
const PROVINCE_OFFSETS = {
    charging: {
        '北京市': 3.2, '上海市': 3.5, '天津市': 2.8, '广东省': 2.5,
        '浙江省': 2.6, '江苏省': 2.4, '福建省': 2.2, '山东省': 1.8,
        '重庆市': 2.0, '湖北省': 1.9, '安徽省': 1.7, '河南省': 1.5,
        '四川省': 1.6, '湖南省': 1.7, '陕西省': 1.8, '辽宁省': 1.9,
        '江西省': 1.6, '广西壮族自治区': 1.4, '云南省': 1.3,
        '山西省': 1.5, '河北省': 1.4, '贵州省': 1.2, '吉林省': 1.6,
        '黑龙江省': 1.3, '内蒙古自治区': 1.1, '海南省': 1.8,
        '甘肃省': 1.0, '新疆维吾尔自治区': 0.9, '宁夏回族自治区': 1.2,
        '青海省': 1.1, '西藏自治区': 0.8
    },
    oil_price: {
        '北京市': 1.05, '上海市': 1.08, '广东省': 1.06, '西藏自治区': 1.15,
        '海南省': 1.04, '甘肃省': 0.97, '新疆维吾尔自治区': 0.98
    },
    air_quality: {
        '北京市': 0.85, '河北省': 1.1, '山东省': 0.95, '河南省': 1.05,
        '四川省': 0.9, '云南省': 0.75, '海南省': 0.7, '广东省': 0.85,
        '内蒙古自治区': 0.92, '新疆维吾尔自治区': 0.95, '辽宁省': 0.98
    },
    avg_temp: {
        '海南省': 1.6, '广东省': 1.4, '广西壮族自治区': 1.3, '云南省': 1.25,
        '西藏自治区': 0.7, '黑龙江省': 0.55, '吉林省': 0.6, '内蒙古自治区': 0.65,
        '新疆维吾尔自治区': 0.75, '青海省': 0.7
    },
    precipitation: {
        '广东省': 1.5, '广西壮族自治区': 1.4, '海南省': 1.6, '福建省': 1.5,
        '浙江省': 1.4, '江西省': 1.4, '湖南省': 1.3, '贵州省': 1.2,
        '四川省': 1.2, '云南省': 1.3, '新疆维吾尔自治区': 0.3, '甘肃省': 0.35,
        '内蒙古自治区': 0.3, '宁夏回族自治区': 0.3, '青海省': 0.25,
        '西藏自治区': 0.5, '黑龙江省': 0.6, '吉林省': 0.7, '辽宁省': 0.8
    }
};

// Generate data for a specific metric + year + month
function generateMetricData(metric, year, month) {
    const baseData = provincesDataByYear[year];
    const monthIdx = month - 1;

    return baseData.map(item => {
        let value;
        if (metric === 'ev_sales') {
            value = item.value * SEASONAL.ev_sales[monthIdx] / 12;
        } else if (metric === 'charging') {
            const offset = (PROVINCE_OFFSETS.charging[item.name] || 1.0);
            value = item.value * offset * SEASONAL.charging[monthIdx] * 0.08;
        } else if (metric === 'oil_price') {
            const offset = (PROVINCE_OFFSETS.oil_price[item.name] || 1.0);
            value = SEASONAL.oil_price[monthIdx] * offset;
        } else if (metric === 'air_quality') {
            const offset = (PROVINCE_OFFSETS.air_quality[item.name] || 1.0);
            value = SEASONAL.air_quality[monthIdx] * offset;
        } else if (metric === 'avg_temp') {
            const offset = (PROVINCE_OFFSETS.avg_temp[item.name] || 1.0);
            value = SEASONAL.avg_temp[monthIdx] * offset;
        } else if (metric === 'precipitation') {
            const offset = (PROVINCE_OFFSETS.precipitation[item.name] || 1.0);
            value = SEASONAL.precipitation[monthIdx] * offset * (0.9 + Math.random() * 0.2);
        } else {
            value = item.value;
        }
        return { name: item.name, value: parseFloat(value.toFixed(2)) };
    });
}

// ── REGIONAL AGGREGATION ──
function aggregateByRegion(data) {
    const result = [];
    for (const [region, provinces] of Object.entries(REGION_MAP)) {
        const total = provinces.reduce((sum, p) => {
            const item = data.find(d => d.name === p);
            return sum + (item ? item.value : 0);
        }, 0);
        result.push({ name: region, value: parseFloat(total.toFixed(2)) });
    }
    return result;
}

// ── SHARED ECHARTS THEME ──
const TOOLTIP_STYLE = {
    backgroundColor: 'rgba(10, 18, 42, 0.95)',
    borderColor: 'rgba(0, 240, 255, 0.25)',
    borderWidth: 1,
    textStyle: { color: '#e8edf5', fontSize: 12, fontFamily: "'Noto Sans SC', sans-serif" },
    extraCssText: 'box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); border-radius: 4px;'
};

// ── CLOCK ──
function updateClock() {
    const now = new Date();
    const timeEl = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('zh-CN', { hour12: false });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// ── KPI UPDATE ──
function updateKPIs(metric, year, month) {
    const data = generateMetricData(metric, year, month);
    const config = METRIC_CONFIG[metric];
    const total = data.reduce((s, d) => s + d.value, 0).toFixed(1);
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const top = sorted[0];

    document.getElementById('kpi-sales-num').textContent = total;
    document.getElementById('kpi-top-name').textContent = top.name;
    document.getElementById('kpi-top-val').textContent = top.value + ' ' + config.unit;

    // Growth calc
    const yearNum = parseInt(year);
    const prevYear = (yearNum - 1).toString();
    if (provincesDataByYear[prevYear]) {
        const prevData = generateMetricData(metric, prevYear, month);
        const prevTotal = prevData.reduce((s, d) => s + d.value, 0);
        const growth = prevTotal > 0 ? ((total - prevTotal) / prevTotal * 100).toFixed(1) : '--';
        const isUp = parseFloat(growth) >= 0;
        document.getElementById('kpi-growth-val').textContent = (isUp ? '+' : '') + growth + '%';
        document.getElementById('kpi-growth-val').style.color = isUp ? '#00ff88' : '#ff3d5a';
        document.getElementById('kpi-growth-label').textContent = '同比去年';
        document.getElementById('kpi-growth-label').className = 'kpi-trend ' + (isUp ? 'up' : 'down');
        document.getElementById('kpi-sales-trend').textContent = (isUp ? '↑ +' : '↓ ') + Math.abs(growth) + '% YoY';
        document.getElementById('kpi-sales-trend').className = 'kpi-trend ' + (isUp ? 'up' : 'down');
    } else {
        document.getElementById('kpi-growth-val').textContent = '--';
        document.getElementById('kpi-growth-label').textContent = '基准年份';
        document.getElementById('kpi-sales-trend').textContent = '';
    }

    // Second KPI: charging density
    const chargeData = generateMetricData('charging', year, month);
    const avgCharge = (chargeData.reduce((s, d) => s + d.value, 0) / chargeData.length).toFixed(1);
    document.getElementById('kpi-charge-num').textContent = avgCharge;
    document.getElementById('kpi-charge-trend').textContent = year === '2024' ? 'CNN 预测值' : '实时数据';

    // Update overlay info text
    document.getElementById('overlay-current-info').innerHTML =
        '当前：<strong>' + config.name + '</strong> (' + config.unit + ')';

    // Update map panel title
    document.getElementById('map-panel-title').textContent = config.mapTitle;
}

// ── LEFT BAR CHART (TOP10 of selected metric) ──
function updateLeftBar(metric, year, month) {
    const data = generateMetricData(metric, year, month);
    const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 10).reverse();
    const names = sorted.map(d => d.name.replace(/(省|市|壮族自治区|维吾尔自治区|回族自治区|自治区)/, ''));
    const values = sorted.map(d => d.value);
    const maxVal = Math.max(...values);
    const config = METRIC_CONFIG[metric];
    const accentColor = metric === 'charging' ? TEAL : CYAN;

    // Multi-color gradient per bar rank
    const BAR_GRADIENTS = [
        ['#ff1a6e', '#ff4a3a'], // 1st - red/pink
        ['#ff6b35', '#f5a623'], // 2nd - orange
        ['#fbbf24', '#c0d810'], // 3rd - yellow-green
        ['#40b840', '#00d4aa'], // 4th - green
        ['#00c4a0', '#00f0ff'], // 5th - teal-cyan
        ['#00f0ff', '#00b8d4'], // 6th - cyan
        ['#a855f7', '#7c3aed'], // 7th - purple
        ['#6366f1', '#818cf8'], // 8th - indigo
        ['#4a5a7a', '#64748b'], // 9th - slate
        ['#334155', '#475569']  // 10th - dark slate
    ];

    const option = {
        tooltip: {
            ...TOOLTIP_STYLE,
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: p => `<div style="font-size:13px">${p[0].name}</div>${config.name}：<b style="color:${accentColor};font-size:15px">${p[0].value}</b> ${config.unit}`
        },
        grid: { left: 8, right: 65, top: 8, bottom: 8, containLabel: true },
        xAxis: { type: 'value', show: false, max: maxVal * 1.15 },
        yAxis: {
            type: 'category', data: names,
            axisLine: { show: false }, axisTick: { show: false },
            axisLabel: { color: '#a0b4d0', fontSize: 11, fontWeight: 500 }
        },
        series: [{
            type: 'bar', data: values, barWidth: '60%',
            itemStyle: {
                borderRadius: [0, 4, 4, 0],
                color: function (params) {
                    const grad = BAR_GRADIENTS[params.dataIndex] || ['#4a5a7a', '#64748b'];
                    return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: grad[0] + '33' },
                        { offset: 1, color: grad[1] }
                    ]);
                }
            },
            label: { show: true, position: 'right', color: '#c8d4e8', fontSize: 11, fontWeight: 600, formatter: '{c}' },
            emphasis: { itemStyle: { shadowBlur: 16, shadowColor: 'rgba(0, 240, 255, 0.35)' } }
        }],
        animationDuration: 800, animationEasing: 'cubicOut'
    };
    salesBarChart.setOption(option, true);
}

// ── LEFT PIE CHART (regional breakdown of selected metric) ──
function updateLeftPie(metric, year, month) {
    const data = generateMetricData(metric, year, month);
    const regionData = aggregateByRegion(data);
    const config = METRIC_CONFIG[metric];

    const option = {
        tooltip: {
            ...TOOLTIP_STYLE, trigger: 'item',
            formatter: p => `<div style="font-size:13px">${p.name}</div>${config.name}：<b style="color:${REGION_COLORS[p.name] || '#00f0ff'};font-size:15px">${p.value}</b> ${config.unit} (${p.percent}%)`
        },
        series: [{
            type: 'pie', radius: ['20%', '72%'], center: ['50%', '50%'],
            roseType: 'area',
            avoidLabelOverlap: true,
            itemStyle: { borderColor: '#0a0e27', borderWidth: 3, borderRadius: 6 },
            label: { color: '#a0b4d0', fontSize: 11, fontWeight: 500, formatter: '{b}\n{d}%', lineHeight: 16 },
            labelLine: { lineStyle: { color: 'rgba(123,141,181,0.4)', width: 1.5 }, length: 12, length2: 16 },
            emphasis: {
                label: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
                itemStyle: { shadowBlur: 24, shadowColor: 'rgba(0, 0, 0, 0.5)' }
            },
            data: regionData.map(d => ({
                name: d.name, value: d.value,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                        { offset: 0, color: (REGION_COLORS[d.name] || CYAN) },
                        { offset: 1, color: (REGION_COLORS[d.name] || CYAN) + '88' }
                    ])
                }
            })),
            animationType: 'scale', animationDuration: 1000, animationEasing: 'elasticOut'
        }]
    };
    salesPieChart.setOption(option, true);
}

// ── RIGHT BAR CHART (charging TOP10) ──
function updateRightBar(year, month) {
    const data = generateMetricData('charging', year, month);
    const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 10).reverse();
    const names = sorted.map(d => d.name.replace(/(省|市|壮族自治区|维吾尔自治区|回族自治区|自治区)/, ''));
    const values = sorted.map(d => d.value);
    const maxVal = Math.max(...values);

    const CHARGE_GRADIENTS = [
        ['#00ff88', '#00d4aa'],
        ['#00d4aa', '#00b8d4'],
        ['#00f0ff', '#0090ff'],
        ['#6366f1', '#a855f7'],
        ['#c026d3', '#e879f9'],
        ['#f472b6', '#fb7185'],
        ['#ff6b35', '#fbbf24'],
        ['#c0d810', '#40b840'],
        ['#4a5a7a', '#64748b'],
        ['#334155', '#475569']
    ];

    const option = {
        tooltip: {
            ...TOOLTIP_STYLE, trigger: 'axis', axisPointer: { type: 'shadow' },
            formatter: p => `<div style="font-size:13px">${p[0].name}</div>密度：<b style="color:#00d4aa;font-size:15px">${p[0].value}</b> 个/万人`
        },
        grid: { left: 8, right: 75, top: 8, bottom: 8, containLabel: true },
        xAxis: { type: 'value', show: false, max: maxVal * 1.15 },
        yAxis: {
            type: 'category', data: names,
            axisLine: { show: false }, axisTick: { show: false },
            axisLabel: { color: '#a0b4d0', fontSize: 11, fontWeight: 500 }
        },
        series: [{
            type: 'bar', data: values, barWidth: '60%',
            itemStyle: {
                borderRadius: [0, 4, 4, 0],
                color: function (params) {
                    const grad = CHARGE_GRADIENTS[params.dataIndex] || ['#4a5a7a', '#64748b'];
                    return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: grad[0] + '33' },
                        { offset: 1, color: grad[1] }
                    ]);
                }
            },
            label: { show: true, position: 'right', color: '#c8d4e8', fontSize: 11, fontWeight: 600, formatter: '{c}' },
            emphasis: { itemStyle: { shadowBlur: 16, shadowColor: 'rgba(0, 212, 170, 0.35)' } }
        }],
        animationDuration: 800, animationEasing: 'cubicOut'
    };
    chargeBarChart.setOption(option, true);
}

// ── RIGHT PIE CHART (charging regional) ──
function updateRightPie(year, month) {
    const data = generateMetricData('charging', year, month);
    const regionData = aggregateByRegion(data);

    const option = {
        tooltip: {
            ...TOOLTIP_STYLE, trigger: 'item',
            formatter: p => `<div style="font-size:13px">${p.name}</div>密度总量：<b style="color:${REGION_COLORS[p.name] || '#00d4aa'};font-size:15px">${p.value.toFixed(0)}</b> (${p.percent}%)`
        },
        series: [{
            type: 'pie', radius: ['20%', '72%'], center: ['50%', '50%'],
            roseType: 'area',
            avoidLabelOverlap: true,
            itemStyle: { borderColor: '#0a0e27', borderWidth: 3, borderRadius: 6 },
            label: { color: '#a0b4d0', fontSize: 11, fontWeight: 500, formatter: '{b}\n{d}%', lineHeight: 16 },
            labelLine: { lineStyle: { color: 'rgba(123,141,181,0.4)', width: 1.5 }, length: 12, length2: 16 },
            emphasis: {
                label: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
                itemStyle: { shadowBlur: 24, shadowColor: 'rgba(0, 0, 0, 0.5)' }
            },
            data: regionData.map(d => ({
                name: d.name, value: d.value,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                        { offset: 0, color: (REGION_COLORS[d.name] || TEAL) },
                        { offset: 1, color: (REGION_COLORS[d.name] || TEAL) + '88' }
                    ])
                }
            })),
            animationType: 'scale', animationDuration: 1000, animationEasing: 'elasticOut'
        }]
    };
    chargePieChart.setOption(option, true);
}

// ── TREND LINE CHART ──
function updateTrendChart() {
    const years = ['2019', '2020', '2021', '2022', '2023', '2024'];
    const totals = years.map(y => {
        return generateMetricData(currentMetric, y, currentMonth).reduce((s, d) => s + d.value, 0).toFixed(1);
    });

    const option = {
        tooltip: {
            ...TOOLTIP_STYLE, trigger: 'axis',
            formatter: p => `<div style="font-size:13px">${p[0].axisValue}</div>全国${METRIC_CONFIG[currentMetric].name}：<b style="color:#00f0ff;font-size:15px">${p[0].value}</b> ${METRIC_CONFIG[currentMetric].unit}`
        },
        grid: { left: 8, right: 20, top: 20, bottom: 5, containLabel: true },
        xAxis: {
            type: 'category', data: years,
            axisLine: { lineStyle: { color: 'rgba(0,240,255,0.2)', width: 1 } },
            axisTick: { show: false },
            axisLabel: { color: '#a0b4d0', fontSize: 12, fontWeight: 500, formatter: v => v + '年' }
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { color: 'rgba(0,240,255,0.08)' } },
            axisLine: { show: false }, axisTick: { show: false },
            axisLabel: { color: '#7b8db5', fontSize: 11 }
        },
        series: [{
            type: 'line', data: totals, smooth: true, symbol: 'circle', symbolSize: 10,
            lineStyle: {
                width: 4,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: '#00f0ff' }, { offset: 0.4, color: '#a855f7' }, { offset: 0.7, color: '#ff6b35' }, { offset: 1, color: '#ff1a6e' }
                ])
            },
            itemStyle: { color: '#00f0ff', borderColor: '#0a0e27', borderWidth: 3 },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(0, 240, 255, 0.35)' },
                    { offset: 0.4, color: 'rgba(168, 85, 247, 0.15)' },
                    { offset: 0.7, color: 'rgba(255, 107, 53, 0.06)' },
                    { offset: 1, color: 'rgba(255, 26, 110, 0.0)' }
                ])
            },
            emphasis: { itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0, 240, 255, 0.8)', borderColor: '#00f0ff', borderWidth: 4 } },
            markPoint: {
                data: [
                    { type: 'max', symbol: 'pin', symbolSize: 44, label: { fontSize: 11, color: '#fff', fontWeight: 600, formatter: '{c}' }, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#a855f7' }, { offset: 1, color: '#ff1a6e' }] } } },
                    { type: 'min', symbol: 'pin', symbolSize: 40, label: { fontSize: 10, color: '#fff', fontWeight: 600, formatter: '{c}' }, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#0090ff' }, { offset: 1, color: '#00f0ff' }] } } }
                ]
            },
            markLine: {
                silent: true,
                lineStyle: { color: 'rgba(0, 240, 255, 0.15)', type: 'dashed', width: 1 },
                label: { show: false },
                data: [{ type: 'average', name: '平均值' }]
            }
        }],
        animationDuration: 1200, animationEasing: 'cubicOut'
    };
    trendChart.setOption(option, true);
}

// ── 3D CHINA MAP ──
function getMapOptions(metric, year, month) {
    const data = generateMetricData(metric, year, month);
    const config = METRIC_CONFIG[metric];
    const maxVal = Math.max(...data.map(d => d.value));
    const minVal = Math.min(...data.map(d => d.value));

    // Rich multi-hue color ramp: dark blue -> teal -> green -> yellow -> orange -> red
    const HEAT_COLORS = [
        '#0b1a3e', '#0d2f5e', '#0e4478', '#0a5e7a', '#0d7a6e',
        '#1a9e5a', '#40b840', '#80cc20', '#c0d810', '#e8c800',
        '#f5a623', '#ff7832', '#ff4a3a', '#e82050', '#ff1a6e'
    ];

    function getColor(val) {
        const r = (val - minVal) / (maxVal - minVal);
        const idx = Math.min(Math.floor(r * (HEAT_COLORS.length - 1)), HEAT_COLORS.length - 2);
        return HEAT_COLORS[idx];
    }

    const mapData = data.map(item => ({
        name: item.name,
        value: item.value,
        itemStyle: { color: getColor(item.value), opacity: 0.92 }
    }));

    // 3D bars - taller and wider
    const bar3DData = [];
    data.forEach(item => {
        const coords = provinceCenters[item.name];
        if (coords) {
            const ratio = (item.value - minVal) / (maxVal - minVal);
            bar3DData.push({
                name: item.name,
                value: [coords[0], coords[1], 0.5 + ratio * 10],
                itemStyle: { color: getColor(item.value), opacity: 0.88 }
            });
        }
    });

    return {
        backgroundColor: 'transparent',
        tooltip: {
            ...TOOLTIP_STYLE, trigger: 'item',
            formatter: function (params) {
                const item = data.find(d => d.name === params.name);
                if (!item) return params.name;
                return `<div style="padding:6px 8px"><b style="font-size:15px">${params.name}</b><br/>${config.name}：<b style="color:#00f0ff;font-size:18px">${item.value}</b> ${config.unit}</div>`;
            }
        },
        visualMap: {
            show: true, min: minVal, max: maxVal,
            left: 8, bottom: 30,
            orient: 'vertical',
            text: ['高', '低'],
            textStyle: { color: '#a0b4d0', fontSize: 11 },
            calculable: true,
            itemWidth: 14, itemHeight: 120,
            inRange: { color: HEAT_COLORS }
        },
        geo3D: {
            map: 'china', roam: true,
            boxDepth: 80, regionHeight: 3,
            itemStyle: { opacity: 0.95, borderWidth: 1.2, borderColor: 'rgba(0, 240, 255, 0.4)' },
            light: {
                main: { intensity: 1.4, shadow: true, shadowQuality: 'high', alpha: 30, beta: 20 },
                ambient: { intensity: 0.4 },
                ambientCubemap: { exposure: 1.2, diffuseIntensity: 0.6 }
            },
            viewControl: {
                autoRotate: false, distance: 100, alpha: 40, beta: 2,
                minAlpha: 5, maxAlpha: 80, minBeta: -80, maxBeta: 80,
                animation: true, animationDurationUpdate: 800, damping: 0.85,
                rotateSensitivity: 1.5, zoomSensitivity: 1.2
            },
            groundPlane: { show: false },
            label: { show: false },
            emphasis: {
                itemStyle: { color: '#00f0ff', opacity: 1 },
                label: {
                    show: true, formatter: '{b}',
                    textStyle: { color: '#fff', fontSize: 14, backgroundColor: 'rgba(0,0,0,0.65)', padding: [5, 10], borderRadius: 4 }
                }
            },
            shading: 'realistic',
            realisticMaterial: { roughness: 0.4, metalness: 0.15 },
            postEffect: {
                enable: true,
                bloom: { enable: true, bloomIntensity: 0.12 },
                SSAO: { enable: true, radius: 3, intensity: 1.2 },
                depthOfField: { enable: false }
            },
            temporalSuperSampling: { enable: true }
        },
        series: [
            { type: 'map3D', coordinateSystem: 'geo3D', data: mapData },
            {
                type: 'bar3D', coordinateSystem: 'geo3D', data: bar3DData,
                shading: 'realistic', barSize: 1.6, bevelSize: 0.4,
                itemStyle: { opacity: 0.85 },
                emphasis: { itemStyle: { opacity: 1 } },
                label: { show: false }
            }
        ]
    };
}

function initMap() {
    fetch('js/china.json')
        .then(res => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(chinaJson => {
            echarts.registerMap('china', chinaJson);
            const container = document.getElementById('china-map');
            if (!container) return;

            // CRITICAL: Use setTimeout to ensure DOM has laid out and container has actual dimensions
            setTimeout(() => {
                mapChart = echarts.init(container);
                mapChart.setOption(getMapOptions(currentMetric, currentYear, currentMonth));
                window.addEventListener('resize', () => { if (mapChart) mapChart.resize(); });
            }, 100);
        })
        .catch(err => {
            console.error('Map load failed:', err);
            const container = document.getElementById('china-map');
            if (container) {
                container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#ff3d5a;font-size:14px;">地图数据加载失败，请刷新重试</div>';
            }
        });
}

// ── UPDATE ALL ──
function updateAll() {
    updateKPIs(currentMetric, currentYear, currentMonth);
    updateLeftBar(currentMetric, currentYear, currentMonth);
    updateLeftPie(currentMetric, currentYear, currentMonth);
    updateRightBar(currentYear, currentMonth);
    updateRightPie(currentYear, currentMonth);
    updateTrendChart();
    if (mapChart) {
        mapChart.setOption(getMapOptions(currentMetric, currentYear, currentMonth), true);
    }
}

// ── INITIALIZATION ──
document.addEventListener('DOMContentLoaded', function () {
    // Clock
    updateClock();
    setInterval(updateClock, 1000);

    // Init all chart instances
    salesBarChart = echarts.init(document.getElementById('sales-bar-chart'));
    salesPieChart = echarts.init(document.getElementById('sales-pie-chart'));
    chargeBarChart = echarts.init(document.getElementById('charge-bar-chart'));
    chargePieChart = echarts.init(document.getElementById('charge-pie-chart'));
    trendChart = echarts.init(document.getElementById('trend-line-chart'));

    // Load map & render everything
    initMap();

    // Initial render (non-map charts can render immediately)
    setTimeout(() => { updateAll(); }, 200);

    // Year selector
    document.getElementById('year-select').addEventListener('change', function (e) {
        currentYear = e.target.value;
        updateAll();
    });

    // Month selector
    document.getElementById('month-select').addEventListener('change', function (e) {
        currentMonth = parseInt(e.target.value);
        updateAll();
    });

    // Metric selector
    document.getElementById('metric-select').addEventListener('change', function (e) {
        currentMetric = e.target.value;
        updateAll();
    });

    // Map controls
    document.getElementById('reset-view-btn').addEventListener('click', function () {
        if (mapChart) {
            mapChart.setOption({ geo3D: { viewControl: { alpha: 30, beta: 5, distance: 120 } } });
        }
    });

    document.getElementById('download-map-btn').addEventListener('click', function () {
        if (mapChart) {
            const url = mapChart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#050a1a' });
            const a = document.createElement('a');
            a.download = '新能源汽车数据_' + currentYear + '年' + currentMonth + '月.png';
            a.href = url;
            a.click();
        }
    });

    // Update time
    document.getElementById('update-time').textContent = '最后更新：' + new Date().toLocaleString('zh-CN');

    // Responsive resize for all charts
    window.addEventListener('resize', function () {
        if (salesBarChart) salesBarChart.resize();
        if (salesPieChart) salesPieChart.resize();
        if (chargeBarChart) chargeBarChart.resize();
        if (chargePieChart) chargePieChart.resize();
        if (trendChart) trendChart.resize();
    });
});
