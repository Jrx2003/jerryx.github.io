---
title: Transformer详解
description: ''
date: null
tags: []
category: LLM
---
# Transformer 详解

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 60 分钟

---

## 目录

1. [Transformer 概述](#transformer-概述)
2. [整体架构](#整体架构)
3. [编码器详解](#编码器详解)
4. [解码器详解](#解码器详解)
5. [残差连接与层归一化](#残差连接与层归一化)
6. [前馈神经网络](#前馈神经网络)
7. [参数效率](#参数效率)
8. [代码实现](#代码实现)
9. [面试要点](#面试要点)

---

## Transformer 概述

### 核心突破

Transformer 首次完全基于注意力机制，摒弃了 RNN/CNN 的序列建模方式。

| 对比维度 | RNN | CNN | Transformer |
|----------|-----|-----|-------------|
| 并行化 | 串行 | 部分并行 | 完全并行 |
| 长距离依赖 | 梯度消失 | 感受野有限 | O(1) 直接连接 |
| 位置敏感 | 序列处理 | 需要位置编码 | 需要位置编码 |
| 计算复杂度 | O(n) | O(n) | O(n²) |

### 应用演变

```
2017: Attention Is All You Need
  │
  ├─→ BERT (2018): 编码器架构，理解任务
  ├─→ GPT-1 (2018): 解码器架构，生成任务
  ├─→ Transformer-XL (2019): 长序列扩展
  ├─→ T5 (2019): 编码器-解码器，文本到文本
  ├─→ GPT-3 (2020): 大规模涌现能力
  ├─→ BART (2020): 去噪自编码器
  └─→ 现代 LLMs: 基于 Transformer 架构
```

---

## 整体架构

### Encoder-Decoder 架构

```
输入序列               输出序列
    │                   │
    ▼                   ▼
┌───────────────┐   ┌───────────────┐
│  Encoders     │   │  Decoders     │
│              │   │              │
│  ┌────────┐  │   │  ┌────────┐  │
│  │ Layer 1 │  │   │  │ Layer 1 │  │
│  └───┬────┘  │   │  └───┬────┘  │
│      │        │   │      │        │
│  ┌───▼────┐  │   │  ┌───▼────┐  │
│  │ Layer 2 │  │   │  │ Layer 2 │  │
│  └───┬────┘  │   │  └───┬────┘  │
│      │        │   │      │        │
│  ┌───▼────┐  │   │  ┌───▼────┐  │
│  │ Layer N │  │   │  │ Layer N │  │
│  └───┬────┘  │   │  └───┬────┘  │
└──────┼───────┘   └──────┼───────┘
       │                   │
   编码器表示           │
       │                   │
       │         ┌─────────▼─────────┐
       │         │ Cross-Attention  │
       │         │ (K, V 来自编码器) │
       │         └─────────┬─────────┘
       │                   │
       └───────────────────┤
                           ▼
                      最终输出
```

### 纯解码器架构 (GPT 系列)

```
输入序列
    │
    ▼
┌───────────────┐
│  Decoders     │
│              │
│  ┌────────┐  │
│  │ Layer 1 │  │
│  └───┬────┘  │
│      │        │
│  ┌───▼────┐  │
│  │ Layer 2 │  │
│  └───┬────┘  │
│      │        │
│  ┌───▼────┐  │
│  │ Layer N │  │
│  └───┬────┘  │
└──────┼───────┘
       │
       ▼
   最终输出
```

---

## 编码器详解

### 自注意力层

编码器使用**双向**自注意力，每个 token 可以关注序列中所有其他 token。

```python
class EncoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        self.self_attn = MultiHeadAttention(d_model, num_heads, dropout)
        self.feed_forward = PositionwiseFeedForward(d_model, d_ff, dropout)
        self.norm1 = LayerNorm(d_model)
        self.norm2 = LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        # 自注意力 (双向)
        attn_output, _ = self.self_attn(x, x, x, mask)

        # 残差连接 + 层归一化
        x = self.norm1(x + self.dropout(attn_output))

        # 前馈网络
        ff_output = self.feed_forward(x)

        # 残差连接 + 层归一化
        x = self.norm2(x + self.dropout(ff_output))

        return x
```

### 双向特性

| 方向 | 说明 |
|------|------|
| **前向** | token 可以看到后面的信息 |
| **后向** | token 可以看到前面的信息 |
| **应用** | 适合理解任务（分类、NER）|

---

## 解码器详解

### 三种子层

解码器包含三种注意力子层：

1. **Masked Self-Attention**: 自回归，只能看到过去
2. **Cross-Attention**: Q 来自解码器，K/V 来自编码器
3. **Feed Forward**: 逐位置变换

```python
class DecoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        # 1. Masked Self-Attention
        self.self_attn = MultiHeadAttention(d_model, num_heads, dropout)

        # 2. Cross-Attention
        self.cross_attn = MultiHeadAttention(d_model, num_heads, dropout)

        # 3. Feed Forward
        self.feed_forward = PositionwiseFeedForward(d_model, d_ff, dropout)

        # 层归一化
        self.norm1 = LayerNorm(d_model)
        self.norm2 = LayerNorm(d_model)
        self.norm3 = LayerNorm(d_model)

        self.dropout = nn.Dropout(dropout)

    def forward(self, x, enc_output, self_mask, enc_mask=None):
        # 1. Masked Self-Attention (自回归)
        attn_output, _ = self.self_attn(x, x, x, self_mask)
        x = self.norm1(x + self.dropout(attn_output))

        # 2. Cross-Attention (K, V 来自编码器)
        attn_output, _ = self.cross_attn(x, enc_output, enc_output, enc_mask)
        x = self.norm2(x + self.dropout(attn_output))

        # 3. Feed Forward
        ff_output = self.feed_forward(x)
        x = self.norm3(x + self.dropout(ff_output))

        return x
```

### 自回归特性

```
时间步 t=1: 可以看到 [input_1]
时间步 t=2: 可以看到 [input_1, input_2]
时间步 t=3: 可以看到 [input_1, input_2, input_3]
...
时间步 t=n: 可以看到 [input_1, ..., input_n]
```

---

## 残差连接与层归一化

### 残差连接 (Residual Connection)

$$
\text{Output} = \text{LayerNorm}(x + \text{SubLayer}(x))
$$

| 作用 | 说明 |
|------|------|
| **梯度流动** | 缓解梯度消失 |
| **信息保留** | 原始信息直接传递 |
| **训练稳定** | 便于深度网络训练 |

### 层归一化 (Layer Normalization)

$$
\text{LN}(x) = \gamma \cdot \frac{x - \mu}{\sqrt{\sigma^2 + \epsilon}} + \beta
$$

| 对比 | Layer Norm | Batch Norm |
|------|-------------|------------|
| 归一化维度 | 特征维度 | 批次维度 |
| 适用 | 序列数据 | CV 数据 |
| 训练/测试 | 相同 | 不同（需要运行时统计）|

### Pre-LN vs Post-LN

| 类型 | 公式 | 效果 |
|------|------|------|
| **Post-LN** | `x = x + SubLayer(LN(x))` | 原始 Transformer |
| **Pre-LN** | `x = x + SubLayer(x) / LN(x)` | 更稳定，现代模型常用 |

---

## 前馈神经网络

### Position-wise FFN

$$
\text{FFN}(x) = \text{ReLU}(xW_1 + b_1)W_2 + b_2
$$

| 维度 | 说明 |
|------|------|
| $d_{model}$ | 输入维度 |
| $d_{ff} = 4 \times d_{model}$ | 隐藏层维度 |
| $d_{model}$ | 输出维度 |

```python
class PositionwiseFeedForward(nn.Module):
    def __init__(self, d_model, d_ff, dropout=0.1):
        super().__init__()
        self.w1 = nn.Linear(d_model, d_ff)
        self.w2 = nn.Linear(d_ff, d_model)
        self.dropout = nn.Dropout(dropout)
        self.activation = nn.ReLU()  # 或 GELU, Swish

    def forward(self, x):
        # [batch_size, seq_len, d_model]
        return self.w2(self.dropout(self.activation(self.w1(x))))
```

### 激活函数演变

| 激活函数 | 特点 | 应用 |
|-----------|------|------|
| **ReLU** | 简单，但可能死神经元 | 原始 Transformer |
| **GELU** | 更平滑 | BERT, T5 |
| **Swish** | 平滑且非单调 | 现代模型 |
| **GeGLU** | 门控激活 | PaLM, LLaMA |

---

## 参数效率

### 参数计算

对于 $L$ 层、$h$ 个头、$d$ 模型维度：

| 组件 | 参数量 |
|------|--------|
| 嵌入层 | $vocab\_size \times d$ |
| QKV 投影 | $3 \times d^2$ (每层) |
| 输出投影 | $d^2$ (每层) |
| FFN | $2 \times d \times 4d$ (每层) |

**总计** (约):
$$
P \approx 12 \cdot L \cdot d^2 + vocab\_size \cdot d
$$

### 实际模型参数量

| 模型 | 层数 | d_model | 头数 | d_ff | 参数量 |
|-------|-------|---------|-------|-------|---------|
| BERT-Base | 12 | 768 | 12 | 3072 | 110M |
| GPT-2 Small | 12 | 768 | 12 | 3072 | 117M |
| GPT-3 (175B) | 96 | 12288 | 96 | 49152 | 175B |
| LLaMA-7B | 32 | 4096 | 32 | 11008 | 7B |

---

## 代码实现

### 完整 Transformer Block

```python
import torch
import torch.nn as nn
import math

class TransformerBlock(nn.Module):
    """完整的 Transformer Block"""
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1, is_decoder=False):
        super().__init__()
        self.is_decoder = is_decoder

        # 自注意力 (编码器) 或 Masked 自注意力 (解码器)
        self.self_attn = MultiHeadAttention(d_model, num_heads, dropout)

        # 解码器需要交叉注意力
        if is_decoder:
            self.cross_attn = MultiHeadAttention(d_model, num_heads, dropout)

        # 前馈网络
        self.feed_forward = PositionwiseFeedForward(d_model, d_ff, dropout)

        # 层归一化 (Pre-LN)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        if is_decoder:
            self.norm3 = nn.LayerNorm(d_model)

        self.dropout = nn.Dropout(dropout)

    def forward(self, x, enc_output=None, self_mask=None, enc_mask=None):
        # 1. Self-Attention with Pre-LN
        attn_out, _ = self.self_attn(
            self.norm1(x), self.norm1(x), self.norm1(x),
            mask=self_mask, is_causal=self.is_decoder
        )
        x = x + self.dropout(attn_out)

        # 2. Cross-Attention (仅解码器)
        if self.is_decoder and enc_output is not None:
            attn_out, _ = self.cross_attn(
                self.norm2(x),
                self.norm2(enc_output),
                self.norm2(enc_output),
                mask=enc_mask
            )
            x = x + self.dropout(attn_out)

        # 3. Feed Forward
        ff_out = self.feed_forward(self.norm3(x) if self.is_decoder else self.norm2(x))
        x = x + self.dropout(ff_out)

        return x
```

### 完整 Transformer 模型

```python
class Transformer(nn.Module):
    """完整 Transformer 模型"""
    def __init__(
        self,
        vocab_size,
        d_model=512,
        num_heads=8,
        num_layers=6,
        d_ff=2048,
        max_seq_len=512,
        dropout=0.1,
        pad_idx=0
    ):
        super().__init__()

        self.d_model = d_model

        # Token 嵌入 + 位置编码
        self.token_embedding = nn.Embedding(vocab_size, d_model, padding_idx=pad_idx)
        self.positional_encoding = SinusoidalPositionalEncoding(d_model, max_seq_len, dropout)

        # Transformer 层
        self.layers = nn.ModuleList([
            TransformerBlock(d_model, num_heads, d_ff, dropout, is_decoder=False)
            for _ in range(num_layers)
        ])

        # 输出层
        self.output_layer = nn.Linear(d_model, vocab_size)

        # 初始化
        self._init_parameters()

    def _init_parameters(self):
        """参数初始化"""
        for p in self.parameters():
            if p.dim() > 1:
                nn.init.xavier_uniform_(p)

    def forward(self, x, mask=None):
        """
        x: [batch_size, seq_len]
        mask: [batch_size, seq_len] 或 [seq_len, seq_len]
        """
        # 嵌入 + 位置编码
        x = self.token_embedding(x) * math.sqrt(self.d_model)
        x = self.positional_encoding(x)  # [batch_size, seq_len, d_model]

        # 通过所有 Transformer 层
        for layer in self.layers:
            x = layer(x, mask=mask)

        # 输出投影
        output = self.output_layer(x)

        return output
```

---

## 面试要点

### 高频问题

**Q1: Transformer 相比 RNN 的核心优势？**

A:
1. **完全并行化**: 不需要按时间步迭代，可以同时处理所有位置
2. **长距离依赖**: O(1) 连接任意两个位置，不受序列长度影响
3. **可解释性**: 注意力权重展示关注重点

**Q2: Encoder-Decoder vs Decoder-only 架构的选择？**

A:
| 架构 | 优点 | 缺点 | 适用场景 |
|-------|------|------|----------|
| Encoder-Decoder | 双向理解 + 自回归生成 | 训练复杂 | 翻译、摘要 |
| Decoder-only | 训练简单，易于生成 | 单向理解 | 生成式任务、对话 |

**Q3: 为什么要用 Pre-LN 而非 Post-LN？**

A:
- **训练稳定性**: Pre-LN 让输入在进入子层前就归一化，梯度更稳定
- **深网络友好**: 更容易训练深层 Transformer
- **现代实践**: GPT-3, LLaMA 都使用 Pre-LN

**Q4: Multi-Head Attention 的作用？**

A:
- 多个头独立学习不同的注意力模式
- 某些头关注局部语法，某些关注语义关系
- 类比：多个人从不同角度观察同一事物

**Q5: FFN 为什么用 4 倍隐藏维度？**

A:
- 增加模型容量
- 平衡计算效率和表达能力
- 可调整，但 4x 是经验值

### 手撕代码重点

1. **Scaled Dot-Product Attention** 完整实现
2. **因果掩码** 构造与应用
3. **Multi-Head** 维度变换
4. **Pre-LN Transformer Block**
5. **位置编码**（正弦/RoPE）

---

## 相关文档

- [注意力机制深入理解](/kb/) - QKV 计算详解
- [位置编码技术演进](/kb/) - 位置编码对比
- [GPT系列模型演进](/kb/gpt) - Decoder-only 演进
- [BERT与编码器模型](/kb/bert) - Encoder-only 架构

---

## 参考文献

1. Vaswani et al. "Attention Is All You Need". NeurIPS 2017.
2. Devlin et al. "BERT: Pre-training of Deep Bidirectional Transformers". 2018.
3. Radford et al. "Improving Language Understanding by Generative Pre-training". 2018.
