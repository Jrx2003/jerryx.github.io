---
title: Learning to Rank
description: ''
date: null
tags: []
category: SearchRec
---
# Learning to Rank

> 更新日期：2026-03-13
> 相关文档：[搜索系统架构](/kb/) | [语义搜索与向量检索](/kb/)

---

## 一、LTR 概述

### 什么是 Learning to Rank

将排序问题转化为机器学习问题，直接优化排序指标。

```
传统方法:
Query → 人工规则 → 排序

LTR:
Query + 特征 → 模型 → 排序分数
```

### 三类方法

| 方法 | 粒度 | 损失函数 | 代表算法 |
|------|------|----------|----------|
| **Pointwise** | 单文档 | 回归/分类 | PRank, OC SVM |
| **Pairwise** | 文档对 | 比较损失 | RankSVM, RankNet, LambdaRank |
| **Listwise** | 文档列表 | 列表损失 | ListNet, LambdaMART, SoftRank |

---

## 二、Pointwise 方法

### 核心思想

将排序问题转化为**回归**或**分类**问题。

```
输入: (Query, Doc_i) → 输出: 相关性分数
直接预测每个文档的绝对相关度
```

### 方法

| 方法 | 类型 | 说明 |
|------|------|------|
| **McRank** | 分类 | 将相关性分桶预测 |
| **PRank** | 在线学习 | 感知机的排序版本 |
| **OC SVM** | 分类 | 单类 SVM |

### 缺点

- 忽略文档间的相对顺序
- 损失函数与排序指标不一致

---

## 三、Pairwise 方法

### 核心思想

学习文档对的**相对顺序**。

```
输入: (Query, Doc_i, Doc_j) → 输出: Doc_i > Doc_j ?
```

### RankNet

**神经网络排序模型**。

```python
class RankNet(nn.Module):
    """RankNet 实现"""

    def __init__(self, input_dim, hidden_dims=[128, 64]):
        super().__init__()
        layers = []
        prev_dim = input_dim
        for dim in hidden_dims:
            layers.extend([
                nn.Linear(prev_dim, dim),
                nn.ReLU(),
                nn.Dropout(0.2)
            ])
            prev_dim = dim
        layers.append(nn.Linear(prev_dim, 1))
        self.model = nn.Sequential(*layers)

    def forward(self, x):
        return self.model(x)

    def rank_loss(self, s_i, s_j, S_ij):
        """
        s_i, s_j: 文档 i,j 的预测分数
        S_ij: 真实偏好 (1: i>j, -1: i<j, 0: 相等)
        """
        # 概率 P(i > j) = sigmoid(s_i - s_j)
        pred_prob = torch.sigmoid(s_i - s_j)

        # 真实概率
        true_prob = (S_ij + 1) / 2  # 转换到 [0, 1]

        # 交叉熵损失
        loss = -true_prob * torch.log(pred_prob + 1e-8) - \
               (1 - true_prob) * torch.log(1 - pred_prob + 1e-8)

        return loss.mean()
```

### LambdaRank

**直接优化 NDCG**。

核心创新：在 RankNet 基础上，根据 NDCG 变化调整梯度权重。

```python
class LambdaRank(nn.Module):
    """LambdaRank 实现"""

    def compute_lambda(self, scores, labels, doc_i, doc_j):
        """
        计算 Lambda (排序梯度)

        Lambda_ij = (1/2) * (1 - S_ij) * sigma * (1 - P_ij) * |ΔNDCG|
        """
        s_i, s_j = scores[doc_i], scores[doc_j]
        label_i, label_j = labels[doc_i], labels[doc_j]

        # 交换 i,j 后的 NDCG 变化
        delta_ndcg = self.compute_delta_ndcg(labels, doc_i, doc_j)

        # Lambda
        lambda_ij = -sigma / (1 + torch.exp(sigma * (s_i - s_j)))
        lambda_ij *= abs(delta_ndcg)

        # 根据真实标签调整方向
        if label_i > label_j:
            lambda_ij = abs(lambda_ij)
        elif label_i < label_j:
            lambda_ij = -abs(lambda_ij)
        else:
            lambda_ij = 0

        return lambda_ij

    def compute_delta_ndcg(self, labels, i, j):
        """计算交换位置后的 NDCG 变化"""
        # 原始 NDCG
        original_ndcg = self.compute_ndcg(labels)

        # 交换 i,j
        swapped_labels = labels.copy()
        swapped_labels[i], swapped_labels[j] = swapped_labels[j], swapped_labels[i]
        swapped_ndcg = self.compute_ndcg(swapped_labels)

        return original_ndcg - swapped_ndcg
```

---

## 四、Listwise 方法

### 核心思想

直接优化整个列表的**排序质量**。

### LambdaMART

**最常用的高效 LTR 算法**。

```
基础: MART (Multiple Additive Regression Trees)
      = Gradient Boosting Decision Tree

改进: 使用 Lambda 作为梯度
```

