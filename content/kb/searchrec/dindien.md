---
title: DIN与DIEN
description: ''
date: null
tags: []
category: SearchRec
---
# DIN 与 DIEN

> 更新日期：2026-03-13
> 相关文档：[Wide&Deep架构](/kb/widedeep) | [DeepFM家族](/kb/deepfm) | [序列推荐基础](/kb/)

---

## 一、DIN 深度兴趣网络

### 背景

2018年，阿里巴巴提出 DIN (Deep Interest Network)，解决传统模型对用户历史行为"等权对待"的问题。

### 核心问题

```
传统方法 (如 Wide&Deep):
用户历史: [item_A, item_B, item_C, item_D]
处理: sum/mean pooling → 固定长度向量
问题: 不同物品对当前候选物品的重要性相同

DIN 解决方案:
根据候选物品动态计算历史物品的权重
```

### 注意力机制

```
候选物品 ──→┐
             ├──→ Attention ──→ 加权历史表示
历史物品 ──→┘

注意力权重 = f(候选物品, 历史物品)
```

### 代码实现

```python
class DIN(nn.Module):
    """深度兴趣网络"""

    def __init__(self, feature_dims, embed_dim, mlp_dims, max_hist_len=50):
        super().__init__()
        self.max_hist_len = max_hist_len
        self.embed_dim = embed_dim

        # Embedding 层
        self.user_embeddings = nn.Embedding(feature_dims['user_id'], embed_dim)
        self.item_embeddings = nn.Embedding(feature_dims['item_id'], embed_dim)
        self.category_embeddings = nn.Embedding(feature_dims['category_id'], embed_dim)

        # 注意力层
        self.attention = AttentionLayer(embed_dim * 2)

        # MLP
        input_dim = embed_dim * 5  # user + candidate + weighted_hist + other
        self.mlp = self._build_mlp(input_dim, mlp_dims)

    def forward(self, user_ids, candidate_items, hist_items, hist_len):
        """
        user_ids: [batch]
        candidate_items: [batch]
        hist_items: [batch, max_hist_len]
        hist_len: [batch] 实际历史长度
        """
        batch_size = user_ids.size(0)

        # Embedding lookup
        user_emb = self.user_embeddings(user_ids)  # [batch, embed_dim]
        candidate_emb = self.item_embeddings(candidate_items)  # [batch, embed_dim]
        hist_emb = self.item_embeddings(hist_items)  # [batch, max_hist_len, embed_dim]

        # 计算注意力权重
        # 扩展候选物品维度
        candidate_expanded = candidate_emb.unsqueeze(1).expand(-1, self.max_hist_len, -1)

        # 拼接历史物品和候选物品
        attention_input = torch.cat([hist_emb, candidate_expanded], dim=-1)
        # [batch, max_hist_len, embed_dim * 2]

        # 计算注意力权重
        attention_weights = self.attention(attention_input, hist_len)
        # [batch, max_hist_len]

        # 加权历史物品
        weighted_hist = torch.bmm(
            attention_weights.unsqueeze(1),  # [batch, 1, max_hist_len]
            hist_emb  # [batch, max_hist_len, embed_dim]
        ).squeeze(1)  # [batch, embed_dim]

        # 拼接所有特征
        concat_features = torch.cat([
            user_emb,
            candidate_emb,
            weighted_hist,
            user_emb * candidate_emb,  # 交互特征
            user_emb - candidate_emb   # 差异特征
        ], dim=1)

        # MLP
        output = self.mlp(concat_features)
        return torch.sigmoid(output)


class AttentionLayer(nn.Module):
    """注意力层"""

    def __init__(self, input_dim, hidden_dim=36):
        super().__init__()
        self.mlp = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1)
        )

    def forward(self, x, hist_len):
        """
        x: [batch, max_hist_len, input_dim]
        hist_len: [batch] 实际长度
        """
        # 计算注意力分数
        scores = self.mlp(x).squeeze(-1)  # [batch, max_hist_len]

        # Mask 掉 padding 位置
        mask = torch.arange(x.size(1)).unsqueeze(0).to(x.device)
        mask = mask < hist_len.unsqueeze(1)  # [batch, max_hist_len]
        scores = scores.masked_fill(~mask, -1e9)

        # Softmax
        attention_weights = F.softmax(scores, dim=1)

        return attention_weights
```

