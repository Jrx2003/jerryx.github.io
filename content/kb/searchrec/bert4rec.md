---
title: BERT4Rec
description: ''
date: null
tags: []
category: SearchRec
---
# BERT4Rec

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 40 分钟

---

## 目录

1. [BERT4Rec 概述](#bert4rec-概述)
2. [模型架构](#模型架构)
3. [双向编码](#双向编码)
4. [实现代码](#实现代码)
5. [面试要点](#面试要点)

---

## BERT4Rec 概述

### 什么是 BERT4Rec

BERT4Rec 将 BERT 的双向编码能力引入序列推荐任务。

```
传统序列模型 (GRU4Rec, SASRec):
- 单向编码: 只能看到过去的交互
- 自回归训练

BERT4Rec:
- 双向编码: 同时利用过去和未来信息
- Cloze 任务训练 (类似 MLM)
```

### 核心思想

```
问题: 预测用户下一个可能交互的物品

传统方法: [item1] [item2] [item3] → [item4]
BERT4Rec: [item1] [item2] [MASK] [item4] → [item3]

优势:
- 双向上下文
- 更强的表示能力
- 更好的冷启动处理
```

---

## 模型架构

```
输入序列: [item1] [item2] [item3] [item4] [item5]

随机 mask 部分物品:
[item1] [MASK] [item3] [MASK] [item5]

位置嵌入: 考虑序列顺序

BERT Encoder (双向 Transformer):
┌─────────────────────────────────────┐
│  Multi-Head Self-Attention         │
│  ↓                                  │
│  Feed Forward Network              │
│  ↓                                  │
│  Layer Norm + Residual             │
└─────────────────────────────────────┘
重复 L 层

输出: 预测 mask 位置的物品
```

---

## 双向编码

### 为什么双向有帮助

```
用户序列: 手机 → 手机壳 → 充电宝 → 耳机

单向模型预测充电宝:
- 只能看到: 手机 → 手机壳 → ?
- 不知道用户后续买了耳机

双向模型预测充电宝:
- 可以看到: 手机 → 手机壳 → ? → 耳机
- 结合上下文: 买了手机配件系列
- 更准确预测充电宝
```

### Cloze 任务

```python
def create_cloise_task(sequence, mask_prob=0.2):
    """
    创建 Cloze 任务训练数据

    Args:
        sequence: 物品 ID 列表
        mask_prob: mask 概率

    Returns:
        masked_sequence, labels
    """
    masked_sequence = sequence.copy()
    labels = [-100] * len(sequence)  # -100 表示不计算损失

    # 随机选择 mask 位置
    n_mask = max(1, int(len(sequence) * mask_prob))
    mask_positions = random.sample(range(len(sequence)), n_mask)

    for pos in mask_positions:
        labels[pos] = sequence[pos]

        # 80% 替换为 [MASK]
        if random.random() < 0.8:
            masked_sequence[pos] = MASK_TOKEN
        # 10% 替换为随机物品
        elif random.random() < 0.5:
            masked_sequence[pos] = random.randint(0, num_items)
        # 10% 保持不变

    return masked_sequence, labels
```

---

## 实现代码

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class BERT4Rec(nn.Module):
    """
    BERT4Rec: Sequential Recommendation with Bidirectional Encoder

    参考: Sun et al. "BERT4Rec: Sequential Recommendation with
          Bidirectional Encoder Representations from Transformer"
    """

    def __init__(self, num_items, hidden_size=256, num_layers=2,
                 num_heads=4, max_seq_len=50, dropout=0.2):
        super().__init__()

        self.num_items = num_items
        self.hidden_size = hidden_size
        self.max_seq_len = max_seq_len

        # 物品嵌入
        self.item_embedding = nn.Embedding(num_items + 2, hidden_size, padding_idx=0)
        # +2 用于 [MASK] 和 [PAD]

        # 位置嵌入
        self.position_embedding = nn.Embedding(max_seq_len, hidden_size)

        # Transformer Encoder
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=hidden_size,
            nhead=num_heads,
            dim_feedforward=hidden_size * 4,
            dropout=dropout,
            batch_first=True
        )
        self.transformer_encoder = nn.TransformerEncoder(
            encoder_layer,
            num_layers=num_layers
        )

        # 输出层
        self.output_layer = nn.Linear(hidden_size, num_items + 1)

        self.dropout = nn.Dropout(dropout)
        self.layer_norm = nn.LayerNorm(hidden_size)

    def forward(self, item_seq, mask_positions=None):
        """
        Args:
            item_seq: [batch, seq_len] 物品序列 (包含 [MASK])
            mask_positions: [batch, num_mask] mask 位置 (用于测试时指定)

        Returns:
            logits: [batch, seq_len, num_items] 每个位置的预测
        """
        batch_size, seq_len = item_seq.shape

        # 1. 物品嵌入
        item_emb = self.item_embedding(item_seq)

        # 2. 位置嵌入
        positions = torch.arange(seq_len, device=item_seq.device)
        pos_emb = self.position_embedding(positions)

        # 3. 相加并归一化
        sequence_emb = self.layer_norm(item_emb + pos_emb)
        sequence_emb = self.dropout(sequence_emb)

        # 4. 生成 attention mask (padding mask)
        padding_mask = (item_seq == 0)

        # 5. Transformer Encoder (双向)
        encoded = self.transformer_encoder(
            sequence_emb,
            src_key_padding_mask=padding_mask
        )

        # 6. 预测
        logits = self.output_layer(encoded)

        return logits

    def calculate_loss(self, item_seq, labels):
        """
        计算 Cloze 任务损失

        Args:
            item_seq: [batch, seq_len] mask 后的序列
            labels: [batch, seq_len] -100 表示不计算
        """
        logits = self.forward(item_seq)

        # 只计算 mask 位置的损失
        loss_fct = nn.CrossEntropyLoss(ignore_index=-100)
        loss = loss_fct(
            logits.view(-1, self.num_items + 1),
            labels.view(-1)
        )

        return loss

    def predict(self, item_seq, item_candidates=None):
        """
        预测下一个物品

        Args:
            item_seq: [batch, seq_len]
            item_candidates: 候选物品列表 (可选)

        Returns:
            scores: [batch, num_candidates]
        """
        # 在序列最后添加 [MASK]
        batch_size = item_seq.shape[0]
        mask_token = torch.full((batch_size, 1), MASK_TOKEN_ID,
                                device=item_seq.device)
        masked_seq = torch.cat([item_seq, mask_token], dim=1)

        # 前向传播
        logits = self.forward(masked_seq)

        # 取最后一个位置的预测
        final_logits = logits[:, -1, :]  # [batch, num_items]

        if item_candidates is not None:
            # 只返回候选物品的分数
            scores = final_logits[:, item_candidates]
        else:
            scores = final_logits

        return scores

    def recommend(self, user_history, top_k=10):
        """
        为用户推荐物品

        Args:
            user_history: 用户历史交互列表
            top_k: 推荐数量
        """
        # 构建输入序列
        seq = user_history[-self.max_seq_len:]  # 截断
        seq_tensor = torch.LongTensor([seq]).to(next(self.parameters()).device)

        # 预测
        with torch.no_grad():
            scores = self.predict(seq_tensor)

        # 排除已交互物品
        scores[0, user_history] = float('-inf')

        # Top-K 推荐
        _, top_items = torch.topk(scores, k=top_k, dim=1)

        return top_items[0].cpu().tolist()


class BERT4RecTrainer:
    """BERT4Rec 训练器"""

    def __init__(self, model, train_data, val_data, config):
        self.model = model
        self.train_data = train_data
        self.val_data = val_data
        self.config = config

        self.optimizer = torch.optim.Adam(
            model.parameters(),
            lr=config['learning_rate'],
            weight_decay=config['weight_decay']
        )

        self.scheduler = torch.optim.lr_scheduler.StepLR(
            self.optimizer,
            step_size=config['decay_step'],
            gamma=config['gamma']
        )

    def train_epoch(self, epoch):
        """训练一个 epoch"""
        self.model.train()
        total_loss = 0

        for batch in self.train_data:
            # 为每个序列创建 mask
            masked_seq, labels = self.create_masked_batch(batch)

            # 前向传播
            loss = self.model.calculate_loss(masked_seq, labels)

            # 反向传播
            self.optimizer.zero_grad()
            loss.backward()
            torch.nn.utils.clip_grad_norm_(self.model.parameters(), 1.0)
            self.optimizer.step()

            total_loss += loss.item()

        self.scheduler.step()

        return total_loss / len(self.train_data)

    def create_masked_batch(self, batch):
        """为 batch 创建 mask"""
        masked_sequences = []
        label_sequences = []

        for seq in batch:
            masked_seq, labels = create_cloise_task(seq)
            masked_sequences.append(masked_seq)
            label_sequences.append(labels)

        # Padding
        max_len = max(len(s) for s in masked_sequences)
        padded_masked = []
        padded_labels = []

        for seq, label in zip(masked_sequences, label_sequences):
            pad_len = max_len - len(seq)
            padded_masked.append(seq + [0] * pad_len)
            padded_labels.append(label + [-100] * pad_len)

        return (
            torch.LongTensor(padded_masked),
            torch.LongTensor(padded_labels)
        )

    def evaluate(self):
        """评估"""
        self.model.eval()
        metrics = {'NDCG@10': 0, 'HR@10': 0}
        num_users = 0

        with torch.no_grad():
            for user_id, history, targets in self.val_data:
                # 预测
                scores = self.model.recommend(history, top_k=10)

                # 计算指标
                for target in targets:
                    num_users += 1

                    if target in scores:
                        rank = scores.index(target) + 1
                        metrics['HR@10'] += 1
                        metrics['NDCG@10'] += 1 / np.log2(rank + 1)

        for key in metrics:
            metrics[key] /= num_users

        return metrics
```

---

## 面试要点

### 高频问题

**Q1: BERT4Rec 和 SASRec 的区别？**

A:
| 维度 | BERT4Rec | SASRec |
|------|----------|--------|
| 编码方式 | 双向 | 单向 |
| 训练任务 | Cloze (MLM) | 自回归 |
| 预测方式 | mask 填充 | 自回归生成 |
| 优势 | 双向上下文 | 更快、更简单 |

**Q2: 为什么 BERT4Rec 使用双向编码？**

A:
- 能同时利用过去和未来的交互信息
- 更强的上下文建模能力
- 特别适合稀疏数据场景

**Q3: Cloze 任务如何实现推荐？**

A:
训练时用 Cloze 任务，预测时:
1. 在历史序列末尾添加 [MASK]
2. 用模型预测 [MASK] 位置最可能的物品
3. 即为下一个推荐物品

---

## 相关文档

- [GRU4Rec与SASRec](/kb/gru4recsasrec) - 其他序列模型
- [DIN与DIEN](/kb/dindien) - 注意力机制
- [BERT与编码器模型](/kb/bert) - BERT 基础

---

## 参考文献

1. Sun et al. "BERT4Rec: Sequential Recommendation with Bidirectional Encoder Representations from Transformer". 2019.
