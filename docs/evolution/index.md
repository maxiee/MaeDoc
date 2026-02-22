# MaeDoc 演进史

> **用途**：MaeDoc 从想法到成型的完整历程
> **最后更新**：2026-02-22

---

## 核心理念

MaeDoc 不是一蹴而就的产物，而是一个**持续演进**的文档工程系统。本部分记录了：

- **我们走了多远**：Phase 0-7 的关键产出与设计决策
- **我们学到了什么**：核心设计的反思与痛点分析
- **我们想去哪里**：未来的演进路线与能力深化方向

---

## 演进结构

```mermaid
graph LR
    subgraph Past[过去：回顾]
        H[历史回顾]
        R[设计反思]
        P[痛点分析]
    end
    
    subgraph Future[未来：规划]
        RD[演进路线]
        AI[AI 能力深化]
    end
    
    Past -->| informing | Future
```

---

## 导航

### 历史回顾

了解 MaeDoc Phase 0-7 的关键产出与设计决策。

| 文档 | 说明 |
|------|------|
| [项目现状回顾](./history/current-state.md) | Phase 0-7 的关键产出与设计决策 |
| [核心设计反思](./history/design-reflections/index.md) | 四个关键设计的批判性审视 |
| [历史回顾导航](./history/index.md) | 历史回顾分组入口 |

### 演进规划

了解 MaeDoc 的未来演进方向。

| 文档 | 说明 |
|------|------|
| [演进路线图](./roadmap/evolution-roadmap.md) | 从 v0029 到未来的版本规划 |
| [AI 能力深化方向](./roadmap/ai-capability-deepening.md) | 本地模型强化与协作模式优化 |
| [演进规划导航](./roadmap/index.md) | 演进规划分组入口 |

### 痛点与改进

诚实面对 MaeDoc 当前的不足，为后续改进提供方向。

| 文档 | 说明 |
|------|------|
| [痛点与不足](./pain-points.md) | 当前设计的摩擦点与改进方向 |

---

## 演进时间线

| 阶段 | 主题 | 核心产出 |
|------|------|---------|
| Phase 0 | 基础设施 | AGENTS.md、opencode.jsonc |
| Phase 1-2 | 能力驱动 | 8 个 Skills、文档类型系统（后删除） |
| Phase 3-4 | 命令层 | /create 命令、模板删除 |
| Phase 5 | 远程桥接 | .docforge 中继协议 |
| Phase 6-7 | 治理机制 | TODO 管理、伴侣模式 |
| Phase 8+ | 能力深化 | 提示优化、交互改进 |

---

## 相关文档

- [MaeDoc 核心架构](../maedoc/index.md) — 技术实现细节
- [OpenCode 使用指南](../opencode/index.md) — 平台使用说明
- [伴侣控制平面](../companion/index.md) — 运行时状态管理

---

*本部分由 `/companion` 和 `/evolve` 命令维护。*
