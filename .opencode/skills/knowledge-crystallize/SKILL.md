---
name: knowledge-crystallize
description: 从多文档内容中提炼“知识晶体”（可复用论断 + 证据链 + 置信度 + 适用边界），用于长期沉淀真知。
mode: read-only
---

# knowledge-crystallize

> **Skill ID**：`knowledge-crystallize`
> **版本**：1.0.0
> **用途**：把“文档内容”升级为“可迁移知识”

---

## 输入

| 参数 | 必需 | 说明 |
|------|:----:|------|
| `focus` | 是 | 当前探索焦点 |
| `changed_files` | 是 | 本轮新增/修改文档路径列表 |
| `docs_snapshot` | 是 | 与焦点相关文档内容 |
| `existing_crystals` | 否 | 已有知识晶体内容 |

---

## 执行步骤

### 步骤 1：抽取候选论断

从 `changed_files` 中识别“可复用判断”，候选必须满足：

1. 不依赖单一上下文即可理解
2. 对后续写作或决策有复用价值
3. 至少可链接一个文本证据

### 步骤 2：构建证据链

为每条候选论断绑定证据：

- 主证据：直接支持论断的段落所在文件
- 补强证据：跨文档一致支持的补充来源
- 反证线索：与论断冲突或削弱的内容（若存在）

### 步骤 3：评估置信度

| 置信度 | 判定规则 |
|-------|---------|
| `[HIGH]` | 2+ 文档一致支持，无明显反证 |
| `[MED]` | 有证据支持，但存在边界条件或样本不足 |
| `[LOW]` | 仅弱证据支持，需进一步验证 |

### 步骤 4：定义适用边界

为每条论断补充：

- 适用场景（Apply Scope）
- 不适用场景（Not Apply Scope）
- 继续验证方式（若 `[MED]/[LOW]`）

---

## 输出格式

```markdown
CRYSTALS_TO_ADD:
- ID: K-NEW-001
  CLAIM: {可复用论断}
  CONFIDENCE: {[HIGH]|[MED]|[LOW]}
  EVIDENCE:
    - {path}: {证据摘要}
  COUNTER_EVIDENCE: {无/说明}
  APPLY_SCOPE: {适用场景}
  NOT_APPLY_SCOPE: {不适用场景}
  NEXT_VALIDATION: {可执行验证动作}

CONFLICTS:
- {概念冲突} -> {涉及文件}
（若无写"无"）

DROP_LIST:
- {被丢弃候选及原因}
（若无写"无"）

SUMMARY: {2-3 句}
```

---

## 注意事项

1. 没有证据链的候选，必须进入 `DROP_LIST`。
2. 论断要“可迁移”，不能写成仅针对单个案例的描述。
3. `[LOW]` 置信项可以保留，但必须给出明确验证动作。
