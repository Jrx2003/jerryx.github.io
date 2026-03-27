---
title: SASRec 与 BERT4Rec
description: ''
date: null
tags: []
category: SearchRec
---
# SASRec 与 BERT4Rec

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 45 分钟

---

## 目录

1. [SASRec](#sasrec)
2. [BERT4Rec](#bert4rec)
3. [模型对比](#模型对比)
4. [面试要点](#面试要点)

---

## SASRec

### 概述

SASRec 使用 Transformer 的 Self-Attention 机制进行序列推荐。

```
核心思想:
- 用 Self-Attention 替代 RNN
- 捕捉长距离依赖
- 并行计算，速度更快
```

### 实现

```python
class SASRec(nn.Module):
    """SASRec 实现"""

    def __init__(self, num_items, hidden_size=64, num_layers=2, num_heads=2):
        super().__init__()

        self.item_embedding = nn.Embedding(num_items, hidden_size)
        self.position_embedding = nn.Embedding(512, hidden_size)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=hidden_size,
            nhead=num_heads,
            batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers)

        self.output = nn.Linear(hidden_size, num_items)

    def forward(self, item_seq):
        positions = torch.arange(len(item_seq), device=item_seq.device)

        item_emb = self.item_embedding(item_seq)
        pos_emb = self.position_embedding(positions)

        seq_emb = item_emb + pos_emb

        # 因果 mask
        mask = torch.triu(torch.ones(len(item_seq), len(item_seq)), diagonal=1).bool()

        hidden = self.transformer(seq_emb, mask=mask)
        logits = self.output(hidden)

        return logits
```

---

## BERT4Rec

### 概述

BERT4Rec 将 BERT 的双向编码能力引入序列推荐。

```
核心创新:
- 双向编码: 利用过去和未来信息
- Cloze 任务: 类似 MLM 的训练方式

示例:
输入: [item1] [MASK] [item3] [item4]
目标: 预测 [MASK] 位置的 item2
```

### 实现

```python
class BERT4Rec(nn.Module):
    """BERT4Rec 实现"""

    def __init__(self, num_items, hidden_size=256, num_layers=2):
        super().__init__()

        self.item_embedding = nn.Embedding(num_items + 2, hidden_size)
        self.position_embedding = nn.Embedding(512, hidden_size)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=hidden_size,
            nhead=8,
            batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers)

        self.output = nn.Linear(hidden_size, num_items)

    def forward(self, item_seq, mask_positions=None):
        positions = torch.arange(len(item_seq), device=item_seq.device)

        seq_emb = self.item_embedding(item_seq) + self.position_embedding(positions)

        hidden = self.transformer(seq_emb)
        logits = self.output(hidden)

        return logits
```

---

## 模型对比

| 特性 | SASRec | BERT4Rec |
|------|--------|----------|
| 注意力 | 单向 | 双向 |
| 训练任务 | 自回归 | Cloze (MLM) |
| 推理 | 自回归生成 | Mask 填充 |
| 优势 | 简单高效 | 双向上下文 |

---

## 面试要点

**Q1: SASRec 和 BERT4Rec 的主要区别？**

A:
- SASRec 单向注意力，BERT4Rec 双向
- SASRec 自回归训练，BERT4Rec Cloze 任务
- BERT4Rec 能利用未来信息

**Q2: 为什么 BERT4Rec 使用双向编码？**

A:
- 能同时利用过去和未来交互
- 更强的上下文建模
- 适合稀疏数据

---

## 相关文档

- [序列建模基础](/kb/) - 序列推荐入门
- [GRU4Rec 与 NARM](/kb/gru4rec-narm) - RNN 序列模型
