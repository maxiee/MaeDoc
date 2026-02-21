# Skill 契约设计

> **所属系列**：[MaeDoc 核心架构设计](./index.md)
> **最后更新**：2026-02-22

---

## Skill 的唯一要素

每个 Skill 由单一文件组成：

```
.opencode/skills/my-skill/
└── SKILL.md        # 全大写，唯一必需文件
```

**SKILL.md 结构**：
- **frontmatter**：包含 `name`（Skill 名称）和 `description`（功能描述）
- **Markdown 正文**：任务说明，定义 AI 的输入、处理方式和输出格式约定

**设计原则**：通过结构化的 Prompt 格式约定规范 Skill 的行为，让 AI 的创造力在可预测的工作流上运行。

---

## Skill 分类

| 类型 | 说明 | 示例 |
|------|------|------|
| **生成型** | 依赖 LLM 生成内容 | `doc-outline-generate` |
| **审阅型** | 对已有内容进行评估和反馈 | `doc-review` |
| **操作型** | 对文档结构进行修改和整理 | `doc-content-fill` |

---

## 为什么是结构化 Prompt 而非自由对话？

**Maeiee 的判断**：让大模型自由决定调用什么能力，会导致系统**不可靠**。

**解决方案**：通过 SKILL.md 中的结构化 Prompt 格式约定规范 Skill 的输入输出——明确说明接收什么、如何处理、输出什么格式，让 AI 的创造力在可预测的工作流上运行。

**权衡**：Prompt 约定没有强类型校验，依赖约定而非机制，但实现简单、维护成本低。

---

## 相关文档

- [命令分发机制](./command-dispatch.md) — 了解 Skill 如何被调用
- [扩展机制](./extension-mechanism.md) — 了解如何新增 Skill
