# MaeDoc 设计反思与演进

> **当前探索方向**：MaeDoc 设计反思与 AI 能力深化
> **最后更新**：2026-02-21

---

## 概述

这是 **MaeDoc** 项目的文档库——一个基于 OpenCode 的**通用文档 AI Agent 生成器**。

**核心特点**：
- **本地优先**：隐私可控，敏感内容不离开本地
- **文档类型可扩展**：不限于技术文档，支持任意文档类型
- **AI 写作流水线**：从想法到成稿的完整工作流
- **Skills 可组合**：能力可复用、可扩展

这份文档集合是对 MaeDoc 项目的整体反思与演进规划。它不只是记录「做了什么」，更要回答「为什么这么做」和「怎么做更好」。

**核心主题**：
- 方案复盘：审视已做出的设计决策
- 演进规划：规划未来的发展方向
- 架构说明：系统性描述设计理念
- 思考笔记：记录探索过程中的洞察

---

## 文档目录

### 回顾与反思

| 文档 | 说明 |
|------|------|
| [项目现状回顾](./retrospect/current-state.md) | Phase 0-7 的关键产出与设计决策 |
| [核心设计反思](./retrospect/design-reflections/index.md) | 四个关键设计的批判性审视 |
| [痛点与不足](./retrospect/pain-points.md) | 当前设计的摩擦点与改进方向 |

### 方向与规划

| 文档 | 说明 |
|------|------|
| [AI 能力深化方向](./forward/ai-capability-deepening.md) | 本地模型强化与协作模式优化 |
| [演进路线图](./forward/evolution-roadmap.md) | 从 v0029 到未来的版本规划 |

### 开放问题

| 文档 | 说明 |
|------|------|
| [开放问题](./questions/open-questions.md) | 还没有答案的问题 |

---

## 目录结构

```
docs/
├── index.md                          # 本文件（导航入口）
├── retrospect/                       # 回顾与反思
│   ├── index.md                      # 分组导航
│   ├── current-state.md              # 项目现状回顾
│   ├── pain-points.md                # 痛点与不足
│   └── design-reflections/           # 设计反思（4篇子文档）
│       ├── index.md                  # 设计反思导航
│       ├── skills-architecture.md    # Skills 架构反思
│       ├── create-freedom.md         # /create 自由化反思
│       ├── remote-bridge.md          # 远程桥接反思
│       └── proactive-escalation.md   # 主动求助机制反思
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

## 阅读建议

| 你的目标 | 建议路径 |
|---------|---------|
| 快速了解项目全貌 | [项目现状回顾](./retrospect/current-state.md) → [演进路线图](./forward/evolution-roadmap.md) |
| 深入理解设计理念 | [核心设计反思](./retrospect/design-reflections/index.md) → [AI 能力深化](./forward/ai-capability-deepening.md) |
| 找具体改进方向 | [痛点与不足](./retrospect/pain-points.md) → [演进路线图](./forward/evolution-roadmap.md) |
| 参与讨论 | [开放问题](./questions/open-questions.md) |

---

## 项目文档关系

| 文档 | 位置 | 职责 |
|------|------|------|
| `README.md` | 项目根目录 | 项目介绍、快速上手 |
| `AGENTS.md` | 项目根目录 | AI Agent 行为准则、写作原则、安全红线 |
| `maedoc/writing-guidelines.md` | maedoc/ | 通用写作规范 |
| `maedoc/dev_plan.md` | maedoc/ | 任务清单、迭代计划（「做什么」） |
| `docs/` | docs/ | 本文档库（「为什么」「怎么做更好」） |

**关键区别**：
- `maedoc/dev_plan.md` 是**执行层面**的任务跟踪
- `docs/` 是**思考层面**的深度探索

---

## 能力概览

### 可用命令

| 命令 | 描述 | 状态 |
|------|------|:----:|
| `/create` | 一键创建新文档（意图 → 大纲 → 内容 → 格式化） | ✅ |
| `/review` | 对现有文档进行全面审阅 | ✅ |
| `/iterate` | 基于反馈定向迭代文档 | ✅ |
| `/evolve` | 文档库结构演进（拆分/合并/归档） | ✅ |
| `/escalate` | 打包上下文发给外部 AI | ✅ |
| `/ingest-remote` | 导入外部 AI 的回答 | ✅ |
| `/do-todo` | 处理 docs/TODO.md 中的代办事项 | ✅ |

### AI Skills

| Skill | 功能 | 状态 |
|-------|------|:----:|
| `doc-outline-generate` | 根据想法 + 文档类型生成结构化大纲 | ✅ |
| `doc-content-fill` | 按章节填充完整内容，标注信心等级 | ✅ |
| `doc-review` | 结构、逻辑、语言多维度审阅 | ✅ |
| `doc-format-normalize` | Markdown 格式规范化 | ✅ |
| `doc-structure-audit` | 检查是否符合文档类型结构要求 | ✅ |
| `doc-quality-score` | 量化质量评分（0–100）+ 改进建议 | ✅ |
| `doc-iterate` | 基于反馈定向修改 | ✅ |
| `doc-translate` | 保持结构的多语言翻译 | ✅ |

---

## 与 dev_plan.md 的关系

| 文档 | 定位 | 性质 |
|------|------|------|
| `maedoc/dev_plan.md` | 任务清单 | 「做什么」 |
| 本文档库 | 设计反思 | 「为什么」「怎么做更好」 |

两者互补：
- dev_plan.md 是执行层面的任务跟踪
- 本文档库是思考层面的深度探索

---

*本文档由 `/create` 和 `/evolve` 命令维护。新建文档会自动追加到文档地图。*

*结构演进于 2026-02-21：去掉 maedoc-reflections 层级，将内容提升到 docs/ 级别。*
