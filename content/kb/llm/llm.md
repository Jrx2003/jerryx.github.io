---
title: LLM高频面试题
description: ''
date: null
tags: []
category: LLM
---
# LLM 高频面试题

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 全阶段
> **预计阅读时间**: 60 分钟

---

## 一、基础概念题

### Transformer 相关

**Q1: Transformer 相比 RNN 的核心优势？**

**答案要点**:
1. **并行化**: RNN 必须按时间步迭代，Transformer 可同时处理所有位置
2. **长距离依赖**: Attention 直接连接任意两个位置，不受序列长度影响
3. **可解释性**: 注意力权重展示模型关注重点
4. **梯度流动**: 残差连接 + LayerNorm 缓解梯度消失

**Q2: Self-Attention 的时间复杂度？**

**答案**:
- 序列长度 n，模型维度 d
- Attention: O(n² × d) - 序列间两两交互
- FFN: O(n × d²) - 逐位置变换
- 通常 n < d，所以 Attention 是瓶颈

**Q3: 为什么需要 Multi-Head Attention？**

**答案**:
1. 不同头学习不同的注意力模式
2. 有的头关注语法，有的关注语义
3. 增加模型表达能力
4. 类似 CNN 的多通道

**Q4: LayerNorm 的位置 (Pre vs Post)？**

**答案**:
| 类型 | 公式 | 效果 |
|------|------|------|
| Post-LN | x + Sublayer(LN(x)) | 原始 Transformer，训练不稳定 |
| Pre-LN | LN(x + Sublayer(x)) | 现代常用，训练更稳定 |

现代模型 (GPT-3, LLaMA) 都用 Pre-LN

---

## 二、预训练技术题

### GPT/BERT

**Q5: GPT 和 BERT 的核心区别？**

**答案**:
| 维度 | GPT | BERT |
|------|-----|------|
| 架构 | Decoder-only | Encoder-only |
| 注意力 | 因果掩码 (单向) | 双向 |
| 预训练任务 | 语言模型 (CLM) | MLM + NSP |
| 适用任务 | 生成 | 理解 |

**Q6: 什么是涌现能力 (Emergent Ability)？**

**答案**:
- 模型规模超过阈值后突然出现的能力
- 小规模时完全不具备，超过阈值后稳定出现
- 例子: 算术、代码、复杂推理
- GPT-3 175B 是典型例子

**Q7: 预训练数据如何清洗？**

**答案要点**:
1. **去重**: 精确/模糊去重
2. **过滤**: 低质量内容、NSFW、PII
3. **语言检测**: 保留目标语言
4. **长度过滤**: 去除过短/过长文本
5. **质量打分**: 使用分类器评估质量

---

## 三、对齐技术题

### RLHF / DPO

**Q8: RLHF 的三个阶段？**

**答案**:
1. **SFT**: 指令微调，学习任务格式
2. **RM 训练**: 人类偏好数据训练奖励模型
3. **PPO**: 使用 RM 奖励优化策略

**Q9: RLHF 中为什么需要 Reference Model？**

**答案**:
1. 计算 KL 散度约束
2. 防止模型过度偏离 SFT 模型
3. 避免奖励黑客 (Reward Hacking)
4. 保持生成质量稳定性

**Q10: DPO 相比 RLHF 的优势？**

**答案**:
| 维度 | RLHF | DPO |
|------|------|-----|
| 奖励模型 | 需要 | 不需要 |
| 训练稳定性 | 一般 | 好 |
| 实现复杂度 | 高 | 低 |
| 训练效率 | 低 | 高 |

DPO 直接优化策略，跳过奖励模型训练

**Q11: 什么情况下 DPO 比 RLHF 差？**

**答案**:
- 偏好数据噪声大时
- 需要细粒度过程监督时
- 多轮对话优化时

---

## 四、推理优化题

### KV Cache / 量化

**Q12: KV Cache 为什么能加速生成？**

