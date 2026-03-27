---
title: 网络架构与VPC
description: ''
date: null
tags: []
category: Cloud Computing
---
# 网络架构与 VPC

> 更新日期：2026-03-13
> 相关文档：[云计算核心概念](/kb/) | [计算服务概览](/kb/) | [Kubernetes架构详解](/kb/kubernetes)

---

## 一、VPC 概述

VPC (Virtual Private Cloud) 是在公有云中创建的隔离网络环境，用户可以完全控制网络拓扑、IP 地址、路由、网关等。

### VPC 核心组件

```
                        Internet
                            │
                            │
                       ┌────▼────┐
                       │ IGW     │  Internet Gateway
                       │ (NAT)   │
                       └────┬────┘
                            │
                   ┌─────────▼────────────────┐
                   │        VPC             │
                   │   (10.0.0.0/16)      │
                   └─────────────────────────┘
                            │
    ┌───────────┬───────────┼───────────┬───────────┐
    │           │           │           │           │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│子网 A │ │子网 B │ │子网 C │ │子网 D │ │子网 E │
│Public │ │Public │ │Private│ │Private│ │Private│
│10.0.1.0│ │10.0.2.0│ │10.0.3.0│ │10.0.4.0│ │10.0.5.0│
└───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘
    │          │          │          │          │
    │     ┌────┘          │     ┌────┘
    │     │               │     │
┌───▼────▼───┐    ┌────▼────▼─────┐
│ NAT Gateway│    │ Private Link │
│  (10.0.3.1)│    │  服务访问   │
└────────────┘    └──────────────┘
```

---

## 二、VPC 核心组件

### 1. 子网 (Subnet)

子网是 VPC 的网络分段，分为公共子网和私有子网。

| 类型 | 特点 | 路由到 |
|------|------|---------|
| **公共子网** | 可以直接访问互联网 | Internet Gateway |
| **私有子网** | 不能直接访问互联网 | NAT Gateway / 无路由 |

### 2. 路由表 (Route Table)

控制子网的网络流量转发。

```bash
# AWS 路由表示例
Destination        | Target
------------------|-----------------------
10.0.0.0/16      | local
0.0.0.0/0        | igw-xxxxxxxx (公共子网)
0.0.0.0/0        | nat-xxxxxxxx (私有子网)
172.16.0.0/12     | vpc-peering-xxxxxx
```

### 3. 网关 (Gateway)

| 网关类型 | 说明 | 用途 |
|----------|------|------|
| **Internet Gateway** | 连接互联网的入口 | 公共子网访问互联网 |
| **NAT Gateway** | 网络地址转换 | 私有子网出站访问 |
| **VPN Gateway** | Site-to-Site VPN | 连接本地数据中心 |
| **Transit Gateway** | 多 VPC/VPN 中转 | 大规模网络互联 |

### 4. 安全组 (Security Group)

虚拟防火墙，控制实例的入站和出站流量。

| 规则类型 | 配置示例 |
|----------|----------|
| **入站规则** | 允许 TCP 22 (SSH) from 0.0.0.0/0 |
| **出站规则** | 允许所有流量 0.0.0.0/0 |

```bash
# AWS CLI 创建安全组
aws ec2 create-security-group \
    --group-name my-sg \
    --description "My security group"

# 添加入站规则
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxx \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0
```

### 5. NACL (Network ACL)

子网级别的无状态防火墙，按顺序评估规则。

| 特点 | 安全组 vs NACL |
|------|---------------|
| 作用对象 | 实例级 | 子网级 |
| 状态 | 有状态 | 无状态 |
| 默认行为 | 拒绝所有入站，允许所有出站 | 允许所有 |

---

## 三、网络连接

### 1. VPC Peering

两个 VPC 之间的私有网络连接。

```
VPC A (10.0.0.0/16)         VPC B (172.16.0.0/16)
    │                              │
    └─────── Peering ───────────────┘
            Connection
```

| 限制 | 说明 |
|------|------|
| CIDR 不能重叠 | 不能使用相同的 IP 段 |
| 只能连接两个 VPC | 需要多个 Peering 连接多 VPC |
| 跨区域 Peering | 需要额外配置 |

### 2. Private Link

将服务暴露到另一个 VPC，不暴露到公网。

```
服务提供方                    服务消费方
VPC A                          VPC B
    │                              │
┌───▼───┐                    ┌───▼───┐
│ NLB   │───PrivateLink───→  │ EC2   │
└───────┘                    └───────┘
```

