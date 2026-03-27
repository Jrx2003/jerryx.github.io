---
title: Python编程基础
description: ''
date: null
tags: []
category: Quant
---
# Python编程基础

> 量化金融的核心工具——从零开始学习Python

---

## 为什么选择Python？

### Python的优势

| 优势 | 说明 |
|------|------|
| **简单易学** | 语法接近英语，适合初学者 |
| **生态丰富** | 有pandas、numpy等专业库 |
| **社区活跃** | 遇到问题容易找到答案 |
| **应用广泛** | 量化、数据分析、机器学习通用 |

### Python在量化中的角色
- **数据获取**：从各种API获取金融数据
- **数据处理**：清洗、转换、分析数据
- **策略实现**：编写交易逻辑
- **回测验证**：测试策略历史表现
- **可视化**：绘制图表、展示结果

---

## 环境搭建

### 安装Anaconda（推荐）
Anaconda是Python的发行版，包含了数据科学常用的库。

**下载**：https://www.anaconda.com/download

**安装后验证**：
```bash
python --version
# 应显示 Python 3.x.x
```

### 使用Jupyter Notebook
Jupyter是交互式编程环境，非常适合数据探索。

**启动方式**：
```bash
jupyter notebook
```

**界面说明**：
- 单元格（Cell）：输入代码的地方
- 运行：Shift + Enter 执行当前单元格
- 保存：Ctrl + S

---

## Python基础语法

### 1. 变量与数据类型

```python
# 数字
price = 100.5          # 浮点数
quantity = 100         # 整数

# 字符串
stock_name = "AAPL"    # 股票代码

# 列表（有序集合）
prices = [100, 101, 102, 99, 98]

# 字典（键值对）
stock = {
    "code": "AAPL",
    "price": 150.5,
    "volume": 1000000
}

# 布尔值
is_rising = True       # 或 False
```

### 2. 基本运算

```python
# 算术运算
a = 10
b = 3

print(a + b)    # 13 (加法)
print(a - b)    # 7  (减法)
print(a * b)    # 30 (乘法)
print(a / b)    # 3.333... (除法)
print(a // b)   # 3  (整除)
print(a % b)    # 1  (取余)
print(a ** b)   # 1000 (幂运算)

# 复合运算
total = 0
total += 10     # total = total + 10
```

### 3. 条件语句

```python
price = 150

# if-else
if price > 200:
    print("高价股")
elif price > 100:
    print("中价股")    # 会执行这里
else:
    print("低价股")

# 逻辑运算符
if price > 100 and price < 200:
    print("价格在100-200之间")
```

### 4. 循环

```python
# for循环
prices = [100, 101, 102, 99, 98]

for price in prices:
    print(f"当前价格: {price}")

# while循环
count = 0
while count < 5:
    print(f"计数: {count}")
    count += 1

# range函数
for i in range(5):      # 0, 1, 2, 3, 4
    print(i)
```

### 5. 函数

```python
# 定义函数
def calculate_return(initial, final):
    """计算收益率"""
    return (final - initial) / initial

# 使用函数
ret = calculate_return(100, 110)
print(f"收益率: {ret:.2%}")    # 收益率: 10.00%

# 带默认参数的函数
def calculate_sharpe(returns, risk_free_rate=0.02):
    """计算夏普比率（简化版）"""
    excess_return = sum(returns) / len(returns) - risk_free_rate
    volatility = (sum((r - sum(returns)/len(returns))**2 for r in returns) / len(returns)) ** 0.5
    return excess_return / volatility
```

---

## NumPy基础

NumPy是Python数值计算的核心库，提供了高效的多维数组操作。

### 安装与导入
```python
import numpy as np
```

### 创建数组
```python
# 从列表创建
prices = np.array([100, 101, 102, 99, 98])

# 创建特定数组
zeros = np.zeros(5)           # [0, 0, 0, 0, 0]
ones = np.ones(5)             # [1, 1, 1, 1, 1]
range_arr = np.arange(0, 10, 2)   # [0, 2, 4, 6, 8]

# 二维数组（矩阵）
returns = np.array([
    [0.01, 0.02, -0.01],
    [0.02, -0.01, 0.01],
    [-0.01, 0.01, 0.02]
])
```

### 数组运算
```python
prices = np.array([100, 101, 102, 99, 98])

# 基本运算
print(prices + 10)        # 每个元素加10
print(prices * 2)         # 每个元素乘2
print(prices ** 2)        # 每个元素平方

# 统计运算
print(np.mean(prices))    # 平均值
print(np.std(prices))     # 标准差
print(np.max(prices))     # 最大值
print(np.min(prices))     # 最小值
print(np.sum(prices))     # 求和

# 收益率计算
prices = np.array([100, 102, 99, 105, 103])
returns = np.diff(prices) / prices[:-1]   # [0.02, -0.0294, 0.0606, -0.0190]
```

