# MaeDoc 文档库

> **面向读者**：Maeiee（记录个人品味与技术判断）
> **最后更新**：2026-02-22

---

## 简介

**MaeDoc** 是一个基于 OpenCode 的**通用文档 AI Agent 生成器**。

它是一套**结构化的 AI 写作系统**，让严肃的写作变成可预测的工业流水线。

**核心能力**：
- **本地优先**：隐私可控，敏感内容不离开本地
- **AI 写作流水线**：从想法到成稿的完整工作流
- **Skills 可组合**：能力可复用、可扩展

---

## 系统架构快照

MaeDoc 由四层组成：**用户层**（命令输入）→ **OpenCode 运行时**（Commands + Skills）→ **SubAgent 协作层**（4 个核心 Agent）→ **本地文件系统**（输出与配置）。

```
用户 ──► /create /iterate /review ──► OpenCode Runtime
                                            │
                    ┌───────────────────────┤
                    ▼                       ▼
               Commands                  Skills
              (/create 等)           (AI 写作能力)
                    │                       │
                    └───────────────────────┤
                                            ▼
                                     本地文件系统
                                    (docs/ 输出文档)
```

**完整架构文档**：[核心架构设计](./maedoc/index.md)

---

## 文档地图

按**主题归属**组织，帮助你快速定位内容。

---

## 一、MaeDoc 核心

关于本项目的设计理念、架构决策与演进历程。

### 架构设计

| 文档 | 说明 |
|------|------|
| [核心架构设计](./maedoc/index.md) | 架构设计导航入口 |
| [系统全景](./maedoc/system-overview.md) | 四层架构、6 Commands、12 Skills、4 SubAgents |
| [核心数据流](./maedoc/data-flow.md) | 一次写作命令的完整生命周期 |
| [Skill 契约设计](./maedoc/skill-contract.md) | Skill 的结构、分类与设计原则 |
| [命令分发机制](./maedoc/command-dispatch.md) | 命令与 Skill Chain 的映射关系 |
| [扩展机制](./maedoc/extension-mechanism.md) | 新增 Skill 和 Command |
| [安全边界](./maedoc/security-boundary.md) | 文件访问、外部请求、写入确认的安全措施 |

### 项目演进

| 文档 | 说明 |
|------|------|
| [项目现状回顾](./retrospect/current-state.md) | Phase 0-7 的关键产出与设计决策 |
| [核心设计反思](./retrospect/design-reflections/index.md) | 四个关键设计的批判性审视 |
| [痛点与不足](./retrospect/pain-points.md) | 当前设计的摩擦点与改进方向 |
| [AI 能力深化方向](./forward/ai-capability-deepening.md) | 本地模型强化与协作模式优化 |
| [演进路线图](./forward/evolution-roadmap.md) | 从 v0029 到未来的版本规划 |

---

## 二、OpenCode 平台

关于底层 AI 运行时的使用与扩展开发。

### 使用指南

| 文档 | 说明 |
|------|------|
| [OpenCode 使用指南](./opencode/index.md) | 使用指南导航入口 |
| [安装指南](./opencode/installation.md) | 下载地址、桌面端/CLI 安装、文件结构 |
| [内置命令参考](./opencode/commands-built-in.md) | /models、/connect、/init、模式切换 |
| [自定义命令开发](./opencode/commands-custom.md) | 创建、配置、参数、选项详解 |
| [Skills 使用入门](./opencode/skills-basics.md) | 什么是 Skills、目录结构、安装与验证 |
| [SKILL.md 开发规范](./opencode/skill-md-spec.md) | Frontmatter 字段、名称验证规则 |
| [Skills 权限配置](./opencode/skills-permissions.md) | 权限模式、禁用技能 |
| [环境变量](./opencode/environment-variables.md) | 全局配置 vs 项目配置 |
| [常见问题](./opencode/faq.md) | 问题解决与使用技巧 |

