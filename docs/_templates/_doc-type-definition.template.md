# 文档类型定义元模板

> **用途**：本文件是创建新文档类型的元模板——一份"如何定义文档类型"的完整指南。
> 按照本指南填写，即可为 MaeDoc 注册一个可复用的文档类型。

---

## 目录

1. [概述](#概述)
2. [目录结构](#目录结构)
3. [type.json 模板](#typejson-模板)
4. [template.md 模板骨架](#templatemd-模板骨架)
5. [guidelines.md 模板骨架](#guidelinesmd-模板骨架)
6. [完整示例：竞品分析报告](#完整示例竞品分析报告)
7. [校验与注册](#校验与注册)

---

## 概述

每个文档类型由三个文件组成：

| 文件 | 必需 | 用途 |
|------|------|------|
| `type.json` | 是 | 结构化元数据，符合 `doc-type.schema.v1.json` |
| `template.md` | 是 | Markdown 骨架，AI 填充内容时的结构参考 |
| `guidelines.md` | 否 | 类型专属写作规范，覆盖通用规范中的同名条目 |

所有文件放置于：

```
docs/_templates/{type_id}/
├── type.json
├── template.md
└── guidelines.md   # 可选
```

---

## 目录结构

在创建新文档类型之前，先确定 `type_id`（文档类型唯一标识）。

**命名规则**：

- 格式：`kebab-case`，全小写，仅含字母、数字和连字符
- 首字符必须是字母，末字符必须是字母或数字
- 长度：2–64 字符
- 示例：`tech-design`、`blog-post`、`competitive-analysis`

```bash
# 创建目录
mkdir docs/_templates/{type_id}
```

---

## type.json 模板

将以下内容复制到 `docs/_templates/{type_id}/type.json`，并替换所有 `{占位符}`。

```json
{
  "$schema": "../../schemas/doc-type.schema.v1.json",
  "type_id": "{type_id}",
  "name": "{文档类型中文名称}",
  "description": "{一句话描述：这种文档类型适用于什么场景}",
  "version": "1.0.0",
  "author": "{你的名字或组织名}",
  "tags": ["{tag1}", "{tag2}"],
  "sections": [
    {
      "id": "{section-id}",
      "title": "{章节标题}",
      "required": true,
      "description": "{AI 写作提示：本章节应包含哪些内容}",
      "subsections": []
    },
    {
      "id": "{section-id-2}",
      "title": "{章节标题 2}",
      "required": false,
      "description": "{AI 写作提示}",
      "subsections": [
        {
          "id": "{sub-section-id}",
          "title": "{子章节标题}",
          "required": false,
          "description": "{AI 写作提示}"
        }
      ]
    }
  ],
  "variables": {
    "document_title": {
      "type": "string",
      "required": true,
      "description": "文档标题"
    },
    "author": {
      "type": "string",
      "required": false,
      "description": "文档作者",
      "default": "未指定"
    },
    "date": {
      "type": "string",
      "required": false,
      "description": "文档日期，格式 YYYY-MM-DD",
      "default": "未指定"
    }
  },
  "writing_guidelines": "guidelines.md",
  "output_format": "markdown"
}
```

### 字段填写指南

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `type_id` | string | 是 | kebab-case，全局唯一 |
| `name` | string | 是 | 用户看到的中文/英文名称 |
| `description` | string | 是 | 不超过 512 字符，说明使用场景 |
| `version` | string | 是 | 语义版本，初始值 `1.0.0` |
| `author` | string | 是 | 创建者名称 |
| `tags` | array | 否 | 用于发现和过滤，全小写 kebab-case |
| `sections` | array | 是 | 至少 1 个章节 |
| `sections[].id` | string | 是 | 章节机器可读标识，kebab-case |
| `sections[].title` | string | 是 | 章节 Markdown 标题 |
| `sections[].required` | boolean | 是 | 是否为必需章节 |
| `sections[].description` | string | 否 | AI 写作提示（推荐填写，越详细越好） |
| `variables` | object | 否 | 模板变量，key 为 snake_case |
| `writing_guidelines` | string | 否 | 相对路径指向 guidelines.md |
| `output_format` | string | 是 | 枚举值：`markdown`、`html`、`pdf`、`docx` |

---

## template.md 模板骨架

将以下内容复制到 `docs/_templates/{type_id}/template.md`，并按文档类型调整章节结构。

```markdown
# {{document_title}}

> **文档类型**：{name}
> **作者**：{{author}}
> **日期**：{{date}}
> **版本**：{{version}}
> **状态**：草稿 / 审阅中 / 已发布

---

## 概述

<!-- 必需章节：简述本文档的目标、范围和主要受众 -->

### 目标

{此处填写目标}

### 范围

{此处描述本文档的边界}

---

## {章节 1 标题}

<!--
AI 写作提示：{sections[0].description}
所需输入：{列出需要用户提供的信息}
-->

{内容占位}

---

## {章节 2 标题}

<!-- AI 写作提示：{sections[1].description} -->

{内容占位}

### {子章节标题}

{内容占位}

---

## 总结

<!-- 必需章节：概括关键结论和后续行动 -->

### 关键结论

- {结论 1}
- {结论 2}

### 下一步行动

| 行动项 | 负责人 | 截止日期 |
|--------|--------|---------|
| {待办 1} | 未指定 | 未指定 |

---

## 附录

<!-- 可选章节：参考资料、相关链接、术语表 -->

### 参考资料

- {参考 1}

### 术语表

| 术语 | 定义 |
|------|------|
| {术语} | {定义} |
```

### template.md 编写说明

1. **`{{变量名}}`**：使用双花括号引用 `type.json` 中定义的变量
2. **HTML 注释**：`<!-- AI 写作提示 -->` 用于向 AI 传递上下文，不出现在最终文档中
3. **章节顺序**：与 `type.json` 中 `sections` 数组顺序保持一致
4. **必需章节**：`required: true` 的章节在模板中不能省略
5. **占位符文本**：用 `{斜体描述}` 提示用户或 AI 应填写的内容类型

---

## guidelines.md 模板骨架

将以下内容复制到 `docs/_templates/{type_id}/guidelines.md`，并按需补充类型专属规范。

```markdown
# {文档类型名称} 写作规范

> 本规范为类型专属覆盖。通用规范请参见：
> [`docs/_templates/writing-guidelines.md`](../writing-guidelines.md)

---

## 适用范围

本规范适用于所有 `{type_id}` 类型的文档，在以下方面覆盖通用写作规范：

- {覆盖点 1}
- {覆盖点 2}

---

## 结构要求

### 必需章节

以下章节必须在文档中出现，否则视为不合格：

1. {章节名} —— {一句话说明}
2. {章节名} —— {一句话说明}

### 推荐章节顺序

```
1. {章节 1}
2. {章节 2}
3. {章节 3}
```

---

## 内容规范

### 语气与风格

- {类型专属语气要求，例如：技术文档应使用客观、被动语态}
- {避免使用的词汇或表达}

### 数据与引用

- {如何引用数据来源}
- {图表的使用规范}

### 专属格式要求

- {代码块、表格、图表等的使用规范}

---

## 未指定信息处理

当以下信息不可用时，按如下方式标注：

| 信息类型 | 标注方式 |
|---------|---------|
| 负责人未确认 | `**负责人**：未指定（待确认）` |
| 截止日期未定 | `**截止日期**：未指定（待排期）` |
| 数据未知 | `**数据来源**：未指定 — 假设：{列出假设}` |

---

## 质量检查清单

在提交文档之前，核对以下项目：

- [ ] 所有必需章节均已填写
- [ ] 没有遗留的占位符文本（`{...}`）
- [ ] 所有"未指定"项已列出明确假设
- [ ] 表格列宽对齐，代码块指定语言
- [ ] {类型专属检查项 1}
- [ ] {类型专属检查项 2}
```

---

## 完整示例：竞品分析报告

以下展示如何为"竞品分析报告"创建一个完整的文档类型定义。

### 步骤 1：创建目录

```bash
mkdir docs/_templates/competitive-analysis
```

### 步骤 2：填写 type.json

```json
{
  "$schema": "../../schemas/doc-type.schema.v1.json",
  "type_id": "competitive-analysis",
  "name": "竞品分析报告",
  "description": "系统性分析竞争对手产品，用于产品策略决策和市场定位",
  "version": "1.0.0",
  "author": "MaeDoc",
  "tags": ["product", "strategy", "analysis"],
  "sections": [
    {
      "id": "executive-summary",
      "title": "执行摘要",
      "required": true,
      "description": "用 3-5 句话总结分析结论和核心建议，供决策者快速阅读",
      "subsections": []
    },
    {
      "id": "analysis-scope",
      "title": "分析范围",
      "required": true,
      "description": "明确分析的竞品列表、评估维度、数据收集时间窗口和分析局限性",
      "subsections": []
    },
    {
      "id": "competitor-profiles",
      "title": "竞品概况",
      "required": true,
      "description": "逐一介绍每个竞品的基本信息、核心功能、目标用户和商业模式",
      "subsections": [
        {
          "id": "feature-comparison",
          "title": "功能对比矩阵",
          "required": true,
          "description": "用表格对比各竞品在关键功能维度上的表现，使用 ✅/❌/⚠️ 标注"
        },
        {
          "id": "pricing-comparison",
          "title": "定价策略对比",
          "required": false,
          "description": "对比各竞品的定价模型、价格区间和收费策略"
        }
      ]
    },
    {
      "id": "swot-analysis",
      "title": "SWOT 分析",
      "required": true,
      "description": "与主要竞品相比，列出我方产品的优势、劣势、机会和威胁",
      "subsections": []
    },
    {
      "id": "strategic-recommendations",
      "title": "战略建议",
      "required": true,
      "description": "基于分析结论，给出 3-5 条具体可执行的产品或市场策略建议",
      "subsections": []
    },
    {
      "id": "data-sources",
      "title": "数据来源",
      "required": false,
      "description": "列出所有数据来源（官网、应用商店评论、行业报告等）和收集日期",
      "subsections": []
    }
  ],
  "variables": {
    "document_title": {
      "type": "string",
      "required": true,
      "description": "报告标题，例如：XX 产品竞品分析报告 2025 Q1"
    },
    "product_name": {
      "type": "string",
      "required": true,
      "description": "被分析的自身产品名称"
    },
    "author": {
      "type": "string",
      "required": false,
      "description": "报告作者",
      "default": "未指定"
    },
    "analysis_date": {
      "type": "string",
      "required": false,
      "description": "分析日期，格式 YYYY-MM-DD",
      "default": "未指定"
    },
    "confidentiality_level": {
      "type": "string",
      "required": false,
      "description": "保密级别：公开 / 内部 / 机密",
      "default": "内部"
    }
  },
  "writing_guidelines": "guidelines.md",
  "output_format": "markdown"
}
```

### 步骤 3：创建 template.md（片段示例）

```markdown
# {{document_title}}

> **产品**：{{product_name}}
> **作者**：{{author}}
> **分析日期**：{{analysis_date}}
> **保密级别**：{{confidentiality_level}}

---

## 执行摘要

<!-- 用 3-5 句话总结核心发现和建议，供决策者快速阅读 -->

{执行摘要}

---

## 分析范围

**竞品列表**：

| 竞品名称 | 官网 | 分析版本 |
|---------|------|---------|
| {竞品 1} | {URL} | {版本} |

**评估维度**：{列出核心评估维度}

**数据收集时间**：{开始日期} — {结束日期}

**分析局限性**：{标注数据来源的限制和可能的偏差}

---

## 竞品概况

### 功能对比矩阵

| 功能维度 | {{product_name}} | {竞品 1} | {竞品 2} |
|---------|-----------------|---------|---------|
| {功能 1} | ✅ | ❌ | ⚠️ 部分支持 |

---

## SWOT 分析

| | 有利 | 不利 |
|-|------|------|
| **内部** | **优势 (S)**：{列出优势} | **劣势 (W)**：{列出劣势} |
| **外部** | **机会 (O)**：{列出机会} | **威胁 (T)**：{列出威胁} |

---

## 战略建议

1. **{建议标题}**：{具体行动描述}，预期效果：{效果描述}
2. **{建议标题}**：{具体行动描述}

---

## 数据来源

| 来源 | 类型 | 获取日期 |
|------|------|---------|
| {来源 1} | 官方文档 | {日期} |
```

### 步骤 4：创建 guidelines.md（片段示例）

```markdown
# 竞品分析报告写作规范

> 通用规范参见：[`docs/_templates/writing-guidelines.md`](../writing-guidelines.md)

## 内容规范

- **客观性**：所有比较应基于可验证数据，避免主观评价词（"更好"、"更强"）
- **时效性**：每项数据必须标注来源和收集日期
- **对称性**：功能对比矩阵中，所有竞品应使用相同维度和标准
- **保密意识**：包含竞对内部数据时，标注来源可信度和法律风险

## 功能对比矩阵图例

- ✅ 完整支持
- ⚠️ 部分支持（需在备注中说明限制）
- ❌ 不支持
- ❓ 未知（需标注原因）
```

---

## 校验与注册

### 本地校验

创建完成后，运行 Schema 校验脚本（v0043 提供）：

```bash
python scripts/validate_schemas.py docs/_templates/{type_id}/type.json
```

### 手动校验清单

在运行脚本之前，可先按以下清单自查：

- [ ] `type_id` 符合 kebab-case 命名规范
- [ ] `type_id` 在所有已有类型中唯一
- [ ] `version` 格式为 `x.y.z`（语义版本）
- [ ] 每个 `section.id` 在本类型内唯一
- [ ] 所有必填字段（`type_id`、`name`、`description`、`version`、`author`、`sections`、`output_format`）已填写
- [ ] `sections` 数组至少有 1 个元素
- [ ] `template.md` 中每个 `required: true` 的章节均已包含
- [ ] 文件编码为 UTF-8，行尾为 LF

### 注册到 MaeDoc

文档类型在以下情况下自动注册（无需额外操作）：

1. 文件放置于 `docs/_templates/{type_id}/` 目录下
2. `type.json` 通过 Schema 校验

使用 `/list-types` 命令（v0023 提供）可查看已注册的所有文档类型。

---

*本文件由 MaeDoc 元模板维护。如需修改元模板，请同步更新 `docs/guides/custom-doc-types.md`。*