**答案**:
1. 避免重复计算之前 token 的 KV
2. 复杂度从 O(n²) 降到 O(n) 每步
3. 内存局部性好，缓存命中率高

**Q13: GQA 是什么？相比 MHA 的优势？**

**答案**:
- **MHA**: 每头独立 KV (8 heads = 8 套 KV)
- **GQA**: 多查询头共享 KV (8 heads = 2 套 KV)
- **优势**: 减少 KV Cache 显存，几乎不损失效果

**Q14: INT8 量化的两种方法？**

**答案**:
1. **PTQ (Post-Training Quantization)**: 训练后直接量化
2. **QAT (Quantization-Aware Training)**: 训练时模拟量化

**Q15: 为什么量化能加速推理？**

**答案**:
1. 减少显存占用，可批处理更多样本
2. 硬件支持 INT8/FP8 矩阵乘法 (更快)
3. 减少数据传输

---

## 五、长上下文题

### 位置编码 / 外推

**Q16: 绝对位置编码 vs 相对位置编码？**

**答案**:
| 类型 | 代表 | 特点 |
|------|------|------|
| 绝对 | Sinusoidal, Learned | 每个位置独立编码 |
| 相对 | RoPE, ALiBi | 编码相对距离 |

RoPE 兼具绝对和相对优点

**Q17: RoPE 位置编码的优势？**

**答案**:
1. 通过旋转矩阵编码相对位置
2. 外推性好 (可扩展到更长序列)
3. 注意力得分可分解为相对位置的函数
4. 现代 LLM 主流选择

**Q18: 如何处理超出训练长度的序列？**

**答案**:
1. **NTK-aware 外推**: 频率缩放
2. **YaRN**: 组合策略 + 温度缩放
3. **位置插值**: 压缩位置到训练长度
4. **滑动窗口**: 只关注局部上下文

---

## 六、前沿技术题

### MoE / o1

**Q19: MoE 的核心思想？负载均衡如何实现？**

**答案**:
- **核心**: 多个专家，只激活部分
- **负载均衡**: 辅助损失函数，鼓励均匀分配
- **辅助损失**: 基于专家使用频率的 KL 散度

**Q20: o1 类模型与传统 LLM 的核心区别？**

**答案**:
1. **思考方式**: o1 深度推理，传统快速直觉
2. **训练**: o1 使用过程奖励模型 (PRM)
3. **推理**: o1 投入更多计算时间
4. **适用**: o1 适合复杂推理任务

**Q21: 什么是 Test-Time Scaling？**

**答案**:
- 在推理时投入更多计算资源
- 方法: 多次采样、自我验证、逐步检查
- 与训练时扩展开销不同

---

## 七、系统设计题

### 工程实践

**Q22: 如何设计一个 LLM 推理服务？**

**答案要点**:
```
架构:
1. 负载均衡 (nginx/ALB)
2. 推理服务器 (vLLM/TGI)
   - 连续批处理
   - PagedAttention
   - 量化支持
3. 缓存层 (Redis)
4. 模型存储 (S3/共享存储)

优化:
- 动态批处理
- KV Cache 复用
- 模型量化
- 多卡并行
```

**Q23: 大模型部署的显存计算？**

**答案**:
```
7B 模型 FP16:
- 模型权重: 14 GB
- KV Cache (4K): 2 GB
- 激活值: 1 GB
- 合计: ~17 GB

优化后 (INT4 + GQA):
- 模型权重: 4 GB
- KV Cache: 0.5 GB
- 可在单卡 24GB 运行
```

**Q24: 如何处理 LLM 的幻觉问题？**

**答案**:
1. **数据**: 高质量训练数据
2. **对齐**: RLHF 减少幻觉
3. **检索**: RAG 提供事实依据
4. **验证**: 让模型自我验证
5. **约束**: 限制生成长度

---

## 八、手撕代码题

### 必会代码

**Q25: 手写 Scaled Dot-Product Attention**

