---
title: KV Cache优化
description: ''
date: null
tags: []
category: LLM
---
# KV Cache 优化

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 45 分钟

---

## 目录

1. [KV Cache 概述](#kv-cache-概述)
2. [KV Cache 原理](#kv-cache-原理)
3. [内存占用分析](#内存占用分析)
4. [优化策略](#优化策略)
5. [分组查询注意力 (GQA)](#分组查询注意力-gqa)
6. [实现技巧](#实现技巧)
7. [面试要点](#面试要点)

---

## KV Cache 概述

### 核心问题

自回归生成时，每一步都重新计算之前所有 token 的注意力。

```
生成过程:
t=1: 计算 Attention(x₁, x₁, x₁)          → 生成 x₂
t=2: 计算 Attention(x₁, x₂, x₁, x₂)       → 生成 x₃
t=3: 计算 Attention(x₁, x₂, x₃, x₁, x₂, x₃) → 生成 x₄
...
```

**问题**: 重复计算，效率低。

### KV Cache 解决方案

缓存之前计算的 K 和 V，避免重复计算。

```
使用 KV Cache:
t=1: 计算 K₁,V₁ = Attention(x₁)        → 缓存 → 生成 x₂
t=2: 计算 K₂,V₂ = Attention(x₂)        → 缓存 → 生成 x₃
t=3: 计算 Attention(x₃, cache=[K₁,K₂], cache=[V₁,V₂]) → 生成 x₄
...
```

---

## KV Cache 原理

### 生成过程对比

**标准生成**:
```python
def generate_without_cache(model, prompt, max_tokens):
    for i in range(max_tokens):
        # 每次重新计算全部注意力
        output = model(prompt)  # O(n²) 每步
        next_token = output[:, -1]
        prompt = torch.cat([prompt, next_token], dim=1)
```

**使用 KV Cache**:
```python
def generate_with_cache(model, prompt, max_tokens):
    past_key_values = None

    for i in range(max_tokens):
        # 使用缓存计算注意力
        output, past_key_values = model(
            prompt,
            past_key_values=past_key_values,
            use_cache=True
        )  # O(n) 每步

        next_token = output[:, -1]
        prompt = next_token.unsqueeze(1)  # 只传入新 token
```

### Cache 结构

```
每层的 KV Cache:
{
    "layer_0": {
        "key": [batch, heads, seq_len, d_head],
        "value": [batch, heads, seq_len, d_head]
    },
    "layer_1": {...},
    ...
}
```

---

## 内存占用分析

### KV Cache 内存计算

对于序列长度 $L$、层数 $n_{\text{layers}}$、头数 $h$、头维度 $d$、元素大小 $b$（FP16=2）：

$$
\text{Memory} = 2 \cdot n_{\text{layers}} \cdot h \cdot L \cdot d \cdot b
$$

### 实际例子

| 模型 | 层数 | 头数 | d | seq_len=2K | seq_len=4K |
|------|-------|------|---|-----------|-----------|
| LLaMA-7B | 32 | 32 | 128 | ~2GB | ~4GB |
| LLaMA-13B | 40 | 40 | 128 | ~3.2GB | ~6.4GB |
| GPT-J-6B | 28 | 16 | 256 | ~1.4GB | ~2.8GB |

### KV Cache vs 模型权重

| 模型 | 模型权重 (FP16) | KV Cache (8K) |
|------|-----------------|---------------|
| LLaMA-7B | 14GB | 8GB |
| LLaMA-13B | 26GB | 12.8GB |
| LLaMA-30B | 60GB | 29.4GB |

---

## 优化策略

### 1. PagedAttention (vLLM)

借鉴操作系统的虚拟内存思想：

```
连续内存 (传统 KV Cache):
[ K₁ | K₂ | K₃ | ... | Kₙ ][ V₁ | V₂ | V₃ | ... | Vₙ ]
  └── 问题：需要连续大内存块 ──┘

分页内存 (PagedAttention):
Page 0 | Page 1 | Page 2 | ... | Page N
[  K₁-V₁  ][  K₂-V₂  ][  K₃-V₃  ]      ...
  └─ 每页独立，可动态分配/释放 ─┘
```

### 2. 量化 KV Cache

```python
# 使用 FP8 代替 FP16 存储
def quantize_kv(key, value):
    # [batch, heads, seq, d] FP16
    key_fp8 = fp8_quantize(key)
    value_fp8 = fp8_quantize(value)
    return key_fp8, value_fp8

# 使用时反量化
def dequantize_kv(key_fp8, value_fp8):
    key = fp8_dequantize(key_fp8)
    value = fp8_dequantize(value_fp8)
    return key, value
```

### 3. 稀疏 KV Cache

只保留重要的 KV：

```python
def prune_kv_cache(key_cache, value_cache, attention_weights, threshold=0.01):
    """
    attention_weights: [batch, heads, seq, seq]
    """
    # 计算每个 token 的重要性
    importance = attention_weights.mean(dim=[0, 1, 3])  # [seq]

    # 保留重要 token
    keep_mask = importance > threshold

    # 裁剪 cache
    key_cache = key_cache[keep_mask]
    value_cache = value_cache[keep_mask]

    return key_cache, value_cache
```

### 4. KV Cache 共享

多个请求共享部分 KV：

```
用户 A: ["什么是", "机器", "学习"] → KV_A
用户 B: ["机器", "学习", "算法"]   → KV_B

共享 ["机器", "学习"] → KV_shared

用户 A 使用: KV_A + KV_shared
用户 B 使用: KV_B + KV_shared
```

---

## 分组查询注意力 (GQA)

### 核心思想

平衡 MHA 和 MQA：多个查询头共享同一组 KV。

### MHA vs MQA vs GQA

```
MHA (Multi-Head Attention):
Q₁-K₁-V₁, Q₂-K₂-V₂, Q₃-K₃-V₃, Q₄-K₄-V₄
每头独立 KV，效果最好但内存大

MQA (Multi-Query Attention):
Q₁-K-V, Q₂-K-V, Q₃-K-V, Q₄-K-V
所有头共享 KV，内存小但效果略降

GQA (Grouped-Query Attention):
Q₁-K₁-V₁, Q₂-K₁-V₁, Q₃-K₂-V₂, Q₄-K₂-V₂
头分组共享 KV，平衡效果和内存
```

### GQA 参数

| 头数 | KV 组数 | 每组头数 | KV 内存比例 |
|------|---------|-----------|-----------|
| 32 | 32 | 1 | 100% (MHA) |
| 32 | 16 | 2 | 50% |
| 32 | 8 | 4 | 25% |
| 32 | 4 | 8 | 12.5% (MQA) |

---

## 实现技巧

### 1. KV Cache 管理

```python
class KVCacheManager:
    def __init__(self, max_seq_len, num_layers, num_heads, head_dim):
        self.max_seq_len = max_seq_len
        self.num_layers = num_layers
        self.num_heads = num_heads
        self.head_dim = head_dim

        # 预分配 cache
        self.key_cache = [torch.zeros(...) for _ in range(num_layers)]
        self.value_cache = [torch.zeros(...) for _ in range(num_layers)]
        self.seq_len = [0 for _ in range(num_layers)]

    def update(self, layer_idx, key, value):
        """更新 cache"""
        seq_pos = self.seq_len[layer_idx]
        self.key_cache[layer_idx][:, :, seq_pos] = key
        self.value_cache[layer_idx][:, :, seq_pos] = value
        self.seq_len[layer_idx] += 1

    def get(self, layer_idx):
        """获取 cache"""
        return (
            self.key_cache[layer_idx][:, :, :self.seq_len[layer_idx]],
            self.value_cache[layer_idx][:, :, :self.seq_len[layer_idx]]
        )
```

### 2. Flash Attention + KV Cache

```python
from flash_attn import flash_attn_func

def attention_with_cache(query, key_cache, value_cache, causal=True):
    """
    query: [batch, heads, 1, d]
    key_cache: [batch, heads, seq, d]
    value_cache: [batch, heads, seq, d]
    """
    return flash_attn_func(
        q=query,
        k=key_cache,
        v=value_cache,
        causal=causal
    )
```

### 3. KV Cache 序列化

```python
# 保存 KV Cache 用于推理加速
def save_kv_cache(kv_cache, path):
    cache_dict = {
        'key': [k.cpu() for k in kv_cache.key_cache],
        'value': [v.cpu() for v in kv_cache.value_cache],
        'seq_len': kv_cache.seq_len
    }
    torch.save(cache_dict, path)

def load_kv_cache(path):
    cache_dict = torch.load(path)
    kv_cache = KVCacheManager(...)
    kv_cache.key_cache = [k.to('cuda') for k in cache_dict['key']]
    kv_cache.value_cache = [v.to('cuda') for v in cache_dict['value']]
    kv_cache.seq_len = cache_dict['seq_len']
    return kv_cache
```

---

## 面试要点

### 高频问题

**Q1: KV Cache 为什么能加速生成？**

A:
1. **避免重复计算**: 之前 token 的 KV 已缓存
2. **复杂度降低**: 从 O(n²) 降到 O(n) 每步
3. **内存局部性**: 缓存命中更快

**Q2: KV Cache 的内存占用如何计算？**

A:
$$
\text{Memory} = 2 \times n_{\text{layers}} \times h \times L \times d \times \text{bytes\_per\_element}
$$

其中 2 是因为 K 和 V 各占一份。

**Q3: GQA 相比 MHA 和 MQA 的优势？**

A:
- vs MHA: 减少 KV 内存，降低显存占用
- vs MQA: 保持一定程度的头多样性，效果更好
- 平衡效果和效率的最佳选择

**Q4: PagedAttention 的核心思想？**

A: 借鉴操作系统虚拟内存：
1. KV Cache 分页管理
2. 动态分配/释放页面
3. 避免内存碎片和浪费
4. 支持变长序列更灵活

**Q5: 如何选择 KV Cache 量化方案？**

A:
| 方案 | 精度 | 效果 | 适用 |
|------|------|------|------|
| FP16 | 标准 | 基准 | 通用 |
| FP8 | 轻微下降 | 大幅节省内存 | 长序列 |
| INT8 | 可能下降更多 | 最多节省 | 资源紧张 |

---

## 相关文档

- [注意力机制深入理解](/kb/) - Attention 基础
- [模型量化技术](/kb/) - 量化详解
- [vLLM与PagedAttention](/kb/vllmpagedattention) - PagedAttention 实现
- [推理优化](/kb/) - 其他推理优化技术

---

## 参考文献

1. Kitaev et al. "On Layer Normalization in the Transformer Architecture". 2020.
2. Liu et al. "PagedAttention: Efficient Attention with Memory for Long Sequences". 2023.
3. Ainslie et al. "GQA: Training Generalized Multi-Query Transformer Models". 2023.