---

## Pandas基础

Pandas是Python数据分析的主力库，提供了DataFrame数据结构。

### 安装与导入
```python
import pandas as pd
```

### Series（一维数据）
```python
# 创建Series
prices = pd.Series([100, 101, 102, 99, 98],
                   index=['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'])

print(prices)
# 2024-01-01    100
# 2024-01-02    101
# ...

# 访问数据
print(prices['2024-01-01'])      # 100
print(prices[0])                  # 100 (位置索引)
print(prices.mean())              # 平均值
```

### DataFrame（二维数据）
```python
# 创建DataFrame
data = {
    'date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
    'open': [100, 101, 102, 99, 98],
    'close': [101, 102, 99, 98, 100],
    'volume': [10000, 12000, 9000, 11000, 10500]
}

df = pd.DataFrame(data)
print(df)

# 查看数据
print(df.head(3))         # 前3行
print(df.tail(2))         # 后2行
print(df.info())          # 数据信息
print(df.describe())      # 统计描述

# 选择列
print(df['close'])        # 选择close列
print(df['open', 'close'](/kb/open-close))  # 选择多列

# 选择行
print(df.iloc[0])         # 第1行（位置索引）
print(df.iloc[0:3])       # 前3行

# 条件筛选
high_volume = df[df['volume'] > 10000]
print(high_volume)
```

### 数据操作
```python
# 添加新列
df['return'] = (df['close'] - df['open']) / df['open']

# 排序
df_sorted = df.sort_values('volume', ascending=False)

# 分组统计
df.groupby(df['date'].str[:7])['volume'].mean()   # 按月统计平均成交量

# 缺失值处理
df.dropna()               # 删除缺失值
df.fillna(0)              # 填充缺失值
```

---

## 实战：计算股票收益率

```python
import pandas as pd
import numpy as np

# 模拟股票数据
data = {
    'date': pd.date_range('2024-01-01', periods=20, freq='B'),  # 20个交易日
    'close': [100, 102, 101, 103, 105, 104, 106, 108, 107, 109,
              110, 108, 109, 111, 113, 112, 114, 115, 114, 116]
}

df = pd.DataFrame(data)

# 计算日收益率
df['daily_return'] = df['close'].pct_change()

# 计算累计收益率
df['cumulative_return'] = (1 + df['daily_return']).cumprod() - 1

# 计算移动平均
df['ma5'] = df['close'].rolling(window=5).mean()
df['ma10'] = df['close'].rolling(window=10).mean()

# 统计指标
print("日收益率统计:")
print(f"平均日收益: {df['daily_return'].mean():.4f}")
print(f"日收益标准差: {df['daily_return'].std():.4f}")
print(f"夏普比率(简化): {df['daily_return'].mean() / df['daily_return'].std():.4f}")

print("\n累计收益率:", f"{df['cumulative_return'].iloc[-1]:.2%}")

print("\n最后5行数据:")
print(df.tail())
```

---

## 练习

### 练习1：基础计算
计算给定价格序列的简单收益率和对数收益率。

```python
prices = [100, 102, 99, 105, 103, 107, 106]

# 你的代码
# 1. 计算简单收益率
# 2. 计算对数收益率（提示：np.log）
# 3. 计算平均收益率和波动率
```

### 练习2：DataFrame操作
创建一个包含多只股票的数据框，计算每只股票的统计指标。

```python
# 你的代码
# 1. 创建包含AAPL、GOOGL、MSFT的DataFrame
# 2. 每只股票的日收益率
# 3. 计算每只股票的平均收益、波动率、最大回撤
```

### 练习3：策略回测框架
编写一个简单的双均线策略回测。

```python
# 你的代码
# 1. 计算5日和20日移动平均线
# 2. 当5日均线上穿20日均线时买入
# 3. 当5日均线下穿20日均线时卖出
# 4. 计算策略收益
```

---

## 下一步

- [pandas与数据处理](/kb/pandas) - 深入学习数据处理
- [numpy与数值计算](/kb/numpy) - 高效数值运算
- [向量化计算](/kb/) - 提升代码效率

---

**学习资源**：
- 《Python编程：从入门到实践》
- 《Python for Data Analysis》（pandas作者）
- pandas官方文档: https://pandas.pydata.org/docs/