| 优势 | 说明 |
|------|------|
| 安全 | 不经过公网 |
| 私有 IP | 使用私有 IP 访问 |
| 简化 | 无需复杂的路由配置 |

### 3. VPN Connection

连接本地数据中心和云环境。

```
本地数据中心                          云环境
    │                                  │
┌───▼───┐                   ┌────────▼────────┐
│ VPN   │═════════════════════│ VPN Gateway  │
│ 设备  │       加密隧道       │      │
└───────┘                   └────────┬────────┘
                                     │
                                   VPC
```

### 4. Direct Connect /专线

专用物理连接，提供更低延迟和更高可靠性。

| 对比 | VPN | Direct Connect |
|------|-----|---------------|
| 带宽 | < 1Gbps | 1Gbps - 100Gbps |
| 延迟 | 互联网波动 | 稳定低延迟 |
| 安全 | 加密隧道 | 物理隔离 |
| 成本 | 较低 | 较高 |

---

## 四、负载均衡

### 负载均衡器类型

| 类型 | 层级 | 协议 | 场景 |
|------|------|------|------|
| **ALB** | L7 | HTTP/HTTPS | 微服务、需要路由 |
| **NLB** | L4 | TCP/UDP/TLS | 高性能、低延迟 |
| **CLB** | L4/L7 | 多种协议 | 传统应用 |

### ALB 路由规则

```yaml
# AWS Application Load Balancer 监听器规则
Conditions:
  - Field: path-pattern
    Values: ["/api/*"]
  - Field: header
    HeaderName: x-service-version
    Values: ["v1"]
Actions:
  - Type: forward
    TargetGroup:
      Arn: arn:aws:elasticloadbalancing:...
```

---

## 五、DNS 服务

### Route 53 vs Cloud DNS

| 特性 | AWS Route 53 | GCP Cloud DNS |
|------|--------------|---------------|
| 类型 | 权威 DNS | 权威 DNS |
| 记录类型 | A、AAAA、CNAME 等 | A、AAAA、CNAME 等 |
| 健康检查 | 支持 | 支持 |
| 流量策略 | 延迟、地理位置、权重 | 加权轮询 |

### DNS 路由策略

| 策略 | 说明 | 用途 |
|------|------|------|
| **简单路由** | 固定 IP | 静态网站 |
| **加权路由** | 按权重分配流量 | 灰度发布 |
| **延迟路由** | 选择最低延迟区域 | 全球部署 |
| **地理位置路由** | 基于用户位置 | 本地化服务 |

---

## 六、网络监控

### VPC 流量日志

记录网络流量信息，用于安全审计和故障排查。

| 记录字段 | 说明 |
|----------|------|
| version | 日志版本 |
| account-id | AWS 账户 ID |
| vpc-id | VPC ID |
| subnet-id | 子网 ID |
| srcaddr | 源 IP 地址 |
| dstaddr | 目的 IP 地址 |
| srcport | 源端口 |
| dstport | 目的端口 |
| protocol | 协议 (TCP/UDP/ICMP) |
| action | ACCEPT/REJECT |

---

## 七、面试要点

### 高频问题

1. **公共子网 vs 私有子网？**
   - 公共子网：有 Internet Gateway 路由，可访问互联网
   - 私有子网：无 Internet Gateway，通过 NAT 出站

2. **安全组 vs NACL？**
   - 安全组：实例级，有状态，推荐使用
   - NACL：子网级，无状态，用于子网级别控制

3. **ALB vs NLB？**
   - ALB：L7，支持 HTTP 路由，适合微服务
   - NLB：L4，性能更高，适合高吞吐场景

4. **VPC Peering 的限制？**
   - CIDR 不能重叠
   - 只能连接两个 VPC
   - 跨区域需要额外配置

5. **如何让私有子网访问互联网？**
   - 配置 NAT Gateway
   - 路由表添加 0.0.0.0/0 -> NAT GW

---

## 八、最佳实践

1. **多可用区部署**：提高可用性
2. **最小权限原则**：安全组和 NACL 只开放必要端口
3. **私有子网部署应用**：数据库等敏感服务放私有子网
4. **监控和日志**：启用 VPC Flow Logs
5. **加密传输**：VPN、Direct Connect 使用加密

---

## 九、相关技术

- [计算服务概览](/kb/) - EC2 等计算服务
- [Kubernetes架构详解](/kb/kubernetes) - K8s 网络
- [云计算核心概念](/kb/) - 基础概念
