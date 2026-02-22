---
name: focus
description: 快速切换 MaeDoc 探索焦点。更新伴侣控制平面并生成“切换后首轮动作清单”，用于低打断主题迁移。
---

# /focus 命令

> **命令**：`/focus`
> **版本**：1.0.0
> **用途**：在不丢失已有沉淀的前提下切换主题重心

---

## 用法

```bash
/focus <新的探索焦点>
/focus
```

**示例**：

```bash
/focus 从“系统设计”转向“AI Agent 协作模式”
/focus 接下来两周专注“文档治理自动化”
```

---

## 执行流程

### 阶段 0：获取新焦点

1. 从 `$ARGUMENTS` 提取新焦点。
2. 若为空，使用 `question` 工具询问“你要切换到什么新焦点？”。

### 阶段 1：影响评估（只读）

调用 `doc-explorer`（task）：
- 输入：`new_focus` + `docs/` + 伴侣状态文件
- 输出：
  - 受影响主题
  - 需要降级为“背景材料”的旧主题
  - 需要立即创建/更新的文档

### 阶段 2：切换策略

根据影响评估，生成三类动作：

- `KEEP`：继续推进（与新焦点强相关）
- `PARK`：降级为背景（保留但暂停投入）
- `START`：新焦点下首批动作

若包含高风险动作（归档/删除/大规模合并），使用 `question` 工具确认。

### 阶段 3：状态写回

加载 `companion-state-sync` Skill：

- 更新 `docs/companion/current-focus.md`
- 更新 `docs/companion/theme-map.md`
- 更新 `docs/companion/session-brief.md`

### 阶段 4：输出切换报告

```markdown
焦点切换完成

- 新焦点：{new_focus}
- KEEP：{列表}
- PARK：{列表}
- START：{列表}

建议下一步：`/companion`（自动执行首轮动作）
```

### 阶段 5：TODO 录入（必做）

调用 `todo-append` Skill，记录：
- 被 PARK 的高价值主题（待未来重启）
- 因切换而延期的操作

结束声明：`已记录 TODO：T-NNN` 或 `TODO 扫描：无项`。
