# Skills 架构：8 个能力的设计哲学

> **本文档定位**：批判性审视 MaeDoc 的 Skills 架构设计
> **所属系列**：[核心设计反思](./index.md)
> **相关文档**：[痛点与不足](../pain-points.md)、[AI 能力深化](../../forward/ai-capability-deepening.md)

---

## 1. 当初的设计

把写作能力拆分成 8 个独立的 Skills，每个负责一件事：

```
用户意图 → /create 命令 → Skills 编排 → 输出文档
```

理论上的好处：
- **可组合**：不同 Skills 可以灵活组合
- **可复用**：单个 Skill 可以被不同命令调用
- **可测试**：每个 Skill 有明确的输入输出

---

## 2. 实际的问题

### 2.1 用户不直接使用 Skills

我几乎从未直接调用某个 Skill。通常是通过 `/create` 间接使用，或者直接跟 AI 说「帮我审阅这篇文档」。

这意味着 Skills 层的价值被稀释了——它变成了命令层的内部实现细节，而非用户可见的能力。

### 2.2 Skills 之间的边界模糊

举个例子：
- `doc-review`：多维度审阅
- `doc-quality-score`：量化评分
- `doc-structure-audit`：结构检查

这三个 Skill 有大量重叠。`doc-review` 本身就应该包含质量评分和结构检查。把它们拆开，反而增加了理解成本。

### 2.3 Skills 的粒度不一致

- `doc-translate` 是一个「原子操作」，职责非常清晰
- `doc-content-fill` 是一个「复杂流程」，内部需要处理很多子问题

把这两个放在同一层级，感觉不太对。

---

## 3. 如果重新设计

我可能会这样重新划分：

**Level 1：核心能力（面向 AI 内部使用）**
- `generate-outline`：生成大纲
- `fill-content`：填充内容
- `format-document`：格式化

**Level 2：分析能力（面向用户可选使用）**
- `review-document`：综合审阅（包含质量评分、结构检查等）
- `analyze-gap`：差距分析（文档 vs 理想状态）

**Level 3：操作能力**
- `translate`：翻译
- `iterate`：迭代修改

这样的划分逻辑是：**按使用场景分层，而非按功能拆分**。

---

## 4. 留下的开放问题

- Skills 是否应该对用户可见？还是应该完全隐藏在命令层后面？
- 如果 Skills 对用户可见，如何让用户理解它们的用途？
- Skills 的版本如何管理？升级后如何保证兼容性？

---

*本文档从 [design-reflections.md](./index.md) 拆分而来，最后更新：2026-02-21*
