# MaeDoc 设计反思与演进

> **文档类型**：多文档集合（导航入口）
> **日期**：2026-02-21
> **版本**：2.0.0
> **状态**：草稿

---

## 概述

这份文档集合是对 MaeDoc 项目的整体反思与演进规划。

它的定位高于传统的项目文档——不只是记录「做了什么」，更要回答「为什么这么做」和「怎么做更好」。这是一份探索性的随笔，保留了思考过程中的疑问和不确定性。

**核心主题**：
- 方案复盘：审视已做出的设计决策
- 演进规划：规划未来的发展方向
- 架构说明：系统性描述设计理念
- 思考笔记：记录探索过程中的洞察

**写作风格**：探索性随笔，诚实面对不确定性

**演进方向**：AI 能力深化——让本地模型更强

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
docs/maedoc-reflections/
├── index.md                          # 本文件（导航入口）
├── retrospect/                       # 回顾与反思
│   ├── index.md                      # 分组导航
│   ├── current-state.md              # 项目现状回顾
│   ├── design-reflections/           # 设计反思（拆分后）
│   │   ├── index.md                  # 设计反思导航
│   │   ├── skills-architecture.md    # Skills 架构反思
│   │   ├── create-freedom.md         # /create 自由化反思
│   │   ├── remote-bridge.md          # 远程桥接反思
│   │   └── proactive-escalation.md   # 主动求助机制反思
│   └── pain-points.md                # 痛点与不足
├── forward/                          # 方向与规划
│   ├── index.md                      # 分组导航
│   ├── ai-capability-deepening.md    # AI 能力深化方向
│   └── evolution-roadmap.md          # 演进路线图
└── questions/                        # 开放问题
    └── open-questions.md             # 还没有答案的问题
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

## 与 dev_plan.md 的关系

| 文档 | 定位 | 性质 |
|------|------|------|
| `maedoc/dev_plan.md` | 任务清单 | 「做什么」 |
| 本文档集合 | 设计反思 | 「为什么」「怎么做更好」 |

两者互补：
- dev_plan.md 是执行层面的任务跟踪
- 本文档集合是思考层面的深度探索

---

*本文档集合由 `/create` 命令以多文件文档树形式创建于 2026-02-21。*

*结构演进于 2026-02-21：从扁平结构改为分组结构，拆分超长文档。*

*如需调整结构，使用 `/evolve`。如需审阅，使用 `/review`。*