### 扩展开发

| 文档 | 说明 | 风险 |
|------|------|:----:|
| [扩展能力总览](./opencode/extensibility/index.md) | 六支柱架构导航 | — |
| [Plugins 扩展机制](./opencode/extensibility/plugins.md) | 事件总线 Hook、改写行为 | 🔴 |
| [Custom Tools](./opencode/extensibility/custom-tools.md) | TypeScript/JS 函数 | 🔴 |
| [MCP Servers](./opencode/extensibility/mcp-servers.md) | 外部工具集接入 | 🟡 |
| [Agents/Rules/Skills](./opencode/extensibility/agents-rules-skills.md) | 可组合工作流 | 🟢 |
| [Server/SDK](./opencode/extensibility/server-sdk.md) | OpenAPI 3.1 + SSE | 🔴 |
| [安全边界](./opencode/extensibility/security-boundary.md) | 权限、审计、应急响应 | — |
| [扩展开发学习路径](./opencode/extensibility/learning-path.md) | 从入门到精通 | — |

---

## 三、其他

### 学习笔记

| 文档 | 说明 |
|------|------|
| [Coding Agents 内部机制](./learning/coding-agents-internals.md) | OpenCode 深度解析，系统提示词设计 |


---

## 目录结构

```
docs/
├── index.md                          # 本文件（导航入口）
├── maedoc/                           # MaeDoc 核心架构设计
│   ├── index.md                      # 架构设计导航
│   ├── system-overview.md            # 系统全景
│   ├── data-flow.md                  # 核心数据流
│   ├── skill-contract.md             # Skill 契约设计
│   ├── command-dispatch.md           # 命令分发机制
│   ├── extension-mechanism.md        # 扩展机制
│   └── security-boundary.md          # 安全边界
├── opencode/                         # OpenCode 使用指南
│   ├── index.md                      # 使用指南导航
│   ├── installation.md               # 安装指南
│   ├── skills-basics.md              # Skills 入门
│   ├── skill-md-spec.md              # SKILL.md 规范
│   ├── skills-permissions.md         # 权限配置
│   ├── environment-variables.md      # 环境变量
│   ├── commands-built-in.md          # 内置命令
│   ├── commands-custom.md            # 自定义命令
│   ├── faq.md                        # 常见问题
│   └── extensibility/                # 扩展能力
│       ├── index.md                  # 扩展导航
│       ├── plugins.md
│       ├── custom-tools.md
│       ├── mcp-servers.md
│       ├── agents-rules-skills.md
│       ├── server-sdk.md
│       ├── security-boundary.md
│       └── learning-path.md
├── retrospect/                       # 回顾与反思
│   ├── index.md
│   ├── current-state.md
│   ├── pain-points.md
│   └── design-reflections/
├── forward/                          # 方向与规划
│   ├── index.md
│   ├── ai-capability-deepening.md
│   └── evolution-roadmap.md
├── learning/                         # 学习笔记
│   └── coding-agents-internals.md

├── TODO.md                           # 待办事项
└── _archive/                         # 已归档文档
```

---

## 项目上下文

| 文档 | 位置 | 职责 |
|------|------|------|
| `README.md` | 项目根目录 | 项目介绍、快速上手 |
| `AGENTS.md` | 项目根目录 | AI Agent 行为准则 |
| `maedoc/writing-guidelines.md` | maedoc/ | 通用写作规范 |
| `maedoc/dev_plan.md` | maedoc/ | 任务清单、迭代计划 |
| `docs/` | docs/ | 本文档库（深度探索） |

**关键区别**：
- `maedoc/dev_plan.md` 是**执行层面**的任务跟踪
- `docs/` 是**思考层面**的深度探索和架构说明

---

*本文档由 `/create` 和 `/evolve` 命令维护。*

*结构演进于 2026-02-22：将"我想……"导航重构为主题导向的两级结构*
