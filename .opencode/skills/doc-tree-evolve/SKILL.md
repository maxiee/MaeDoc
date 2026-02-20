---
name: doc-tree-evolve
description: 分析当前 docs/ 文档树快照与用户演进意图，输出结构化的变更计划（拆分/合并/移动/新建/归档/更新引用/更新 index）
---

# doc-tree-evolve

> **Skill ID**：`doc-tree-evolve`
> **版本**：1.0.0
> **类型**：instruction
> **用途**：接收当前文档树快照和用户的演进意图，分析后输出结构化变更计划，供 `/evolve` 命令执行

---

## 触发条件

本 Skill 由 `/evolve` 命令内部调用，不直接面向用户触发。

---

## 输入

| 参数 | 必需 | 说明 |
|------|:----:|------|
| `tree_snapshot` | 是 | 当前 `docs/` 的结构快照：文件列表，每个文件包含路径、行数、H1 标题、首段摘要（1-2 句） |
| `current_index` | 是 | 当前 `docs/index.md` 的完整内容 |
| `intent` | 是 | 用户的演进意图：新探索方向、结构调整需求等自然语言描述 |
| `max_lines` | 否 | 单文档篇幅上限，默认 `300` |

**`tree_snapshot` 格式示例**：

```yaml
files:
  - path: "docs/windows-component-platform-design.md"
    lines: 280
    title: "Windows 平台组件化与 IPC 技术方案"
    summary: "Windows 平台 IPC 机制调研与 C++/C# 组件化方案推荐"
    referenced_by: []
    references: []
  - path: "docs/distributed-systems/cap-theorem.md"
    lines: 150
    title: "CAP 理论笔记"
    summary: "分布式系统 CAP 定理的核心概念与实际权衡分析"
    referenced_by: ["docs/index.md"]
    references: ["docs/distributed-systems/consistency-models.md"]
diagnostics:
  overlong_files: ["docs/some-long-doc.md (420 lines)"]
  orphan_files: ["docs/forgotten-notes.md"]
  broken_refs: ["docs/foo.md -> docs/deleted-file.md"]
```

---

## 执行步骤

### 步骤 1：理解意图

解析 `intent`，将用户意图分类为以下一种或多种：

| 意图类型 | 说明 | 示例 |
|---------|------|------|
| `DIRECTION_CHANGE` | 探索方向转变，需更新 index.md 的探索方向声明 | "我现在转向研究分布式一致性协议" |
| `RESTRUCTURE` | 重新组织目录结构 | "文档太多了，帮我重新分类整理" |
| `SPLIT` | 拆分超长文档 | "把这篇文档拆成几个小文件" |
| `MERGE` | 合并碎片文档 | "这几篇笔记合并成一篇" |
| `ARCHIVE` | 归档不再活跃的文档 | "之前的组件平台设计暂时搁置" |
| `CLEANUP` | 清理断裂引用和孤立文档 | "帮我清理一下引用关系" |

---

### 步骤 2：诊断现状

基于 `tree_snapshot` 和 `current_index`，生成诊断报告：

1. **篇幅检查**：标记超过 `max_lines` 的文档
2. **孤立文档检测**：找出未被任何其他文档引用的文件（`index.md` 除外）
3. **断裂引用检测**：找出引用了不存在文件的链接
4. **分类覆盖度**：检查 index.md 是否覆盖了所有文档
5. **目录深度检查**：标记嵌套超过 3 层的路径

---

### 步骤 3：生成变更计划

根据用户意图 + 诊断结果，输出一组有序操作。每个操作使用以下类型之一：

| 操作类型 | 参数 | 说明 |
|---------|------|------|
| `CREATE_DIR` | `path` | 创建新目录 |
| `MOVE_FILE` | `from`, `to`, `reason` | 移动文件到新位置 |
| `SPLIT_FILE` | `source`, `targets[]`, `strategy` | 将超长文档拆分为多个子文档 |
| `MERGE_FILES` | `sources[]`, `target`, `strategy` | 将多个文档合并为一个 |
| `ARCHIVE` | `path`, `archive_path` | 将文档移入归档目录 |
| `UPDATE_REFS` | `file`, `old_ref`, `new_ref` | 更新某文件中的引用路径 |
| `UPDATE_INDEX` | `new_content` | 重新生成 index.md 的完整内容 |

**操作排序原则**：

1. `CREATE_DIR` 最先执行（确保目标目录存在）
2. `MOVE_FILE` / `SPLIT_FILE` / `MERGE_FILES` / `ARCHIVE` 次之
3. `UPDATE_REFS` 在文件操作之后（引用路径已确定）
4. `UPDATE_INDEX` 最后执行（所有文件位置已就绪）

---

### 步骤 4：生成影响说明

为每个操作附带影响说明：

- **涉及文件**：哪些文件会被修改
- **变更原因**：为什么需要这个操作（关联到用户意图或诊断结果）
- **风险等级**：`低`（新建/移动）/ `中`（拆分/合并）/ `高`（删除/大规模重组）

---

## 输出格式

```markdown
# 文档树演进方案

> **意图**：{用户意图摘要}
> **生成时间**：{当前日期}
> **影响范围**：{受影响的文件数量} 个文件

---

## 诊断结果

- 超长文档：{列表或"无"}
- 孤立文档：{列表或"无"}
- 断裂引用：{列表或"无"}
- 未收录文档：{列表或"无"}

---

## 变更计划

### 操作 1：{操作类型}

- **参数**：{操作参数}
- **原因**：{变更原因}
- **风险**：{低/中/高}
- **影响文件**：{文件列表}

### 操作 2：{操作类型}

{重复上述结构}

---

## 操作执行顺序

1. {操作摘要 1}
2. {操作摘要 2}
3. ...
N. UPDATE_INDEX — 重新生成 docs/index.md

---

## 新 index.md 草稿

{完整的新 index.md 内容}
```

---

## 缺失信息处理

| 场景 | 处理方式 |
|------|---------|
| `tree_snapshot` 未提供 | 无法执行，返回错误提示 |
| `intent` 过于模糊（如"整理一下"） | 基于诊断结果提出 2-3 个具体建议供选择 |
| 文档间存在循环引用 | 在诊断结果中标记，变更计划中不主动打破循环（除非用户要求） |
| 拆分文档时无法确定拆分点 | 建议按 H2 章节边界拆分，或请用户指定 |

---

## 注意事项

1. **只规划不执行**：本 Skill 只输出变更计划，不执行任何文件操作；执行由 `/evolve` 命令负责
2. **保守原则**：不确定时倾向保持现状，用诊断结果引导用户做决策
3. **引用完整性**：每次 `MOVE_FILE` 或 `SPLIT_FILE` 操作，必须配套 `UPDATE_REFS` 操作更新所有受影响的引用
4. **index.md 始终更新**：任何文件结构变更后，最终操作必须包含 `UPDATE_INDEX`
5. **归档不删除**：`ARCHIVE` 操作将文件移入 `docs/_archive/` 目录，不删除文件
