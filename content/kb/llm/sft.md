---
title: 指令微调与 SFT
description: ''
date: null
tags: []
category: LLM
---
# 指令微调与 SFT

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 45 分钟

---

## 目录

1. [SFT 概述](#sft-概述)
2. [指令数据构建](#指令数据构建)
3. [训练策略](#训练策略)
4. [面试要点](#面试要点)

---

## SFT 概述

### 什么是指令微调

Supervised Fine-Tuning (SFT) 让预训练模型学会遵循指令。

```
预训练模型: 预测下一个 token
SFT 后模型: 理解并执行指令

示例:
输入: "请将以下句子翻译成法语: Hello world"
输出: "Bonjour le monde"
```

### SFT 流程

```
预训练模型 → 指令数据 → SFT 训练 → 指令遵循模型
```

---

## 指令数据构建

### 数据格式

```json
{
  "instruction": "请总结以下文章",
  "input": "文章正文...",
  "output": "总结内容..."
}
```

### 数据多样性

| 类型 | 示例 |
|------|------|
| 问答 | 开放问答、知识问答 |
| 生成 | 写作、翻译、摘要 |
| 推理 | 数学、逻辑、代码 |
| 对话 | 多轮对话、角色扮演 |

---

## 训练策略

### 参数设置

```python
training_args = TrainingArguments(
    learning_rate=2e-5,
    batch_size=32,
    num_epochs=3,
    warmup_ratio=0.1,
    weight_decay=0.01
)
```

### 损失函数

```python
# 只在 output 部分计算损失
loss = cross_entropy(output_logits, output_labels)
```

---

## 面试要点

**Q1: SFT 和预训练的区别？**

A:
- 预训练: 无监督，预测下一个 token
- SFT: 有监督，学习指令-输出映射

**Q2: 指令数据质量要求？**

A:
- 多样性
- 准确性
- 格式统一
- 足够数量
