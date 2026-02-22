# SubAgent 协作架构

> **所属系列**：MaeDoc 核心架构设计
> **最后更新**：2026-02-22

---

## SubAgent 清单

| Agent ID | 层级 | 调用方 | 功能 | 工具权限 |
|----------|------|--------|------|---------|
| `doc-library-analyst` | 分析层 | `/evolve` Phase 1 | 全库扫描，构建跨文档知识图谱，输出结构化分析报告 | 只读（write/edit/bash 禁用）|
| `doc-planner` | 规划层 | `/create` Phase 2 | 分析需求和文档库结构，生成大纲方案（路径/结构/规模评估） | 只读（write/edit/bash 禁用）|
| `doc-analyst` | 分析层 | `/create`、`/iterate`、`/review` 质量门 | 文档质量评估（7 维度评分 + P0/P1/P2 问题清单） | 只读（write/edit/bash 禁用）|
| `doc-writer` | 写作层 | `/create` Phase 3 | 接收大纲，逐章节填充内容并格式化，输出写作完成报告 | 读写（bash/task 禁用）|

---

## SubAgent vs Skill 的选择原则

| 场景 | 使用 SubAgent | 使用 Skill |
|------|-------------|-----------|
| 需要加载大量文档内容（如全库扫描） | 隔离上下文 | 污染主 Agent |
| 需要独立的创作焦点（如内容生成） | 干净上下文 | 受对话历史干扰 |
| 需要严格的工具权限限制 | 可精确配置 | 继承主 Agent 权限 |
| 简单、局部的操作（如追加 TODO） | 开销过大 | 直接执行 |

---

## 调用方式

所有 SubAgent 通过 `task` 工具调用：

```
task(
  description: "3-5 字的任务描述",
  subagent_type: "doc-planner",  // SubAgent ID
  prompt: """
    ... 详细任务描述 + 所有必要参数 ...
    注意：请在最终回复中输出标准格式报告，供调用方解析使用。
  """
)
```

---

## 无状态 Prompt 构成原则

> **核心约束**：每次 SubAgent 调用都是无状态的——SubAgent 无法访问主 Agent 的对话历史。**prompt 必须完全自给自足**。

| 要素 | 必要性 | 说明 |
|------|:------:|------|
| **任务描述** | 必须 | 清晰说明要做什么、为什么做 |
| **输入参数** | 必须 | 所有必要参数显式传入（文件路径、意图、约束等） |
| **上下文摘要** | 视情况 | 对话中的关键决策、已确认的前置条件 |
| **期望输出格式** | 必须 | 明确说明返回什么格式的报告 |
| **行为约束** | 视情况 | 提醒只读/禁止特定操作等 |

**反模式**（避免）：
- 在 prompt 中写"如上所述" / "基于我们的讨论"
- 省略文件路径，认为 SubAgent 能"猜到"
- 不指定输出格式

---

## 并行调用原则

当多个 SubAgent 任务相互独立时，应在同一轮 `task` 调用中并行发出。

**适合并行**：多文件质量检查、独立的分析任务
**必须顺序**：doc-planner → doc-writer、doc-writer → doc-analyst

---

## 温度设定

| SubAgent | Temperature | 设定理由 |
|----------|:-----------:|---------|
| `doc-analyst` | 0.1 | 质量评分需高一致性 |
| `doc-library-analyst` | 0.1 | 全库扫描是事实性分析 |
| `doc-planner` | 0.3 | 规划需要一定灵活性 |
| `doc-writer` | 0.7 | 内容创作需要创意表达 |

---

## 写 → 诊断 → 调整 反馈循环

```
[doc-writer 写入文档]
        |
        v
[doc-analyst 质量评估]  <- 独立上下文，客观评分
        |
        |-- PASS（>=70）-> 继续后续流程
        |
        +-- FAIL（<70）-> TOP_ISSUES 作为反馈 -> [doc-iterate 改进] -> 循环（最多3次）
```

**为什么 doc-analyst 是独立 SubAgent**：Skill 在主 Agent 上下文中运行，受写作过程的"认知惯性"影响；SubAgent 拥有干净上下文，评分更客观。

---

## 协作模式

```
主 Agent（协调者）
  |-- 用户交互：提问、确认、展示结果
  |-- 状态管理：维护文件路径、创建模式等变量
  |-- 调用 SubAgent（via task 工具）
  |     |-- doc-library-analyst -> 分析报告
  |     |-- doc-planner -> 规划报告（大纲 + 元数据）
  |     |-- doc-writer -> 写作完成报告（写入文件）
  |     +-- doc-analyst -> 质量报告（评分 + 问题列表）
  +-- 写入 docs/index.md（SubAgent 不做，主 Agent 统一负责）
```

**关键约定**：
- SubAgent 的输出是**紧凑的结构化文本报告**
- 主 Agent 解析报告，决定后续操作
- `docs/index.md` 的更新**始终由主 Agent 负责**
