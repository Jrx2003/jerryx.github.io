---
title: DeepFM 与 xDeepFM
description: ''
date: null
tags: []
category: SearchRec
---
# DeepFM 与 xDeepFM

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 45 分钟

---

## 目录

1. [DeepFM 概述](#deepfm-概述)
2. [DeepFM 架构详解](#deepfm-架构详解)
3. [xDeepFM 改进](#xdeepfm-改进)
4. [面试要点](#面试要点)

---

## DeepFM 概述

### 什么是 DeepFM

DeepFM 是华为诺亚方舟实验室于 2017 年提出的模型，结合了 FM（因子分解机）和 DNN 的优点。

```
核心思想:
- FM 部分: 学习低阶特征交叉（二阶）
- Deep 部分: 学习高阶特征交叉（通过 DNN）
- 联合训练: 共享 Embedding，同时优化

优势:
- 不需要人工特征工程
- 同时学习低阶和高阶特征交叉
- 端到端训练
```

### 架构对比

```
Wide & Deep: 需要人工设计交叉特征
DeepFM:      自动学习二阶交叉

结构:
输入特征
    │
    ├─→ FM Layer ──┐
    │   (二阶交叉)  │
    └─→ DNN Layer ─┼─→ 联合输出
        (高阶交叉)  │
```

---

## DeepFM 架构详解

### FM 部分

```python
class FM(nn.Module):
    """因子分解机"""

    def __init__(self, field_dims, embed_dim):
        super().__init__()
        self.embedding = nn.Embedding(sum(field_dims), embed_dim)
        self.offsets = np.cumsum([0] + field_dims[:-1])

    def forward(self, x):
        """
        x: [batch, num_fields]
        FM: Σ(w_i * x_i) + ΣΣ(v_i·v_j * x_i * x_j)
        """
        # Embedding lookup
        x = x + torch.tensor(self.offsets).unsqueeze(0).to(x.device)
        embeddings = self.embedding(x)  # [batch, num_fields, embed_dim]

        # 二阶部分
        # 技巧: 2ΣΣ(v_i·v_j * x_i * x_j) = (Σv_i*x_i)^2 - Σ(v_i*x_i)^2
        square_of_sum = torch.sum(embeddings, dim=1) ** 2
        sum_of_square = torch.sum(embeddings ** 2, dim=1)

        fm_output = 0.5 * torch.sum(square_of_sum - sum_of_square, dim=1, keepdim=True)

        return fm_output
```

### 完整 DeepFM

```python
class DeepFM(nn.Module):
    """DeepFM 模型"""

    def __init__(self, field_dims, embed_dim, mlp_dims):
        super().__init__()

        # FM 部分
        self.fm = FM(field_dims, embed_dim)

        # Deep 部分
        self.embedding = nn.Embedding(sum(field_dims), embed_dim)
        self.offsets = np.cumsum([0] + field_dims[:-1])

        input_dim = len(field_dims) * embed_dim
        mlp_layers = []
        for dim in mlp_dims:
            mlp_layers.extend([
                nn.Linear(input_dim, dim),
                nn.ReLU(),
                nn.Dropout(0.2)
            ])
            input_dim = dim
        mlp_layers.append(nn.Linear(input_dim, 1))
        self.mlp = nn.Sequential(*mlp_layers)

    def forward(self, x):
        # FM 输出
        fm_out = self.fm(x)

        # Deep 输出
        x = x + torch.tensor(self.offsets).unsqueeze(0).to(x.device)
        embeddings = self.embedding(x)
        deep_out = self.mlp(embeddings.view(x.size(0), -1))

        # 联合输出
        output = torch.sigmoid(fm_out + deep_out)
        return output
```

---

## xDeepFM 改进

### xDeepFM 概述

xDeepFM (eXtreme DeepFM) 于 2018 年提出，引入 CIN (Compressed Interaction Network) 显式学习高阶特征交叉。

```
改进点:
- FM: 隐向量内积 (二阶)
- CIN: 外积 + 压缩 (任意阶)
```

### CIN 结构

```
第 1 层: 原始特征 X^0
第 2 层: X^0 ⊙ X^1 (外积 + 压缩)
第 3 层: X^0 ⊙ X^2
...
```

---

## 面试要点

### 高频问题

**Q1: DeepFM vs Wide&Deep？**

A:
| 维度 | DeepFM | Wide&Deep |
|------|--------|-----------|
| 特征交叉 | 自动学习 | 人工设计 |
| 低阶建模 | FM | 线性 |
| 实现难度 | 简单 | 中等 |

**Q2: FM 的时间复杂度？**

A: O(n×k)，n 是特征数，k 是隐向量维度。通过公式转换实现线性复杂度。

---

## 相关文档

- [Wide & Deep 模型](/kb/wide-deep) - Google 经典架构
- [DIN 与 DIEN](/kb/din-dien) - 注意力机制
