---
title: BERT与编码器模型
description: ''
date: null
tags: []
category: LLM
---
# BERT 与编码器模型

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 50 分钟

---

## 目录

1. [BERT 概述](#bert-概述)
2. [预训练任务](#预训练任务)
3. [BERT 架构详解](#bert-架构详解)
4. [BERT 变体](#bert-变体)
5. [编码器 vs 解码器](#编码器-vs-解码器)
6. [面试要点](#面试要点)

---

## BERT 概述

### 什么是 BERT

**BERT** (Bidirectional Encoder Representations from Transformers) 是 Google 于 2018 年提出的预训练语言模型，开创了 NLP 预训练的新时代。

```
BERT 核心创新:
1. 双向编码: 同时利用上下文信息
2. 预训练+微调范式: 通用预训练 + 下游任务微调
3. 深层双向: 12-24 层 Transformer Encoder
```

### BERT 模型规模

| 模型 | 层数 | 隐藏维度 | 参数量 | 注意力头数 |
|------|------|----------|--------|------------|
| BERT-Base | 12 | 768 | 110M | 12 |
| BERT-Large | 24 | 1024 | 340M | 16 |
| BERT-Tiny | 2 | 128 | 4M | 2 |

---

## 预训练任务

### Masked Language Model (MLM)

```python
class MaskedLM(nn.Module):
    """
    MLM: 随机 mask 部分 token，让模型预测

    示例:
    输入: "今天 [MASK] 气很好"
    输出: "天"
    """

    def __init__(self, bert_model, vocab_size):
        super().__init__()
        self.bert = bert_model
        self.cls = nn.Linear(bert_model.config.hidden_size, vocab_size)

    def forward(self, input_ids, attention_mask, labels=None):
        """
        input_ids: [batch, seq_len]
        labels: [batch, seq_len] (-100 表示非 mask 位置)
        """
        # BERT 编码
        outputs = self.bert(input_ids, attention_mask)
        sequence_output = outputs.last_hidden_state  # [batch, seq_len, hidden]

        # 预测 vocab
        prediction_scores = self.cls(sequence_output)  # [batch, seq_len, vocab_size]

        loss = None
        if labels is not None:
            # 只在 mask 位置计算损失
            loss_fct = nn.CrossEntropyLoss(ignore_index=-100)
            loss = loss_fct(
                prediction_scores.view(-1, self.config.vocab_size),
                labels.view(-1)
            )

        return {'loss': loss, 'logits': prediction_scores}


def create_mlm_inputs(tokens, vocab, mask_prob=0.15):
    """
    创建 MLM 训练数据

    对于被 mask 的 token:
    - 80% 概率替换为 [MASK]
    - 10% 概率替换为随机 token
    - 10% 概率保持不变
    """
    labels = [-100] * len(tokens)  # -100 表示不计算损失
    masked_tokens = tokens.copy()

    for i in range(len(tokens)):
        if random.random() < mask_prob:
            labels[i] = vocab[tokens[i]]  # 记录真实标签

            prob = random.random()
            if prob < 0.8:
                masked_tokens[i] = "[MASK]"
            elif prob < 0.9:
                # 随机 token
                masked_tokens[i] = random.choice(list(vocab.keys()))
            # else: 10% 保持不变

    return masked_tokens, labels
```

### Next Sentence Prediction (NSP)

```python
class NextSentencePrediction(nn.Module):
    """
    NSP: 预测两个句子是否有上下文关系

    示例:
    句子 A: "今天天气很好"
    句子 B: "我想出去散步" → IsNext (是连续的)

    句子 A: "今天天气很好"
    句子 B: "机器学习很有趣" → NotNext (不是连续的)
    """

    def __init__(self, bert_model):
        super().__init__()
        self.bert = bert_model
        # 二分类: IsNext / NotNext
        self.nsp = nn.Linear(bert_model.config.hidden_size, 2)

    def forward(self, input_ids, attention_mask, token_type_ids, labels=None):
        """
        token_type_ids: 0 表示句子 A, 1 表示句子 B
        """
        outputs = self.bert(
            input_ids,
            attention_mask=attention_mask,
            token_type_ids=token_type_ids
        )

        # 取 [CLS] token 的表示
        pooled_output = outputs.pooler_output  # [batch, hidden]

        # 分类
        logits = self.nsp(pooled_output)  # [batch, 2]

        loss = None
        if labels is not None:
            loss_fct = nn.CrossEntropyLoss()
            loss = loss_fct(logits, labels)

        return {'loss': loss, 'logits': logits}


def create_nsp_inputs(documents, nsp_prob=0.5):
    """创建 NSP 训练数据"""

    examples = []

    for doc in documents:
        sentences = doc.split('。')

        for i in range(len(sentences) - 1):
            # 句子 A
            sentence_a = sentences[i]

            if random.random() < nsp_prob:
                # 50% 概率: 真实的下一句
                sentence_b = sentences[i + 1]
                label = 1  # IsNext
            else:
                # 50% 概率: 随机句子
                sentence_b = random.choice(random.choice(documents).split('。'))
                label = 0  # NotNext

            examples.append({
                'sentence_a': sentence_a,
                'sentence_b': sentence_b,
                'label': label
            })

    return examples
```

---

## BERT 架构详解

### 完整 BERT 实现

```python
class BertEmbeddings(nn.Module):
    """BERT 嵌入层"""

    def __init__(self, vocab_size, hidden_size, max_position_embeddings=512,
                 type_vocab_size=2, dropout=0.1):
        super().__init__()

        # Token 嵌入
        self.word_embeddings = nn.Embedding(vocab_size, hidden_size)

        # 位置嵌入 (可学习)
        self.position_embeddings = nn.Embedding(max_position_embeddings, hidden_size)

        # Token Type 嵌入 (句子 A/B)
        self.token_type_embeddings = nn.Embedding(type_vocab_size, hidden_size)

        self.LayerNorm = nn.LayerNorm(hidden_size)
        self.dropout = nn.Dropout(dropout)

    def forward(self, input_ids, token_type_ids=None, position_ids=None):
        batch_size, seq_len = input_ids.shape

        if position_ids is None:
            position_ids = torch.arange(seq_len, device=input_ids.device)
            position_ids = position_ids.unsqueeze(0).expand(batch_size, -1)

        if token_type_ids is None:
            token_type_ids = torch.zeros_like(input_ids)

        # 三种嵌入相加
        word_embeds = self.word_embeddings(input_ids)
        position_embeds = self.position_embeddings(position_ids)
        token_type_embeds = self.token_type_embeddings(token_type_ids)

        embeddings = word_embeds + position_embeds + token_type_embeds
        embeddings = self.LayerNorm(embeddings)
        embeddings = self.dropout(embeddings)

        return embeddings


class BertEncoder(nn.Module):
    """BERT 编码器: 多层 Transformer Encoder"""

    def __init__(self, hidden_size=768, num_hidden_layers=12,
                 num_attention_heads=12, intermediate_size=3072, dropout=0.1):
        super().__init__()

        self.layer = nn.ModuleList([
            BertLayer(hidden_size, num_attention_heads, intermediate_size, dropout)
            for _ in range(num_hidden_layers)
        ])

    def forward(self, hidden_states, attention_mask=None):
        all_hidden_states = []

        for layer in self.layer:
            hidden_states = layer(hidden_states, attention_mask)
            all_hidden_states.append(hidden_states)

        return hidden_states, all_hidden_states


class BertLayer(nn.Module):
    """单层 BERT (Transformer Encoder Layer)"""

    def __init__(self, hidden_size, num_attention_heads, intermediate_size, dropout):
        super().__init__()

        # 自注意力
        self.attention = BertAttention(hidden_size, num_attention_heads, dropout)

        # 前馈网络
        self.intermediate = nn.Linear(hidden_size, intermediate_size)
        self.intermediate_act = nn.GELU()

        self.output = nn.Linear(intermediate_size, hidden_size)
        self.output_dropout = nn.Dropout(dropout)
        self.output_layernorm = nn.LayerNorm(hidden_size)

    def forward(self, hidden_states, attention_mask=None):
        # 1. 自注意力
        attention_output = self.attention(hidden_states, attention_mask)

        # 2. 前馈网络
        intermediate_output = self.intermediate(attention_output)
        intermediate_output = self.intermediate_act(intermediate_output)

        layer_output = self.output(intermediate_output)
        layer_output = self.output_dropout(layer_output)
        layer_output = self.output_layernorm(layer_output + attention_output)

        return layer_output


class BertAttention(nn.Module):
    """BERT 自注意力"""

    def __init__(self, hidden_size, num_attention_heads, dropout):
        super().__init__()

        self.num_attention_heads = num_attention_heads
        self.attention_head_size = hidden_size // num_attention_heads

        # Q, K, V 投影
        self.query = nn.Linear(hidden_size, hidden_size)
        self.key = nn.Linear(hidden_size, hidden_size)
        self.value = nn.Linear(hidden_size, hidden_size)

        self.dropout = nn.Dropout(dropout)
        self.dense = nn.Linear(hidden_size, hidden_size)
        self.LayerNorm = nn.LayerNorm(hidden_size)

    def forward(self, hidden_states, attention_mask=None):
        batch_size, seq_len, _ = hidden_states.shape

        # 投影并分头
        Q = self.query(hidden_states).view(
            batch_size, seq_len, self.num_attention_heads, self.attention_head_size
        ).transpose(1, 2)

        K = self.key(hidden_states).view(
            batch_size, seq_len, self.num_attention_heads, self.attention_head_size
        ).transpose(1, 2)

        V = self.value(hidden_states).view(
            batch_size, seq_len, self.num_attention_heads, self.attention_head_size
        ).transpose(1, 2)

        # 注意力计算
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.attention_head_size)

        # 应用 attention mask
        if attention_mask is not None:
            scores = scores + attention_mask

        attn_weights = F.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)

        # 加权求和
        attn_output = torch.matmul(attn_weights, V)

        # 合并头
        attn_output = attn_output.transpose(1, 2).contiguous()
        attn_output = attn_output.view(batch_size, seq_len, -1)

        # 输出投影
        output = self.dense(attn_output)
        output = self.dropout(output)
        output = self.LayerNorm(output + hidden_states)

        return output


class BertModel(nn.Module):
    """完整 BERT 模型"""

    def __init__(self, vocab_size=30522, hidden_size=768, num_hidden_layers=12,
                 num_attention_heads=12, intermediate_size=3072, max_position=512):
        super().__init__()

        self.embeddings = BertEmbeddings(
            vocab_size, hidden_size, max_position
        )

        self.encoder = BertEncoder(
            hidden_size, num_hidden_layers,
            num_attention_heads, intermediate_size
        )

        # Pooler: 用于句子级别任务
        self.pooler = nn.Linear(hidden_size, hidden_size)
        self.pooler_activation = nn.Tanh()

    def forward(self, input_ids, attention_mask=None, token_type_ids=None):
        # 嵌入
        embedding_output = self.embeddings(input_ids, token_type_ids)

        # 编码
        if attention_mask is not None:
            # 将 attention_mask 转为相加形式
            attention_mask = (1.0 - attention_mask[:, None, None, :]) * -10000.0

        sequence_output, all_hidden_states = self.encoder(
            embedding_output, attention_mask
        )

        # Pooler: 取 [CLS] token
        pooled_output = self.pooler_activation(
            self.pooler(sequence_output[:, 0])
        )

        return {
            'last_hidden_state': sequence_output,
            'pooler_output': pooled_output,
            'hidden_states': all_hidden_states
        }
```

---

## BERT 变体

### RoBERTa

```python
# RoBERTa 改进:
# 1. 动态掩码: 每个 epoch 重新随机 mask
# 2. 移除 NSP 任务
# 3. 更大的 batch size
# 4. 更长的训练时间
# 5. 更大的语料

class DynamicMasking:
    """动态掩码"""

    def __init__(self, tokenizer, mask_prob=0.15):
        self.tokenizer = tokenizer
        self.mask_prob = mask_prob

    def __call__(self, examples):
        """每个 epoch 重新 mask"""
        masked_inputs = []

        for text in examples:
            tokens = self.tokenizer.tokenize(text)
            masked_tokens, labels = self.mask_tokens(tokens)
            masked_inputs.append({
                'input_ids': self.tokenizer.convert_tokens_to_ids(masked_tokens),
                'labels': labels
            })

        return masked_inputs
```

### ALBERT

```python
# ALBERT 改进:
# 1. 因子化嵌入: 将大 vocab embedding 分解为两个小的矩阵
# 2. 跨层参数共享: 所有层共享同一套参数
# 3. SOP (Sentence Order Prediction) 替代 NSP

class AlbertEmbeddings(nn.Module):
    """ALBERT 因子化嵌入"""

    def __init__(self, vocab_size, embedding_size, hidden_size):
        super().__init__()

        # 因子化: vocab_size -> embedding_size -> hidden_size
        self.word_embeddings = nn.Embedding(vocab_size, embedding_size)
        self.embedding_projection = nn.Linear(embedding_size, hidden_size)

        # ... 其他嵌入

    def forward(self, input_ids):
        word_embeds = self.word_embeddings(input_ids)
        # 投影到隐藏维度
        projected = self.embedding_projection(word_embeds)
        return projected


class AlbertTransformer(nn.Module):
    """ALBERT: 跨层参数共享"""

    def __init__(self, hidden_size, num_layers):
        super().__init__()

        # 只有一层，重复使用
        self.layer = BertLayer(hidden_size)
        self.num_layers = num_layers

    def forward(self, hidden_states, attention_mask):
        all_hidden_states = []

        for _ in range(self.num_layers):
            hidden_states = self.layer(hidden_states, attention_mask)
            all_hidden_states.append(hidden_states)

        return hidden_states, all_hidden_states
```

### ELECTRA

```python
# ELECTRA: 使用判别式预训练替代生成式

class Electra(nn.Module):
    """
    ELECTRA 预训练:
    1. 使用小 Generator 生成替换 token
    2. 使用 Discriminator 判断每个 token 是否被替换
    """

    def __init__(self, generator, discriminator):
        super().__init__()
        self.generator = generator  # 小 BERT
        self.discriminator = discriminator  # 判别器

    def forward(self, input_ids, masked_positions):
        """
        1. 用 Generator 预测 masked token
        2. 用预测结果替换原 token
        3. Discriminator 判断每个位置是否被替换
        """
        # Generator
        gen_logits = self.generator(input_ids)
        gen_predictions = gen_logits.argmax(dim=-1)

        # 构造替换后的输入
        corrupted_input = input_ids.clone()
        corrupted_input[masked_positions] = gen_predictions[masked_positions]

        # Discriminator 判断
        disc_logits = self.discriminator(corrupted_input)

        return gen_logits, disc_logits
```

---

## 编码器 vs 解码器

### 架构对比

| 特性 | Encoder (BERT) | Decoder (GPT) | Encoder-Decoder (T5) |
|------|----------------|---------------|----------------------|
| 注意力 | 双向 | 单向 (因果) | Encoder双向, Decoder单向 |
| 预训练任务 | MLM, NSP | 自回归生成 | Span Corruption |
| 适合任务 | 理解任务 | 生成任务 | 翻译、摘要 |
| 代表模型 | BERT, RoBERTa, ALBERT | GPT-2/3/4, LLaMA | T5, BART |

### 使用场景

```python
# 编码器适合的任务:
- 文本分类: 情感分析、主题分类
- 序列标注: NER、POS tagging
- 句子关系: 语义相似度、NLI
- 抽取式 QA

# 解码器适合的任务:
- 文本生成: 续写、创作
- 对话系统
- 生成式 QA
- 代码生成

# Encoder-Decoder 适合的任务:
- 机器翻译
- 文本摘要
- 文本改写
```

### 注意力掩码对比

```python
# BERT: 双向注意力 (全可见)
def create_bert_attention_mask(seq_len):
    """BERT: 所有位置互相可见"""
    return torch.ones(seq_len, seq_len)


# GPT: 因果注意力 (只能看到过去)
def create_gpt_attention_mask(seq_len):
    """GPT: 只能看到当前及之前的位置"""
    mask = torch.tril(torch.ones(seq_len, seq_len))
    return mask


# T5 Encoder: 双向
# T5 Decoder: 因果 (带 cross-attention 到 encoder)
```

---

## 面试要点

### 高频问题

**Q1: BERT 的预训练任务是什么？**

A:
1. **MLM (Masked Language Model)**: 随机 mask 15% 的 token，让模型预测
   - 80% 概率替换为 [MASK]
   - 10% 概率替换为随机 token
   - 10% 概率保持不变

2. **NSP (Next Sentence Prediction)**: 预测两个句子是否有上下文关系

**Q2: BERT 和 GPT 的主要区别？**

A:
| 维度 | BERT | GPT |
|------|------|-----|
| 架构 | Transformer Encoder | Transformer Decoder |
| 注意力 | 双向 | 单向 (因果) |
| 预训练 | MLM | 自回归 |
| 优势 | 理解任务 | 生成任务 |

**Q3: 为什么 BERT 使用双向注意力而 GPT 使用单向？**

A:
- **BERT**: 目标是理解上下文，双向注意力可以同时利用左右信息
- **GPT**: 目标是生成文本，只能基于已生成的 token，不能"偷看"未来的 token

**Q4: MLM 中为什么 10% 的 mask 位置保持不变？**

A:
为了让模型学会在输入是真实 token 时也能正确预测，而不是只学会从 [MASK] 预测。这:
1. 减少预训练和微调的不一致 (微调时没有 [MASK])
2. 保持一部分真实输入的信息

**Q5: RoBERTa 相比 BERT 有哪些改进？**

A:
1. **动态掩码**: 每个 epoch 重新随机 mask
2. **移除 NSP**: 发现 NSP 对下游任务帮助不大
3. **更大 batch**: 8k 样本/batch
4. **更多数据**: 160GB vs 16GB
5. **更长训练**: 更多训练步数

**Q6: BERT 的位置编码是什么？**

A:
BERT 使用**可学习的位置编码** (Learned Positional Embedding)，而非正弦位置编码。

```python
self.position_embeddings = nn.Embedding(max_position_embeddings, hidden_size)
```

---

## 相关文档

- [Transformer详解](/kb/transformer) - 基础架构
- [GPT系列模型演进](/kb/gpt) - 解码器模型
- [多模态基础架构](/kb/) - 视觉编码器

---

## 参考文献

1. Devlin et al. "BERT: Pre-training of Deep Bidirectional Transformers". 2019.
2. Liu et al. "RoBERTa: A Robustly Optimized BERT Pretraining Approach". 2019.
3. Lan et al. "ALBERT: A Lite BERT for Self-supervised Learning". 2020.
4. Clark et al. "ELECTRA: Pre-training Text Encoders as Discriminators". 2020.
