# MaeDoc 核心架构设计

> **版本**：2.0.0
> **最后更新**：2026-02-22
> **适用读者**：想深入理解 MaeDoc 设计原理的开发者

---

## 概述

MaeDoc 是一个基于 OpenCode 运行时的文档生成系统，其核心设计理念是：

- **本地优先**：所有敏感操作在本地完成
- **契约驱动**：AI 能力通过 Schema 定义边界
- **流水线胜于对话框**：结构化工作流替代自由对话

本文档库描述 MaeDoc 的核心架构设计，重点说明**边界**和**契约**——而非实现细节。

---

## 架构全景

| 文档 | 说明 |
|------|------|
| [系统全景](./system-overview.md) | 三层架构：用户层、OpenCode 运行时、本地文件系统 |
| [核心数据流](./data-flow.md) | 一次写作命令的完整生命周期 |
| [Skill 契约设计](./skill-contract.md) | Skill 的结构、分类与设计原则 |
| [命令分发机制](./command-dispatch.md) | 命令与 Skill Chain 的映射关系 |
| [扩展机制](./extension-mechanism.md) | 新增文档类型、Skill 和 Command |
| [安全边界](./security-boundary.md) | 文件访问、外部请求、写入确认的安全措施 |

---

## 快速导航

### 我想了解整体架构

👉 [系统全景](./system-overview.md) — OpenCode 运行时与文件系统的边界

### 我想了解数据如何流转

👉 [核心数据流](./data-flow.md) — 从用户输入到文档输出的完整链路

### 我想新增一个 Skill

👉 [Skill 契约设计](./skill-contract.md) + [扩展机制](./extension-mechanism.md)

### 我想新增一个命令

👉 [命令分发机制](./command-dispatch.md) + [扩展机制](./extension-mechanism.md)

### 我想了解安全设计

👉 [安全边界](./security-boundary.md)

---

## 参考资料

- [AGENTS.md](../../AGENTS.md) — AI Agent 行为准则
- [通用写作规范](../../maedoc/writing-guidelines.md)
- [设计反思](../retrospect/design-reflections/index.md) — 架构决策的反思与演进

---

*本文档库由 `/evolve` 命令从单文件架构拆分而来。*
