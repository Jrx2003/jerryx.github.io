---
title: Wide & Deep 模型
description: ''
date: null
tags: []
category: SearchRec
---
# Wide & Deep 模型

> Google 提出的经典深度学习推荐模型：记忆能力与泛化能力的结合
> 更新日期：2026-03-13

---

## 模型背景

Wide & Deep 模型由 Google 在 2016 年提出，应用于 Google Play 的 App 推荐场景。该模型的核心思想是：**结合记忆能力（Memorization）和泛化能力（Generalization）**。

### 记忆 vs 泛化

| 能力 | 说明 | 典型场景 |
|------|------|----------|
| **记忆 (Memorization)** | 学习历史数据中频繁出现的特征组合 | 用户经常购买咖啡配牛奶 |
| **泛化 (Generalization)** | 学习未出现过的特征组合 | 喜欢咖啡的用户可能喜欢茶 |

### 为什么需要结合

- **Wide 部分（记忆）**：擅长学习规则性、共现性强的特征交叉，但无法处理未出现过的组合
- **Deep 部分（泛化）**：通过 Embedding 学习隐式特征关系，能处理新组合，但可能过度泛化

---

## 模型架构

```
输入特征
    ↓
┌─────────────────────────────────────────────────────────────┐
│                      Wide 部分 (线性)                         │
│  原始特征 + 人工交叉特征 → Linear Model                      │
│  y_wide = w^T x + b                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
                              加权融合 → Sigmoid → 输出
                              ↑
┌─────────────────────────────────────────────────────────────┐
│                      Deep 部分 (非线性)                       │
│  稀疏特征 → Embedding → Concatenate → DNN (MLP)              │
│  a^(l+1) = f(W^(l) a^(l) + b^(l))                           │
└─────────────────────────────────────────────────────────────┘
```

### 数学公式

$$P(Y=1|x) = \sigma(w_{wide}^T [x, \phi(x)] + w_{deep}^T a^{(lf)} + b)$$

其中：
- $x$：原始特征
- $\phi(x)$：人工设计的交叉特征
- $a^{(lf)}$：Deep 网络最后一层输出
- $\sigma$：Sigmoid 函数

---

## Wide 部分详解

### 结构

Wide 部分是一个广义线性模型：

$$y_{wide} = w^T x + b$$

### 特征处理

```python
# Wide 特征：原始特征 + 人工交叉特征
wide_features = [
    # 原始特征
    'user_id',
    'item_id',
    'category',
    'hour_of_day',

    # 人工交叉特征（需要领域知识）
    'user_id_x_category',      # 用户对类目的偏好
    'category_x_hour',         # 类目在不同时段的表现
    'user_id_x_item_id',       # 用户对特定物品的偏好
]
```

### 交叉特征生成

```python
import tensorflow as tf

# 使用 TF 的 crossed_column 生成交叉特征
category_x_hour = tf.feature_column.crossed_column(
    ['category', 'hour_of_day'],
    hash_bucket_size=1000
)

user_x_category = tf.feature_column.crossed_column(
    ['user_id', 'category'],
    hash_bucket_size=10000
)
```

### Wide 部分特点

| 特点 | 说明 |
|------|------|
| 稀疏性 | 使用稀疏特征，大部分权重为0 |
| 可解释性 | 权重直接反映特征重要性 |
| FTRL 优化 | 通常使用 FTRL 优化器处理稀疏特征 |

---

## Deep 部分详解

### 结构

Deep 部分是标准的多层感知机（MLP）：

```
稀疏特征 → Embedding → Concatenate → Dense(128) → ReLU → Dropout
                                              ↓
                                         Dense(64) → ReLU → Dropout
                                              ↓
                                         Dense(32) → Output
```

### 特征处理

```python
# Deep 特征：连续特征 + Embedding 后的类别特征
deep_features = [
    # 连续特征
    'user_age',
    'item_price',
    'user_history_ctr',

    # 类别特征（需要 Embedding）
    'user_id_emb',      # 维度: 32
    'item_id_emb',      # 维度: 32
    'category_emb',     # 维度: 16
    'brand_emb',        # 维度: 16
]
```

### Embedding 层

```python
import tensorflow as tf

# 类别特征 Embedding
user_id_emb = tf.feature_column.embedding_column(
    tf.feature_column.categorical_column_with_hash_bucket('user_id', 100000),
    dimension=32
)

item_id_emb = tf.feature_column.embedding_column(
    tf.feature_column.categorical_column_with_hash_bucket('item_id', 100000),
    dimension=32
)
```

### Deep 部分特点

| 特点 | 说明 |
|------|------|
| 稠密表示 | 将稀疏特征映射为稠密向量 |
| 自动学习 | 自动学习特征间的非线性关系 |
| 泛化能力 | 能处理未出现过的特征组合 |

