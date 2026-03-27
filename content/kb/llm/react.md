---
title: ReAct推理框架
description: ''
date: null
tags: []
category: LLM
---
# ReAct 推理框架

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 中级
> **预计阅读时间**: 40 分钟

---

## 目录

1. [ReAct 概述](#react-概述)
2. [核心思想](#核心思想)
3. [推理与行动循环](#推理与行动循环)
4. [Prompt 设计](#prompt-设计)
5. [工具使用](#工具使用)
6. [记忆机制](#记忆机制)
7. [代码实现](#代码实现)
8. [应用场景](#应用场景)
9. [面试要点](#面试要点)

---

## ReAct 概述

### 什么是 ReAct

ReAct (Reasoning + Acting) 是一种将推理和行动结合的 Agent 框架，由 Google Research 在 2022 年提出。

```
传统 LLM: 问题 → 直接回答
           ↓
ReAct:     问题 → 思考 → 行动 → 观察 → 思考 → ... → 回答
```

### 核心优势

| 特性 | 传统 LLM | ReAct |
|------|----------|-------|
| 事实准确性 | 可能幻觉 | 通过工具获取真实信息 |
| 可解释性 | 黑盒 | 显示思考过程 |
| 任务完成能力 | 单次推理 | 多步迭代 |
| 工具使用 | 无 | 灵活调用外部工具 |

---

## 核心思想

### Reasoning + Acting

```
┌─────────────────────────────────────────────────────────┐
│                    ReAct 循环                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌────────────┐                                        │
│   │   Thought  │  ← 推理：我现在需要什么？               │
│   └─────┬──────┘                                        │
│         │                                                │
│         ▼                                                │
│   ┌────────────┐                                        │
│   │    Act     │  ← 行动：调用工具或生成答案             │
│   └─────┬──────┘                                        │
│         │                                                │
│         ▼                                                │
│   ┌────────────┐                                        │
│   │  Observation│  ← 观察：获取行动结果                  │
│   └─────┬──────┘                                        │
│         │                                                │
│         └────────────────┐                              │
│                          │                              │
│                          ▼                              │
│                    是否完成任务？                        │
│                          │                              │
│                    是 ←──┴──→ 否                        │
│                   结束       继续循环                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 三种核心能力

| 能力 | 说明 | 示例 |
|------|------|------|
| **推理 (Reasoning)** | 分解问题，制定计划 | "我需要先查询天气，再决定穿衣建议" |
| **行动 (Acting)** | 执行具体操作 | 调用天气 API |
| **观察 (Observing)** | 获取外部反馈 | API 返回"今天北京 25°C，晴" |

---

## 推理与行动循环

### 标准流程示例

```
用户问题: "今天是苹果公司成立多少周年？"

Step 1 - Thought:
"我需要知道苹果公司成立日期和今天的日期。"

Step 2 - Act:
搜索[苹果公司成立日期]

Step 3 - Observation:
"苹果公司于 1976 年 4 月 1 日由史蒂夫·乔布斯等人创立。"

Step 4 - Thought:
"现在我知道了成立日期是 1976 年 4 月 1 日。今天是 2026 年 3 月 13 日，
需要计算周年数。"

Step 5 - Act:
计算[2026 - 1976]

Step 6 - Observation:
"结果为 50"

Step 7 - Thought:
"由于今天（3月13日）还未到成立日（4月1日），所以是 49 周年。"

Step 8 - Act:
回答[苹果公司成立 49 周年，即将在 2026 年 4 月 1 日迎来 50 周年]
```

---

## Prompt 设计

### Few-shot Prompt 模板

```python
REACT_PROMPT = """Solve a question answering task with interleaving Thought, Action, Observation steps.

Thought can reason about the current situation, and Action can be three types:
(1) Search[entity], which searches the exact entity on Wikipedia and returns the first paragraph if it exists. If not, it will return some similar entities to search.
(2) Lookup[string], which returns the next sentence containing the string in the current passage.
(3) Finish[answer], which returns the answer and finishes the task.

Here are some examples:

Question: What is the elevation range for the area that the eastern sector of the Colorado orogeny extends into?
Thought 1: I need to search Colorado orogeny, find the area that the eastern sector of the Colorado orogeny extends into, then find the elevation range of the area.
Action 1: Search[Colorado orogeny]
Observation 1: The Colorado orogeny was an episode of mountain building (an orogeny) in Colorado and surrounding areas.
Thought 2: It does not mention the eastern sector. So I need to look up eastern sector.
Action 2: Lookup[eastern sector]
Observation 2: (Result 1 / 1) The eastern sector extends into the High Plains and is called the Central Plains orogeny.
Thought 3: The eastern sector of Colorado orogeny extends into the High Plains. So I need to search High Plains and find its elevation range.
Action 3: Search[High Plains]
Observation 3: High Plains refers to one of two distinct land regions
Thought 4: I need to instead search High Plains (United States).
Action 4: Search[High Plains (United States)]
Observation 4: The High Plains are a subregion of the Great Plains. From east to west, the High Plains rise in elevation from around 1,800 to 7,000 ft (550 to 2,130 m).
Thought 5: High Plains rise in elevation from around 1,800 to 7,000 ft, so the answer is 1,800 to 7,000 ft.
Action 5: Finish[1,800 to 7,000 ft]

Question: {question}"""
```

### Zero-shot Prompt 模板

```python
ZERO_SHOT_REACT_PROMPT = """You are an AI assistant that helps users by thinking step by step.

When you need information, use tools by specifying:
Action: tool_name[parameters]

After each action, you will receive an Observation.
Continue until you can provide the final answer.

Format your response as:
Thought: your reasoning here
Action: tool_name[parameters]

or when you have the answer:
Thought: I have found the answer
Action: Finish[your final answer]

Question: {question}
Thought:"""
```

---

## 工具使用

### 工具定义

```python
class Tool:
    """工具基类"""
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    def run(self, query: str) -> str:
        raise NotImplementedError

class SearchTool(Tool):
    """搜索工具"""
    def __init__(self):
        super().__init__(
            name="Search",
            description="Search for information on the internet"
        )

    def run(self, query: str) -> str:
        # 实际实现调用搜索 API
        return search_api(query)

class CalculatorTool(Tool):
    """计算器工具"""
    def __init__(self):
        super().__init__(
            name="Calculator",
            description="Perform mathematical calculations"
        )

    def run(self, expression: str) -> str:
        try:
            result = eval(expression)
            return str(result)
        except:
            return "Error: Invalid expression"

class WeatherTool(Tool):
    """天气查询工具"""
    def __init__(self):
        super().__init__(
            name="Weather",
            description="Get current weather for a location"
        )

    def run(self, location: str) -> str:
        # 调用天气 API
        return weather_api(location)
```

### 工具注册

```python
class ToolRegistry:
    """工具注册中心"""
    def __init__(self):
        self.tools = {}

    def register(self, tool: Tool):
        self.tools[tool.name] = tool

    def execute(self, action_str: str) -> str:
        """执行工具调用

        action_str: "ToolName[parameters]"
        """
        import re
        match = re.match(r'(\w+)\[(.*)\]', action_str)
        if not match:
            return "Error: Invalid action format"

        tool_name, params = match.groups()
        if tool_name not in self.tools:
            return f"Error: Unknown tool {tool_name}"

        return self.tools[tool_name].run(params)
```

---

## 记忆机制

### 短期记忆

```python
class ShortTermMemory:
    """短期记忆：当前对话上下文"""
    def __init__(self, max_turns: int = 10):
        self.history = []
        self.max_turns = max_turns

    def add(self, thought: str, action: str, observation: str):
        self.history.append({
            'thought': thought,
            'action': action,
            'observation': observation
        })
        # 保持最近 N 轮
        if len(self.history) > self.max_turns:
            self.history = self.history[-self.max_turns:]

    def get_context(self) -> str:
        """获取记忆上下文用于 Prompt"""
        context = ""
        for i, turn in enumerate(self.history, 1):
            context += f"Thought {i}: {turn['thought']}\n"
            context += f"Action {i}: {turn['action']}\n"
            context += f"Observation {i}: {turn['observation']}\n"
        return context
```

### 长期记忆

```python
class LongTermMemory:
    """长期记忆：向量数据库存储"""
    def __init__(self, embedding_model, vector_store):
        self.embedding_model = embedding_model
        self.vector_store = vector_store

    def store(self, text: str, metadata: dict = None):
        """存储记忆"""
        embedding = self.embedding_model.encode(text)
        self.vector_store.add(
            embeddings=[embedding],
            documents=[text],
            metadatas=[metadata or {}]
        )

    def retrieve(self, query: str, k: int = 3) -> list:
        """检索相关记忆"""
        query_embedding = self.embedding_model.encode(query)
        results = self.vector_store.query(
            query_embeddings=[query_embedding],
            n_results=k
        )
        return results['documents'][0]
```

---

## 代码实现

### 完整 ReAct Agent

```python
import re
from typing import List, Dict, Optional

class ReActAgent:
    """ReAct Agent 完整实现"""

    def __init__(
        self,
        llm,
        tools: List[Tool],
        max_iterations: int = 10,
        prompt_template: str = None
    ):
        self.llm = llm
        self.tools = {tool.name: tool for tool in tools}
        self.max_iterations = max_iterations
        self.prompt_template = prompt_template or REACT_PROMPT
        self.memory = ShortTermMemory()

    def run(self, question: str) -> str:
        """运行 ReAct 循环"""
        context = f"Question: {question}\n"

        for i in range(self.max_iterations):
            # 1. 生成 Thought 和 Action
            prompt = self._build_prompt(context)
            response = self.llm.generate(prompt)

            # 2. 解析 Thought 和 Action
            thought, action = self._parse_response(response)

            if not thought or not action:
                return "Error: Failed to parse response"

            # 3. 检查是否完成
            if action.startswith("Finish["):
                answer = action[7:-1]  # 提取 Finish[...] 中的内容
                return answer

            # 4. 执行 Action
            observation = self._execute_action(action)

            # 5. 更新记忆
            self.memory.add(thought, action, observation)

            # 6. 更新上下文
            context += f"Thought {i+1}: {thought}\n"
            context += f"Action {i+1}: {action}\n"
            context += f"Observation {i+1}: {observation}\n"

        return "Error: Maximum iterations reached"

    def _build_prompt(self, context: str) -> str:
        """构建 Prompt"""
        return self.prompt_template.format(question=context)

    def _parse_response(self, response: str) -> tuple:
        """解析 LLM 响应"""
        thought_match = re.search(r'Thought \d+: (.+?)(?=\nAction|$)', response)
        action_match = re.search(r'Action \d+: (.+?)(?=\n|$)', response)

        thought = thought_match.group(1) if thought_match else ""
        action = action_match.group(1) if action_match else ""

        return thought, action

    def _execute_action(self, action: str) -> str:
        """执行工具调用"""
        # 解析 Action
        match = re.match(r'(\w+)\[(.*)\]', action)
        if not match:
            return "Error: Invalid action format"

        tool_name, params = match.groups()

        # 执行工具
        if tool_name not in self.tools:
            return f"Error: Unknown tool '{tool_name}'"

        try:
            result = self.tools[tool_name].run(params)
            return result
        except Exception as e:
            return f"Error: {str(e)}"

# 使用示例
if __name__ == "__main__":
    # 初始化组件
    llm = YourLLM()  # 替换为你的 LLM
    tools = [
        SearchTool(),
        CalculatorTool(),
        WeatherTool()
    ]

    # 创建 Agent
    agent = ReActAgent(llm=llm, tools=tools)

    # 运行
    question = "苹果公司成立多少年了？"
    answer = agent.run(question)
    print(f"Answer: {answer}")
```

---

## 应用场景

| 场景 | 示例 | 所需工具 |
|------|------|----------|
| **信息查询** | "今天北京天气如何？" | 天气 API |
| **数学计算** | "计算 1234 * 5678" | 计算器 |
| **知识问答** | "谁发明了电话？" | 搜索引擎 |
| **数据分析** | "分析这份销售数据" | 代码执行器 |
| **多步任务** | "帮我订明天去上海的机票" | 多个 API 组合 |

---

## 面试要点

### 高频问题

**Q1: ReAct 相比 Chain-of-Thought 的优势？**

A:
- CoT 只有推理，ReAct 增加了行动
- ReAct 可以与外部环境交互获取信息
- ReAct 更适合需要实时信息的任务

**Q2: ReAct 的停止条件是什么？**

A:
1. 调用 Finish[answer] 工具
2. 达到最大迭代次数
3. 发生错误无法恢复

**Q3: 如何防止 ReAct 陷入无限循环？**

A:
1. 设置最大迭代次数
2. 检测重复的动作序列
3. 使用记忆机制避免重复查询

**Q4: ReAct 中的工具如何选择？**

A:
- 在 Prompt 中明确描述每个工具的功能
- LLM 根据 Thought 决定使用哪个工具
- 可以加入工具使用示例（Few-shot）

**Q5: ReAct 的记忆机制作用？**

A:
- 短期记忆：保持当前任务上下文
- 长期记忆：存储历史任务经验
- 避免重复查询，提高效率

---

## 相关文档

- [GPT系列模型演进](/kb/gpt) - LLM 基础
- [工具学习与使用](/kb/) - 工具使用详解
- [Agent规划能力](/kb/agent) - 任务规划

---

## 参考文献

1. Yao et al. "ReAct: Synergizing Reasoning and Acting in Language Models". 2022.
2. Yao et al. "WebShop: Towards Scalable Real-World Web Interaction with Grounded Language Agents". 2022.
