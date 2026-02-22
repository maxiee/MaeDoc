# 命令分发机制

> **所属系列**：[MaeDoc 核心架构设计](./index.md)
> **最后更新**：2026-02-22

---

## 命令与 Skill 的关系

```
Command                      Skill Chain
─────────────────────────────────────────────
/companion ───────────────► doc-focus-map
                               │
                               ▼
                            doc-tree-evolve
                               │
                               ▼
                            knowledge-crystallize
                               │
                               ▼
                            companion-state-sync

/focus     ───────────────► doc-focus-map
                               │
                               ▼
                            companion-state-sync

/create    ───────────────► doc-outline-generate
                               │
                               ▼ (用户确认大纲)
                            doc-content-fill
                               │
                               ▼
                            doc-format-normalize

/review    ───────────────► doc-evaluate

/iterate   ───────────────► doc-iterate

/evolve    ───────────────► doc-tree-evolve
                               │
                               ▼
                            doc-format-normalize
```

---

## 命令解析流程

1. **意图识别**：从用户输入中提取命令类型和参数
2. **上下文组装**：加载 AGENTS.md、相关模板、已有文档
3. **Plan 阶段**：先做探索与方案编排（不写入）
4. **Build 阶段**：按风险策略执行写入
5. **输出生成**：将最终结果写入本地文件

> `/companion` 默认采用“低/中风险自动执行，高风险确认”的分级交互策略。

---

## 相关文档

- [核心数据流](./data-flow.md) — 了解命令执行的完整数据流
- [扩展机制](./extension-mechanism.md) — 了解如何新增 Command
