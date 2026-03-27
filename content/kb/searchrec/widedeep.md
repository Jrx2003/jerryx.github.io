---
title: Wide&Deep架构
description: ''
date: null
tags: []
category: SearchRec
---
# Wide & Deep 架构

> 更新日期：2026-03-13
> 相关文档：[DeepFM家族](/kb/deepfm) | [DIN与DIEN](/kb/dindien) | [评估指标体系](/kb/)

---

## 一、Wide & Deep 概述

### 背景

2016年，Google 在论文《Wide & Deep Learning for Recommender Systems》中提出，是深度学习推荐系统的开山之作。

### 核心思想

结合**记忆能力**（Wide部分）和**泛化能力**（Deep部分）：

```
输入特征
    │
    ├───────────────┬───────────────┐
    │               │               │
    ▼               ▼               ▼
┌─────────┐   ┌──────────┐   ┌──────────┐
│ 原始特征 │   │ 交叉特征 │   │  稠密特征 │
│         │   │(Cross)   │   │Embedding │
└────┬────┘   └────┬─────┘   └────┬─────┘
     │              │              │
     │              │              ▼
     │              │         ┌──────────┐
     │              │         │  Hidden  │
     │              │         │  Layers  │
     │              │         └────┬─────┘
     │              │              │
     │              ▼              ▼
     │         ┌─────────────────────────┐
     └────────→│       Wide Part        │
               │     (Linear Model)     │
               └───────────┬─────────────┘
                           │
               ┌───────────▼─────────────┐
               │       Deep Part        │
               │       (MLP)            │
               └───────────┬─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ 联合训练输出  │
                    └──────────────┘
```

---

## 二、Wide 部分

### 作用

**记忆能力**：学习特征之间的精确关系，记住历史数据中的规则。

### 实现

```python
class WidePart(nn.Module):
    """Wide 部分：线性模型 + 交叉特征"""

    def __init__(self, wide_dim):
        super().__init__()
        self.linear = nn.Linear(wide_dim, 1)

    def forward(self, x_wide):
        """
        x_wide: [batch, wide_dim]
        包括原始稀疏特征和交叉特征
        """
        return self.linear(x_wide)
```

### 交叉特征

```python
def create_cross_features(features, cross_pairs):
    """
    创建交叉特征

    features: dict, 特征名到值的映射
    cross_pairs: list of tuples, 需要交叉的特征对
    """
    cross_features = []
    for feat_a, feat_b in cross_pairs:
        # 特征交叉 (如: gender=male & age=20-30)
        cross_name = f"{feat_a}_x_{feat_b}"
        cross_value = f"{features[feat_a]}_{features[feat_b]}"
        cross_features.append((cross_name, cross_value))
    return cross_features
```

### Wide 特征示例

| 特征类型 | 示例 | 说明 |
|----------|------|------|
| 原始特征 | user_id, item_id | 独热编码 |
| 交叉特征 | gender_x_age | 性别与年龄组合 |
| 统计特征 | item_ctr | 历史点击率 |

---

## 三、Deep 部分

### 作用

**泛化能力**：学习低维稠密特征的非线性关系，推广到未出现过的组合。

### 实现

```python
class DeepPart(nn.Module):
    """Deep 部分：Embedding + MLP"""

    def __init__(self, field_dims, embed_dim, mlp_dims, dropout=0.2):
        super().__init__()

        # Embedding 层
        self.embedding = nn.ModuleList([
            nn.Embedding(dim, embed_dim) for dim in field_dims
        ])

        # 计算输入维度
        self.embed_output_dim = len(field_dims) * embed_dim

        # MLP
        layers = []
        input_dim = self.embed_output_dim
        for dim in mlp_dims:
            layers.append(nn.Linear(input_dim, dim))
            layers.append(nn.ReLU())
            layers.append(nn.Dropout(dropout))
            input_dim = dim
        layers.append(nn.Linear(input_dim, 1))

        self.mlp = nn.Sequential(*layers)

    def forward(self, x_deep):
        """
        x_deep: [batch, num_fields]
        """
        # Embedding lookup
        embeddings = []
        for i, emb_layer in enumerate(self.embedding):
            embeddings.append(emb_layer(x_deep[:, i]))

        # 拼接所有 embedding
        x = torch.cat(embeddings, dim=1)  # [batch, num_fields * embed_dim]

        # MLP
        return self.mlp(x)
```

### Deep 特征

| 特征类型 | 示例 | 说明 |
|----------|------|------|
| 类别特征 | user_id, item_id | Embedding |
| 连续特征 | price, age | 归一化后输入 |
| 文本特征 | title | 预训练 Embedding |

---

## 四、完整模型

