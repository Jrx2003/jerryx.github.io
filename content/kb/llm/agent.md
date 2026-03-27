---
title: Agent 规划能力
description: ''
date: null
tags: []
category: LLM
---
# Agent 规划能力

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 高级
> **预计阅读时间**: 45 分钟

---

## 目录

1. [规划概述](#规划概述)
2. [任务分解](#任务分解)
3. [反思与修正](#反思与修正)
4. [规划策略](#规划策略)
5. [面试要点](#面试要点)

---

## 规划概述

### 为什么需要规划

复杂任务需要多步骤执行和中间结果管理。

```
复杂任务:
"帮我订一张明天从北京到上海的机票，要上午的"

步骤:
1. 查询航班
2. 筛选上午班次
3. 选择合适航班
4. 填写乘客信息
5. 确认订单
```

---

## 任务分解

### Chain of Thought

```python
def cot_planning(task):
    """思维链规划"""
    prompt = f"""
    任务: {task}

    请逐步思考如何完成这个任务:
    1. ...
    2. ...
    3. ...
    """
    return llm.generate(prompt)
```

### Tree of Thoughts

```
       初始状态
       /   |   \
     方案1 方案2 方案3
     /        \
   结果1      结果2
```

---

## 反思与修正

### Self-Reflection

```python
def self_reflection(plan, result):
    """自我反思"""
    prompt = f"""
    原计划: {plan}
    执行结果: {result}

    请反思:
    1. 计划是否合理？
    2. 执行中的问题？
    3. 如何改进？
    """
    return llm.generate(prompt)
```

---

## 规划策略

| 策略 | 特点 |
|------|------|
| ReAct | 推理+行动交替 |
| Plan-and-Solve | 先规划再执行 |
| Reflexion | 带反思的规划 |

---

## 面试要点

**Q1: 规划能力的核心要素？**

A:
- 任务分解
- 中间结果管理
- 错误恢复

**Q2: ReAct 和 Plan-and-Solve 的区别？**

A:
- ReAct: 交替推理和行动
- Plan-and-Solve: 先完整规划再执行
