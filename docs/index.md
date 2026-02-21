# MaeDoc 文档导航

> 本文件是 `docs/` 目录的入口文档。Agent 和人类读者从此处开始浏览所有文档。

---

## 当前探索方向

**Maeiee 的终生数字系统** —— 一个技术 Geek 为自己打造的、可以伴随一生的生产力系统。唯一用户 = Maeiee，不考虑商业化。

**核心哲学**：数据永恒（文件即数据库）、能力流转（Emacs 式统一注册）、视图融合（跨技术栈 GUI 积木式组装）。

**当前锚点**：
- **打通数据基建**：验证本地文件与 SQLite 索引的无缝双向映射
- **协议定义**：确立 Intent 协议初版，验证 Rust/Python/Swift 互操作性
- **视图实验**：探索跨技术栈 GUI 融合渲染的技术方案
- **应用积木化**：开发首批小工具，验证乐高式组装可行性

一切皆未定，一切皆开放。

---

## 文档地图

### 愿景与概念

| 文档 | 说明 |
|------|------|
| [总愿景](./vision/overview.md) | Maeiee 的终生数字系统：唯一用户、变与不变的哲学、与超级 App 的区别、数据永恒/能力流转/视图融合三大支柱 |
| [核心概念](./vision/concepts.md) | 数据层（分层数据存储层 + 可重建元数据库）、能力总线、Intent 协议、积木式组装 |
| [项目拆分](./vision/projects.md) | 独立可复用的开源项目边界与依赖关系 |

### 底层基础设施

| 文档 | 说明 |
|------|------|
| [基础设施概述](./infrastructure/overview.md) | 技术系统的整体架构 |
| [UUID 分层存储与 Sidecar 元信息架构](./infrastructure/file-storage.md) | UUID 分层存储、Sidecar 元信息（frontmatter + Markdown）、文件操作流程、并发冲突处理 |
| [数据库系统](./infrastructure/database.md) | SQLite + EAV 架构、与文件系统联动、数据迁移 |
| [服务中心系统](./infrastructure/service-hub.md) | 服务注册发现、跨平台 IPC、MCP 协议对齐 |
| [组件化 GUI 系统](./infrastructure/component-gui.md) | 窗口合成机制、组件通信协议、Shell 容器 |
| [AI Agent 集成](./infrastructure/ai-integration.md) | 权限控制模型、MCP 集成、审计日志 |

### 系统设计

| 文档 | 说明 |
|------|------|
| [核心设计原则](./system-design/core-principles.md) | 跨平台策略、AI 集成原则、MCP 原生设计 |
| [模块间依赖关系](./system-design/module-dependencies.md) | 模块依赖图、启动顺序、接口契约 |
| [风险与挑战](./system-design/risks-challenges.md) | 技术风险、架构挑战、AI 集成风险及缓解措施 |
| [演进路线](./system-design/roadmap.md) | 里程碑规划、迭代节奏、长期愿景 |

### 平台实现

| 文档 | 说明 |
|------|------|
| [各平台实现策略概览](./platform/overview.md) | Windows、macOS、Linux 技术栈选择与平台特性利用 |

### 代办事项

| 文档 | 说明 |
|------|------|
| [TODO 列表](./TODO.md) | Agent 执行过程中记录的代办事项，使用 `/do-todo` 命令执行 |

### 归档文档

| 文档 | 说明 |
|------|------|
| [Windows 平台组件化与 IPC 技术方案](./_archive/windows-component-platform-design.md) | （已归档）Windows 平台 IPC 机制调研与 C++/C# 组件化方案 |

---

## 目录结构

```text
docs/
├── index.md                              # 本文件（导航入口）
├── TODO.md                               # Agent 代办事项列表（/do-todo 执行）
├── vision/                               # 愿景与概念
│   ├── overview.md                       # 总愿景
│   ├── concepts.md                       # 核心概念
│   └── projects.md                       # 项目拆分
├── infrastructure/                       # 底层基础设施
│   ├── overview.md                       # 基础设施概述
│   ├── file-storage.md                   # 文件存储系统
│   ├── database.md                       # 数据库系统
│   ├── service-hub.md                    # 服务中心系统
│   ├── component-gui.md                  # 组件化 GUI 系统
│   └── ai-integration.md                 # AI Agent 集成
├── system-design/                        # 系统设计
│   ├── core-principles.md                # 核心设计原则
│   ├── module-dependencies.md            # 模块间依赖关系
│   ├── risks-challenges.md               # 风险与挑战
│   └── roadmap.md                        # 演进路线
├── platform/                             # 平台实现
│   └── overview.md                       # 各平台实现策略概览
└── _archive/                             # 归档文档
    └── windows-component-platform-design.md
```

---

*最后更新：2026-02-21*

