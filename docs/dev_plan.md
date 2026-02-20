# MaeDoc 迭代计划

> **项目定位**：基于 Open Code + Skills 的个人文档写作 AI Agent
> **核心场景**：个人使用，持续修改、完善文档；文档主题随思考自由演化，不受预设类型约束
> **设计原则**：与 Open Code 的实际能力对齐，避免过度工程化；只构建真正需要的东西

注意：

1. 如果有任何疑问，随时可以调用提问工具向我提问。
2. 对 Open Code Command 功能的文档可参见：third_party/open_code_doc/open_code_command_doc.md
3. 对 Open Code Skill 功能的文档可参见：third_party/open_code_doc/open_code_skill_doc.md

---

## Phase 0: 项目基础设施（v0001 - v0004）

### v0001: 重写 README —— 项目愿景与定位 ✅

**目标**：让任何人打开 Repo 第一眼就明白 MaeDoc 是什么、解决什么问题、为什么值得 Star。

**产出文件**：
- `README.md`

**内容要求**：
- 一句话定位：MaeDoc —— 通用文档 AI Agent 生成器，基于 Open Code
- 核心价值主张（3-5 个 bullet）：
  - 任意文档类型：技术设计、博客、提案、报告、会议纪要……
  - 开箱即用的内置文档模板 + 可自定义扩展
  - AI 驱动的写作流水线：从想法到成稿的完整工作流
  - 本地优先 + 远程增强：隐私可控
  - 基于 Open Code Skills 生态，可复用、可组合
- Feature 列表（功能预览，标注 WIP）
- Quick Start 占位（先放骨架，后续迭代填充）
- 架构概览图占位（Mermaid）
- 技术栈说明
- License 信息

**Commit**: `docs: rewrite README with project vision and positioning`

---

### v0002: 目录结构脚手架 + .gitignore ✅

**目标**：建立标准化的项目目录结构，为后续所有迭代提供骨架。

**产出文件**：
- `.gitignore`
- 各目录下的 `.gitkeep`（占位空目录）

**目录结构**：
```
.
├── docs/
│   ├── _templates/          # 文档类型模板库
│   ├── guides/              # 用户指南
│   └── examples/            # 示例文档
├── schemas/                 # JSON Schema 定义
├── .opencode/
│   ├── skills/              # 提示型 Skills
│   ├── commands/            # 写作命令
│   ├── tools/               # 可执行工具
│   └── plugins/             # 插件
├── .docforge/
│   ├── outbox/              # 远程请求
│   └── inbox/               # 远程响应
├── scripts/                 # 自动化脚本
└── tests/                   # 测试
```