---

## 二、DIEN 深度兴趣演化网络

### 背景

2019年，阿里巴巴提出 DIEN (Deep Interest Evolution Network)，在 DIN 基础上引入**兴趣演化**机制。

### 核心创新

```
DIN: 注意力机制捕捉兴趣相关性
DIEN:
  ├── 兴趣抽取 (GRU)
  └── 兴趣演化 (AUGRU) ← 引入注意力门控
```

### 架构

```
用户历史序列
    │
    ▼
┌──────────────┐
│   Embedding   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    GRU        │  ← 兴趣抽取层
│  (捕捉时序)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   AUGRU       │  ← 兴趣演化层 (注意力更新门)
│ (关注与候选  │
│  相关的兴趣) │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    MLP        │
└──────┬───────┘
       │
       ▼
     输出
```

### 代码实现

```python
class DIEN(nn.Module):
    """深度兴趣演化网络"""

    def __init__(self, feature_dims, embed_dim, hidden_dim=64, mlp_dims=[200, 80]):
        super().__init__()
        self.hidden_dim = hidden_dim
        self.embed_dim = embed_dim

        # Embedding
        self.item_embedding = nn.Embedding(feature_dims['item_id'], embed_dim)

        # GRU 兴趣抽取
        self.interest_extractor = nn.GRU(
            input_size=embed_dim,
            hidden_size=hidden_dim,
            batch_first=True
        )

        # AUGRU 兴趣演化
        self.interest_evolution = AUGRU(
            input_size=hidden_dim,
            hidden_size=hidden_dim
        )

        # MLP
        input_dim = hidden_dim + embed_dim * 3
        self.mlp = self._build_mlp(input_dim, mlp_dims)

    def forward(self, user_ids, candidate_items, hist_items, hist_len):
        batch_size = user_ids.size(0)
        max_len = hist_items.size(1)

        # Embedding
        candidate_emb = self.item_embedding(candidate_items)
        hist_emb = self.item_embedding(hist_items)

        # 1. 兴趣抽取 (GRU)
        packed_hist = nn.utils.rnn.pack_padded_sequence(
            hist_emb, hist_len.cpu(), batch_first=True, enforce_sorted=False
        )
        hist_output, _ = self.interest_extractor(packed_hist)
        hist_output, _ = nn.utils.rnn.pad_packed_sequence(hist_output, batch_first=True)
        # hist_output: [batch, max_len, hidden_dim]

        # 2. 计算注意力权重 (用于 AUGRU)
        # 计算每个历史物品与候选物品的注意力
        candidate_expanded = candidate_emb.unsqueeze(1).expand(-1, max_len, -1)
        attention_input = torch.cat([hist_output, candidate_expanded], dim=-1)

        attention_scores = torch.sum(
            attention_input * torch.tanh(self.attention_vector),
            dim=-1
        )  # [batch, max_len]

        # Mask
        mask = torch.arange(max_len).unsqueeze(0).to(hist_items.device)
        mask = mask < hist_len.unsqueeze(1)
        attention_scores = attention_scores.masked_fill(~mask, -1e9)
        attention_weights = F.softmax(attention_scores, dim=1)

        # 3. 兴趣演化 (AUGRU)
        final_interest = self.interest_evolution(
            hist_output, attention_weights, hist_len
        )

        # 4. 拼接特征
        concat_features = torch.cat([
            final_interest,
            candidate_emb,
            hist_output[:, -1],  # 最后一步兴趣
            candidate_emb * final_interest  # 交互
        ], dim=1)

        output = self.mlp(concat_features)
        return torch.sigmoid(output)


class AUGRU(nn.Module):
    """
    Attention Update Gate GRU
    在 GRU 的更新门中引入注意力权重
    """

    def __init__(self, input_size, hidden_size):
        super().__init__()
        self.hidden_size = hidden_size

        # GRU 参数
        self.W_z = nn.Linear(input_size + hidden_size, hidden_size)
        self.W_r = nn.Linear(input_size + hidden_size, hidden_size)
        self.W_h = nn.Linear(input_size + hidden_size, hidden_size)

    def forward(self, x, attention_weights, seq_len):
        """
        x: [batch, seq_len, input_size]
        attention_weights: [batch, seq_len]
        """
        batch_size = x.size(0)
        max_len = x.size(1)

        h = torch.zeros(batch_size, self.hidden_size).to(x.device)

        for t in range(max_len):
            # 当前输入
            x_t = x[:, t, :]

            # 计算门
            z_t = torch.sigmoid(self.W_z(torch.cat([x_t, h], dim=1)))
            r_t = torch.sigmoid(self.W_r(torch.cat([x_t, h], dim=1)))

            # 候选隐藏状态
            h_tilde = torch.tanh(
                self.W_h(torch.cat([x_t, r_t * h], dim=1))
            )

            # 注意力更新门: a_t * z_t
            a_t = attention_weights[:, t].unsqueeze(1)
            update_gate = a_t * z_t

            # 更新隐藏状态
            h = (1 - update_gate) * h + update_gate * h_tilde

        return h
```

