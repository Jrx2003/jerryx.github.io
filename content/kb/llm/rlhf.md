---
title: RLHF深度解析
description: ''
date: null
tags: []
category: LLM
---
# RLHF 深度解析

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 高级
> **预计阅读时间**: 50 分钟

---

## 目录

1. [RLHF 概述](#rlhf-概述)
2. [三阶段训练流程](#三阶段训练流程)
3. [阶段 1: 指令微调 (SFT)](#阶段-1-指令微调-sft)
4. [阶段 2: 奖励模型 (RM)](#阶段-2-奖励模型-rm)
5. [阶段 3: PPO 优化](#阶段-3-ppo-优化)
6. [关键技巧](#关键技巧)
7. [与 DPO 对比](#与-dpo-对比)
8. [面试要点](#面试要点)

---

## RLHF 概述

### 核心思想

基于人类反馈的强化学习，将模型对齐到人类偏好。

```
预训练模型 (能力强，但对齐差)
         │
         ▼
    RLHF 训练 (对齐人类偏好)
         │
         ▼
    对齐模型 (能力 + 对齐)
```

### 为什么需要 RLHF

| 问题 | 说明 | 解决方案 |
|------|------|----------|
| **有害输出** | 模型可能生成有害内容 | 人类偏好反馈 |
| **格式不对** | 不遵循指令格式 | SFT 标准化 |
| **幻觉** | 编造事实 | 人类纠错 |
| **不一致** | 多轮对话不稳定 | 强化一致性 |

---

## 三阶段训练流程

### 整体流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                     阶段 1: 指令微调 (SFT)              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│  │ 指令数据集  │  │ 监督训练   │  │ SFT 模型   │              │
│  └────────────┘  └────────────┘  └──────┬─────┘              │
└───────────────────────────────────────────────┼─────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   阶段 2: 奖励模型 (RM)                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│  │ SFT 模型   │──│ 生成候选   │──│ 人类排序   │              │
│  └────────────┘  └────────────┘  └──────┬─────┘              │
│                      ▲                  │                   │
│                      │            ┌───────▼─────┐              │
│                      └────────────│ RM 训练    │              │
│                                   └──────┬─────┘              │
└───────────────────────────────────────────────┼─────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                 阶段 3: PPO 优化                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│  │ SFT 模型   │  │ 奖励模型   │  │ PPO 训练   │              │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘              │
│         │               │               │                    │
│         └───────────────┼───────────────┘                    │
│                         │                                  │
│                  ┌──────▼────────┐                          │
│                  │ RL 优化策略   │                          │
│                  │ (使用 RM 奖励)│                          │
│                  └──────┬────────┘                          │
│                         │                                  │
│                  ┌──────▼────────┐                          │
│                  │ 最终模型      │                          │
│                  └───────────────┘                          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 阶段 1: 指令微调 (SFT)

### 数据构造

```python
# 指令数据格式
{
    "instruction": "解释什么是机器学习",
    "input": "",
    "output": "机器学习是人工智能的一个分支..."
}

# 对话数据格式
{
    "messages": [
        {"role": "user", "content": "你好"},
        {"role": "assistant", "content": "你好！有什么我可以帮助你的？"}
    ]
}
```

### 训练目标

```python
def sft_loss(logits, labels, attention_mask):
    """
    logits: [batch, seq_len, vocab_size]
    labels: [batch, seq_len]
    attention_mask: [batch, seq_len]
    """
    # 只计算有效位置的损失
    shift_logits = logits[..., :-1, :].contiguous()
    shift_labels = labels[..., 1:].contiguous()
    shift_mask = attention_mask[..., 1:].contiguous()

    # 交叉熵损失
    loss = cross_entropy(
        shift_logits.view(-1, vocab_size),
        shift_labels.view(-1),
        reduction='none'
    )
    loss = (loss * shift_mask.view(-1)).sum() / shift_mask.sum()

    return loss
```

### 关键要点

| 要点 | 说明 |
|------|------|
| **多样化指令** | 覆盖各种任务和风格 |
| **质量优先** | 人类验证输出质量 |
| **格式一致性** | 统一的指令-响应格式 |

---

## 阶段 2: 奖励模型 (RM)

### 数据收集

1. **生成候选**:
```python
prompt = "如何学习编程？"
candidates = [
    sft_model.generate(prompt, temperature=0.7),
    sft_model.generate(prompt, temperature=0.7),
    sft_model.generate(prompt, temperature=0.7),
]
```

2. **人类排序**:
```python
ranking = {
    "prompt": "如何学习编程？",
    "completions": [
        "可以从基础语法开始，如 Python...",
        "编程很难，建议放弃...",
        "推荐先选择一门语言，然后..."
    ],
    "rank": [2, 1, 3]  # 人类排序
}
```

### RM 训练

```python
class RewardModel(nn.Module):
    """奖励模型，评分生成质量"""
    def __init__(self, base_model, d_model=768):
        super().__init__()
        self.base_model = base_model
        # 标量输出
        self.reward_head = nn.Sequential(
            nn.Linear(d_model, d_model),
            nn.ReLU(),
            nn.Linear(d_model, 1)
        )

    def forward(self, input_ids, attention_mask):
        # 使用 base_model 编码
        outputs = self.base_model(input_ids, attention_mask)
        pooled = outputs.last_hidden_state[:, 0]  # [CLS] 表示

        # 输出标量奖励
        reward = self.reward_head(pooled).squeeze(-1)
        return reward
```

### 训练目标

```python
def ranking_loss(r1, r2):
    """
    比较排序损失
    r1: 更好回答的奖励
    r2: 更差回答的奖励
    """
    # sigmoid 交叉熵
    return -torch.log(torch.sigmoid(r1 - r2) + 1e-8)

# 批处理
loss = 0
for batch in ranking_data:
    r1 = rm_model(batch.prompt, batch.completion_a)
    r2 = rm_model(batch.prompt, batch.completion_b)
    loss += ranking_loss(r1, r2) if batch.rank[0] < batch.rank[1] else ranking_loss(r2, r1)
```

---

## 阶段 3: PPO 优化

### PPO 核心公式

$$
L^{CLIP}(\theta) = \mathbb{E}_t \left[ \min(r_t(\theta) \hat{A}_t, \text{clip}(r_t(\theta) \hat{A}_t, 1-\epsilon, 1+\epsilon)) \right]
$$

其中：
- $r_t(\theta)$: 概率比，新旧策略概率之比
- $\hat{A}_t$: 优势估计
- $\epsilon$: 裁剪参数（通常 0.2）

### 完整 PPO 流程

```python
def ppo_step(policy_model, ref_model, reward_model, prompts):
    """
    policy_model: 当前策略模型（需要优化）
    ref_model: 参考模型（SFT 模型，用于 KL 约束）
    reward_model: 奖励模型
    prompts: 输入提示
    """

    # 1. 生成样本
    with torch.no_grad():
        old_log_probs, old_values, generations = policy_model.generate(
            prompts, sample=True
        )

    # 2. 计算奖励
    with torch.no_grad():
        rewards = reward_model(prompts, generations)
        # KL 散度惩罚
        ref_log_probs = ref_model.log_prob(prompts, generations)
        kl_penalty = old_log_probs - ref_log_probs
        adjusted_rewards = rewards - beta * kl_penalty

    # 3. 计算优势
    advantages = compute_advantages(rewards, values)

    # 4. PPO 损失
    # 重新计算当前策略的 log_probs
    new_log_probs, new_values = policy_model.log_prob(prompts, generations)

    # 概率比
    ratio = torch.exp(new_log_probs - old_log_probs)

    # PPO 损失
    surrogate1 = ratio * advantages
    surrogate2 = torch.clamp(ratio, 1 - epsilon, 1 + epsilon) * advantages
    policy_loss = -torch.min(surrogate1, surrogate2).mean()

    # 价值函数损失
    value_loss = F.mse_loss(new_values, rewards)

    # 总损失
    total_loss = policy_loss + c1 * value_loss - c2 * entropy_bonus

    # 5. 优化
    total_loss.backward()
    optimizer.step()

    return total_loss
```

---

## 关键技巧

### 1. KL 散度约束

防止模型偏离 SFT 模型太远：

$$
\text{Reward}_{\text{adjusted}} = \text{Reward}_{\text{raw}} - \beta \cdot D_{\text{KL}}(\pi_\theta || \pi_{\text{ref}})
$$

| 效果 | 说明 |
|------|------|
| $\beta$ 太小 | 过度优化，可能出现混乱输出 |
| $\beta$ 太大 | 模型不敢创新，输出保守 |

### 2. 价值函数裁剪

```python
# 裁剪过大的优势估计
advantages = torch.clamp(advantages, -clip_value, clip_value)
```

### 3. 混合训练

混合不同来源的奖励：

$$
R = \alpha R_{\text{human}} + (1-\alpha) R_{\text{code}} + \gamma R_{\text{helpfulness}}
$$

### 4. 拒绝采样

训练时拒绝采样低质量样本：

```python
# 如果奖励低于阈值，减少学习
if reward < threshold:
    weight = weight_decay_factor
else:
    weight = 1.0
loss = weight * ppo_loss
```

---

## 与 DPO 对比

| 维度 | RLHF | DPO |
|------|------|------|
| 需要奖励模型 | 是 | 否 |
| 训练稳定性 | 中等 | 高 |
| 实现复杂度 | 高（三阶段）| 低（单阶段）|
| 内存需求 | 高（需要策略 + 价值 + RM）| 中等 |
| 训练效率 | 低（PPO 样本效率低）| 高（直接偏好优化）|

详见 [DPO直接偏好优化](/kb/dpo)。

---

## 面试要点

### 高频问题

**Q1: RLHF 的三个阶段是什么？**

A:
1. **SFT**: 指令微调，让模型理解任务格式
2. **RM**: 训练奖励模型，学习人类偏好
3. **PPO**: 使用 RM 奖励优化生成策略

**Q2: 为什么 PPO 中需要参考模型？**

A: 用于计算 KL 散度约束，防止模型过度优化偏离 SFT 模型：
- 防止奖励黑客（Reward Hacking）
- 保持生成质量稳定性

**Q3: KL 散度惩罚的作用？**

A: 平衡优化和创新：
- KL 太大：模型过度偏离，可能产生混乱输出
- KL 适中：合理优化，保持稳定性

**Q4: 拒绝采样 (Rejection Sampling) 的作用？**

A: 训练时丢弃低质量样本：
- 减少噪声影响
- 提高训练效率
- 特别在 RLHF 早期

**Q5: RM 训练使用什么损失？**

A: 比较损失（Pairwise Loss）：

$$
L = -\log \sigma(r_{\text{better}} - r_{\text{worse}})
$$

确保正确排序的答案获得更高奖励。

---

## 相关文档

- [DPO直接偏好优化](/kb/dpo) - 替代对齐方法
- [对齐技术对比](/kb/) - 不同方法对比
- [指令微调与SFT](/kb/sft) - 第一阶段详解

---

## 参考文献

1. Ouyang et al. "Training Language Models to Follow Instructions with Human Feedback". 2022.
2. Stiennon et al. "Learning to Summarize with Human Feedback". 2020.
3. Ziegler et al. "Fine-Tuning Language Models from Human Preferences". 2019.
4. Schulman et al. "Proximal Policy Optimization Algorithms". 2017.