---

## TensorFlow 实现

### 完整代码

```python
import tensorflow as tf
from tensorflow import feature_column

class WideDeepModel:
    def __init__(self, wide_columns, deep_columns, hidden_units=[128, 64, 32]):
        self.wide_columns = wide_columns
        self.deep_columns = deep_columns
        self.hidden_units = hidden_units

    def build_model(self):
        # 输入层
        feature_inputs = {}
        for col in self.wide_columns + self.deep_columns:
            if isinstance(col, feature_column._VocabularyListCategoricalColumn):
                feature_inputs[col.name] = tf.keras.layers.Input(
                    name=col.name, shape=(1,), dtype=tf.string
                )
            else:
                feature_inputs[col.name] = tf.keras.layers.Input(
                    name=col.name, shape=(1,), dtype=tf.float32
                )

        # Wide 部分
        wide_layer = tf.keras.layers.DenseFeatures(self.wide_columns)(feature_inputs)
        wide_output = tf.keras.layers.Dense(1, activation='linear')(wide_layer)

        # Deep 部分
        deep_layer = tf.keras.layers.DenseFeatures(self.deep_columns)(feature_inputs)
        for unit in self.hidden_units:
            deep_layer = tf.keras.layers.Dense(unit, activation='relu')(deep_layer)
            deep_layer = tf.keras.layers.Dropout(0.3)(deep_layer)
        deep_output = tf.keras.layers.Dense(1, activation='linear')(deep_layer)

        # 融合
        combined = tf.keras.layers.Add()([wide_output, deep_output])
        output = tf.keras.layers.Activation('sigmoid')(combined)

        model = tf.keras.Model(inputs=feature_inputs, outputs=output)
        return model

# 定义特征列
def get_feature_columns():
    # Wide 特征
    wide_columns = [
        # 原始类别特征
        feature_column.categorical_column_with_identity('user_id', 100000),
        feature_column.categorical_column_with_identity('item_id', 100000),

        # 交叉特征
        feature_column.crossed_column(
            ['user_id', 'item_id'], hash_bucket_size=1000000
        ),
        feature_column.crossed_column(
            ['category', 'hour'], hash_bucket_size=1000
        ),
    ]

    # Deep 特征
    deep_columns = [
        # 连续特征
        feature_column.numeric_column('user_age'),
        feature_column.numeric_column('item_price'),
        feature_column.numeric_column('user_history_ctr'),

        # Embedding 特征
        feature_column.embedding_column(
            feature_column.categorical_column_with_identity('user_id', 100000),
            dimension=32
        ),
        feature_column.embedding_column(
            feature_column.categorical_column_with_identity('item_id', 100000),
            dimension=32
        ),
        feature_column.embedding_column(
            feature_column.categorical_column_with_identity('category', 1000),
            dimension=16
        ),
    ]

    return wide_columns, deep_columns

# 构建和训练模型
wide_columns, deep_columns = get_feature_columns()
model_builder = WideDeepModel(wide_columns, deep_columns)
model = model_builder.build_model()

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['AUC', 'Precision', 'Recall']
)

model.fit(train_dataset, epochs=10, validation_data=val_dataset)
```

---

## PyTorch 实现

```python
import torch
import torch.nn as nn

class WideDeep(nn.Module):
    def __init__(self, wide_dim, embed_dims, embed_sizes, deep_dims, dropout=0.3):
        """
        Args:
            wide_dim: Wide 部分输入维度
            embed_dims: Embedding 特征数量
            embed_sizes: 每个 Embedding 的词汇表大小
            deep_dims: Deep 网络各层维度
            dropout: Dropout 比率
        """
        super(WideDeep, self).__init__()

        # Wide 部分
        self.wide = nn.Linear(wide_dim, 1)

        # Embedding 层
        self.embeddings = nn.ModuleList([
            nn.Embedding(size, dim) for size, dim in zip(embed_sizes, embed_dims)
        ])

        # Deep 部分
        deep_input_dim = sum(embed_dims)
        layers = []
        for i in range(len(deep_dims)):
            if i == 0:
                layers.append(nn.Linear(deep_input_dim, deep_dims[i]))
            else:
                layers.append(nn.Linear(deep_dims[i-1], deep_dims[i]))
            layers.append(nn.ReLU())
            layers.append(nn.Dropout(dropout))
        layers.append(nn.Linear(deep_dims[-1], 1))
        self.deep = nn.Sequential(*layers)

    def forward(self, wide_input, embed_inputs):
        """
        Args:
            wide_input: Wide 部分输入 [batch_size, wide_dim]
            embed_inputs: Embedding 输入列表 [batch_size] * len(embeddings)
        """
        # Wide 部分
        wide_out = self.wide(wide_input)

        # Embedding
        embeds = [emb(inp) for emb, inp in zip(self.embeddings, embed_inputs)]
        deep_input = torch.cat(embeds, dim=1)

        # Deep 部分
        deep_out = self.deep(deep_input)

        # 融合
        out = torch.sigmoid(wide_out + deep_out)
        return out

# 使用示例
model = WideDeep(
    wide_dim=100,
    embed_dims=[32, 32, 16],
    embed_sizes=[100000, 100000, 1000],
    deep_dims=[128, 64, 32]
)
```

