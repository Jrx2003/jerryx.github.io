---
title: Service Mesh 详解
description: ''
date: null
tags: []
category: Cloud Computing
---
# Service Mesh 详解

> **更新日期**: 2026-03-13
> **版本**: v1.0
> **难度**: 高级
> **预计阅读时间**: 50 分钟

---

## 目录

1. [Service Mesh 概述](#service-mesh-概述)
2. [Sidecar 模式](#sidecar-模式)
3. [Istio 架构](#istio-架构)
4. [核心功能](#核心功能)
5. [面试要点](#面试要点)

---

## Service Mesh 概述

### 为什么需要 Service Mesh

```
传统微服务痛点:
┌─────────┐      ┌─────────┐      ┌─────────┐
│ 服务A   │ ←──→ │ 服务B   │ ←──→ │ 服务C   │
│ - 服务发现│      │ - 服务发现│      │ - 服务发现│
│ - 负载均衡│      │ - 负载均衡│      │ - 负载均衡│
│ - 熔断    │      │ - 熔断    │      │ - 熔断    │
│ - 限流    │      │ - 限流    │      │ - 限流    │
│ - 监控    │      │ - 监控    │      │ - 监控    │
└─────────┘      └─────────┘      └─────────┘

每个服务都要重复实现基础设施代码!

Service Mesh 解决:
- 将基础设施下沉到 Sidecar
- 业务代码只关注业务逻辑
```

### 架构演进

```
第一代: 应用内 SDK (如 Hystrix)
第二代: 代理 Sidecar (Envoy + Istio)
第三代: eBPF 内核级 (Cilium)
```

---

## Sidecar 模式

### 部署模式

```
Pod 结构:
┌─────────────────────────────────┐
│           Pod                   │
│  ┌──────────┐  ┌──────────┐    │
│  │ App      │  │ Sidecar  │    │
│  │ (业务)   │←→│ (Envoy)  │    │
│  │          │  │          │    │
│  │ :8080    │  │ :15001   │    │
│  └──────────┘  └──────────┘    │
│       ↑              ↓         │
│    本地回环      对外通信        │
└─────────────────────────────────┘

流量劫持:
- iptables 透明拦截
- eBPF 高性能拦截
```

### 流量走向

```
服务A调用服务B:

App A → Sidecar A → Sidecar B → App B
         (出站)        (入站)

所有流量经过 Sidecar，可以进行:
- 认证授权
- 加密传输 (mTLS)
- 流量控制
- 指标收集
```

---

## Istio 架构

### 控制平面 + 数据平面

```
┌─────────────────────────────────────────┐
│         Control Plane (istiod)          │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Pilot    │ │ Citadel  │ │ Galley  │ │
│  │ 服务发现 │ │ 证书管理 │ │ 配置验证│ │
│  └──────────┘ └──────────┘ └─────────┘ │
└─────────────────────────────────────────┘
                    ↓ 下发配置
┌─────────────────────────────────────────┐
│           Data Plane (Envoy)            │
│  ┌──────────┐      ┌──────────┐        │
│  │ Sidecar  │←────→│ Sidecar  │        │
│  │ (Pod A)  │      │ (Pod B)  │        │
│  └──────────┘      └──────────┘        │
└─────────────────────────────────────────┘
```

---

## 核心功能

### 流量管理

```yaml
# 虚拟服务 - 流量路由
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
  - reviews
  http:
  - match:
    - headers:
        end-user:
          exact: jason
    route:
    - destination:
        host: reviews
        subset: v2
  - route:
    - destination:
        host: reviews
        subset: v1
      weight: 90
    - destination:
        host: reviews
        subset: v2
      weight: 10
```

### 安全通信

```yaml
# 自动 mTLS
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT  # 强制双向 TLS
```

### 可观测性

```
三大支柱:
1. 指标 (Metrics) - Prometheus
2. 日志 (Logging) - Fluentd/Elasticsearch
3. 追踪 (Tracing) - Jaeger/Zipkin

Istio 自动收集:
- 请求量、延迟、错误率
- 服务拓扑
- 调用链追踪
```

---

## 面试要点

**Q1: Service Mesh 解决了什么问题？**

A:
- 服务间通信复杂度
- 重复的基础设施代码
- 统一的流量管理和安全策略
- 开箱即用的可观测性

**Q2: Sidecar 模式的优缺点？**

A:
- 优点: 透明、语言无关、可独立升级
- 缺点: 延迟增加 (~2-3ms)、资源开销

**Q3: Istio vs Linkerd 对比？**

A:
- Istio: 功能丰富、配置复杂、资源占用高
- Linkerd: 轻量级、简单易用、性能更好