```python
def scaled_dot_product_attention(Q, K, V, mask=None, dropout=None):
    """
    Q, K, V: [batch, heads, seq_len, d_k]
    """
    d_k = Q.size(-1)

    # 计算注意力得分
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    # scores: [batch, heads, seq_len, seq_len]

    # 应用 mask
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)

    # Softmax
    attn_weights = F.softmax(scores, dim=-1)

    # Dropout
    if dropout is not None:
        attn_weights = dropout(attn_weights)

    # 加权求和
    output = torch.matmul(attn_weights, V)
    # output: [batch, heads, seq_len, d_k]

    return output, attn_weights
```

**Q26: 手写 RoPE 位置编码**

```python
def apply_rotary_pos_emb(q, k, cos, sin):
    """
    应用旋转位置编码

    q, k: [batch, heads, seq_len, head_dim]
    cos, sin: [1, 1, seq_len, head_dim]
    """
    # 将 q, k 分成两半
    q1, q2 = q[..., ::2], q[..., 1::2]
    k1, k2 = k[..., ::2], k[..., 1::2]

    # 应用旋转
    q_embed = torch.cat([q1 * cos - q2 * sin, q1 * sin + q2 * cos], dim=-1)
    k_embed = torch.cat([k1 * cos - k2 * sin, k1 * sin + k2 * cos], dim=-1)

    return q_embed, k_embed


def get_rope_embeddings(seq_len, head_dim, base=10000):
    """生成 RoPE 的 cos/sin"""
    positions = torch.arange(seq_len).unsqueeze(1)  # [seq_len, 1]
    dim_indices = torch.arange(0, head_dim, 2).float()  # [head_dim//2]

    # 计算角度
    angles = positions / (base ** (dim_indices / head_dim))

    # 扩展到完整维度
    cos = torch.cos(angles).repeat_interleave(2, dim=-1)
    sin = torch.sin(angles).repeat_interleave(2, dim=-1)

    return cos.unsqueeze(0).unsqueeze(0), sin.unsqueeze(0).unsqueeze(0)
```

---

## 九、行为面试题

### 项目经验

**Q27: 介绍你最熟悉的 LLM 项目**

**回答框架**:
1. **背景**: 项目目标和挑战
2. **方案**: 技术选型和架构
3. **实现**: 具体做了哪些工作
4. **结果**: 量化的效果提升
5. **反思**: 学到了什么，有什么改进

**Q28: 遇到过的最大技术挑战？**

**参考回答**:
```
场景: 长文档理解任务，上下文长度不足

解决方案:
1. 调研了多种长上下文方案
2. 选择了 YaRN 外推 + 分层注意力
3. 实现了 Sliding Window Attention
4. 效果: 从 4K 扩展到 32K，性能保持 95%

学到: 技术选型的权衡，工程化经验
```

**Q29: 如何跟进 LLM 最新进展？**

**答案**:
1. **论文**: arXiv, Papers With Code
2. **社区**: Hugging Face, Twitter/X
3. **开源**: GitHub trending
4. **会议**: NeurIPS, ICML, ACL
5. **博客**: OpenAI, DeepMind, 知乎

---

## 十、面试准备建议

### 知识层次

| 层次 | 内容 | 要求 |
|------|------|------|
| **基础** | Transformer, Attention | 必须熟练 |
| **进阶** | RLHF, 推理优化 | 深入理解 |
| **前沿** | MoE, o1, 多模态 | 了解原理 |
| **工程** | 部署, 量化, 加速 | 实践经验 |

### 推荐准备

1. **理论**: 精读 Attention is All You Need, InstructGPT 等经典论文
2. **代码**: 手撕 Transformer, LoRA, Attention
3. **项目**: 准备 1-2 个完整的 LLM 项目
4. **跟进**: 了解最新的 GPT-4, Claude, Llama 等进展

---

## 相关文档

- [手撕代码题](/kb/) - 代码实现详解
- [系统设计题](/kb/) - 系统设计详解
- [Transformer详解](/kb/transformer) - 基础架构
- [RLHF深度解析](/kb/rlhf) - 对齐技术