**.gitignore 覆盖**：
- Node.js 产物（node_modules/、dist/）
- Python 产物（__pycache__/、.venv/）
- OpenCode 运行时产物
- IDE 配置
- .env / 密钥文件
- .docforge/outbox/*.json、.docforge/inbox/*.json（运行时数据不入库）

**Commit**: `chore: scaffold project directory structure and add gitignore`

---

### v0003: Open Code 基础配置 ✅

**目标**：配置 Open Code 运行环境，确立本地优先 + 权限收紧的基线策略。

**产出文件**：
- `opencode.jsonc`

**配置要点**：
- `share`: `"disabled"`（禁用会话分享）
- `permission`: edit=ask, bash=ask, webfetch=ask, external_directory=ask, doom_loop=ask
- `compaction`: auto=true, prune=true, reserved=10000
- `instructions`: 引用 `docs/_templates/writing-guidelines.md`

**Commit**: `chore: add Open Code base configuration with security defaults`

---

### v0004: AGENTS.md —— 核心智能体规则 ✅

**目标**：定义 MaeDoc AI Agent 的行为准则、写作原则和安全红线。

**产出文件**：
- `AGENTS.md`

**内容要求**：
- MaeDoc 项目介绍与目标
- 角色定义：你是一个通用文档写作 AI Agent
- 写作原则：
  - 结构化优先：所有文档必须有清晰的层级结构
  - 未指定即标注：对不确定的信息显式标注为"未指定"并列出假设
  - 可验证输出：关键输出应为结构化格式
  - 最小必要原则：只写需要的内容，不过度扩展
- 安全红线：
  - 禁止读取 .env 等敏感文件
  - 外部目录访问必须询问
  - 远程外发数据前必须经过脱敏检查
  - 禁止自动执行破坏性操作
- 文档类型扩展规范说明
- 可用 Skills/Commands 的使用指引

**Commit**: `docs: add AGENTS.md with core rules, writing principles and safety guardrails`

---

## Phase 1: 文档类型系统（v0005 - v0010）

### v0005: 文档类型注册 Schema ✅

**目标**：定义"文档类型"的元数据规范，使任何人都能按规范创建新的文档类型。

**产出文件**：
- `schemas/doc-type.schema.v1.json`

**Schema 字段**：
```json
{
  "type_id": "tech-design",
  "name": "技术设计文档",
  "description": "用于系统架构与技术方案设计",
  "version": "1.0.0",
  "author": "MaeDoc",
  "tags": ["technical", "architecture"],
  "sections": [
    {
      "id": "background",
      "title": "背景与目标",
      "required": true,
      "description": "项目背景、问题陈述、目标与非目标",
      "subsections": []
    }
  ],
  "variables": {
    "project_name": { "type": "string", "required": true },
    "author": { "type": "string", "required": false }
  },
  "writing_guidelines": "可选的类型专属写作指南路径",
  "output_format": "markdown"
}
```

**Commit**: `feat: define document type registry JSON Schema`

---

### v0006: 通用写作规范 ✅

**目标**：建立跨文档类型的通用写作指南，作为所有 AI 写作的基线约束。

**产出文件**：
- `docs/_templates/writing-guidelines.md`

**内容要求**：
- Markdown 格式规范（标题层级、列表、代码块、表格）
- 语言风格指南（简洁、准确、避免废话）
- 结构化写作原则（每段一个主题、先结论后展开）
- 未指定信息的标注规范
- Mermaid 图表使用规范
- 引用与来源标注规范
- 中英文混排规范

**Commit**: `docs: add universal writing guidelines template`

---

### v0007: 文档类型定义模板 ✅

**目标**：创建一个"元模板"——用于定义新文档类型的模板，降低用户自定义文档类型的门槛。

**产出文件**：
- `docs/_templates/_doc-type-definition.template.md`

**内容**：
- 文档类型定义的填写指南
- type.json 模板（符合 doc-type.schema.v1.json）
- template.md 模板骨架
- 写作指南模板骨架
- 示例：如何创建一个新的文档类型

**Commit**: `feat: add meta-template for defining custom document types`

---

### v0008: 内置文档类型 —— 通用文档 ✅

**目标**：提供最基础的文档类型，适用于任何非特定领域的文档。

**产出文件**：
- `docs/_templates/generic/type.json`
- `docs/_templates/generic/template.md`
- `docs/_templates/generic/guidelines.md`

**章节结构**：
- 概述（目标、背景、范围）
- 正文（支持用户自定义章节）
- 总结与下一步
- 附录

**Commit**: `feat: add built-in document type - generic document`

---

### v0009: 内置文档类型 —— 技术设计文档 ✅

**目标**：提供系统设计/技术方案的文档类型，这是 MaeDoc 最核心的使用场景之一。

**产出文件**：
- `docs/_templates/tech-design/type.json`
- `docs/_templates/tech-design/template.md`
- `docs/_templates/tech-design/guidelines.md`

**章节结构**：
- 执行摘要
- 背景与问题陈述
- 目标与非目标
- 架构设计（含 Mermaid 图）
- 组件清单
- 数据流与接口定义
- 安全与隐私考量
- 测试策略
- 部署与运维
- 风险与缓解
- 里程碑与排期
- 未指定项与假设清单

**Commit**: `feat: add built-in document type - technical design document`

---

### v0010: 内置文档类型 —— 博客文章 ✅

**目标**：覆盖内容创作场景，展示 MaeDoc 的"通用性"——不止于技术文档。

**产出文件**：
- `docs/_templates/blog-post/type.json`
- `docs/_templates/blog-post/template.md`
- `docs/_templates/blog-post/guidelines.md`

**章节结构**：
- 标题与副标题
- 目标受众
- 引言（Hook）
- 核心论点/内容
- 案例/示例
- 总结与行动号召（CTA）
- SEO 元信息（关键词、摘要）

**Commit**: `feat: add built-in document type - blog post`

---

## Phase 2: 核心 Skills —— AI 写作能力（v0011 - v0018）

### v0011: doc-outline-generate Skill ✅

**目标**：MaeDoc 的核心能力——根据用户想法 + 文档类型，生成结构化大纲。

**产出文件**：
- `.opencode/skills/doc-outline-generate/SKILL.md`

**Skill 行为**：
- 输入：用户的想法描述 + 目标文档类型
- 处理：结合文档类型模板的章节定义，生成定制化大纲
- 输出：Markdown 大纲，每个章节标注"所需输入"和"验收标准"
- 对未指定信息列出假设，并给出"需要用户确认的问题清单"

**Commit**: `feat: add doc.outline.generate skill`

---

### v0012: doc-content-fill Skill ✅

**目标**：根据大纲逐章节生成/填充内容。

**产出文件**：
- `.opencode/skills/doc-content-fill/SKILL.md`

**Skill 行为**：
- 输入：文档大纲 + 用户提供的素材/约束
- 处理：按章节依次填充，遵循写作规范
- 输出：完整的 Markdown 文档内容
- 每章节完成后标注信心等级（高/中/低）

**Commit**: `feat: add doc.content.fill skill`

---

### v0013: doc-review Skill ✅

**目标**：对已生成的文档进行多维度审阅。

**产出文件**：
- `.opencode/skills/doc-review/SKILL.md`

**Skill 行为**：
- 输入：待审阅的文档
- 审阅维度：结构完整性、逻辑一致性、语言质量、信息准确性、可读性
- 输出：审阅报告（问题列表 + 修改建议 + 优先级）

**Commit**: `feat: add doc.review skill`

---

### v0014: doc-format-normalize Skill ✅

**目标**：统一文档的 Markdown 格式，消除格式不一致。

**产出文件**：
- `.opencode/skills/doc-format-normalize/SKILL.md`

**Skill 行为**：
- 检查并修正：标题层级、列表格式、代码块语言标注、表格对齐、空行规范
- 输出格式化后的文档 diff

**Commit**: `feat: add doc.format.normalize skill`

---

### v0015: doc-structure-audit Skill ✅

**目标**：检查文档是否符合其文档类型定义的结构要求。

**产出文件**：
- `.opencode/skills/doc-structure-audit/SKILL.md`

**Skill 行为**：
- 输入：文档 + 对应的文档类型定义
- 检查：必需章节是否存在、章节顺序、断链检测、重复内容检测
- 输出：审计报告（缺失项 + 问题定位 + 修复建议）

**Commit**: `feat: add doc.structure.audit skill`

---

### v0016: doc-quality-score Skill ✅

**目标**：对文档进行量化质量评分。

**产出文件**：
- `.opencode/skills/doc-quality-score/SKILL.md`

**Skill 行为**：
- 评分维度（各占权重）：
  - 结构完整性（是否覆盖必需章节）
  - 内容深度（每章节是否有足够细节）
  - 语言质量（清晰度、简洁度）
  - 一致性（术语统一、格式统一）
  - 可操作性（是否有明确的下一步）
- 输出：总分（0-100）+ 各维度分数 + 改进建议

**Commit**: `feat: add doc.quality.score skill`

---

### v0017: doc-iterate Skill ✅

**目标**：基于反馈对文档进行定向迭代优化。

**产出文件**：
- `.opencode/skills/doc-iterate/SKILL.md`

**Skill 行为**：
- 输入：当前文档 + 用户反馈（自然语言或结构化）
- 处理：定位需要修改的章节，生成修改方案
- 输出：修改后的文档 diff + 变更说明

**Commit**: `feat: add doc.iterate skill`

---

### v0018: doc-translate Skill ✅

**目标**：支持文档的多语言翻译，扩大项目的国际化吸引力。

**产出文件**：
- `.opencode/skills/doc-translate/SKILL.md`

**Skill 行为**：
- 输入：源文档 + 目标语言
- 处理：保持文档结构不变，翻译内容，保留代码块和专业术语
- 输出：翻译后的完整文档

**Commit**: `feat: add doc.translate skill`

---

## Phase 3: Commands 写作命令（v0019 - v0021）

### v0019: /create 命令 ✅

**目标**：一键创建新文档——MaeDoc 最核心的用户入口。

**产出文件**：
- `.opencode/commands/create.md`

**命令行为**：
```
/create 我想写一篇关于微服务架构的技术设计文档
```
- 解析用户意图，匹配最合适的文档类型
- 调用 doc.outline.generate 生成大纲
- 交互确认大纲（通过 question 工具）
- 调用 doc.content.fill 填充内容
- 调用 doc.format.normalize 格式化
- 输出最终文档到 docs/ 目录

**Commit**: `feat: add /create command for one-step document creation`

---

### v0020: /review 命令 ✅

**目标**：对现有文档进行全面审阅。

**产出文件**：
- `.opencode/commands/review.md`

**命令行为**：
```
/review docs/my-design.md
```
- 读取目标文档
- 调用 doc.structure.audit + doc.quality.score + doc.review
- 输出综合审阅报告

**Commit**: `feat: add /review command for document review`

---

### v0021: /iterate 命令 ✅

**目标**：基于反馈迭代更新文档。

**产出文件**：
- `.opencode/commands/iterate.md`

**命令行为**：
```
/iterate docs/my-design.md 请补充安全章节的威胁模型分析
```
- 读取目标文档 + 解析用户反馈
- 调用 doc.iterate 生成修改
- 展示 diff 并请求确认
- 应用修改

**Commit**: `feat: add /iterate command for feedback-driven document iteration`

---

## Phase 4: 清理与精简（v0022）

### v0022: 清理模板系统 + 更新 /create 命令 ✅

**目标**：移除预设文档类型约束，让写作更自由。删除绑定了固定类型系统的模板文件，更新 /create 命令使其完全基于用户描述自由创建文档，不依赖预设模板。

**要做的事**：
- 删除 `docs/_templates/blog-post/`、`docs/_templates/generic/`、`docs/_templates/tech-design/` 三个目录
- 删除 `docs/_templates/_doc-type-definition.template.md`
- 删除 `schemas/doc-type.schema.v1.json`
- 保留 `docs/_templates/writing-guidelines.md`（AI 写作基线规范，仍然有用）
- 更新 `.opencode/commands/create.md`：去掉"匹配文档类型"步骤，改为直接根据用户描述自由生成结构

**更新后的 /create 命令行为**：
```
/create 我想整理一下对分布式系统 CAP 理论的理解
```
- 与用户简短对话，澄清文档的目的和受众
- AI 根据内容性质自主判断结构（不套模板）
- 生成文档到 `docs/` 目录
- 后续可通过 /iterate 持续演化

**Commit**: `chore: remove template system, update /create for freeform document creation`

---

## Phase 5: 远程桥接——中继文件协议（v0023 - v0025）

> **设计说明**：当本地模型能力遇到瓶颈时（复杂推理、大量上下文），通过文件中继桥接到更强大的外部 AI（Claude.ai、ChatGPT 等）。整个流程基于 markdown 文件，不依赖任何 API 调用或自定义工具代码。

### v0023: .docforge 中继目录设置

**目标**：建立远程桥接的工作区，用 markdown 文件作为中继载体（替代原复杂的 JSON 协议方案）。

**产出文件**：
- `.docforge/README.md`（使用说明）
- `.docforge/outbox/.gitkeep`（AI 生成的提示词包）
- `.docforge/inbox/.gitkeep`（用户粘贴的外部 AI 回答）

**.docforge/README.md 内容**：
- 工作流说明：outbox → 复制到外部 AI → 答案保存到 inbox → /ingest-remote 应用
- 文件命名规范：`{YYYYMMDD-HHMMSS}-{slug}.md`
- gitignore 规则：outbox/*.md 和 inbox/*.md 不入库（运行时数据）

**更新 .gitignore**：追加 `.docforge/outbox/*.md` 和 `.docforge/inbox/*.md`

**Commit**: `feat: scaffold .docforge relay directory for remote AI bridge`

---

### v0024: /escalate 命令

**目标**：一键打包当前文档上下文 + 问题，生成可直接复制给外部 AI 的中继文件。

**产出文件**：
- `.opencode/commands/escalate.md`

**命令行为**：
```
/escalate docs/my-doc.md 这部分论证逻辑是否严谨？有没有遗漏的反驳视角？
```
- 读取目标文档
- 收集必要上下文（文档目的、当前问题、用户的具体问题）
- 生成结构清晰的中继文件，保存到 `.docforge/outbox/{timestamp}-{slug}.md`
- 中继文件格式：
  ```
  ## Context
  [文档摘要 + 目的]

  ## Document Content
  [文档全文或相关片段]

  ## Question
  [用户的具体问题]

  ## Expected Output
  [说明期望回答的格式和重点]
  ```
- 告知用户：打开该文件，复制内容，粘贴到外部 AI，将回答保存为 `.docforge/inbox/{同名文件}.md`

**Commit**: `feat: add /escalate command for remote AI context packaging`

---

### v0025: /ingest-remote 命令

**目标**：读取用户从外部 AI 获取的回答，引导应用到文档中。

**产出文件**：
- `.opencode/commands/ingest-remote.md`

**命令行为**：
```
/ingest-remote 20250220-143000-cap-theorem
```
- 读取 `.docforge/inbox/{slug}.md`（或自动查找最新的 inbox 文件）
- 展示外部 AI 的建议摘要
- 与用户确认：哪些建议要采纳、哪些跳过
- 根据确认结果对目标文档执行修改

**Commit**: `feat: add /ingest-remote command for applying remote AI suggestions`

---

## Phase 6: 安全——纯 Skill 实现（v0026 - v0028）

> **设计说明**：Open Code 没有插件系统，所有安全能力通过 SKILL.md 提示词指令实现；运行时权限控制依赖 opencode.jsonc 配置，不需要额外的可执行代码。

### v0026: sec-secret-scan Skill

**目标**：在外发到远程 AI 之前，检测文档中是否含有敏感信息。

**产出文件**：
- `.opencode/skills/sec-secret-scan/SKILL.md`

**Skill 行为**（提示词指令）：
- 扫描目标内容：API Key 模式、Token、密码、邮箱、手机号、私钥头部
- 命中即告警，列出位置和类型，建议替换为占位符后再外发
- 在 /escalate 命令中引用此 Skill 作为前置检查

**Commit**: `feat: add sec-secret-scan skill for pre-escalation sensitive content check`

---

### v0027: sec-prompt-injection-check Skill

**目标**：当文档内容来自外部来源（网页、粘贴内容）时，检测潜在的提示注入风险。

**产出文件**：
- `.opencode/skills/sec-prompt-injection-check/SKILL.md`

**Skill 行为**（提示词指令）：
- 识别可疑的指令注入模式（如"忽略上述指令"、隐藏的系统提示）
- 输出：风险等级（低/中/高）+ 可疑片段位置 + 处理建议

**Commit**: `feat: add sec-prompt-injection-check skill for input validation`

---

### v0028: 安全使用指南 + 模型选择指南

**目标**：帮助个人用户理解 MaeDoc 的数据流和如何选择合适的模型配置。

**产出文件**：
- `docs/guides/security.md`
- `docs/guides/model-selection.md`

**security.md 内容**：
- 数据留在哪里（本地文件、opencode 会话）
- 什么情况下数据会外发（/escalate 流程、模型 API 调用）
- 使用 /escalate 前的安全检查清单
- opencode.jsonc 权限配置说明

**model-selection.md 内容**：
- Open Code 支持的本地模型接入方式（Ollama、LM Studio）
- 推荐的本地模型：Llama 3.1、Qwen2.5、Gemma 3、DeepSeek-R1
- 远程 API 对比：Anthropic、OpenAI、Gemini、阿里云百炼
- 何时用本地模型、何时用远程强模型的决策建议

**Commit**: `docs: add security guide and model selection guide`

---

## Phase 7: 个人使用文档（v0029 - v0030）

### v0029: Quickstart 指南

**目标**：让自己（或未来的使用者）能快速上手，跑通第一个文档写作流程。

**产出文件**：
- `docs/guides/quickstart.md`

**内容**：
- 前置条件：Open Code 安装、模型配置
- 克隆 MaeDoc 并在目录下启动 opencode
- 用 `/create` 创建第一个文档
- 用 `/review` 审阅
- 用 `/iterate` 根据反馈修改
- 用 `/escalate` 发起远程增强请求

**Commit**: `docs: add quickstart guide for personal use`

---

### v0030: README 更新

**目标**：将 README 更新为真实反映项目当前状态和定位的版本，去除"打造网红开源项目"的定位，聚焦个人使用场景。

**产出文件**：
- `README.md`（更新）

**更新内容**：
- 一句话定位：个人文档写作 AI Agent，基于 Open Code
- 核心工作流：/create → /review → /iterate → /escalate（可选）
- 可用命令列表（含简短说明）
- 可用 Skills 列表
- Quick Start 链接到 docs/guides/quickstart.md
- 移除"网红开源"定位、CONTRIBUTING、社区链接等

**Commit**: `docs: update README to reflect personal use positioning`

---

## 里程碑概览

| 里程碑 | 版本范围 | 核心交付 | 状态 |
|--------|---------|---------|------|
| M0: 基础设施 | v0001-v0004 | 项目骨架、配置、规则 | ✅ 完成 |
| M1: 文档类型系统 | v0005-v0010 | Schema + 3 种内置类型 | ✅ 完成 |
| M2: AI 写作 Skills | v0011-v0018 | 8 个核心 Skills | ✅ 完成 |
| M3: 核心命令 | v0019-v0021 | /create、/review、/iterate | ✅ 完成 |
| M4: 精简清理 | v0022 | 删除模板系统，/create 自由化 | ✅ 完成 |
| M5: 远程桥接 | v0023-v0025 | .docforge 中继 + /escalate + /ingest-remote | 待做 |
| M6: 安全 Skills | v0026-v0028 | 安全扫描 Skills + 使用指南 | 待做 |
| M7: 个人文档 | v0029-v0030 | Quickstart + README 更新 | 待做 |

---

## 建议执行节奏

- **M3-M4（v0021-v0022）优先**：完成 /iterate 命令，清理模板系统，让 /create 彻底自由化
- **M5（v0023-v0025）次之**：建立远程桥接能力，这是扩展写作深度的关键
- **M6-M7（v0026-v0030）最后**：安全补充和文档收尾，按需做

每个迭代（v-number）对应一次独立 Commit，遵循 Conventional Commits 规范。使用 `feat:` / `docs:` / `chore:` 前缀。
