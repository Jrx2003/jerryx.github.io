---
title: AB 实验与评估
description: ''
date: null
tags: []
category: SearchRec
---
# AB 实验与评估

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 50 分钟

---

## 目录

1. [AB 实验基础](#ab-实验基础)
2. [实验设计](#实验设计)
3. [指标评估](#指标评估)
4. [面试要点](#面试要点)

---

## AB 实验基础

### 什么是 AB 实验

```
AB 实验: 对照实验，比较两组差异

对照组 (Control): 现有方案
实验组 (Treatment): 新方案

目标: 科学评估新方案效果
```

### 关键要素

| 要素 | 说明 |
|------|------|
| 随机分流 | 用户随机分配到各组 |
| 样本量 | 足够的统计功效 |
| 实验时长 | 覆盖完整周期 |
| 指标定义 | 明确的评估指标 |

---

## 实验设计

### 分流策略

```python
def assign_experiment_group(user_id, exp_id, traffic=0.5):
    """
    哈希分流
    """
    hash_val = hash(f"{user_id}_{exp_id}") % 100

    if hash_val < traffic * 100:
        return 'treatment'
    else:
        return 'control'
```

### AA 测试

```
AA 测试: 两组都用现有方案

目的:
- 验证分流均匀
- 检测系统误差
- 建立基线
```

---

## 指标评估

### 统计显著性

```python
def t_test(control_metrics, treatment_metrics):
    """
    t 检验
    """
    from scipy import stats

    t_stat, p_value = stats.ttest_ind(
        treatment_metrics,
        control_metrics
    )

    return p_value < 0.05  # 显著
```

### 常用指标

| 指标 | 说明 |
|------|------|
| CTR | 点击率 |
| CVR | 转化率 |
| GMV | 成交额 |
| 留存率 | 用户留存 |

---

## 面试要点

**Q1: AB 实验的核心原则？**

A:
- 随机分流
- 单一变量
- 足够样本
- 长期观察

**Q2: 如何避免实验偏差？**

A:
- AA 测试验证
- 分层抽样
- 排除新奇效应
- 长期跟踪