```python
class WideDeep(nn.Module):
    """Wide & Deep 完整模型"""

    def __init__(
        self,
        wide_dim,           # Wide 部分输入维度
        field_dims,         # 各字段的维度 (用于 Embedding)
        embed_dim=16,       # Embedding 维度
        mlp_dims=[256, 128, 64],  # MLP 隐藏层
        dropout=0.2
    ):
        super().__init__()

        self.wide = WidePart(wide_dim)
        self.deep = DeepPart(field_dims, embed_dim, mlp_dims, dropout)

    def forward(self, x_wide, x_deep):
        """
        x_wide: [batch, wide_dim]
        x_deep: [batch, num_fields]
        """
        wide_out = self.wide(x_wide)      # [batch, 1]
        deep_out = self.deep(x_deep)      # [batch, 1]

        # 联合输出
        output = torch.sigmoid(wide_out + deep_out)
        return output

    def predict(self, x_wide, x_deep):
        """预测"""
        self.eval()
        with torch.no_grad():
            prob = self.forward(x_wide, x_deep)
        return prob
```

---

## 五、训练技巧

### 联合训练

```python
def train_wide_deep(model, train_loader, optimizer, criterion, epochs=10):
    """训练 Wide & Deep"""

    for epoch in range(epochs):
        model.train()
        total_loss = 0

        for batch in train_loader:
            x_wide, x_deep, labels = batch

            # 前向传播
            predictions = model(x_wide, x_deep).squeeze()

            # 计算损失
            loss = criterion(predictions, labels.float())

            # 反向传播
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        print(f"Epoch {epoch+1}, Loss: {total_loss/len(train_loader):.4f}")
```

### 优化器选择

| 部分 | 推荐优化器 | 学习率 |
|------|-----------|--------|
| Wide | FTRL | 较小 (0.001) |
| Deep | Adam | 较大 (0.001-0.01) |

```python
# 不同部分使用不同优化器
wide_params = model.wide.parameters()
deep_params = model.deep.parameters()

optimizer = torch.optim.SGD([
    {'params': wide_params, 'lr': 0.001},
    {'params': deep_params, 'lr': 0.01}
])
```

---

## 六、特征工程

### Wide 特征设计

```python
# Wide 特征：需要记忆的规则
wide_features = [
    # 高阶交叉特征
    'user_type_x_item_category',
    'gender_x_age_group_x_item_type',

    # 高频组合
    'user_id_x_item_id',  # 用户-物品对

    # 统计特征
    'item_7d_ctr',
    'user_30d_click_rate',
]
```

### Deep 特征设计

```python
# Deep 特征：需要泛化的特征
deep_features = [
    # 用户画像
    'user_id',           # Embedding
    'age',               # 连续或分桶
    'gender',            # Embedding

    # 物品画像
    'item_id',           # Embedding
    'category_id',       # Embedding
    'price',             # 连续特征

    # 上下文
    'hour',              # 时间
    'day_of_week',       # 星期
]
```

---

## 七、工业实践

### Google Play 应用

| 组件 | 实现细节 |
|------|----------|
| Wide | 用户已安装应用与候选应用的交叉 |
| Deep | 用户画像、应用特征的 Embedding |
| 效果 | 应用获取率提升 3.9% |

### 改进方向

| 改进 | 方法 |
|------|------|
| **特征交叉自动化** | DeepFM, xDeepFM |
| **序列建模** | DIN, DIEN |
| **多任务** | 共享 Deep 部分 |

---

## 八、面试要点

### 高频问题

**Q1: Wide 和 Deep 各解决什么问题？**

A:
- **Wide**: 记忆能力，记住历史数据中的频繁模式
- **Deep**: 泛化能力，学习未出现过的特征组合

**Q2: 为什么 Wide 用 FTRL，Deep 用 Adam？**

A:
- **Wide**: 稀疏特征，FTRL 对稀疏数据效果好
- **Deep**: 稠密特征，Adam 自适应学习率，收敛快

**Q3: Wide & Deep 的特征如何划分？**

A:
| 特征 | 归属 | 原因 |
|------|------|------|
| 交叉特征 | Wide | 需要精确记忆 |
| 稠密向量 | Deep | 需要泛化学习 |
| 统计特征 | Wide/Deep | 视情况而定 |

**Q4: Wide & Deep 与 DeepFM 的区别？**

A:
| 维度 | Wide & Deep | DeepFM |
|------|-------------|--------|
| 特征交叉 | 人工设计 | 自动学习 (FM) |
| Wide 部分 | 线性 | FM 二阶交叉 |
| 实现复杂度 | 中等 | 简单 |

---

## 相关文档

- [DeepFM家族](/kb/deepfm) - 自动特征交叉
- [DIN与DIEN](/kb/dindien) - 注意力机制
- [MMoE与多任务学习](/kb/mmoe) - 多任务扩展

---

## 参考文献

1. Cheng et al. "Wide & Deep Learning for Recommender Systems". 2016.
