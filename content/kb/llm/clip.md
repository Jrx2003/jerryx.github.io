---
title: CLIP 与视觉编码
description: ''
date: null
tags: []
category: LLM
---
# CLIP 与视觉编码

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 45 分钟

---

## 目录

1. [CLIP 概述](#clip-概述)
2. [对比学习](#对比学习)
3. [视觉编码器](#视觉编码器)
4. [应用](#应用)
5. [面试要点](#面试要点)

---

## CLIP 概述

### 什么是 CLIP

CLIP (Contrastive Language-Image Pre-training) 学习视觉和语言的联合表示。

```
核心思想:
- 大规模图文对预训练
- 对比学习对齐两种模态
- 强大的零样本能力
```

### 架构

```
图像编码器 (ViT/CNN)
       ↓
   图像特征
       ↓
   对比学习 ←→ 文本特征
       ↑
   文本编码器 (Transformer)
```

---

## 对比学习

### 训练目标

```python
def contrastive_loss(image_features, text_features, temperature=0.07):
    # 归一化
    image_features = F.normalize(image_features, dim=-1)
    text_features = F.normalize(text_features, dim=-1)

    # 相似度矩阵
    logits = torch.matmul(image_features, text_features.T) / temperature

    # 对角线是正样本
    labels = torch.arange(len(logits))

    loss_i2t = F.cross_entropy(logits, labels)
    loss_t2i = F.cross_entropy(logits.T, labels)

    return (loss_i2t + loss_t2i) / 2
```

---

## 视觉编码器

### ViT

```python
class VisionTransformer(nn.Module):
    def __init__(self, img_size=224, patch_size=16, embed_dim=768):
        self.patch_embed = nn.Conv2d(3, embed_dim, patch_size, patch_size)
        self.pos_embed = nn.Parameter(torch.zeros(1, (img_size//patch_size)**2 + 1, embed_dim))
        self.transformer = TransformerEncoder(...)
```

---

## 应用

### 零样本分类

```python
def zero_shot_classify(image, class_names):
    # 编码图像
    image_features = clip.encode_image(image)

    # 编码类别描述
    text_features = clip.encode_text([f"a photo of a {c}" for c in class_names])

    # 相似度
    similarity = image_features @ text_features.T
    return class_names[similarity.argmax()]
```

---

## 面试要点

**Q1: CLIP 的训练数据和规模？**

A:
- 4亿图文对
- 从互联网收集
- 对比学习预训练

**Q2: CLIP 的优势和局限？**

A:
- 优势: 零样本能力强
- 局限: 细粒度分类差，对组合概念理解有限
