"""
数据生成脚本
生成2019-2023年各省份数据
"""
import json
import random
from datetime import datetime

provinces = [
    '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
    '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省',
    '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省',
    '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省',
    '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'
]

data_types = [
    'ev_sales',           # 新能源汽车销量
    'charging_density',   # 充电桩密度
    'oil_price',          # 油价
    'max_temp',           # 最高气温
    'min_temp',           # 最低气温
    'air_quality',        # 空气质量
    'avg_temp',           # 平均气温
    'precipitation'       # 降水量
]

def generate_province_data(province):
    """为单个省份生成数据"""
    # 基础值（根据省份经济水平设定）
    base_values = {
        '广东省': {'ev': 98, 'charge': 280},
        '江苏省': {'ev': 88, 'charge': 250},
        '浙江省': {'ev': 78, 'charge': 230},
        '上海市': {'ev': 92, 'charge': 320},
        '北京市': {'ev': 85, 'charge': 300},
        '山东省': {'ev': 72, 'charge': 200},
        '河南省': {'ev': 55, 'charge': 150},
        '四川省': {'ev': 48, 'charge': 140}
    }

    base = base_values.get(province, {'ev': 40, 'charge': 120})

    data = {
        'province': province,
        'years': {}
    }

    # 为2019-2023每年生成数据
    for year in range(2019, 2024):
        year_data = {}

        # 新能源汽车销量（万辆）
        year_factor = (year - 2018) * 0.15 + 0.5  # 年增长因子
        year_data['ev_sales'] = round(base['ev'] * year_factor * random.uniform(0.9, 1.1), 2)

        # 充电桩密度（个/万人）
        year_data['charging_density'] = round(base['charge'] * year_factor * random.uniform(0.9, 1.1), 0)

        # 油价（元/升）
        year_data['oil_price'] = round(random.uniform(6.5, 8.5), 2)

        # 气温数据（℃）
        year_data['avg_temp'] = round(random.uniform(10, 25), 1)
        year_data['max_temp'] = round(year_data['avg_temp'] + random.uniform(10, 15), 1)
        year_data['min_temp'] = round(year_data['avg_temp'] - random.uniform(10, 15), 1)

        # 空气质量（AQI）
        year_data['air_quality'] = round(random.uniform(40, 120), 0)

        # 降水量（mm）
        year_data['precipitation'] = round(random.uniform(50, 200), 1)

        data['years'][str(year)] = year_data

    return data

def main():
    """生成所有省份数据"""
    print("正在生成数据...")

    all_data = {
        'generated_at': datetime.now().isoformat(),
        'provinces': {}
    }

    for province in provinces:
        all_data['provinces'][province] = generate_province_data(province)
        print(f"✓ {province}")

    # 保存数据
    output_file = 'backend/data/province_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    print(f"\n数据已生成并保存到: {output_file}")
    print(f"共生成 {len(provinces)} 个省份数据")

if __name__ == '__main__':
    main()