---

## 三、DIN vs DIEN 对比

| 维度 | DIN | DIEN |
|------|-----|------|
| **核心** | 注意力机制 | 注意力 + 时序建模 |
| **兴趣表示** | 静态加权 | 动态演化 |
| **模型复杂度** | 中等 | 较高 |
| **训练速度** | 快 | 较慢 |
| **效果** | 好 | 更好 |
| **适用场景** | 一般推荐 | 序列推荐 |

---

## 四、工业实践

### 阿里巴巴广告系统

| 指标 | 提升 |
|------|------|
| CTR | +3.5% |
| RPM | +6.8% |

### 优化技巧

```python
# 1. 使用 Dice 激活函数替代 ReLU
class Dice(nn.Module):
    """自适应激活函数"""

    def __init__(self, num_features):
        super().__init__()
        self.bn = nn.BatchNorm1d(num_features)
        self.alpha = nn.Parameter(torch.zeros(num_features))

    def forward(self, x):
        normalized = self.bn(x)
        p = torch.sigmoid(normalized)
        return p * x + (1 - p) * self.alpha * x

# 2. 辅助损失 (DIEN)
def auxiliary_loss(hist_output, hist_items, neg_items):
    """
    辅助损失：预测下一个点击的物品
    帮助 GRU 学习更好的兴趣表示
    """
    # 正样本
    pos_score = torch.sum(hist_output[:, :-1] * hist_items[:, 1:], dim=-1)
    # 负样本
    neg_score = torch.sum(hist_output[:, :-1] * neg_items, dim=-1)

    # BPR 损失
    loss = -torch.log(torch.sigmoid(pos_score - neg_score) + 1e-8)
    return loss.mean()
```

---

## 五、面试要点

### 高频问题

**Q1: DIN 的注意力机制与传统 Attention 的区别？**

A:
- **传统 Attention**: Query 是模型参数
- **DIN Attention**: Query 是候选物品，随样本变化
- **目的**: 捕捉用户对不同候选物品的不同兴趣

**Q2: DIEN 中 AUGRU 的作用？**

A:
1. 建模兴趣随时间的演化
2. 注意力门控关注与候选物品相关的兴趣变化
3. 避免无关历史信息的干扰

**Q3: 为什么需要辅助损失？**

A:
- GRU 学习的是隐藏表示，没有直接的监督信号
- 辅助损失让 GRU 学习预测下一个点击
- 帮助提取更好的兴趣表示

**Q4: DIN/DIEN 适合什么场景？**

A:
- **DIN**: 有丰富用户历史行为的场景
- **DIEN**: 用户兴趣随时间变化的场景
- 不适用于：新用户、物品更新极快的场景

---

## 相关文档

- [Wide&Deep架构](/kb/widedeep) - 基础架构
- [序列推荐基础](/kb/) - 时序建模
- [GRU4Rec与SASRec](/kb/gru4recsasrec) - 序列模型

---

## 参考文献

1. Zhou et al. "Deep Interest Network for Click-Through Rate Prediction". 2018.
2. Zhou et al. "Deep Interest Evolution Network for Click-Through Rate Prediction". 2019.
