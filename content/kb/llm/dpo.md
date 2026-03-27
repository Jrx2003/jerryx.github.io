---
title: DPO直接偏好优化
description: ''
date: null
tags: []
category: LLM
---
# DPO 直接偏好优化

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 高级
> **预计阅读时间**: 40 分钟

---

## 目录

1. [DPO 概述](#dpo-概述)
2. [与 RLHF 对比](#与-rlhf-对比)
3. [DPO 数学推导](#dpo-数学推导)
4. [DPO 算法流程](#dpo-算法流程)
5. [DPO 变体](#dpo-变体)
6. [实现技巧](#实现技巧)
7. [面试要点](#面试要点)

---

## DPO 概述

### 核心思想

DPO (Direct Preference Optimization) 直接优化偏好数据，无需训练奖励模型。

```
RLHF 三阶段:
SFT → RM → PPO
   ↓      ↓     ↓
  训练   训练  强化学习 (复杂)

DPO 单阶段:
偏好数据 → DPO 训练
   ↓
  直接优化 (简单)
```

### 关键洞察

从 Bradley-Terry 模型出发，推导出不需要显式 RM 的目标函数。

---

## 与 RLHF 对比

| 维度 | RLHF | DPO |
|------|-------|-----|
| 阶段数 | 3 (SFT + RM + PPO) | 1 |
| 奖励模型 | 需要 | 不需要 |
| 复杂度 | 高（PPO 采样）| 低（直接优化）|
| 训练稳定性 | 中等 | 高 |
| 内存需求 | 高（策略 + 价值 + RM）| 中等 |

---

## DPO 数学推导

### Bradley-Terry 模型

给定两个回答 $y_w$（更优）和 $y_l$（更差），偏好概率：

$$
P(y_w \succ y_l | x) = \frac{\exp(r_\pi(x, y_w))}{\exp(r_\pi(x, y_w)) + \exp(r_\pi(x, y_l))}
$$

其中 $r_\pi(x, y)$ 是策略 $\pi$ 的隐式奖励。

### DPO 目标函数

通过对数变换，消去奖励函数：

$$
L_{\text{DPO}}(\pi_\theta; x, y_w, y_l) = -\log \sigma \left( \beta \log \frac{\pi_\theta(y_w | x)}{\pi_\theta(y_l | x)} \right)
$$

其中：
- $\pi_\theta(y | x)$: 模型概率
- $\beta$: 温度参数

### 优势估计

$$
A_\pi(x, y) = \log \pi_\theta(y | x) - \log \pi_{\text{ref}}(y | x)
$$

其中 $\pi_{\text{ref}}$ 是参考模型（通常是 SFT 模型）。

---

## DPO 算法流程

### 训练步骤

```python
def dpo_step(model, ref_model, preference_batch, beta=0.1):
    """
    model: 需要优化的策略模型
    ref_model: 参考模型（冻结）
    preference_batch: {
        "prompt": prompt,
        "chosen": 更好的回答,
        "rejected": 更差的回答
    }
    """
    # 1. 计算模型概率
    chosen_logp = model.log_prob(preference_batch.prompt, preference_batch.chosen)
    rejected_logp = model.log_prob(preference_batch.prompt, preference_batch.rejected)

    # 2. 计算参考概率
    with torch.no_grad():
        chosen_ref_logp = ref_model.log_prob(preference_batch.prompt, preference_batch.chosen)
        rejected_ref_logp = ref_model.log_prob(preference_batch.prompt, preference_batch.rejected)

    # 3. 计算优势
    pi_logratios = chosen_logp - rejected_logp
    ref_logratios = chosen_ref_logp - rejected_ref_logp
    losses = -F.logsigmoid(beta * (pi_logratios - ref_logratios))

    # 4. 优化
    loss = losses.mean()
    loss.backward()
    optimizer.step()

    return loss
```

### 数据格式

```python
# DPO 训练数据
training_data = [
    {
        "prompt": "解释什么是机器学习",
        "chosen": "机器学习是人工智能的一个分支...",
        "rejected": "机器学习就是用代码写算法"
    },
    {
        "prompt": "如何训练神经网络？",
        "chosen": "训练神经网络需要：1) 准备数据...",
        "rejected": "训练就是 run 代码"
    },
    ...
]
```

---

## DPO 变体

### 1. IPO (Identity Policy Optimization)

改进 DPO 的数值稳定性：

$$
L_{\text{IPO}}(\theta; x, y_w, y_l) = \frac{1}{2} \left( \log \frac{\sigma(h(x, y_w; \theta))}{\sigma(h(x, y_l; \theta))} - \text{clip}((h_w - h_l) - \beta, -2, 2) \right)^2
$$

### 2. KTO (Kahneman-Tversky Optimization)

不需要成对偏好数据，使用单输出质量标签。

| 数据需求 | DPO | KTO |
|---------|------|-----|
| 成对偏好 | 需要 | 不需要 |
| 单标签 | 不需要 | 需要 |

### 3. ORPO (Odds Ratio Policy Optimization)

增加归一化约束：

$$
L_{\text{ORPO}} = L_{\text{DPO}} + \lambda \cdot \left( \frac{\pi_\theta(y_w | x)}{\pi_\theta(y_l | x)} - 1 \right)^2
```

---

## 实现技巧

### 1. 参考模型冻结

```python
# 参考模型不参与训练
for param in ref_model.parameters():
    param.requires_grad = False
```

### 2. 梯度裁剪

```python
# 防止梯度爆炸
torch.nn.utils.clip_grad_norm_(model.parameters(), max_grad_norm=1.0)
```

### 3. 温度调优

```python
# beta 影响 KL 约束强度
beta_values = [0.1, 0.2, 0.5, 1.0]
# 通常从 0.1 开始，逐步增加
```

### 4. 数据增强

```python
# 随机交换 chosen 和 rejected
if random.random() < 0.5:
    batch['chosen'], batch['rejected'] = batch['rejected'], batch['chosen']
```

---

## 面试要点

### 高频问题

**Q1: DPO 相比 RLHF 的优势？**

A:
1. **简单**: 单阶段，无需训练 RM
2. **稳定**: 直接优化，无 PPO 采样噪声
3. **高效**: 梯度直接利用偏好数据
4. **实现简单**: 几行代码即可

**Q2: DPO 中的参考模型作用？**

A: 用于计算 KL 散度约束，防止模型偏离参考策略太远：
- 没有 ref：可能过度优化，产生混乱输出
- 有 ref：保持生成稳定性

**Q3: DPO 的损失函数含义？**

A:
$$
L = -\log \sigma(\beta \cdot \log \frac{p(y_w|x)}{p(y_l|x)})
$$

- $\log \frac{p(y_w|x)}{p(y_l|x)}$: 模型对更优回答的相对偏好
- $\beta$: 控制优化强度
- $\sigma$: 确保数值稳定

**Q4: IPO 相比 DPO 的改进？**

A:
1. **数值稳定**: 使用 logit 而非概率
2. **平方损失**: 更稳定的梯度
3. **自适应约束**: 避免梯度爆炸

**Q5: 如何选择 DPO vs RLHF？**

| 场景 | 推荐 |
|--------|------|
| 快速原型 | DPO |
| 数据有限 | DPO（偏好数据更高效）|
| 需要精确控制 | RLHF |
| 计算资源有限 | DPO |

---

## 相关文档

- [RLHF深度解析](/kb/rlhf) - RLHF 三阶段详解
- [对齐技术对比](/kb/) - 不同方法对比
- [指令微调与SFT](/kb/sft) - 基础对齐方法

---

## 参考文献

1. Rafailov et al. "Direct Preference Optimization: Your Language Model is Secretly a Reward Model". 2023.
2. Azar et al. "A General Theoretical Paradigm to Innate and Learned Perceptual Biases in RL". 2023.
3. Ethayarajh et al. "KTO: Kahneman-Tversky Optimized DPO". 2024.
