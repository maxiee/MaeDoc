# MaeDoc 文档导航

> 本文件是 `docs/` 目录的入口文档。Agent 和人类读者从此处开始浏览所有文档。

---

## 当前探索方向

**跨平台个人生产力系统** —— 研究个人生产力系统的技术架构设计，包括文件管理、数据存储、服务集成、GUI 组件化、AI Agent 集成等核心模块，以及 Windows、macOS、Linux 三大平台的实现策略。

---

## 文档地图

### 系统设计

| 文档 | 说明 |
|------|------|
| [系统概述](./system-design/overview.md) | 跨平台个人生产力系统的定位、目标用户、设计理念 |
| [核心设计原则](./system-design/core-principles.md) | 跨平台策略、AI 集成原则、MCP 原生设计 |
| [模块间依赖关系](./system-design/module-dependencies.md) | 模块依赖图、启动顺序、接口契约 |
| [风险与挑战](./system-design/risks-challenges.md) | 技术风险、架构挑战、AI 集成风险及缓解措施 |
| [演进路线](./system-design/roadmap.md) | 里程碑规划、迭代节奏、长期愿景 |

### 可跨系统复用模块

| 文档 | 说明 |
|------|------|
| [文件存储系统](./shared-modules/file-storage.md) | UUID 分层存储、Sidecar 元信息、文件操作流程 |
| [数据库系统](./shared-modules/database.md) | SQLite + EAV 架构、与文件系统联动、数据迁移 |
| [服务中心系统](./shared-modules/service-hub.md) | 服务注册发现、跨平台 IPC、MCP 协议对齐 |
| [组件化 GUI 系统](./shared-modules/component-gui.md) | 窗口合成机制、组件通信协议、Shell 容器 |
| [AI Agent 集成](./shared-modules/ai-integration.md) | 权限控制模型、MCP 集成、审计日志 |

### 不同操作系统实现

| 文档 | 说明 |
|------|------|
| [各平台实现策略概览](./platform-implementations/overview.md) | Windows、macOS、Linux 技术栈选择与平台特性利用 |

### 操作系统知识概念

| 文档 | 说明 |
|------|------|
| [待创建] Windows 知识概念 | Windows IPC、COM、WinRT 等核心概念 |
| [待创建] macOS 知识概念 | XPC、Core Animation、UTI 等核心概念 |
| [待创建] Linux 知识概念 | D-Bus、Wayland/X11、inotify 等核心概念 |

### 编程语言技术概念

| 文档 | 说明 |
|------|------|
| [待创建] Rust 技术概念 | Rust 在系统编程中的应用、跨平台编译 |
| [待创建] Swift 技术概念 | Swift 与 Apple 生态集成 |
| [待创建] C# 技术概念 | C# 与 Windows 生态集成 |

### 归档文档

| 文档 | 说明 |
|------|------|
| [Windows 平台组件化与 IPC 技术方案](./_archive/windows-component-platform-design.md) | （已归档）Windows 平台 IPC 机制调研与 C++/C# 组件化方案 |

---

## 目录结构

```text
docs/
├── index.md                              # 本文件（导航入口）
├── system-design/                        # 系统设计
│   ├── overview.md                       # 系统概述
│   ├── core-principles.md                # 核心设计原则
│   ├── module-dependencies.md            # 模块间依赖关系
│   ├── risks-challenges.md               # 风险与挑战
│   └── roadmap.md                        # 演进路线
├── shared-modules/                       # 可跨系统复用模块
│   ├── file-storage.md                   # 文件存储系统
│   ├── database.md                       # 数据库系统
│   ├── service-hub.md                    # 服务中心系统
│   ├── component-gui.md                  # 组件化 GUI 系统
│   └── ai-integration.md                 # AI Agent 集成
├── platform-implementations/             # 不同操作系统实现
│   └── overview.md                       # 各平台实现策略概览
├── os-concepts/                          # 操作系统知识概念
│   └── （待创建）
├── tech-concepts/                        # 编程语言技术概念
│   └── （待创建）
└── _archive/                             # 归档文档
    └── windows-component-platform-design.md
```

---

*最后更新：2026-02-20*
