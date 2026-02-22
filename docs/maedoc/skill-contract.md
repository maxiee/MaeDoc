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
| **审阅型** | 对已有内容进行评估和反馈 | `doc-evaluate` |
| **操作型** | 对文档结构进行修改和整理 | `doc-content-fill` |

---

## 为什么是结构化 Prompt 而非自由对话？

**Maeiee 的判断**：让大模型自由决定调用什么能力，会导致系统**不可靠**。

**解决方案**：通过 SKILL.md 中的结构化 Prompt 格式约定规范 Skill 的输入输出——明确说明接收什么、如何处理、输出什么格式，让 AI 的创造力在可预测的工作流上运行。

**权衡**：Prompt 约定没有强类型校验，依赖约定而非机制，但实现简单、维护成本低。

---

## Skill 描述设计模式

> **核心洞察**：Skill 的描述不是"功能说明"，而是"使用指南"——告诉 LLM 什么时候用、怎么用、注意什么。

### 描述即 Prompt

每个 Skill 的描述应该告诉 LLM：

1. **功能概述**：这个 Skill 做什么
2. **使用场景**：什么时候应该使用
3. **输入格式**：参数的正确格式
4. **输出格式**：返回内容的结构
5. **注意事项**：边界情况和常见错误

### SKILL.md 描述结构建议

```markdown
---
name: doc-evaluate
description: |
  对文档进行统一质量评估（7 维度 0-100 评分 + P0/P1/P2 问题清单）。

  使用场景：
  - 评估文档的整体质量
  - 识别需要改进的章节
  - 对比不同版本的质量变化
  - 检查结构合规性

  输出：评分报告 + 各维度分数 + 问题清单 + 改进建议
---

## 功能说明

...

## 输入要求

- 文档路径（必需）
- 评分维度（可选，默认全部）

## 输出格式

```json
{
  "total_score": 85,
  "dimensions": {
    "structure": 90,
    "clarity": 80,
    ...
  },
  "suggestions": [...]
}
```

## 注意事项

- 不适用于代码文档
- 需要先运行 `doc-format-normalize` 格式化
```

### 与其他 Skill 的协作

在描述中明确说明与其他 Skill 的关系：

```markdown
## 协作关系

- 前置：`doc-format-normalize`（格式化后评分更准确）
- 后续：`doc-iterate`（根据评分报告迭代改进）
```

---

## 相关文档

- [命令分发机制](./command-dispatch.md) — 了解 Skill 如何被调用
- [扩展机制](./extension-mechanism.md) — 了解如何新增 Skill
- [Coding Agents 内部机制](../learning/coding-agents-internals.md) — OpenCode 深度解析中的"描述即 Prompt"设计模式
