---
title: Kubernetes架构详解
description: ''
date: null
tags: []
category: Cloud Computing
---
# Kubernetes 架构详解

> 更新日期：2026-03-13
> 相关文档：[虚拟化技术详解](/kb/) | [计算服务概览](/kb/) | [云计算核心概念](/kb/)

---

## 一、Kubernetes 概述

Kubernetes (K8s) 是容器编排系统，自动化部署、扩缩容、管理容器化应用。

### 核心功能

| 功能 | 说明 |
|------|------|
| **服务发现** | 自动暴露服务 |
| **负载均衡** | 分布流量到多个 Pod |
| **存储编排** | 自动挂载存储 |
| **自动扩缩容** | 根据负载调整 Pod 数量 |
| **自愈** | 自动替换失败的容器 |
| **滚动更新** | 无停机部署 |

---

## 二、K8s 架构

### 控制平面 (Control Plane)

```
                    ┌─────────────────────────────────────────┐
                    │            Control Plane             │
                    ├─────────────────────────────────────────┤
                    │                                     │
        ┌───────────▼──────────┐   ┌──────────────────────┐
        │  API Server         │   │    etcd            │
        │  (REST API)       │   │   (Key-Value Store) │
        └───────────┬──────────┘   └──────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
   ┌────▼────┐ ┌───▼──────┐ ┌───▼──────────┐
   │Scheduler│ │Controller│ │Cloud Controller│
   │         │ │Manager  │ │  Manager     │
   └─────────┘ └──────────┘ └──────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
┌───▼────────┐ ┌──▼─────────┐ ┌──▼──────────┐
│  Worker 1  │ │  Worker 2  │ │  Worker N   │
│            │ │            │ │            │
│ ┌────────┐ │ │ ┌────────┐ │ │ ┌────────┐ │
│ │  Kubelet │ │ │ │  Kubelet │ │ │ │  Kubelet │ │
│ └────────┘ │ │ └────────┘ │ │ └────────┘ │
│ ┌────────┐ │ │ ┌────────┐ │ │ ┌────────┐ │
│ │Proxy  │ │ │ │Proxy  │ │ │ │Proxy  │ │
│ └────────┘ │ │ └────────┘ │ │ └────────┘ │
│ ┌────────┐ │ │ ┌────────┐ │ │ ┌────────┐ │
│ │Container│ │ │ │Container│ │ │ │Container│ │
│ │Runtime │ │ │ │Runtime │ │ │ │Runtime │ │
│ └────────┘ │ │ └────────┘ │ │ └────────┘ │
└────────────┘ └────────────┘ └────────────┘
```

### 控制平面组件

| 组件 | 作用 |
|------|------|
| **API Server** | REST API 入口，认证授权 |
| **etcd** | 集群状态存储，键值数据库 |
| **Scheduler** | 调度 Pod 到 Worker 节点 |
| **Controller Manager** | 维护集群状态（副本、节点等）|
| **Cloud Controller Manager** | 与云平台交互（负载均衡、存储）|

### Worker 节点组件

| 组件 | 作用 |
|------|------|
| **Kubelet** | 容器运行时代理，管理 Pod 生命周期 |
| **Kube-proxy** | 网络代理，维护服务规则 |
| **Container Runtime** | 运行容器（Docker/containerd）|

---

## 三、核心概念

### Pod

Pod 是最小部署单元，包含一个或多个容器。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:1.21
    ports:
    - containerPort: 80
  - name: sidecar
    image: fluentd
    volumeMounts:
    - name: log-volume
      mountPath: /var/log
```

| 特性 | 说明 |
|------|------|
| **共享网络** | 同一 Pod 的容器共享网络栈 |
| **共享存储** | 通过 Volume 共享数据 |
| **临时性** | Pod 可以被随时替换 |

### Deployment

管理无状态应用的部署和扩缩容。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
```

### Service

稳定的网络端点，暴露 Pod。

| Service 类型 | 说明 |
|-------------|------|
| **ClusterIP** | 集群内部访问（默认）|
| **NodePort** | 通过节点端口访问 |
| **LoadBalancer** | 云厂商负载均衡器 |

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

### Ingress

HTTP/HTTPS 路由规则。

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress
spec:
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-service
            port:
              number: 80
```

---

## 四、调度机制

### 调度流程

```
1. Pod 创建请求
        │
        ▼
2. 调度器过滤节点 (Predicate)
        │
        │ 剩余候选节点
        ▼
3. 评分节点 (Priority)
        │
        ▼
4. 选择最优节点
        │
        ▼
5. 绑定 Pod 到节点
```

### 调度策略

| 策略 | 说明 |
|------|------|
| **资源请求** | Pod 需要的最小资源 |
| **资源限制** | Pod 可用的最大资源 |
| **亲和性** | Pod 与节点的亲和关系 |
| **反亲和性** | Pod 与节点的排斥关系 |
| **污点和容忍度** | 节点标记和 Pod 选择 |

### 亲和性示例

```yaml
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: disktype
            operator: In
            values:
            - ssd
```

---

## 五、存储

### PV 和 PVC

| 对象 | 说明 |
|------|------|
| **PersistentVolume (PV)** | 集群中的存储资源 |
| **PersistentVolumeClaim (PVC)** | 对存储资源的声明 |

### StorageClass

动态创建存储。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp2
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
```

---

## 六、配置和密钥

### ConfigMap

配置数据注入。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database.url: "mysql://localhost:3306"
  cache.ttl: "3600"
```

### Secret

敏感数据加密存储。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  password: cGFzc3dvcmQ=  # base64 编码
```

---

## 七、自愈和自动扩缩容

### 探针 (Probe)

| 探针类型 | 说明 |
|----------|------|
| **Liveness** | 检查容器是否存活 |
| **Readiness** | 检查容器是否就绪 |
| **Startup** | 检查容器是否启动完成 |

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
```

### HPA (Horizontal Pod Autoscaler)

自动扩缩容 Pod 数量。

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## 八、面试要点

### 高频问题

1. **K8s 核心组件作用？**
   - API Server：REST API 入口
   - etcd：状态存储
   - Scheduler：调度 Pod
   - Controller Manager：维护集群状态

2. **Pod vs Deployment？**
   - Pod：最小部署单元，临时性
   - Deployment：管理 Pod，支持滚动更新

3. **Service 类型区别？**
   - ClusterIP：集群内部
   - NodePort：节点端口
   - LoadBalancer：外部负载均衡

4. **HPA 如何工作？**
   - 监控 CPU/内存等指标
   - 超过阈值增加 Pod
   - 低于阈值减少 Pod

5. **亲和性 vs 反亲和性？**
   - 亲和性：Pod 倾向调度到某些节点
   - 反亲和性：Pod 避免调度到某些节点

---

## 九、最佳实践

1. **使用资源请求和限制**：避免资源争用
2. **配置探针**：及时检测和恢复
3. **使用 ConfigMap 和 Secret**：配置与镜像分离
4. **启用 HPA**：自动应对流量变化
5. **使用命名空间**：资源隔离

---

## 十、相关技术

- [虚拟化技术详解](/kb/) - 容器技术
- [计算服务概览](/kb/) - 云计算服务
- [网络架构与VPC](/kb/vpc) - 网络配置
