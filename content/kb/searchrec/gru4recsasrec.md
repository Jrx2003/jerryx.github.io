---
title: GRU4Rec与SASRec
description: ''
date: null
tags: []
category: SearchRec
---
# GRU4Rec 与 SASRec

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 50 分钟

---

## 目录

1. [GRU4Rec](#gru4rec)
2. [SASRec](#sasrec)
3. [模型对比](#模型对比)
4. [面试要点](#面试要点)

---

## GRU4Rec

### 概述

GRU4Rec 是首个将 RNN 应用于会话推荐的开创性工作。

```
核心思想:
- 用 GRU 建模用户行为序列
- 基于会话的推荐 (不需要用户登录信息)
- 实时更新用户状态
```

### 架构

```
输入: [item1] → [item2] → [item3] → [item4]
       ↓         ↓         ↓         ↓
    ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐
    │ GRU │ → │ GRU │ → │ GRU │ → │ GRU │
    └──┬──┘   └──┬──┘   └──┬──┘   └──┬──┘
       │         │         │         │
       ▼         ▼         ▼         ▼
    预测item2  预测item3  预测item4  预测下一个
```

### 实现

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class GRU4Rec(nn.Module):
    """
    GRU4Rec: Session-based Recommendation

    参考: Hidasi et al. "Session-based Recommendations with RNNs"
    """

    def __init__(self, num_items, hidden_size=100, num_layers=1,
                 embedding_dim=50, dropout=0.2):
        super().__init__()

        self.num_items = num_items
        self.hidden_size = hidden_size

        # 物品嵌入
        self.item_embedding = nn.Embedding(num_items, embedding_dim)

        # GRU 层
        self.gru = nn.GRU(
            input_size=embedding_dim,
            hidden_size=hidden_size,
            num_layers=num_layers,
            dropout=dropout if num_layers > 1 else 0,
            batch_first=True
        )

        # 输出层
        self.output_layer = nn.Linear(hidden_size, num_items)

        self.dropout = nn.Dropout(dropout)

    def forward(self, item_seq, lengths=None):
        """
        Args:
            item_seq: [batch, seq_len] 物品 ID 序列
            lengths: [batch] 每个序列的实际长度

        Returns:
            outputs: [batch, seq_len, num_items]
        """
        # 物品嵌入
        embedded = self.item_embedding(item_seq)
        embedded = self.dropout(embedded)

        # GRU 前向传播
        if lengths is not None:
            # Pack 序列
            packed = nn.utils.rnn.pack_padded_sequence(
                embedded, lengths.cpu(), batch_first=True, enforce_sorted=False
            )
            packed_output, hidden = self.gru(packed)
            gru_output, _ = nn.utils.rnn.pad_packed_sequence(
                packed_output, batch_first=True
            )
        else:
            gru_output, hidden = self.gru(embedded)

        # 预测输出
        gru_output = self.dropout(gru_output)
        outputs = self.output_layer(gru_output)

        return outputs

    def predict_next(self, session_history):
        """预测下一个物品"""
        with torch.no_grad():
            outputs = self.forward(session_history)
            last_output = outputs[:, -1, :]  # 取最后一个时间步
            scores = F.softmax(last_output, dim=-1)

        return scores

    def recommend(self, session_history, top_k=10):
        """推荐 top-k 物品"""
        scores = self.predict_next(session_history)

        # 排除已出现的物品
        for item in session_history[0]:
            scores[0, item] = float('-inf')

        _, top_items = torch.topk(scores, k=top_k, dim=1)
        return top_items[0].cpu().tolist()


# 训练
class GRU4RecLoss(nn.Module):
    """GRU4Rec 损失函数 - Top1 或 BPR"""

    def __init__(self, loss_type='bpr'):
        super().__init__()
        self.loss_type = loss_type

    def forward(self, predictions, targets, negatives=None):
        """
        Args:
            predictions: [batch, seq_len, num_items]
            targets: [batch, seq_len]
            negatives: [batch, seq_len, num_neg] 负样本
        """
        if self.loss_type == 'cross_entropy':
            # 交叉熵损失
            loss = F.cross_entropy(
                predictions.view(-1, predictions.size(-1)),
                targets.view(-1),
                ignore_index=0
            )

        elif self.loss_type == 'bpr':
            # BPR 损失
            pos_scores = predictions.gather(2, targets.unsqueeze(-1)).squeeze(-1)

            # 随机采样负样本
            if negatives is None:
                neg_scores = torch.randn_like(pos_scores)
            else:
                neg_scores = predictions.gather(2, negatives).mean(dim=-1)

            loss = -torch.log(torch.sigmoid(pos_scores - neg_scores) + 1e-8).mean()

        return loss
```

---

## SASRec

### 概述

SASRec 使用 Transformer 替代 RNN 进行序列推荐。

```
核心思想:
- 用 Self-Attention 建模序列
- 捕捉长距离依赖
- 并行计算，速度更快
```

### 架构

```
输入序列: [item1] [item2] [item3] [item4]
           ↓       ↓       ↓       ↓
        Embedding + Positional Encoding
           ↓       ↓       ↓       ↓
┌──────────────────────────────────────────┐
│           Self-Attention Block 1         │
│  ┌────────────────────────────────────┐  │
│  │  Multi-Head Causal Self-Attention  │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │         Feed Forward               │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────┐
│           Self-Attention Block 2         │
└──────────────────────────────────────────┘
                   ↓
              Output Layer
```

### 实现

```python
class SASRec(nn.Module):
    """
    SASRec: Self-Attentive Sequential Recommendation

    参考: Kang & McAuley "Self-Attentive Sequential Recommendation"
    """

    def __init__(self, num_items, hidden_size=64, num_layers=2,
                 num_heads=2, max_seq_len=50, dropout=0.2):
        super().__init__()

        self.num_items = num_items
        self.hidden_size = hidden_size
        self.max_seq_len = max_seq_len

        # 物品嵌入 (包含 padding 和 mask 标记)
        self.item_embedding = nn.Embedding(num_items + 1, hidden_size, padding_idx=0)

        # 位置编码 (可学习)
        self.position_embedding = nn.Embedding(max_seq_len, hidden_size)

        # Dropout
        self.dropout = nn.Dropout(dropout)
        self.layer_norm = nn.LayerNorm(hidden_size)

        # Transformer Encoder 层
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=hidden_size,
            nhead=num_heads,
            dim_feedforward=hidden_size * 4,
            dropout=dropout,
            batch_first=True
        )
        self.transformer_layers = nn.TransformerEncoder(
            encoder_layer,
            num_layers=num_layers
        )

        # 输出层
        self.output_layer = nn.Linear(hidden_size, num_items)

    def forward(self, item_seq):
        """
        Args:
            item_seq: [batch, seq_len] 物品序列

        Returns:
            logits: [batch, seq_len, num_items]
        """
        batch_size, seq_len = item_seq.shape

        # 1. 物品嵌入
        item_emb = self.item_embedding(item_seq)

        # 2. 位置嵌入
        positions = torch.arange(seq_len, device=item_seq.device)
        pos_emb = self.position_embedding(positions)

        # 3. 相加并 dropout
        seq_emb = item_emb + pos_emb
        seq_emb = self.layer_norm(seq_emb)
        seq_emb = self.dropout(seq_emb)

        # 4. 生成因果 mask (上三角为 True，表示不能 attend)
        causal_mask = torch.triu(
            torch.ones(seq_len, seq_len, device=item_seq.device),
            diagonal=1
        ).bool()

        # 5. Transformer 层
        hidden = self.transformer_layers(
            seq_emb,
            mask=causal_mask
        )

        # 6. 预测
        logits = self.output_layer(hidden)

        return logits

    def predict(self, item_seq, item_candidates=None):
        """
        预测下一个物品

        Args:
            item_seq: [batch, seq_len]
            item_candidates: 候选物品列表
        """
        logits = self.forward(item_seq)

        # 取最后一个位置的预测
        final_logits = logits[:, -1, :]

        if item_candidates is not None:
            scores = final_logits[:, item_candidates]
        else:
            scores = final_logits

        return scores


# SASRec 使用示例
model = SASRec(
    num_items=10000,
    hidden_size=64,
    num_layers=2,
    num_heads=2,
    max_seq_len=50
)

# 模拟输入
batch_size = 32
seq_len = 10
item_seq = torch.randint(1, 10000, (batch_size, seq_len))

# 前向传播
logits = model(item_seq)
print(logits.shape)  # [32, 10, 10000]

# 预测下一个物品
next_scores = model.predict(item_seq)
top_items = torch.topk(next_scores, k=10, dim=1).indices
```

---

## 模型对比

### 对比表

| 特性 | GRU4Rec | SASRec |
|------|---------|--------|
| 核心结构 | GRU | Self-Attention |
| 长距离依赖 | 有限 | 强 |
| 并行性 | 序列化 | 完全并行 |
| 位置信息 | 隐式 | 显式位置编码 |
| 训练速度 | 慢 | 快 |
| 参数量 | 少 | 多 |

### 性能对比

| 数据集 | 指标 | GRU4Rec | SASRec |
|--------|------|---------|--------|
| Amazon | NDCG@10 | 0.285 | 0.312 |
| Amazon | HR@10 | 0.482 | 0.521 |
| MovieLens | NDCG@10 | 0.312 | 0.345 |
| MovieLens | HR@10 | 0.528 | 0.564 |

---

## 面试要点

### 高频问题

**Q1: GRU4Rec 和 SASRec 的主要区别？**

A:
- **结构**: GRU vs Self-Attention
- **并行性**: GRU 序列处理，SASRec 完全并行
- **长依赖**: SASRec 通过注意力直接捕捉长距离依赖
- **速度**: SASRec 训练更快

**Q2: 为什么 SASRec 使用因果 mask？**

A:
- 保证模型只能看到过去的交互
- 防止"偷看"未来的信息
- 符合推荐的实际场景

**Q3: 位置编码的作用？**

A:
- Self-Attention 本身是无序的
- 位置编码提供序列顺序信息
- SASRec 使用可学习的位置编码

**Q4: 序列推荐如何处理变长序列？**

A:
- Padding 到固定长度
- 使用 mask 忽略 padding 位置
- 或按长度分组 batch

---

## 相关文档

- [BERT4Rec](/kb/bert4rec) - 双向序列模型
- [DIN与DIEN](/kb/dindien) - 注意力机制
- [Transformer详解](/kb/transformer) - Transformer 基础

---

## 参考文献

1. Hidasi et al. "Session-based Recommendations with Recurrent Neural Networks". 2016.
2. Kang & McAuley. "Self-Attentive Sequential Recommendation". 2018.
