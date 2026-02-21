# MaeDoc 文档库

> **当前探索方向**：MaeDoc 设计反思与 AI 能力深化
> **最后更新**：2026-02-21

---

## 概述

这是 **MaeDoc** 项目的文档库。MaeDoc 是一个基于 OpenCode 的**通用文档 AI Agent 生成器**——让任何人都能用 AI 高效生成、审阅、迭代任意类型的文档。

**核心特点**：
- **本地优先**：隐私可控，敏感内容不离开本地
- **文档类型可扩展**：不限于技术文档，支持任意文档类型
- **AI 写作流水线**：从想法到成稿的完整工作流
- **Skills 可组合**：能力可复用、可扩展

**给谁用**：
- 想用 AI 辅助写作但担心隐私的人
- 需要频繁写技术设计文档、博客、提案的工程师
- 希望建立个人知识库的创作者

---

## 文档地图

### 核心文档

| 文档 | 说明 | 预估阅读时间 |
|------|------|------------|
| [MaeDoc 设计反思与演进](./maedoc-reflections/index.md) | 项目整体复盘、设计反思、痛点分析、AI 能力深化方向、演进路线图 | ~60 分钟 |

### 子文档（设计反思系列）

| 文档 | 说明 |
|------|------|
| [项目现状回顾](./maedoc-reflections/current-state.md) | Phase 0-7 的关键产出与设计决策 |
| [核心设计反思](./maedoc-reflections/design-reflections.md) | 四个关键设计的批判性审视 |
| [痛点与不足](./maedoc-reflections/pain-points.md) | 当前设计的摩擦点与改进方向 |
| [AI 能力深化方向](./maedoc-reflections/ai-capability-deepening.md) | 本地模型强化与协作模式优化 |
| [演进路线图](./maedoc-reflections/evolution-roadmap.md) | 从 v0029 到未来的版本规划 |
| [开放问题](./maedoc-reflections/open-questions.md) | 还没有答案的问题 |

### 待补充

| 文档 | 状态 |
|------|------|
| `guides/quickstart.md` | 🚧 计划中（v0029） |
| `examples/` | 🚧 计划中 |

---

## 内容导览

### 设计反思与演进（maedoc-reflections/）

这是当前文档库的核心内容，是对 MaeDoc 项目的系统性复盘。

**为什么有这份文档**：
- 记录设计决策背后的「为什么」，而非只有「做了什么」
- 诚实面对不确定性和痛点
- 为未来演进提供方向

**文档关系**：

```
index.md（导航入口）
    ├── current-state.md     ← 回顾：我们建成了什么
    ├── design-reflections.md ← 反思：四个核心设计的得失
    ├── pain-points.md       ← 痛点：当前的问题在哪里
    ├── ai-capability-deepening.md ← 方向：如何让 AI 更强
    ├── evolution-roadmap.md ← 规划：具体版本计划
    └── open-questions.md    ← 开放：还没答案的问题
```

---

## 阅读建议

### 如果你是新用户

1. 先阅读项目根目录的 [README.md](../README.md) 了解项目概况
2. 快速浏览 [项目现状回顾](./maedoc-reflections/current-state.md)
3. 尝试使用 `/create` 命令创建一个简单文档

### 如果你想了解设计理念

1. 重点阅读 [核心设计反思](./maedoc-reflections/design-reflections.md)
2. 配合阅读 [AI 能力深化方向](./maedoc-reflections/ai-capability-deepening.md)
3. 查看 [开放问题](./maedoc-reflections/open-questions.md) 了解探索方向

### 如果你想知道接下来要做什么

1. 直接看 [演进路线图](./maedoc-reflections/evolution-roadmap.md)
2. 参考第 5 节的「版本规划总览」

### 如果你想参与讨论

1. 查看 [开放问题](./maedoc-reflections/open-questions.md)
2. 如果你有想法，欢迎交流

---

## 项目文档关系

MaeDoc 的文档分布在多个位置，各有不同职责：

| 文档 | 位置 | 职责 |
|------|------|------|
| `README.md` | 项目根目录 | 项目介绍、快速上手 |
| `AGENTS.md` | 项目根目录 | AI Agent 行为准则、写作原则、安全红线 |
| `maedoc/writing-guidelines.md` | maedoc/ | 通用写作规范（Markdown 格式、语言风格） |
| `maedoc/dev_plan.md` | maedoc/ | 任务清单、迭代计划（「做什么」） |
| `docs/` | docs/ | 用户文档库（本目录） |
| `docs/maedoc-reflections/` | docs/ | 设计反思与演进（「为什么」「怎么做更好」） |

**关键区别**：
- `maedoc/dev_plan.md` 是**执行层面**的任务跟踪
- `docs/maedoc-reflections/` 是**思考层面**的深度探索

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

## 目录结构

```
docs/
├── index.md                          # 本文件（文档地图）
├── maedoc-reflections/               # 设计反思与演进
│   ├── index.md                      # 导航入口
│   ├── current-state.md              # 项目现状回顾
│   ├── design-reflections.md         # 核心设计反思
│   ├── pain-points.md                # 痛点与不足
│   ├── ai-capability-deepening.md    # AI 能力深化方向
│   ├── evolution-roadmap.md          # 演进路线图
│   └── open-questions.md             # 开放问题
├── guides/                           # 用户指南（WIP）
└── examples/                         # 示例文档（WIP）
```

---

## 快速导航

**新用户**：阅读 [README.md](../README.md) 后，可先浏览 [项目现状回顾](./maedoc-reflections/current-state.md)

**想了解演进计划**：直接看 [演进路线图](./maedoc-reflections/evolution-roadmap.md)

**想参与讨论**：查看 [开放问题](./maedoc-reflections/open-questions.md)

**想快速上手写作**：在 OpenCode 中使用 `/create [你的想法]`

---

*本文档由 `/create` 和 `/evolve` 命令维护。新建文档会自动追加到文档地图。*
