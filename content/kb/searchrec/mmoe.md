---
title: MMoE与多任务学习
description: ''
date: null
tags: []
category: SearchRec
---
# MMoE 与多任务学习

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 50 分钟

---

## 目录

1. [多任务学习概述](#多任务学习概述)
2. [硬参数共享](#硬参数共享)
3. [软参数共享](#软参数共享)
4. [MMoE 详解](#mmoe-详解)
5. [PLE 渐进式分层提取](#ple-渐进式分层提取)
6. [面试要点](#面试要点)

---

## 多任务学习概述

### 什么是多任务学习

多任务学习 (Multi-Task Learning, MTL) 旨在通过共享表示同时学习多个相关任务。

```
单任务学习:
输入 → 特征提取 → 任务A输出

多任务学习:
输入 → 共享特征提取 → 任务A输出
                    → 任务B输出
                    → 任务C输出

优势:
- 数据效率: 多个任务共享数据
- 正则化: 防止过拟合
- 知识迁移: 相关任务互相促进
```

### 推荐系统多任务

| 任务 | 说明 | 典型场景 |
|------|------|----------|
| CTR | 点击率预估 | 信息流 |
| CVR | 转化率预估 | 电商 |
| 观看时长 | 视频播放时长 | 短视频 |
| 点赞/收藏 | 互动行为 | 社交媒体 |
| 完播率 | 内容消费深度 | 视频平台 |

---

## 硬参数共享

### 基础架构

```python
class HardParameterSharing(nn.Module):
    """
    硬参数共享: 底层完全共享，顶层分离
    适用于任务高度相关的场景
    """

    def __init__(self, input_dim, shared_dims, task_dims):
        """
        Args:
            input_dim: 输入维度
            shared_dims: 共享层维度列表
            task_dims: 每个任务的塔维度列表
        """
        super().__init__()

        # 共享层 (所有任务共用)
        layers = []
        prev_dim = input_dim
        for dim in shared_dims:
            layers.extend([
                nn.Linear(prev_dim, dim),
                nn.ReLU(),
                nn.Dropout(0.2)
            ])
            prev_dim = dim
        self.shared_layers = nn.Sequential(*layers)

        # 任务特定塔
        self.task_towers = nn.ModuleList([
            self._build_tower(prev_dim, dims)
            for dims in task_dims
        ])

    def _build_tower(self, input_dim, hidden_dims):
        """构建任务塔"""
        layers = []
        prev_dim = input_dim
        for dim in hidden_dims[:-1]:
            layers.extend([
                nn.Linear(prev_dim, dim),
                nn.ReLU(),
                nn.Dropout(0.2)
            ])
            prev_dim = dim
        layers.append(nn.Linear(prev_dim, hidden_dims[-1]))
        return nn.Sequential(*layers)

    def forward(self, x):
        """
        Returns:
            List[torch.Tensor]: 每个任务的输出
        """
        # 共享特征
        shared_features = self.shared_layers(x)

        # 各任务预测
        task_outputs = [
            tower(shared_features) for tower in self.task_towers
        ]

        return task_outputs


# 使用示例: 电商推荐 (CTR + CVR)
model = HardParameterSharing(
    input_dim=128,
    shared_dims=[256, 128, 64],  # 共享层
    task_dims=[
        [32, 1],   # CTR 塔
        [32, 1]    # CVR 塔
    ]
)

features = torch.randn(32, 128)  # batch=32
ctr_pred, cvr_pred = model(features)
```

### 损失函数设计

```python
class MultiTaskLoss(nn.Module):
    """多任务损失函数"""

    def __init__(self, num_tasks, loss_weights=None):
        super().__init__()
        self.num_tasks = num_tasks

        # 手动设置权重
        if loss_weights is not None:
            self.weights = loss_weights
        else:
            # 可学习的权重 ( uncertainty weighting )
            self.log_vars = nn.Parameter(torch.zeros(num_tasks))

    def forward(self, task_losses):
        """
        Args:
            task_losses: List[Tensor] 每个任务的损失
        """
        if isinstance(self.weights, list):
            # 固定权重
            total_loss = sum(
                w * loss for w, loss in zip(self.weights, task_losses)
            )
        else:
            # 不确定性加权 (自动学习权重)
            # 参考: Multi-Task Learning Using Uncertainty to Weigh Losses
            total_loss = sum(
                torch.exp(-self.log_vars[i]) * task_losses[i] + self.log_vars[i]
                for i in range(self.num_tasks)
            )

        return total_loss


# 动态权重调整
class GradNorm:
    """
    GradNorm: Gradient Normalization for Adaptive Loss Balancing

    根据任务难度动态调整权重
    """

    def __init__(self, model, num_tasks, alpha=1.5):
        self.model = model
        self.num_tasks = num_tasks
        self.alpha = alpha
        self.initial_losses = None

    def compute_weights(self, task_losses, shared_params):
        """计算任务权重"""

        # 记录初始损失
        if self.initial_losses is None:
            self.initial_losses = [l.item() for l in task_losses]

        # 计算梯度范数
        grad_norms = []
        for loss in task_losses:
            grads = torch.autograd.grad(
                loss, shared_params, retain_graph=True
            )
            grad_norm = sum(g.norm() for g in grads if g is not None)
            grad_norms.append(grad_norm)

        # 计算平均梯度范数
        avg_grad_norm = sum(grad_norms) / len(grad_norms)

        # 计算相对反向训练速度
        relative_rates = [
            (self.initial_losses[i] / task_losses[i].item()) ** self.alpha
            for i in range(self.num_tasks)
        ]

        # 计算目标梯度范数
        target_norms = [
            avg_grad_norm * (relative_rates[i] ** self.alpha)
            for i in range(self.num_tasks)
        ]

        # 更新权重
        weights = [
            target_norms[i] / (grad_norms[i] + 1e-8)
            for i in range(self.num_tasks)
        ]

        return weights
```

---

## 软参数共享

### Cross-Stitch Network

```python
class CrossStitchNetwork(nn.Module):
    """
    Cross-Stitch Network: 通过学习组合参数实现软共享

    参考: Misra et al. "Cross-stitch Networks for Multi-task Learning"
    """

    def __init__(self, input_dim, num_tasks, num_layers):
        super().__init__()
        self.num_tasks = num_tasks
        self.num_layers = num_layers

        # 每个任务独立的网络层
        self.task_layers = nn.ModuleList([
            nn.ModuleList([
                nn.Sequential(
                    nn.Linear(input_dim if l == 0 else 128, 128),
                    nn.ReLU()
                )
                for l in range(num_layers)
            ])
            for _ in range(num_tasks)
        ])

        # Cross-stitch 单元: 学习如何组合不同任务的特征
        self.cross_stitch_units = nn.ParameterList([
            nn.Parameter(torch.eye(num_tasks))  # 初始化为单位矩阵
            for _ in range(num_layers)
        ])

    def forward(self, x):
        """
        x: [batch, input_dim]

        Returns:
            List[Tensor]: 每个任务的输出
        """
        # 初始化每个任务的输入
        task_features = [x for _ in range(self.num_tasks)]

        for layer_idx in range(self.num_layers):
            # 每个任务通过各自的层
            task_outputs = [
                self.task_layers[t][layer_idx](task_features[t])
                for t in range(self.num_tasks)
            ]

            # Cross-stitch: 组合不同任务的特征
            # [task_i_feature] = sum_j (alpha_ij * task_j_feature)
            stitch_matrix = self.cross_stitch_units[layer_idx]

            task_features = [
                sum(
                    stitch_matrix[t][j] * task_outputs[j]
                    for j in range(self.num_tasks)
                )
                for t in range(self.num_tasks)
            ]

        return task_features
```

---

## MMoE 详解

### 动机

```
硬参数共享的问题:
- 任务冲突: 不同任务可能竞争共享参数
- 跷跷板现象: 一个任务提升，另一个下降

MMoE 解决方案:
- 使用多个专家网络 (Experts)
- 每个任务学习选择不同的专家组合
- 自动学习任务间的关系
```

### 架构

```
输入特征
    │
    ▼
┌─────────────────────────────────────────────┐
│              门控网络 (Gating Network)        │
│  每个任务有一个门控网络，决定如何使用专家       │
│  输出 softmax 权重，表示对每个专家的偏好      │
└─────────────────────────────────────────────┘
    │
    ├───────────────────────────────────────────────┬───────────────────────────────────────────────┐
    │                                               │                                               │
    ▼                                               ▼                                               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   专家 1     │  │   专家 2     │  │   专家 3     │  │     ...      │  │   专家 n     │
│   Expert 1   │  │   Expert 2   │  │   Expert 3   │  │              │  │   Expert n   │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
    │               │               │                               │
    └───────────────┴───────────────┴───────────────────────────────┘
                              │
                              ▼
              加权融合: f(x) = sum_i (g_i(x) * expert_i(x))
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   任务 A 塔   │  │   任务 B 塔   │  │   任务 C 塔   │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 完整实现

```python
class Expert(nn.Module):
    """专家网络"""

    def __init__(self, input_dim, hidden_dim, dropout=0.2):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU()
        )

    def forward(self, x):
        return self.net(x)


class GatingNetwork(nn.Module):
    """门控网络"""

    def __init__(self, input_dim, num_experts):
        super().__init__()
        self.gate = nn.Sequential(
            nn.Linear(input_dim, num_experts),
            nn.Softmax(dim=-1)
        )

    def forward(self, x):
        """
        Returns:
            weights: [batch, num_experts] 每个专家对当前样本的权重
        """
        return self.gate(x)


class MMoE(nn.Module):
    """
    Multi-gate Mixture-of-Experts

    参考: Ma et al. "Modeling Task Relationships in Multi-task Learning"
    """

    def __init__(self, input_dim, num_experts, num_tasks,
                 expert_dim=128, task_hidden_dims=None):
        """
        Args:
            input_dim: 输入特征维度
            num_experts: 专家网络数量
            num_tasks: 任务数量
            expert_dim: 专家网络输出维度
            task_hidden_dims: 每个任务塔的隐藏层维度
        """
        super().__init__()

        self.num_experts = num_experts
        self.num_tasks = num_tasks

        # 共享的专家网络
        self.experts = nn.ModuleList([
            Expert(input_dim, expert_dim)
            for _ in range(num_experts)
        ])

        # 每个任务有自己的门控网络
        self.gates = nn.ModuleList([
            GatingNetwork(input_dim, num_experts)
            for _ in range(num_tasks)
        ])

        # 任务塔
        if task_hidden_dims is None:
            task_hidden_dims = [[64, 1] for _ in range(num_tasks)]

        self.task_towers = nn.ModuleList([
            self._build_task_tower(expert_dim, dims)
            for dims in task_hidden_dims
        ])

    def _build_task_tower(self, input_dim, hidden_dims):
        """构建任务塔"""
        layers = []
        prev_dim = input_dim
        for dim in hidden_dims[:-1]:
            layers.extend([
                nn.Linear(prev_dim, dim),
                nn.ReLU(),
                nn.Dropout(0.2)
            ])
            prev_dim = dim
        layers.append(nn.Linear(prev_dim, hidden_dims[-1]))
        return nn.Sequential(*layers)

    def forward(self, x):
        """
        Args:
            x: [batch, input_dim]

        Returns:
            List[Tensor]: 每个任务的输出
        """
        # 所有专家的输出
        expert_outputs = torch.stack([
            expert(x) for expert in self.experts
        ], dim=1)  # [batch, num_experts, expert_dim]

        task_outputs = []

        for task_idx in range(self.num_tasks):
            # 门控权重 [batch, num_experts]
            gate_weights = self.gates[task_idx](x)

            # 加权融合专家输出
            # [batch, num_experts, 1] * [batch, num_experts, expert_dim]
            weighted_experts = (
                gate_weights.unsqueeze(-1) * expert_outputs
            ).sum(dim=1)  # [batch, expert_dim]

            # 任务塔
            output = self.task_towers[task_idx](weighted_experts)
            task_outputs.append(output)

        return task_outputs

    def get_expert_utilization(self, x):
        """
        获取专家使用统计 (用于分析)

        Returns:
            List[Tensor]: 每个任务的专家使用分布
        """
        utilizations = []
        for task_idx in range(self.num_tasks):
            gate_weights = self.gates[task_idx](x)
            avg_weights = gate_weights.mean(dim=0)  # [num_experts]
            utilizations.append(avg_weights)

        return utilizations


# 使用示例: 短视频推荐 (CTR + 完播率 + 点赞)
model = MMoE(
    input_dim=256,
    num_experts=8,      # 8 个专家
    num_tasks=3,        # 3 个任务
    expert_dim=128,
    task_hidden_dims=[
        [64, 1],        # CTR: 二分类
        [64, 1],        # 完播率: 回归
        [64, 1]         # 点赞: 二分类
    ]
)

features = torch.randn(64, 256)
ctr_logits, completion_pred, like_logits = model(features)

# 计算损失
criterion_ctr = nn.BCEWithLogitsLoss()
criterion_completion = nn.MSELoss()
criterion_like = nn.BCEWithLogitsLoss()

loss_ctr = criterion_ctr(ctr_logits.squeeze(), labels_ctr)
loss_completion = criterion_completion(completion_pred.squeeze(), labels_completion)
loss_like = criterion_like(like_logits.squeeze(), labels_like)

# 多任务损失
multi_task_loss = loss_ctr + loss_completion + loss_like
```

### MMoE 分析

```python
def analyze_mmoe_experts(model, dataloader):
    """分析 MMoE 专家使用情况"""

    all_utilizations = [[] for _ in range(model.num_tasks)]

    for batch in dataloader:
        features = batch['features']

        utilizations = model.get_expert_utilization(features)

        for task_idx, util in enumerate(utilizations):
            all_utilizations[task_idx].append(util.detach().cpu())

    # 计算平均使用分布
    avg_utilizations = [
        torch.stack(utils).mean(dim=0)
        for utils in all_utilizations
    ]

    # 打印结果
    for task_idx, util in enumerate(avg_utilizations):
        print(f"任务 {task_idx} 的专家使用分布:")
        for expert_idx, weight in enumerate(util):
            print(f"  专家 {expert_idx}: {weight:.4f}")

    # 可视化
    import matplotlib.pyplot as plt

    fig, axes = plt.subplots(1, model.num_tasks, figsize=(15, 4))

    for task_idx, util in enumerate(avg_utilizations):
        axes[task_idx].bar(range(model.num_experts), util.numpy())
        axes[task_idx].set_title(f"任务 {task_idx}")
        axes[task_idx].set_xlabel("专家编号")
        axes[task_idx].set_ylabel("平均权重")

    plt.tight_layout()
    plt.savefig('mmoe_expert_utilization.png')
```

---

## PLE 渐进式分层提取

### PLE 架构

PLE (Progressive Layered Extraction) 解决了 MMoE 中专家被所有任务共享可能导致冲突的问题。

```
PLE 核心思想:
1. 显式分离共享专家和任务特定专家
2. 多层渐进式提取

架构:
┌─────────────────────────────────────────────────────────────┐
│                      第一层                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 任务A专家   │  │ 共享专家    │  │ 任务B专家   │         │
│  │ (task-specific)│ (shared)    │  │ (task-specific)│         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      第二层                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 任务A专家   │  │ 共享专家    │  │ 任务B专家   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   任务 A 塔   │  │              │  │   任务 B 塔   │
└──────────────┘  │              │  └──────────────┘
                  │    任务 C 塔   │
                  └──────────────┘
```

### 实现

```python
class PLELayer(nn.Module):
    """PLE 单层"""

    def __init__(self, input_dim, num_tasks, num_shared_experts,
                 num_task_experts, expert_dim):
        super().__init__()

        self.num_tasks = num_tasks

        # 共享专家
        self.shared_experts = nn.ModuleList([
            Expert(input_dim, expert_dim)
            for _ in range(num_shared_experts)
        ])

        # 任务特定专家
        self.task_experts = nn.ModuleList([
            nn.ModuleList([
                Expert(input_dim, expert_dim)
                for _ in range(num_task_experts)
            ])
            for _ in range(num_tasks)
        ])

        # 门控网络 (每个任务看到: 自己的专家 + 共享专家)
        total_experts_per_task = num_task_experts + num_shared_experts
        self.gates = nn.ModuleList([
            GatingNetwork(input_dim, total_experts_per_task)
            for _ in range(num_tasks)
        ])

    def forward(self, x):
        """
        Returns:
            List[Tensor]: 每个任务的输出特征
        """
        # 共享专家输出
        shared_outputs = torch.stack([
            expert(x) for expert in self.shared_experts
        ], dim=1)  # [batch, num_shared, expert_dim]

        task_outputs = []

        for task_idx in range(self.num_tasks):
            # 任务特定专家输出
            task_specific_outputs = torch.stack([
                expert(x) for expert in self.task_experts[task_idx]
            ], dim=1)  # [batch, num_task_experts, expert_dim]

            # 拼接: 任务专家 + 共享专家
            all_experts = torch.cat([
                task_specific_outputs, shared_outputs
            ], dim=1)

            # 门控
            gate_weights = self.gates[task_idx](x)

            # 加权融合
            weighted = (
                gate_weights.unsqueeze(-1) * all_experts
            ).sum(dim=1)

            task_outputs.append(weighted)

        return task_outputs


class PLE(nn.Module):
    """
    Progressive Layered Extraction

    参考: Tang et al. "Progressive Layered Extraction"
    """

    def __init__(self, input_dim, num_tasks, num_levels=2,
                 num_shared_experts=2, num_task_experts=1,
                 expert_dim=128, task_hidden_dims=None):
        super().__init__()

        self.num_tasks = num_tasks
        self.num_levels = num_levels

        # 多层 PLE
        self.ple_layers = nn.ModuleList([
            PLELayer(
                input_dim if i == 0 else expert_dim,
                num_tasks,
                num_shared_experts,
                num_task_experts,
                expert_dim
            )
            for i in range(num_levels)
        ])

        # 任务塔
        if task_hidden_dims is None:
            task_hidden_dims = [[64, 1] for _ in range(num_tasks)]

        self.task_towers = nn.ModuleList([
            self._build_task_tower(expert_dim, dims)
            for dims in task_hidden_dims
        ])

    def _build_task_tower(self, input_dim, hidden_dims):
        layers = []
        prev_dim = input_dim
        for dim in hidden_dims[:-1]:
            layers.extend([
                nn.Linear(prev_dim, dim),
                nn.ReLU()
            ])
            prev_dim = dim
        layers.append(nn.Linear(prev_dim, hidden_dims[-1]))
        return nn.Sequential(*layers)

    def forward(self, x):
        # 逐层处理
        task_features = [x for _ in range(self.num_tasks)]

        for ple_layer in self.ple_layers:
            # 当前层使用上一层的输出
            task_features = ple_layer(
                torch.stack(task_features).mean(dim=0)
                if len(task_features) > 1 else task_features[0]
            )

        # 任务塔输出
        outputs = [
            tower(task_features[i])
            for i, tower in enumerate(self.task_towers)
        ]

        return outputs
```

---

## 面试要点

### 高频问题

**Q1: 多任务学习相比单任务学习的优势？**

A:
1. **数据效率**: 多个任务共享数据，每个任务都有更多训练信号
2. **正则化**: 共享参数减少过拟合
3. **知识迁移**: 相关任务可以互相促进
4. **推理效率**: 一次前向传播得到多个预测

**Q2: MMoE 相比硬参数共享的优势？**

A:
- **灵活性**: 每个任务可以选择不同的专家组合
- **任务关系建模**: 自动学习任务间的相关性
- **缓解冲突**: 不同任务可以使用不同的专家，减少参数竞争

**Q3: 如何设计多任务损失函数？**

A:
1. **固定权重**: 手动设置权重，简单直接
2. **不确定性加权**: 基于任务不确定性自动调整
3. **GradNorm**: 根据梯度大小动态平衡
4. **动态加权**: 根据任务难度调整

**Q4: PLE 相比 MMoE 的改进？**

A:
- **显式分离**: 分离任务特定专家和共享专家
- **渐进式提取**: 多层结构，信息逐层提取
- **减少干扰**: 任务特定信息不会污染其他任务

**Q5: 如何处理负迁移 (Negative Transfer)？**

A:
1. 使用 MMoE/PLE 等软共享架构
2. 任务聚类: 将相关任务分组
3. 动态加权: 减少不相关任务的影响
4. 任务特定层: 保留任务独特特征

---

## 相关文档

- [Wide&Deep架构](/kb/widedeep) - 基础推荐架构
- [DeepFM家族](/kb/deepfm) - 特征交叉
- [DIN与DIEN](/kb/dindien) - 序列建模

---

## 参考文献

1. Ma et al. "Modeling Task Relationships in Multi-task Learning with Multi-gate Mixture-of-Experts". 2018.
2. Tang et al. "Progressive Layered Extraction (PLE): A Novel Multi-Task Learning Model". 2020.
3. Misra et al. "Cross-stitch Networks for Multi-task Learning". 2016.
4. Kendall et al. "Multi-Task Learning Using Uncertainty to Weigh Losses". 2018.
