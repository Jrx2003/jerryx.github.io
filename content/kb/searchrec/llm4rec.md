---
title: LLM4Rec大模型推荐
description: ''
date: null
tags: []
category: SearchRec
---
# LLM4Rec 大模型推荐

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 高级
> **预计阅读时间**: 50 分钟

---

## 目录

1. [LLM4Rec 概述](#llm4rec-概述)
2. [应用范式](#应用范式)
3. [Prompt 设计](#prompt-设计)
4. [微调策略](#微调策略)
5. [面试要点](#面试要点)

---

## LLM4Rec 概述

### 为什么用 LLM 做推荐

```
传统推荐系统:
- 专用架构 (召回+排序)
- 领域特定训练
- 难以跨域迁移

LLM for Recommendation:
- 统一语言建模框架
- 预训练知识丰富
- 强大的泛化能力
- 自然语言接口
```

### 应用层次

```
┌─────────────────────────────────────────────┐
│  Level 4: 统一推荐系统 (Chat-Rec)           │
│  LLM 控制整个推荐流程                        │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────┐
│  Level 3: 特征工程/打分机                   │
│  LLM 生成特征或打分                          │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────┐
│  Level 2: 序列建模 (P5, GPT4Rec)            │
│  LLM 建模用户行为序列                        │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────┐
│  Level 1: 知识增强 (KAR, UniCRS)            │
│  LLM 提供外部知识                            │
└─────────────────────────────────────────────┘
```

---

## 应用范式

### 1. Prompt-based 推荐

```python
"""
将推荐任务转化为自然语言任务
"""

class PromptBasedRecommendation:
    """基于 Prompt 的推荐"""

    def __init__(self, llm):
        self.llm = llm

    def build_prompt(self, user_history, candidates):
        """构建推荐 Prompt"""

        prompt = f"""基于用户的历史行为，推荐最相关的物品。

用户历史行为:
{chr(10).join(f'- {item}' for item in user_history)}

候选物品:
{chr(10).join(f'{i+1}. {item}' for i, item in enumerate(candidates))}

请推荐最可能感兴趣的物品 (只输出编号):"""

        return prompt

    def recommend(self, user_history, candidates, top_k=5):
        """生成推荐"""

        prompt = self.build_prompt(user_history, candidates)

        response = self.llm.generate(prompt)

        # 解析推荐结果
        recommended_indices = self.parse_response(response, top_k)

        return [candidates[i] for i in recommended_indices]

    def parse_response(self, response, top_k):
        """解析模型输出"""
        # 提取数字编号
        import re
        numbers = re.findall(r'\d+', response)
        indices = [int(n) - 1 for n in numbers if int(n) <= 10]

        return indices[:top_k]
```

### 2. In-Context Learning

```python
"""
上下文学习: 提供示例让 LLM 学习推荐模式
"""

class InContextLearningRec:
    """上下文学习推荐"""

    def build_prompt_with_examples(self, user_history, candidates, examples):
        """构建带示例的 Prompt"""

        prompt = "根据用户历史推荐物品:\n\n"

        # 添加示例
        for example in examples:
            prompt += f"""示例:
历史: {', '.join(example['history'])}
推荐: {example['recommendation']}

"""

        # 添加当前用户
        prompt += f"""当前用户:
历史: {', '.join(user_history)}

候选: {', '.join(candidates)}

推荐:"""

        return prompt
```

### 3. 指令微调

```python
"""
指令微调: 让 LLM 学习执行推荐任务
"""

class InstructionTuningRec:
    """指令微调推荐"""

    def create_training_data(self, interactions):
        """创建指令微调数据"""

        instructions = []

        for user_id, history, target in interactions:
            # 构建指令
            instruction = {
                'instruction': '根据用户历史推荐下一个物品',
                'input': f"历史: {', '.join(history)}",
                'output': target
            }

            # 格式化为对话
            formatted = self.format_instruction(instruction)
            instructions.append(formatted)

        return instructions

    def format_instruction(self, sample):
        """格式化指令"""

        return f"""### Instruction:
{sample['instruction']}

### Input:
{sample['input']}

### Response:
{sample['output']}"""
```

---

## Prompt 设计

### 推荐任务 Prompt 模板

```python
RECOMMENDATION_PROMPT_TEMPLATES = {

    # 1. 序列推荐
    'sequential': """用户历史交互序列 (按时间排序):
{history}

基于以上历史，预测用户下一个可能交互的物品。
候选物品: {candidates}

推荐 (只输出物品ID):""",

    # 2. 解释生成
    'explanation': """用户历史: {history}
推荐物品: {item}

请生成推荐理由:""",

    # 3. 属性预测
    'attribute': """用户历史: {history}

预测用户对以下属性的偏好:
- 类别偏好:
- 价格偏好:
- 品牌偏好:""",

    # 4. 对话推荐
    'conversational': """用户: {user_utterance}
历史: {history}

系统:""",

    # 5. 跨域推荐
    'cross_domain': """用户在源领域的偏好:
{source_domain_history}

推荐目标领域的物品:
{target_domain_candidates}"""
}
```

### 物品表示方法

```python
"""
如何将物品表示给 LLM?

方法1: 物品 ID
- 简单直接
- 需要微调

方法2: 物品标题
- 利用预训练知识
- 泛化性好

方法3: 物品描述
- 信息丰富
- 输入较长

方法4: 结构化特征
- 属性明确
- 适合特定场景
"""

class ItemRepresentation:
    """物品表示方法"""

    @staticmethod
    def id_based(item):
        return f"item_{item['id']}"

    @staticmethod
    def title_based(item):
        return item['title']

    @staticmethod
    def description_based(item):
        return f"{item['title']}: {item['description']}"

    @staticmethod
    def structured_based(item):
        return f"""商品: {item['title']}
类别: {item['category']}
价格: {item['price']}元
品牌: {item['brand']}"""
```

---

## 微调策略

### 参数高效微调

```python
"""
推荐场景使用 LoRA/Adapter 微调 LLM
"""

from peft import LoraConfig, get_peft_model

class LLM4RecWithLoRA(nn.Module):
    """使用 LoRA 微调的推荐模型"""

    def __init__(self, base_llm_name):
        super().__init__()

        # 加载基础模型
        self.base_model = AutoModel.from_pretrained(base_llm_name)

        # LoRA 配置
        lora_config = LoraConfig(
            r=16,
            lora_alpha=32,
            target_modules=["q_proj", "v_proj"],
            lora_dropout=0.1,
            bias="none",
            task_type="CAUSAL_LM"
        )

        # 应用 LoRA
        self.model = get_peft_model(self.base_model, lora_config)

        # 推荐头
        self.rec_head = nn.Linear(
            self.base_model.config.hidden_size,
            num_items
        )

    def forward(self, input_ids, attention_mask):
        """前向传播"""

        # LLM 编码
        outputs = self.model(
            input_ids=input_ids,
            attention_mask=attention_mask
        )

        # 取最后一个 token 的表示
        last_hidden = outputs.last_hidden_state[:, -1, :]

        # 推荐分数
        scores = self.rec_head(last_hidden)

        return scores
```

### 两阶段训练

```python
"""
两阶段训练策略:
1. 预训练: 在大规模通用数据上训练
2. 微调: 在特定推荐任务上微调
"""

class TwoStageTraining:
    """两阶段训练"""

    def stage1_pretraining(self, model, general_data):
        """阶段1: 通用预训练"""

        # 使用通用推荐数据预训练
        # 包括多个领域的数据

        optimizer = torch.optim.AdamW(
            model.parameters(),
            lr=1e-4
        )

        for epoch in range(5):
            for batch in general_data:
                loss = self.compute_loss(model, batch)

                optimizer.zero_grad()
                loss.backward()
                optimizer.step()

        return model

    def stage2_finetuning(self, model, task_specific_data):
        """阶段2: 任务微调"""

        # 冻结部分层
        for param in model.base_model.parameters():
            param.requires_grad = False

        # 只训练推荐头和 LoRA 参数
        optimizer = torch.optim.AdamW(
            filter(lambda p: p.requires_grad, model.parameters()),
            lr=1e-5
        )

        for epoch in range(10):
            for batch in task_specific_data:
                loss = self.compute_loss(model, batch)

                optimizer.zero_grad()
                loss.backward()
                optimizer.step()

        return model
```

---

## 面试要点

### 高频问题

**Q1: LLM4Rec 的主要范式有哪些？**

A:
1. **Prompt-based**: 直接 Prompt LLM 生成推荐
2. **In-Context Learning**: 提供示例进行推荐
3. **Fine-tuning**: 微调 LLM 适应推荐任务
4. **Tool-use**: LLM 作为控制器调用推荐工具

**Q2: LLM 做推荐的优缺点？**

A:
- **优点**: 统一框架、知识丰富、可解释、跨域泛化
- **缺点**: 推理慢、需要大量计算资源、冷启动仍需解决

**Q3: 如何表示物品给 LLM？**

A:
- ID 表示: 需要微调
- 文本表示 (标题/描述): 利用预训练知识
- 结构化表示: 明确属性

**Q4: 如何降低 LLM 推荐的推理成本？**

A:
1. 蒸馏到小模型
2. 缓存常见查询结果
3. 使用更高效的架构 (如 Mamba)
4. 量化和剪枝

---

## 相关文档

- [生成式推荐](/kb/) - 生成式方法
- [LoRA高效微调](/kb/lora) - 微调技术
- [Prompt设计](/kb/prompt) - Prompt 工程

---

## 参考文献

1. Liu et al. "Is ChatGPT a Good Recommender? A Preliminary Study". 2023.
2. Zhang et al. "Recommendation as Instruction Following: A Large Language Model Empowered Recommendation Approach". 2023.
3. Xi et al. "Towards Open-World Recommendation with Knowledge Augmentation from Large Language Models". 2023.
