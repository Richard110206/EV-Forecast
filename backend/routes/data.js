const express = require('express');
const router = express.Router();

// 模拟数据生成函数
function generateProvinceData(province) {
    const baseValue = {
        '广东省': { ev_sales: 98.2, charging: 280, oil: 7.8, temp: 22 },
        '江苏省': { ev_sales: 88.4, charging: 250, oil: 7.6, temp: 16 },
        '浙江省': { ev_sales: 78.6, charging: 230, oil: 7.7, temp: 18 },
        '上海市': { ev_sales: 92.7, charging: 320, oil: 7.9, temp: 17 },
        '北京市': { ev_sales: 85.5, charging: 300, oil: 7.8, temp: 12 },
        '山东省': { ev_sales: 72.5, charging: 200, oil: 7.5, temp: 14 },
        '河南省': { ev_sales: 55.8, charging: 150, oil: 7.4, temp: 15 },
        '四川省': { ev_sales: 48.2, charging: 140, oil: 7.6, temp: 16 }
    };

    const defaultBase = { ev_sales: 40, charging: 120, oil: 7.5, temp: 15 };
    const base = baseValue[province] || defaultBase;

    return {
        province: province,
        ev_sales: {
            2019: base.ev_sales * 0.5,
            2020: base.ev_sales * 0.7,
            2021: base.ev_sales * 0.85,
            2022: base.ev_sales * 0.95,
            2023: base.ev_sales
        },
        charging_density: {
            2019: base.charging * 0.4,
            2020: base.charging * 0.6,
            2021: base.charging * 0.75,
            2022: base.charging * 0.9,
            2023: base.charging
        },
        oil_price: {
            2019: 7.2,
            2020: 6.8,
            2021: 7.4,
            2022: 8.1,
            2023: 7.8
        },
        avg_temp: {
            2019: base.temp - 1,
            2020: base.temp,
            2021: base.temp + 0.5,
            2022: base.temp + 1,
            2023: base.temp + 1.5
        }
    };
}

function generateNationalComparison(year, dataType) {
    const provinces = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
        '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省',
        '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省',
        '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省',
        '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'];

    return provinces.map(province => {
        const data = generateProvinceData(province);
        const typeMap = {
            'ev_sales': data.ev_sales[year],
            'charging_density': data.charging_density[year],
            'oil_price': data.oil_price[year],
            'avg_temp': data.avg_temp[year]
        };
        return {
            province: province,
            value: typeMap[dataType] || 0
        };
    }).sort((a, b) => b.value - a.value);
}

// 获取省份数据
router.get('/province/:province', (req, res) => {
    try {
        const province = decodeURIComponent(req.params.province);
        const data = generateProvinceData(province);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 获取全国对比数据
router.get('/comparison', (req, res) => {
    try {
        const { year = '2023', dataType = 'ev_sales' } = req.query;
        const data = generateNationalComparison(year, dataType);
        res.json({
            success: true,
            data: data,
            year: year,
            dataType: dataType
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 获取所有省份列表
router.get('/provinces', (req, res) => {
    const provinces = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
        '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省',
        '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省',
        '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省',
        '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'];

    res.json({
        success: true,
        data: provinces
    });
});

// 获取数据类型列表
router.get('/types', (req, res) => {
    const dataTypes = [
        { id: 'ev_sales', name: '新能源汽车销量', unit: '万辆' },
        { id: 'charging_density', name: '充电桩密度', unit: '个/万人' },
        { id: 'oil_price', name: '省级月度油价', unit: '元/升' },
        { id: 'max_temp', name: '地级市月度最高气温', unit: '℃' },
        { id: 'min_temp', name: '地级市月度最低气温', unit: '℃' },
        { id: 'air_quality', name: '地级市月度空气质量', unit: 'AQI' },
        { id: 'avg_temp', name: '地级市月度平均气温', unit: '℃' },
        { id: 'precipitation', name: '地级市月度降水量', unit: 'mm' }
    ];

    res.json({
        success: true,
        data: dataTypes
    });
});

module.exports = router;
