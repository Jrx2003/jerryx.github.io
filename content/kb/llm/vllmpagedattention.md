---
title: vLLM与PagedAttention
description: ''
date: null
tags: []
category: LLM
---
# vLLM 与 PagedAttention

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 40 分钟

---

## 目录

1. [vLLM 概述](#vllm-概述)
2. [PagedAttention 原理](#pagedattention-原理)
3. [连续批处理 (Continuous Batching)](#连续批处理-continuous-batching)
4. [内存管理](#内存管理)
5. [性能优化](#性能优化)
6. [面试要点](#面试要点)

---

## vLLM 概述

### 核心问题

传统 LLM 推理的两个关键问题：

1. **KV Cache 内存碎片**: 无法有效利用显存
2. **批处理效率低**: 不同序列长度难以高效批处理

### vLLM 解决方案

| 技术 | 解决问题 |
|------|----------|
| **PagedAttention** | KV Cache 内存碎片 |
| **Continuous Batching** | 批处理效率 |
| **CUDA 内核优化** | 计算速度 |

---

## PagedAttention 原理

### 借鉴操作系统虚拟内存

```
传统 KV Cache:
[KV_block_1 | KV_block_2 | KV_block_3 | ... | KV_block_N]
  └──────── 问题：需要连续大内存 ──┘

PagedAttention:
Page 0 | Page 1 | Page 2 | ... | Page M
[KV]  | [KV]  | [KV]  |     | [KV]
  └── 优势：灵活分页，动态分配/释放 ──┘
```

### KV Cache 分页

```python
class KVCacheBlock:
    """单个 KV Cache 块"""
    def __init__(self, block_size, num_heads, head_dim):
        self.block_size = block_size
        # [block_size, num_heads, head_dim]
        self.key_cache = torch.zeros(...)
        self.value_cache = torch.zeros(...)
        self.blocked = False  # 是否被占用

class PagedKVCache:
    """分页 KV Cache"""
    def __init__(self, max_blocks, block_size, num_heads, head_dim):
        self.max_blocks = max_blocks
        self.block_size = block_size
        # 分配池
        self.blocks = [KVCacheBlock(block_size, num_heads, head_dim)
                      for _ in range(max_blocks)]
        self.block_allocator = BlockAllocator(max_blocks)

    def allocate(self, seq_len):
        """分配所需块数"""
        num_blocks = (seq_len + block_size - 1) // block_size
        block_indices = self.block_allocator.allocate(num_blocks)
        return block_indices

    def release(self, block_indices):
        """释放块"""
        for idx in block_indices:
            self.block_allocator.release(idx)
```

### Page 表管理

```python
class PageTable:
    """页表管理"""
    def __init__(self, max_seq_len, block_size):
        self.max_seq_len = max_seq_len
        self.block_size = block_size
        # 页表：映射逻辑位置到物理块
        self.page_table = torch.full((max_seq_len,), -1, dtype=torch.long)

    def map(self, logical_pos):
        """映射逻辑位置到物理块"""
        block_idx = self.page_table[logical_pos]
        if block_idx < 0:
            # 需要分配新块
            block_idx = allocate_block()
            self.page_table[logical_pos] = block_idx
        return block_idx

    def unmap(self, logical_pos):
        """释放指定位置的块"""
        block_idx = self.page_table[logical_pos]
        if block_idx >= 0:
            release_block(block_idx)
            self.page_table[logical_pos] = -1
```

---

## 连续批处理 (Continuous Batching)

### 问题：静态批处理

```
Batch 1: [token:1024, token:1024, token:1024]  → 需 1024 内存
Batch 2: [token:512, token:512, token:512]    → 需要 512 内存
...
不同长度的请求在同一批中浪费内存
```

### 连续批处理解决方案

```
时间线:
t1: 请求A(512), 请求B(1024), 请求C(256)
    └──→ 动态组织批处理

t2: 请求A完成(100), 请求B(800), 请求C(256)
    └──→ 动态组织批处理

t3: 请求C完成(50), 请求B(700)
    └──→ 动态组织批处理
```

### 调度器实现

```python
class ContinuousBatchScheduler:
    """连续批处理调度器"""
    def __init__(self):
        self.requests = []  # 待处理请求
        self.active = []    # 活跃请求

    def add_request(self, request):
        """添加新请求"""
        self.requests.append(request)

    def get_batch(self):
        """获取当前最优批"""
        # 基于优先级和可用资源选择
        selected = select_requests(self.requests, self.active)
        return create_batch(selected)

    def update(self, completed):
        """更新状态"""
        for req in completed:
            self.active.remove(req)
```

---

## 内存管理

### 物理块管理

```python
class BlockManager:
    """物理块分配器"""
    def __init__(self, num_blocks):
        self.num_blocks = num_blocks
        self.free_blocks = set(range(num_blocks))
        self.allocated = {}  # request_id -> blocks

    def allocate(self, num_blocks):
        """分配指定数量的块"""
        if len(self.free_blocks) < num_blocks:
            raise OutOfMemoryError()

        blocks = list(self.free_blocks)[:num_blocks]
        for block in blocks:
            self.free_blocks.remove(block)
        return blocks

    def free(self, blocks):
        """释放块"""
        for block in blocks:
            self.free_blocks.add(block)
```

### 内存碎片处理

```python
def defragment(kv_cache, page_table):
    """整理内存碎片"""
    # 1. 收集活跃 KV 数据
    active_kv = collect_active_kv(kv_cache, page_table)

    # 2. 重新分配到连续块
    for i, (key, value) in enumerate(active_kv):
        # 分配新块
        new_block = allocate_block(i)
        # 复制数据
        kv_cache[new_block] = (key, value)
        # 更新页表
        page_table[i] = new_block
```

---

## 性能优化

### CUDA 内核优化

```cpp
// paged_attention_kernel.cu
__global__ void paged_attention_kernel(
    const float* q,           // Query: [batch, heads, seq, d]
    const float* k_cache,     // Key Cache (paged)
    const float* v_cache,     // Value Cache (paged)
    const int* page_table,    // Page Table
    float* output,
    int seq_len,
    int block_size
) {
    extern __shared__ float shared_mem[];

    // 计算全局 ID
    int bid = blockIdx.x;
    int hid = threadIdx.x;

    // 从页表获取物理块
    int block_idx = page_table[bid];
    int offset_in_block = bid % block_size;

    // 计算 Attention
    float score = 0;
    for (int i = 0; i < block_size; ++i) {
        int phys_idx = block_idx * block_size + offset_in_block;

        // 加载 KV
        float k = k_cache[phys_idx];
        float v = v_cache[phys_idx];

        // 计算
        score += q[hid] * k;
    }

    // 输出
    output[bid * seq_len + hid] = score;
}
```

### CUDA Graph 优化

```python
import torch

# 捕获计算图
def capture_attention_graph():
    q = torch.randn(1, 32, 1024, 128, device='cuda')
    k_cache = torch.randn(1, 32, 1024, 128, device='cuda')
    v_cache = torch.randn(1, 32, 1024, 128, device='cuda')
    page_table = torch.randint(0, 100, (1, 1024), device='cuda')

    # 捕获图
    graph = torch.cuda.CUDAGraph()
    with torch.cuda.graph(graph):
        output = paged_attention(q, k_cache, v_cache, page_table)

    return graph

# 重放图
def run_attention(graph, q, k_cache, v_cache, page_table):
    return graph.replay(q, k_cache, v_cache, page_table)
```

---

## 面试要点

### 高频问题

**Q1: vLLM 相比传统 HuggingFace 推理的优势？**

A:
1. **PagedAttention**: 解决 KV Cache 内存碎片
2. **Continuous Batching**: 提高批处理效率
3. **CUDA 优化**: 更快的注意力计算
4. **高吞吐**: 更高的 tokens/sec

**Q2: PagedAttention 如何解决 KV Cache 碎片？**

A: 借鉴操作系统虚拟内存：
1. KV Cache 分页存储（每页固定大小）
2. 页表映射逻辑位置到物理页
3. 动态分配/释放页面，避免碎片

**Q3: Continuous Batching 的优势？**

A:
1. **动态批处理**: 根据请求实时组织批
2. **提高利用率**: 不浪费内存
3. **降低延迟**: 短序列可以更快完成

**Q4: vLLM 的 block_size 如何选择？**

A: 权衡内存效率和计算效率：
- **太小**: 页表开销大，管理复杂
- **太大**: 浪费内存（部分页未使用）
- **典型值**: 16-32 tokens/页

**Q5: 如何衡量 vLLM 的性能？**

A: 关键指标：
1. **吞吐量**: tokens/s (越高越好）
2. **延迟**: time to first token + tokens/s
3. **显存利用率**: 实际使用/总显存
4. **批大小**: 平均每批请求数

---

## 相关文档

- [KV Cache优化](/kb/kv-cache) - KV Cache 基础
- [模型量化技术](/kb/) - 内存优化
- [推理优化](/kb/) - 其他推理优化技术

---

## 参考文献

1. Kwon et al. "Efficient Memory Management for Large Language Model Serving with PagedAttention". 2023.
2. vLLM GitHub Repository. https://github.com/vllm-project/vllm
