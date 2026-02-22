# MaeDoc 文档库

> **面向读者**：Maeiee（记录个人品味与技术判断）
> **最后更新**：2026-02-22

---

## 简介

**MaeDoc** 是一个基于 OpenCode 的**通用文档 AI Agent 生成器**。

它不只是一个文档工具，而是一套**品味驱动的写作系统**：将 AI 的创造力约束在结构化的工作流上，让严肃的写作变成可预测的工业流水线。

**核心能力**：
- **本地优先**：隐私可控，敏感内容不离开本地
- **AI 写作流水线**：从想法到成稿的完整工作流
- **Skills 可组合**：能力可复用、可扩展

---

## 核心设计理念

以下三条理念是 MaeDoc 架构的**不妥协原则**，由 Maeiee 的技术品味驱动。

### 理念 1：绝对的数据主权

**我的判断**：拒绝任何让核心资产和敏感文档离开本地工作流的方案。

**落地方案**：MaeDoc 强依赖本地运行时引擎（OpenCode），所有上下文组装和安全红线校验均在本地完成。远程模型仅在用户主动触发 `/escalate` 时介入，且外发内容必须经过敏感信息扫描。

👉 详见：[核心架构设计 — 系统全景](./maedoc/system-overview.md)

### 理念 2：一切皆契约

**我的判断**：AI 的能力不应该是一个黑盒 prompt，而应该像可组装的乐高——边界清晰、流程可预测。

**落地方案**：通过 SKILL.md 中的结构化 Prompt 格式约定规范每个 Skill 的输入输出——明确说明接收什么、如何处理、输出什么格式，让 AI 的创造力在可预测的工作流上运行。

👉 详见：[核心架构设计 — Skill 契约设计](./maedoc/skill-contract.md)

### 理念 3：流水线胜于对话框

**我的判断**：严肃的写作不需要闲聊，需要的是工业级的生产流水线——每个环节都有明确的输入输出。

**落地方案**：将写作过程拆解为定义命令、加载 Skill、执行生成的标准化工作流。`/create` 从意图到大纲再到内容，`/iterate` 精准修改目标章节，`/review` 多维度质量审计——每一步都可追溯、可验证。

👉 详见：[核心架构设计 — 命令分发机制](./maedoc/command-dispatch.md)

---

## 系统架构快照

MaeDoc 由三层组成：**用户层**（命令输入）→ **OpenCode 运行时**（Commands + Skills）→ **本地文件系统**（输出与配置）。

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

## 文档大地图

按**认知逻辑**组织，帮助你快速找到需要的内容。

### 我想了解架构设计

| 文档 | 说明 |
|------|------|
| [核心架构设计](./maedoc/index.md) | OpenCode 运行时、Skill 契约、命令机制的完整说明 |

### 我想回顾设计决策

| 文档 | 说明 |
|------|------|
| [项目现状回顾](./retrospect/current-state.md) | Phase 0-7 的关键产出与设计决策 |
| [核心设计反思](./retrospect/design-reflections/index.md) | 四个关键设计的批判性审视 |
| [痛点与不足](./retrospect/pain-points.md) | 当前设计的摩擦点与改进方向 |

### 我想规划未来方向

| 文档 | 说明 |
|------|------|
| [AI 能力深化方向](./forward/ai-capability-deepening.md) | 本地模型强化与协作模式优化 |
| [演进路线图](./forward/evolution-roadmap.md) | 从 v0029 到未来的版本规划 |

### 我想学习 OpenCode 使用

| 文档 | 说明 |
|------|------|
| [OpenCode 使用指南](./opencode/index.md) | OpenCode 安装、配置、使用的完整指南 |
| [安装指南](./opencode/installation.md) | 下载地址、桌面端/CLI 安装、文件结构 |
| [Skills 使用入门](./opencode/skills-basics.md) | 什么是 Skills、目录结构、安装与验证 |
| [SKILL.md 开发规范](./opencode/skill-md-spec.md) | Frontmatter 字段、名称验证规则、完整示例 |
| [Skills 权限配置](./opencode/skills-permissions.md) | 权限模式、禁用技能、常见问题 |
| [内置命令参考](./opencode/commands-built-in.md) | /models、/connect、/init、模式切换、命令汇总表 |
| [自定义命令开发](./opencode/commands-custom.md) | 创建、配置、参数、选项详解、完整示例 |

### 我想参与讨论

| 文档 | 说明 |
|------|------|
| [开放问题](./questions/open-questions.md) | 还没有答案的问题 |

---

## 目录结构

```
docs/
├── index.md                          # 本文件（导航入口）
├── maedoc/                           # MaeDoc 核心架构设计（拆分）
│   ├── index.md                      # 架构设计导航入口
│   ├── system-overview.md            # 系统全景
│   ├── data-flow.md                  # 核心数据流
│   ├── skill-contract.md             # Skill 契约设计
│   ├── command-dispatch.md           # 命令分发机制
│   ├── extension-mechanism.md        # 扩展机制
│   └── security-boundary.md          # 安全边界
├── TODO.md                           # 待办事项（由 /do-todo 处理）
├── opencode/                         # OpenCode 使用指南（新增）
│   ├── index.md                      # 分组导航
│   ├── installation.md               # 安装指南
│   ├── skills-basics.md              # Skills 使用入门
│   ├── skill-md-spec.md              # SKILL.md 开发规范
│   ├── skills-permissions.md         # Skills 权限配置
│   ├── environment-variables.md      # 环境变量
│   ├── commands-built-in.md          # 内置命令参考
│   ├── commands-custom.md            # 自定义命令开发
│   └── faq.md                        # 常见问题
├── retrospect/                       # 回顾与反思
│   ├── index.md                      # 分组导航
│   ├── current-state.md              # 项目现状回顾
│   ├── pain-points.md                # 痛点与不足
│   └── design-reflections/           # 设计反思（4 篇子文档）
├── forward/                          # 方向与规划
│   ├── index.md                      # 分组导航
│   ├── ai-capability-deepening.md    # AI 能力深化方向
│   └── evolution-roadmap.md          # 演进路线图
├── questions/                        # 开放问题
│   └── open-questions.md             # 还没有答案的问题
├── guides/                           # 用户指南（WIP）
└── examples/                         # 示例文档（WIP）
```

---

## 项目上下文

| 文档 | 位置 | 职责 |
|------|------|------|
| `README.md` | 项目根目录 | 项目介绍、快速上手 |
| `AGENTS.md` | 项目根目录 | AI Agent 行为准则、写作原则、安全红线 |
| `maedoc/writing-guidelines.md` | maedoc/ | 通用写作规范 |
| `maedoc/dev_plan.md` | maedoc/ | 任务清单、迭代计划（「做什么」） |
| `docs/` | docs/ | 本文档库（「为什么」「怎么做」） |

**关键区别**：
- `maedoc/dev_plan.md` 是**执行层面**的任务跟踪
- `docs/` 是**思考层面**的深度探索和架构说明

---

*本文档由 `/create` 和 `/evolve` 命令维护。新建文档会自动追加到文档地图。*

*结构演进于 2026-02-22：拆分 maedoc-architecture.md (233 行) 为 docs/maedoc/ 目录（index.md + 6 个子文档）*

*结构演进于 2026-02-22：拆分 skills-configuration.md (377 行) 为 3 个子文档（skills-basics、skill-md-spec、skills-permissions）*
