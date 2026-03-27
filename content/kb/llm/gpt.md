---
title: GPT系列模型演进
description: ''
date: null
tags: []
category: LLM
---
# GPT 系列模型演进

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 初级
> **预计阅读时间**: 40 分钟

---

## 目录

1. [GPT-1: Generative Pre-trained Transformer](#gpt-1-generative-pre-trained-transformer)
2. [GPT-2: Language Models are Unsupervised Multitask Learners](#gpt-2-language-models-are-unsupervised-multitask-learners)
3. [GPT-3: Language Models are Few-Shot Learners](#gpt-3-language-models-are-few-shot-learners)
4. [GPT-3.5: Chat 模型与指令跟随](#gpt-35-chat-模型与指令跟随)
5. [GPT-4: 多模态与能力跃升](#gpt-4-多模态与能力跃升)
6. [开源 GPT 模型](#开源-gpt-模型)
7. [面试要点](#面试要点)

---

## GPT-1: Generative Pre-trained Transformer

### 核心贡献

2018 年 OpenAI 提出首个基于 Transformer 的生成式语言模型。

| 特性 | 说明 |
|------|------|
| **架构** | Decoder-only Transformer |
| **训练** | 无监督语言建模 |
| **微调** | 针对下游任务有监督微调 |

### 模型规模

| 模型 | 层数 | 嵌入维度 | 参数量 |
|------|-------|-----------|--------|
| GPT-1 Small | 8 | 512 | 117M |
| GPT-1 Medium | 12 | 768 | 345M |
| GPT-1 Large | 24 | 1024 | 762M |

### 训练流程

```
阶段 1: 无监督预训练
    │
    ├─→ 收集大规模文本 (BooksCorpus, ~5GB)
    ├─→ 训练语言模型目标 (自回归)
    └─→ 学习通用语言表示

阶段 2: 有监督微调
    │
    ├─→ 下游任务数据 (分类、QA、推理)
    ├─→ 添加任务特定层
    └─→ 端到端微调
```

---

## GPT-2: Language Models are Unsupervised Multitask Learners

### 核心突破

2019 年，提出**零样本学习**，展示大模型的通用能力。

| 能力 | 说明 |
|------|------|
| **零样本** | 不需要任务示例 |
| **多任务** | 一个模型处理多种任务 |
| **涌现能力** | 超大规模后出现新能力 |

### 模型规模

| 模型 | 层数 | 嵌入维度 | 参数量 |
|------|-------|-----------|--------|
| GPT-2 Small | 12 | 768 | 117M |
| GPT-2 Medium | 24 | 1024 | 345M |
| GPT-2 Large | 36 | 1280 | 774M |
| GPT-2 XL | 48 | 1600 | 1558M |

### 多任务学习

GPT-2 将下游任务视为"文本补全"任务：

```
翻译: Translate English to French: Hello → Bonjour
QA: Answer the question: What is capital of China? → Beijing
摘要: Summarize: The quick brown fox... → A fox jumped.
```

---

## GPT-3: Language Models are Few-Shot Learners

### 涌现现象

2020 年，GPT-3 (175B) 展示**涌现能力**。

| 规模 | 参数量 | 涌现能力 |
|------|--------|----------|
| Small | 125M | 基础语言能力 |
| Medium | 350M | 简单推理 |
| Large | 1.3B | 编程基础 |
| XL | 6.7B | 编码、逻辑推理 |
| 13B | 13B | 复杂推理 |
| 175B | 175B | 上下文学习、算术、翻译 |

### 学习范式对比

| 范式 | 示例 | 说明 |
|------|------|------|
| **零样本 (Zero-shot)** | 直接任务描述 | 没有示例 |
| **单样本 (One-shot)** | 1 个示例 | 快速适应 |
| **少样本 (Few-shot)** | k 个示例 | 上下文学习 |

### 上下文学习 (In-Context Learning)

```
输入:
Q: 1 + 2 = ?
A: 3

Q: 2 + 3 = ?
A: 5

Q: 3 + 4 = ?
A: [模型补全] → 7
```

模型不更新参数，而是通过上下文学习任务。

---

## GPT-3.5: Chat 模型与指令跟随

### 核心改进

2022 年，基于 GPT-3 的 Chat 模型。

| 改进 | 说明 |
|------|------|
| **人类反馈强化学习 (RLHF)** | 对齐人类偏好 |
| **指令微调 (SFT)** | 理解和执行指令 |
| **对话能力** | 多轮对话 |
| **安全对齐** | 减少有害输出 |

### 训练流程

```
1. 预训练 (GPT-3)
    │
    ↓
2. 指令微调 (SFT)
    │
    ├─→ 收集人类指令-响应对
    ├─→ 监督训练
    └─→ 模型学会遵循指令
    │
    ↓
3. 奖励模型 (RM)
    │
    ├─→ 收集人类偏好 (A vs B)
    ├─→ 训练 RM 评分输出
    └─→ 量化回答质量
    │
    ↓
4. PPO 强化学习
    │
    ├─→ 用 RM 奖励引导生成
    ├─→ KL 散度约束 (保持与 SFT 接近)
    └─→ 对齐人类偏好
```

详见 [RLHF深度解析](/kb/rlhf)。

---

## GPT-4: 多模态与能力跃升

### 核心特性

2023 年，GPT-4 展示跨越式提升。

| 特性 | 说明 |
|------|------|
| **多模态** | 文本 + 图像输入 |
| **工具使用** | 代码解释器、浏览、API 调用 |
| **推理能力** | 复杂逻辑推理、数学证明 |
| **安全性** | 更好的对齐和拒绝机制 |

### 能力对比

| 任务 | GPT-3.5 | GPT-4 | 提升 |
|------|----------|--------|------|
| MMLU | 70% | 86% | +16% |
| HumanEval | 48% | 67% | +19% |
| Codeforces | 50th | 80th | +30 percentile |
| 复杂推理 | 困难 | 优秀 | 显著提升 |

### 训练推测

```
1. 大规模预训练
    │
    ├─→ 文本数据 (万亿 token)
    ├─→ 图像-文本对齐数据
    └─→ 混合多模态预训练
    │
2. 指令微调
    │
    ├─→ 代码指令数据集
    ├─→ 推理指令数据集
    └─→ 多模态指令数据集
    │
3. 对齐训练
    │
    ├─→ RLHF 扩展到多模态
    └─→ 更强的安全训练
```

---

## 开源 GPT 模型

### LLaMA 系列

| 模型 | 参数量 | 特点 |
|------|--------|------|
| LLaMA-7B | 7B | 基础开源模型 |
| LLaMA-13B | 13B | 中等规模 |
| LLaMA-30B | 30B | 大规模开源 |
| LLaMA-2-7B | 7B | RoPE、GQA、更长上下文 |
| LLaMA-3 | 8B-70B | 多种规模，GQA |

### Qwen 系列

| 模型 | 参数量 | 特点 |
|------|--------|------|
| Qwen-7B | 7B | 中文优化 |
| Qwen-14B | 14B | 中等规模 |
| Qwen-72B | 72B | 大规模 |
| Qwen-2.5 | 0.5B-72B | 代码、数学能力强 |

### 其他开源模型

| 模型 | 特点 |
|------|------|
| **Mistral** | MoE 架构，效率高 |
| **Baichuan** | 中英双语 |
| **Falcon** | 高效训练 |
| **MPT** | 稳定训练、长上下文 |

---

## 面试要点

### 高频问题

**Q1: GPT 系列从 GPT-1 到 GPT-4 的主要演进？**

A:
1. **GPT-1**: 首次用 Transformer 做生成式预训练
2. **GPT-2**: 展示零样本和多任务能力
3. **GPT-3**: 涌现现象，上下文学习
4. **GPT-3.5**: RLHF 对齐，指令跟随
5. **GPT-4**: 多模态、工具使用、推理能力跃升

**Q2: 什么是涌现能力？**

A: 当模型规模超过一定阈值时，突然出现的新能力：
- 小规模：无法完成
- 阈值附近：能力不稳定
- 超过阈值：稳定涌现

常见涌现：算术、编程、逻辑推理

**Q3: 上下文学习 (ICL) vs 微调？**

| 特性 | 上下文学习 | 微调 |
|------|-------------|------|
| 参数更新 | 否 | 是 |
| 适应新任务 | 换 prompt | 重新训练 |
| 存储需求 | 上下文长度 | 模型文件 |
| 成本 | 每次 token | 一次性 |

**Q4: RLHF 的三个阶段？**

A:
1. **SFT**: 指令微调，学习任务格式
2. **RM**: 训练奖励模型，量化人类偏好
3. **PPO**: 使用 RM 优化生成策略

详见 [RLHF深度解析](/kb/rlhf)。

**Q5: GQA 在现代模型中的作用？**

A: 分组查询注意力，平衡效果和效率：
- LLaMA-2: GQA
- Qwen: GQA
- Mistral: GQA

详见 [KV Cache优化](/kb/kv-cache)。

---

## 相关文档

- [Transformer详解](/kb/transformer) - 架构基础
- [RLHF深度解析](/kb/rlhf) - 对齐技术
- [DPO直接偏好优化](/kb/dpo) - 替代对齐方法
- [KV Cache优化](/kb/kv-cache) - 推理优化

---

## 参考文献

1. Radford et al. "Improving Language Understanding by Generative Pre-training". 2018.
2. Radford et al. "Language Models are Unsupervised Multitask Learners". 2019.
3. Brown et al. "Language Models are Few-Shot Learners". 2020.
4. Ouyang et al. "Training Language Models to Follow Instructions with Human Feedback". 2022.
5. OpenAI. "GPT-4 System Card". 2023.
