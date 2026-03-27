---
title: DeepFM家族
description: ''
date: null
tags: []
category: SearchRec
---
# DeepFM 家族

> 更新日期：2026-03-13
> 相关文档：[Wide&Deep架构](/kb/widedeep) | [DIN与DIEN](/kb/dindien)

---

## 一、DeepFM

### 核心思想

结合 **FM (因子分解机)** 和 **DNN**，自动学习低阶和高阶特征交叉。

```
Wide&Deep: 需要人工设计交叉特征
DeepFM:    自动学习二阶交叉

结构:
输入特征
    │
    ├─→ FM Layer ──┐
    │   (二阶交叉)  │
    └─→ DNN Layer ─┼─→ 联合输出
        (高阶交叉)  │
```

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

        # 一阶部分 (线性)
        # ...

        # 二阶部分
        # 技巧: 2ΣΣ(v_i·v_j * x_i * x_j) = (Σv_i*x_i)^2 - Σ(v_i*x_i)^2
        square_of_sum = torch.sum(embeddings, dim=1) ** 2  # [batch, embed_dim]
        sum_of_square = torch.sum(embeddings ** 2, dim=1)  # [batch, embed_dim]

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

## 二、xDeepFM

### 改进

引入 **CIN (Compressed Interaction Network)**，显式学习高阶交叉。

```
FM: 隐向量内积 (二阶)
CIN: 外积 + 压缩 (任意阶)
```

### CIN 结构

```
第 1 层: 原始特征 X^0
第 2 层: X^0 ⊙ X^1 (外积 + 压缩)
第 3 层: X^0 ⊙ X^2
...
```

---

## 三、面试要点

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

**Q3: 为什么 DeepFM 比只用 DNN 好？**

A:
1. FM 显式建模二阶交叉
2. 低阶和高阶特征互补
3. 训练更稳定

---

## 参考文献

1. Guo et al. "DeepFM: A Factorization-Machine based Neural Network for CTR Prediction". 2017.
2. Lian et al. "xDeepFM: Combining Explicit and Implicit Feature Interactions". 2018.