```python
class LambdaMART:
    """LambdaMART 简化实现"""

    def __init__(self, n_trees=100, learning_rate=0.1, max_depth=6):
        self.n_trees = n_trees
        self.learning_rate = learning_rate
        self.max_depth = max_depth
        self.trees = []

    def fit(self, X, queries, labels):
        """
        X: 特征矩阵 [N_docs, N_features]
        queries: 查询分组 [N_docs]
        labels: 相关性标签 [N_docs]
        """
        # 初始分数
        scores = np.zeros(len(X))

        for iteration in range(self.n_trees):
            # 计算 Lambda (梯度)
            lambdas = self.compute_lambdas(scores, queries, labels)

            # 拟合回归树
            tree = DecisionTreeRegressor(max_depth=self.max_depth)
            tree.fit(X, lambdas)

            # 更新分数
            scores += self.learning_rate * tree.predict(X)
            self.trees.append(tree)

    def predict(self, X):
        """预测"""
        scores = np.zeros(len(X))
        for tree in self.trees:
            scores += self.learning_rate * tree.predict(X)
        return scores
```

### ListNet

**基于概率的列表方法**。

```python
class ListNet(nn.Module):
    """ListNet 实现"""

    def __init__(self, input_dim):
        super().__init__()
        self.fc = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 1)
        )

    def forward(self, x):
        return self.fc(x).squeeze(-1)

    def listnet_loss(self, pred_scores, true_scores):
        """
        基于 Top-K 概率的列表损失

        使用 softmax 归一化分数，最小化 KL 散度
        """
        # Top-1 概率
        pred_prob = F.softmax(pred_scores, dim=0)
        true_prob = F.softmax(true_scores, dim=0)

        # 交叉熵 (等价于 KL 散度)
        loss = -(true_prob * torch.log(pred_prob + 1e-8)).sum()

        return loss
```

---

## 五、特征工程

### 常用特征

| 类型 | 特征 | 说明 |
|------|------|------|
| **Query** | 长度、词数、热度 | 查询特征 |
| **Doc** | 长度、质量分、时间 | 文档特征 |
| **匹配** | TF-IDF、BM25 | 文本匹配 |
| **Click** | 历史 CTR | 点击反馈 |
| **Semantic** | Embedding 相似度 | 语义匹配 |

### 特征计算

```python
def extract_features(query, doc, user):
    """特征提取"""
    features = {}

    # Query 特征
    features['query_len'] = len(query)
    features['query_word_count'] = len(query.split())

    # 文档特征
    features['doc_len'] = len(doc['content'])
    features['doc_quality'] = doc['quality_score']
    features['doc_age_days'] = (now - doc['publish_time']).days

    # 匹配特征
    features['tfidf_score'] = compute_tfidf(query, doc['content'])
    features['bm25_score'] = compute_bm25(query, doc['content'])

    # 语义特征
    query_emb = text_encoder.encode(query)
    doc_emb = text_encoder.encode(doc['content'])
    features['semantic_sim'] = cosine_similarity(query_emb, doc_emb)

    # 点击特征
    features['doc_historical_ctr'] = doc['clicks'] / doc['impressions']
    features['user_doc_ctr'] = get_user_doc_ctr(user['id'], doc['id'])

    return features
```

---

## 六、评估指标

### NDCG

```python
def compute_dcg(relevances, k=10):
    """计算 DCG"""
    dcg = 0
    for i, rel in enumerate(relevances[:k], 1):
        dcg += (2 ** rel - 1) / np.log2(i + 1)
    return dcg

def compute_ndcg(relevances, k=10):
    """计算 NDCG"""
    ideal_relevances = sorted(relevances, reverse=True)
    dcg = compute_dcg(relevances, k)
    idcg = compute_dcg(ideal_relevances, k)
    return dcg / idcg if idcg > 0 else 0
```

### MAP

```python
def compute_ap(relevances):
    """计算 Average Precision"""
    precisions = []
    n_relevant = 0

    for i, rel in enumerate(relevances, 1):
        if rel > 0:
            n_relevant += 1
            precisions.append(n_relevant / i)

    return np.mean(precisions) if precisions else 0
```

---

## 七、面试要点

### 高频问题

**Q1: Pointwise、Pairwise、Listwise 的优缺点？**

A:
| 方法 | 优点 | 缺点 |
|------|------|------|
| Pointwise | 简单，可用现有工具 | 忽略文档关系 |
| Pairwise | 关注相对顺序 | 噪声敏感，复杂度 O(n²) |
| Listwise | 直接优化排序指标 | 复杂，计算量大 |

**Q2: LambdaRank 为什么效果好？**

A:
1. 基于 RankNet，理论扎实
2. Lambda 考虑 NDCG 变化，关注重要位置的排序
3. 梯度加权，优化目标明确

**Q3: LambdaMART 中的 MART 是什么？**

A:
- MART = Multiple Additive Regression Trees
- 就是 Gradient Boosting Decision Tree
- LambdaMART = 用 Lambda 作为梯度的 GBDT

**Q4: 为什么搜索场景常用 LambdaMART？**

A:
1. 效果好，在 LTR 比赛中常获胜
2. 可解释性强 (特征重要性)
3. 训练速度快
4. 对特征工程要求相对低

---

## 相关文档

- [搜索系统架构](/kb/) - 搜索系统设计
- [语义搜索与向量检索](/kb/) - 向量召回
