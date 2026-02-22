---
name: companion-state-sync
description: 同步 MaeDoc 伴侣控制平面状态。根据本轮执行结果更新 current-focus/theme-map/knowledge-crystals/session-brief，并校验 docs/index.md 导航注册。
mode: read-write
---

# companion-state-sync

> **Skill ID**：`companion-state-sync`
> **版本**：1.0.0
> **用途**：保证“每轮执行后，状态始终一致”

---

## 输入

| 参数 | 必需 | 说明 |
|------|:----:|------|
| `focus_decision` | 是 | 当前焦点与切换结论 |
| `operation_results` | 是 | 本轮执行日志（成功/失败/跳过） |
| `crystals` | 否 | `knowledge-crystallize` 产出的新增晶体 |
| `open_questions` | 否 | 仍待验证的问题 |

---

## 维护目标文件

- `docs/companion/current-focus.md`
- `docs/companion/theme-map.md`
- `docs/companion/knowledge-crystals.md`
- `docs/companion/session-brief.md`
- `docs/index.md`

若上述文件不存在，先创建模板再写入。

---

## 执行步骤

### 步骤 1：更新当前焦点

在 `current-focus.md` 写入：
- 当前焦点
- 本轮目标达成情况
- 非目标（明确不做）
- 下一轮触发条件

### 步骤 2：更新主题地图

在 `theme-map.md`：
- 更新主题状态（active/background/emerging）
- 刷新最近一次触达时间
- 更新覆盖率与关键文档链接

### 步骤 3：追加知识晶体

若 `crystals` 非空，追加到 `knowledge-crystals.md`：
- 新晶体放在“最新新增”段
- 与已有 ID 冲突时自动递增编号

### 步骤 4：写会话续航摘要

在 `session-brief.md` 写入：
- 本轮完成事项
- 未完成事项
- 下一次恢复入口（建议命令）

### 步骤 5：校验 docs/index.md 注册

检查本轮新增文档是否在 `docs/index.md` 注册：
- 未注册则自动补充到合适栏目
- 更新最后更新时间

---

## 输出格式

```markdown
STATE_SYNC_RESULT:
- updated_files:
  - {path}
  - ...
- created_files:
  - {path}
  - ...
- index_updates:
  - {新增注册条目}

PENDING_QUESTIONS:
- {问题}
（若无写"无"）

TODO_CANDIDATES:
- {应追加到 docs/TODO.md 的事项}
（若无写"无"）

SUMMARY: {2-3 句}
```

---

## 注意事项

1. 这是状态同步 Skill，不做大规模内容重写。
2. 任何自动写入都必须以“最小改动”为原则。
3. 若发现高风险变更需求，只记录到 `TODO_CANDIDATES`，不自动执行。
