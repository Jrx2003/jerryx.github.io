---
title: GraphSAGE 与 GAT
description: ''
date: null
tags: []
category: SearchRec
---
# GraphSAGE 与 GAT

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 45 分钟

---

## 目录

1. [GraphSAGE 详解](#graphsage-详解)
2. [GAT 详解](#gat-详解)
3. [对比与应用](#对比与应用)
4. [面试要点](#面试要点)

---

## GraphSAGE 详解

### 核心思想

GraphSAGE (SAmple and agGreGatE) 通过采样和聚合邻居特征来学习节点表示。

```
创新点:
- 采样固定数量邻居 (而非全图)
- 归纳式学习 (可处理未见节点)
- 多种聚合方式

聚合函数:
- Mean: 平均
- Max: 最大值
- LSTM: 序列建模
```

### 算法流程

```python
def graphsage_forward(x, adj, sample_size=10):
    # 1. 采样邻居
    neighbors = sample_neighbors(adj, sample_size)

    # 2. 聚合邻居特征
    neighbor_features = aggregate(x[neighbors])

    # 3. 拼接自身和邻居
    combined = concat([x, neighbor_features])

    # 4. 非线性变换
    output = relu(W @ combined)

    return output
```

### 实现

```python
class GraphSAGE(nn.Module):
    def __init__(self, in_dim, hidden_dim, out_dim, num_layers=2):
        super().__init__()
        self.layers = nn.ModuleList([
            SAGELayer(in_dim if i==0 else hidden_dim, hidden_dim)
            for i in range(num_layers)
        ])
        self.output = nn.Linear(hidden_dim, out_dim)

    def forward(self, x, adj):
        for layer in self.layers:
            x = layer(x, adj)
        return self.output(x)
```

---

## GAT 详解

### 核心思想

GAT (Graph Attention Network) 使用注意力机制为不同邻居分配不同权重。

```
注意力系数:
e_ij = a(W h_i, W h_j)
α_ij = softmax_j(e_ij)

更新:
h_i' = σ(Σ α_ij W h_j)
```

### 多头注意力

```python
class GATLayer(nn.Module):
    def __init__(self, in_dim, out_dim, num_heads=8):
        super().__init__()
        self.num_heads = num_heads
        self.W = nn.Linear(in_dim, out_dim * num_heads)
        self.attention = nn.Parameter(torch.Tensor(num_heads, out_dim * 2))

    def forward(self, x, adj):
        # 线性变换
        h = self.W(x)

        # 计算注意力分数
        attn_scores = self.compute_attention(h, adj)

        # 加权聚合
        output = torch.matmul(attn_scores, h)

        return output
```

---

## 对比与应用

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| GraphSAGE | 采样聚合、归纳学习 | 大图、动态图 |
| GAT | 注意力加权 | 需要区分邻居重要性 |

---

## 面试要点

**Q1: GraphSAGE 为什么能处理未见节点？**

A:
- 基于特征而非节点ID学习
- 采样机制不依赖全局结构
- 聚合函数可泛化

**Q2: GAT 相比 GCN 的优势？**

A:
- 自适应权重
- 可解释性更强
- 性能通常更好
