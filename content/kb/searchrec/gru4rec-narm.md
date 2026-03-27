---
title: GRU4Rec 与 NARM
description: ''
date: null
tags: []
category: SearchRec
---
# GRU4Rec 与 NARM

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 45 分钟

---

## 目录

1. [GRU4Rec](#gru4rec)
2. [NARM](#narm)
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
class GRU4Rec(nn.Module):
    """GRU4Rec 实现"""

    def __init__(self, num_items, hidden_size=100):
        super().__init__()

        self.item_embedding = nn.Embedding(num_items, hidden_size)
        self.gru = nn.GRU(hidden_size, hidden_size, batch_first=True)
        self.output = nn.Linear(hidden_size, num_items)

    def forward(self, item_seq):
        embedded = self.item_embedding(item_seq)
        gru_out, hidden = self.gru(embedded)
        logits = self.output(hidden.squeeze(0))
        return logits
```

---

## NARM

### 概述

NARM (Neural Attentive Recommendation Machine) 结合 RNN 和注意力机制。

```
核心创新:
- 全局编码器: GRU 编码整个序列
- 局部编码器: 注意力机制关注相关物品
- 混合表示: 结合全局和局部信息
```

### 架构

```python
class NARM(nn.Module):
    """NARM 模型"""

    def __init__(self, num_items, embed_dim=50, hidden_dim=100):
        super().__init__()

        self.item_embedding = nn.Embedding(num_items, embed_dim)

        # 全局编码器
        self.global_gru = nn.GRU(embed_dim, hidden_dim, batch_first=True)

        # 局部编码器
        self.local_gru = nn.GRU(embed_dim, hidden_dim, batch_first=True)

        # 注意力
        self.attention = nn.MultiheadAttention(hidden_dim, num_heads=4)

        # 输出层
        self.output = nn.Linear(hidden_dim * 2, num_items)

    def forward(self, item_seq):
        embedded = self.item_embedding(item_seq)

        # 全局编码
        global_out, global_hidden = self.global_gru(embedded)

        # 局部编码 + 注意力
        local_out, _ = self.local_gru(embedded)
        attended, _ = self.attention(local_out, local_out, local_out)

        # 混合
        global_repr = global_hidden.squeeze(0)
        local_repr = attended[:, -1, :]

        hybrid = torch.cat([global_repr, local_repr], dim=-1)

        return self.output(hybrid)
```

---

## 模型对比

| 特性 | GRU4Rec | NARM |
|------|---------|------|
| 核心结构 | GRU | GRU + Attention |
| 表示能力 | 全局序列 | 全局 + 局部 |
| 参数量 | 少 | 多 |
| 效果 | 好 | 更好 |

---

## 面试要点

### 高频问题

**Q1: GRU4Rec 相比传统协同过滤的优势？**

A:
- 能建模序列顺序
- 适合匿名会话
- 实时更新兴趣

**Q2: NARM 的注意力机制作用？**

A:
- 关注序列中相关的物品
- 学习局部上下文
- 提升表示能力

---

## 相关文档

- [序列建模基础](/kb/) - 序列推荐入门
- [SASRec 与 BERT4Rec](/kb/sasrec-bert4rec) - 注意力序列模型
