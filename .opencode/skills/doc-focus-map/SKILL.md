---
name: doc-focus-map
description: 扫描 docs 文档库并生成“主题图谱 + 焦点迁移信号”，用于伴侣模式下的探索编排与方向切换。
mode: read-only
---

# doc-focus-map

> **Skill ID**：`doc-focus-map`
> **版本**：1.0.0
> **用途**：把文档集合转成可决策的主题视图

---

## 输入

| 参数 | 必需 | 说明 |
|------|:----:|------|
| `docs_root` | 是 | 文档根目录，默认 `docs/` |
| `intent` | 否 | 本轮用户意图 |
| `current_focus` | 否 | 当前焦点摘要 |
| `theme_map` | 否 | 历史主题映射摘要 |

---

## 执行步骤

### 步骤 1：扫描文档库

1. 读取 `docs/index.md`
2. 遍历 `docs/` 下全部 `.md`（排除 `_archive/`）
3. 收集每个文档的：路径、H1、H2、关键词、出站链接

### 步骤 2：聚类主题

按标题与关键词聚类，形成主题节点：

- `active`：近期持续更新且与当前焦点一致
- `background`：仍有价值但本轮不优先
- `emerging`：用户新意图触发的新方向

### 步骤 3：识别焦点迁移信号

以下任一成立判定为“建议切换”：

1. 新意图与当前焦点关键词重合度 < 40%
2. 新意图对应主题在文档库覆盖率 < 30%
3. 当前焦点连续两轮无新增高价值产出

### 步骤 4：生成动作候选

按主题状态输出：

- `KEEP`：继续推进
- `PARK`：暂停投入，降级背景
- `START`：新开探索线路

---

## 输出格式

```markdown
FOCUS_MAP:
  CURRENT_FOCUS: {主题}
  RECOMMENDED_FOCUS: {主题}
  SWITCH_NEEDED: {yes/no}
  SWITCH_REASON: {一句话}

THEMES:
- {主题名} | status:{active/background/emerging} | docs:{N} | coverage:{N}%
- ...

ACTION_CANDIDATES:
- [KEEP] {操作描述}（文件：{列表}）
- [PARK] {操作描述}（文件：{列表}）
- [START] {操作描述}（文件：{列表}）

GAPS:
- {缺口描述} -> 建议：{新建或迭代哪个文件}

NOTES: {补充说明，最多 3 句}
```

---

## 缺失信息处理

| 场景 | 处理 |
|------|------|
| `docs/index.md` 缺失 | 返回错误并建议先初始化文档库 |
| `intent` 为空 | 以 `current_focus` 为锚点输出保守建议 |
| 文档量过大 | 优先分析 index 收录文档与近 30 天更新文档 |

---

## 注意事项

1. 本 Skill 只输出“分析与建议”，不执行修改。
2. 输出必须包含可落地文件路径，避免抽象建议。
3. 如果建议切换焦点，必须指出“旧焦点如何处理（KEEP/PARK）”。
