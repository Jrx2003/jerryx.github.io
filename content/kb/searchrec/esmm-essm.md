---
title: ESMM 与 ESSM
description: ''
date: null
tags: []
category: SearchRec
---
# ESMM 与 ESSM

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 高级
> **预计阅读时间**: 45 分钟

---

## 目录

1. [ESMM 概述](#esmm-概述)
2. [样本选择偏差问题](#样本选择偏差问题)
3. [ESMM 架构](#esmm-架构)
4. [ESSM 改进](#essm-改进)
5. [面试要点](#面试要点)

---

## ESMM 概述

### 什么是 ESMM

ESMM (Entire Space Multi-Task Model) 是阿里巴巴提出的多任务学习框架，解决 CVR 预估中的样本选择偏差问题。

```
核心思想:
- CVR = CTR × CTCVR
- 在全空间 (曝光空间) 建模
- 消除样本选择偏差
```

---

## 样本选择偏差问题

### 问题描述

```
CVR 训练数据: 点击样本
CVR 预测场景: 曝光样本

偏差:
- 训练分布 ≠ 预测分布
- 高点击率和低点击率物品特征不同
```

---

## ESMM 架构

### 模型结构

```
输入特征
    │
    ├─→ Embedding 共享
    │
    ├─→ CTR 塔 → pCTR
    │
    └─→ CTCVR 塔 → pCTCVR

CVR = pCTCVR / pCTR
```

### 实现

```python
class ESMM(nn.Module):
    def __init__(self, feature_dims, embed_dim):
        super().__init__()
        self.embedding = nn.Embedding(sum(feature_dims), embed_dim)

        # CTR 塔
        self.ctr_tower = nn.Sequential(
            nn.Linear(embed_dim * len(feature_dims), 128),
            nn.ReLU(),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

        # CTCVR 塔
        self.ctcvr_tower = nn.Sequential(
            nn.Linear(embed_dim * len(feature_dims), 128),
            nn.ReLU(),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        # 共享 embedding
        embedded = self.embedding(x).view(x.size(0), -1)

        # CTR 预测
        pctr = self.ctr_tower(embedded)

        # CTCVR 预测
        pctcvr = self.ctcvr_tower(embedded)

        # CVR = CTCVR / CTR
        pcvr = pctcvr / (pctr + 1e-8)

        return pctr, pcvr, pctcvr
```

---

## ESSM 改进

### ESSM 特点

ESSM (Entire Space Supervised Multi-task) 进一步优化。

```
改进点:
- 更好的特征共享
- 更稳定的训练
- 支持更多任务
```

---

## 面试要点

**Q1: ESMM 解决了什么问题？**

A:
样本选择偏差问题，CVR 训练和预测分布不一致。

**Q2: CVR 和 CTCVR 的关系？**

A:
CTCVR = CTR × CVR，表示曝光后转化的概率。

**Q3: ESMM 的优势？**

A:
- 消除样本选择偏差
- 全空间建模
- 利用所有曝光数据