---

## 训练技巧

### 1. 优化器选择

| 部分 | 推荐优化器 | 原因 |
|------|-----------|------|
| Wide | FTRL | 适合稀疏特征，有L1正则化效果 |
| Deep | Adam/Adagrad | 适合稠密特征的非凸优化 |

```python
# TensorFlow 中使用不同优化器
wide_optimizer = tf.keras.optimizers.Ftrl(learning_rate=0.01)
deep_optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)

model.compile(
    optimizer=[wide_optimizer, deep_optimizer],  # 分别优化
    loss='binary_crossentropy'
)
```

### 2. 特征工程要点

**Wide 部分特征选择：**
- 选择具有强记忆性的特征
- 重要的人工交叉特征
- 规则性强的特征组合

**Deep 部分特征选择：**
- 所有类别特征（Embedding）
- 连续特征
- 不需要人工设计交叉

### 3. 超参数调优

| 超参数 | 建议范围 | 说明 |
|--------|----------|------|
| Embedding 维度 | 16-128 | 根据数据规模和特征数量调整 |
| Deep 层数 | 2-4层 | 太深容易过拟合 |
| Deep 层维度 | 64-512 | 逐层递减 |
| Dropout | 0.2-0.5 | 防止过拟合 |
| 学习率 | 0.0001-0.01 | Wide 通常需要更大学习率 |

---

## 工业实践要点

### 1. 特征设计原则

```python
# Wide 特征：需要人工设计交叉
wide_features = [
    # 强记忆性特征
    'user_id',
    'item_id',

    # 人工交叉（基于业务理解）
    'user_id_x_category',     # 用户对类目的历史偏好
    'category_x_hour',        # 类目在不同时段的CTR差异
    'user_age_x_item_price',  # 年龄段对价格敏感度
]

# Deep 特征：自动学习交叉
deep_features = [
    # 所有类别特征
    'user_id_emb',
    'item_id_emb',
    'category_emb',
    'brand_emb',

    # 连续特征
    'user_age',
    'item_price',
    'user_history_ctr',
]
```

### 2. 在线服务优化

```python
class WideDeepServing:
    """Wide & Deep 在线推理服务"""

    def __init__(self, model_path):
        self.model = tf.saved_model.load(model_path)
        self.feature_cache = FeatureCache()

    def predict(self, user_id, candidate_items):
        # 获取特征
        user_features = self.feature_cache.get_user_features(user_id)

        # 批量预测
        batch_features = []
        for item in candidate_items:
            item_features = self.feature_cache.get_item_features(item)
            features = {**user_features, **item_features}
            batch_features.append(features)

        # 模型预测
        scores = self.model.predict(batch_features)
        return scores
```

### 3. A/B 测试要点

| 测试维度 | 说明 |
|----------|------|
| Wide vs Deep 权重 | 调整两部分输出的权重比例 |
| 特征组合 | 测试不同的交叉特征设计 |
| 网络结构 | Deep 部分的层数和宽度 |

---

## 模型变体

### 1. DeepFM

将 Wide 部分的线性模型替换为 FM，自动学习二阶特征交叉。

详见 [DeepFM 与 xDeepFM](/kb/knowledge-basedeepfm-xdeepfm)

### 2. DCN (Deep & Cross Network)

使用 Cross Network 替代 Wide 部分，自动学习有界阶的特征交叉。

```
Cross Network:
x_{l+1} = x_0 x_l^T w_l + b_l + x_l
```

### 3. xDeepFM

使用 CIN (Compressed Interaction Network) 显式学习高阶特征交叉。

---

## 总结

| 维度 | Wide & Deep |
|------|-------------|
| 核心思想 | 记忆 + 泛化 |
| 优点 | 结合两者优势，可解释性强 |
| 缺点 | Wide 部分需要人工设计交叉特征 |
| 适用场景 | 特征工程经验丰富的团队 |
| 工业应用 | Google Play、YouTube 等 |

---

## 参考文档

- [推荐系统概述](/kb/knowledge-base)
- [DeepFM 与 xDeepFM](/kb/knowledge-basedeepfm-xdeepfm)
- [DIN 与 DIEN](/kb/knowledge-basedin-dien)
