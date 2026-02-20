# MaeDoc MVP 迭代计划

> **项目定位**：基于 Open Code + Skills 的通用文档 AI Agent 生成器
> **核心差异**：不限于技术文档，支持任意文档类型（技术设计、博客文章、项目提案、研究报告、会议纪要等），用户可自定义文档类型并复用 AI 写作技能
> **目标**：打造网红开源项目，从 0 到 1 交付可用 MVP

注意：

1. 如果有任何疑问，随时可以调用提问工具向我提问。
2. 对 OpenCode Skill 功能的文档可参见：third_party/open_code_doc/open_code_skill_doc.md

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

### v0018: doc-translate Skill

**目标**：支持文档的多语言翻译，扩大项目的国际化吸引力。

**产出文件**：
- `.opencode/skills/doc-translate/SKILL.md`

**Skill 行为**：
- 输入：源文档 + 目标语言
- 处理：保持文档结构不变，翻译内容，保留代码块和专业术语
- 输出：翻译后的完整文档

**Commit**: `feat: add doc.translate skill`

---

## Phase 3: Commands 写作命令（v0019 - v0024）

### v0019: /create 命令

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

### v0020: /review 命令

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

### v0021: /iterate 命令

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

### v0022: /audit 命令

**目标**：一键运行文档质量全套检查。

**产出文件**：
- `.opencode/commands/audit.md`

**命令行为**：
```
/audit docs/
```
- 扫描目标目录下所有 .md 文件
- 运行 doc.structure.audit + doc.format.normalize（dry-run）+ doc.quality.score
- 输出综合报告，标注需要关注的文件和问题

**Commit**: `feat: add /audit command for batch document quality audit`

---

### v0023: /list-types 命令

**目标**：列出所有可用的文档类型，方便用户选择。

**产出文件**：
- `.opencode/commands/list-types.md`

**命令行为**：
```
/list-types
```
- 扫描 docs/_templates/ 下所有 type.json
- 输出文档类型清单（名称、描述、章节概要）

**Commit**: `feat: add /list-types command to browse available document types`

---

### v0024: /new-type 命令

**目标**：引导用户交互式创建自定义文档类型。

**产出文件**：
- `.opencode/commands/new-type.md`

**命令行为**：
```
/new-type 我想创建一个"竞品分析报告"的文档类型
```
- 通过 question 工具交互式收集：类型名称、用途描述、章节列表、必填字段
- 生成 type.json + template.md + guidelines.md
- 放入 docs/_templates/{type_id}/ 目录

**Commit**: `feat: add /new-type command for interactive document type creation`

---

## Phase 4: Schema 与技能治理（v0025 - v0029）

### v0025: Skill Contract Schema

**目标**：定义 Skill 的统一元数据与接口约束。

**产出文件**：
- `schemas/skill.contract.v1.json`

**Schema 内容**：
- skill_id、skill_version、skill_type（instruction/tool/hybrid）
- owner、license、compatibility
- permissions_required
- data_classification（public/internal/confidential）
- 错误处理结构（error.code/message/hint/trace_id）

**Commit**: `feat: define Skill Contract JSON Schema`

---

### v0026: skill-schema-validate Skill

**目标**：校验所有 Skill 是否符合 Skill Contract 规范。

**产出文件**：
- `.opencode/skills/skill-schema-validate/SKILL.md`

**Skill 行为**：
- 扫描 .opencode/skills/ 下所有 SKILL.md
- 校验 frontmatter 是否符合 Skill Contract
- 输出校验报告

**Commit**: `feat: add skill.schema.validate skill`

---

### v0027: skill-registry-build Skill

**目标**：自动生成 Skills 清单索引，方便发现和文档化。

**产出文件**：
- `.opencode/skills/skill-registry-build/SKILL.md`

**Skill 行为**：
- 扫描所有 Skills（.opencode/skills/）
- 生成 docs/guides/skills-index.md（Skills 目录，含名称、描述、类型、版本）
- 标注缺少元数据的 Skill

**Commit**: `feat: add skill.registry.build skill for skills catalog generation`

---

### v0028: doc-changelog-generate Skill

**目标**：基于 git 提交历史自动生成/更新 CHANGELOG。

**产出文件**：
- `.opencode/skills/doc-changelog-generate/SKILL.md`

**Skill 行为**：
- 读取 git log（要求 Conventional Commits 格式）
- 按 Keep a Changelog 规范生成 CHANGELOG.md
- 支持增量更新（只追加新版本条目）

**Commit**: `feat: add doc.changelog.generate skill`

---

### v0029: doc-drift-detect Skill

**目标**：检测文档与实际状态之间的漂移。

**产出文件**：
- `.opencode/skills/doc-drift-detect/SKILL.md`

**Skill 行为**：
- 检查文档间的交叉引用是否有效
- 检查文档中提到的文件/路径是否存在
- 输出漂移报告

**Commit**: `feat: add doc.drift.detect skill for documentation drift detection`

---

## Phase 5: 远程增强桥接（v0030 - v0036）

### v0030: 远程协议 Schema 定义

**目标**：定义"本地 <-> 远程"交互的协议规范。

**产出文件**：
- `schemas/remote.request.v1.json`
- `schemas/remote.response.v1.json`

**协议要点**：
- protocol 版本号
- task_id（唯一标识）
- context_digest（文件哈希，用于校验一致性）
- question（向远程模型的提问）
- constraints（输出约束）
- patches（远程回答中的修改建议）

**Commit**: `feat: define remote bridge protocol JSON Schemas`

---

### v0031: .docforge 目录与协议说明

**目标**：搭建远程增强桥接的文件协议工作区。

**产出文件**：
- `.docforge/README.md`（协议使用说明）
- `.docforge/outbox/.gitkeep`
- `.docforge/inbox/.gitkeep`

**说明内容**：
- outbox/：Agent 生成的远程请求（request.json）
- inbox/：用户粘贴的远程响应（response.json）
- 使用流程图示

**Commit**: `docs: scaffold .docforge directory with protocol documentation`

---

### v0032: remote_prompt_pack 工具

**目标**：当判定为"疑难问题"时，自动打包上下文生成 Remote Prompt Pack。

**产出文件**：
- `.opencode/tools/remote_prompt_pack.ts`

**工具行为**：
- 输入：task_id、question、context_paths、redaction_mode
- 处理：读取指定文件、执行脱敏、计算哈希、生成 Prompt Pack
- 输出：写入 .docforge/outbox/{task_id}.request.json

**Commit**: `feat: add remote_prompt_pack tool for context packaging`

---

### v0033: remote_inbox_verify 工具

**目标**：校验用户粘贴的远程回答是否合法、可安全合并。

**产出文件**：
- `.opencode/tools/remote_inbox_verify.ts`

**工具行为**：
- 输入：response JSON 路径或内容
- 校验：协议版本、task_id 匹配、context_digest 哈希一致、JSON Schema 合规
- 输出：通过/拒绝 + 原因

**Commit**: `feat: add remote_inbox_verify tool for response validation`

---

### v0034: /ingest-remote 命令

**目标**：引导用户完成"远程增强"的完整交互流程。

**产出文件**：
- `.opencode/commands/ingest-remote.md`

**命令行为**：
```
/ingest-remote RFC-2026-0001
```
- 通过 question 提示用户选择：粘贴 JSON / 提供 inbox 文件路径
- 调用 remote_inbox_verify 校验
- 校验通过后展示 patches diff
- 确认后应用修改

**Commit**: `feat: add /ingest-remote command for remote answer ingestion`

---

### v0035: hardness-classify Skill

**目标**：定义何时自动判定为"疑难问题"，需要升级到远程强模型。

**产出文件**：
- `.opencode/skills/hardness-classify/SKILL.md`

**判定信号**：
- 循环/停滞信号：doom_loop 触发或多轮无进展
- 结构化输出失败：JSON Schema 校验失败超过 2 次重试
- 上下文/能力边界：本地模型频繁遗忘或工具调用不稳定
- 高风险决策：涉及安全、隐私、合规等章节

**Commit**: `feat: add hardness classifier skill for remote escalation decisions`

---

### v0036: /escalate 命令

**目标**：手动触发远程增强流程（用户主动判定为疑难）。

**产出文件**：
- `.opencode/commands/escalate.md`

**命令行为**：
```
/escalate 请帮我对安全章节做深度审阅
```
- 调用 remote_prompt_pack 打包上下文
- 提示用户去远程模型获取回答
- 等待用户返回后调用 /ingest-remote 继续流程

**Commit**: `feat: add /escalate command for manual remote enhancement`

---

## Phase 6: 安全与审计（v0037 - v0042）

### v0037: sec-secret-scan Skill

**目标**：检测文档和 Prompt Pack 中的敏感信息。

**产出文件**：
- `.opencode/skills/sec-secret-scan/SKILL.md`

**Skill 行为**：
- 扫描目标：API Key 模式、密码模式、PII（邮箱、手机号）、私钥
- 命中即阻断（不允许外发到远程）
- 输出：命中清单 + 位置 + 撤回/轮换建议

**Commit**: `feat: add secret scanning skill`

---

### v0038: sec-prompt-injection-check Skill

**目标**：对外部输入内容做提示注入风险检查。

**产出文件**：
- `.opencode/skills/sec-prompt-injection-check/SKILL.md`

**Skill 行为**：
- 检测外部内容（网页、用户粘贴的需求文本）中的注入模式
- 输出：风险等级 + 可疑片段标注 + 隔离建议

**Commit**: `feat: add prompt injection check skill`

---

### v0039: 审计日志插件

**目标**：记录 MaeDoc 运行时的关键操作，提供可追溯性。

**产出文件**：
- `.opencode/plugins/audit-log.ts`

**插件行为**：
- 监听事件：tool 调用、permission 响应、文档变更、远程外发
- 输出：结构化日志（JSON Lines 格式），写入 .docforge/audit/
- 不记录原始敏感内容，只记录操作元信息

**Commit**: `feat: add audit log plugin`

---

### v0040: 环境保护插件

**目标**：在插件层面强化敏感文件保护。

**产出文件**：
- `.opencode/plugins/env-protection.ts`

**插件行为**：
- 拦截对 .env、credentials.json 等敏感文件的读取请求
- 在 permission 事件中检查目标文件是否在黑名单
- 阻断或强制询问用户

**Commit**: `feat: add environment protection plugin`

---

### v0041: 安全策略文档

**目标**：文档化 MaeDoc 的安全模型，帮助用户理解和配置安全策略。

**产出文件**：
- `docs/guides/security.md`

**内容**：
- MaeDoc 的数据流说明（哪些数据留在本地、哪些可能外发）
- 权限策略配置指南
- 远程外发的安全检查清单
- OWASP LLM Top 10 在 MaeDoc 中的应对措施

**Commit**: `docs: add security model and policy documentation`

---

### v0042: 本地与远程模型对比指南

**目标**：帮助用户选择合适的模型配置。

**产出文件**：
- `docs/guides/model-selection.md`

**内容**：
- 本地开源模型推荐清单（Llama 3.1, Mistral, Qwen2.5, Gemma 3, Phi-3, DeepSeek-R1）
- 远程 API 服务对比（OpenAI, Anthropic, Gemini, Bedrock, Azure, 阿里云）
- 对比维度：能力、延迟、成本、隐私策略、易用性
- Open Code 配置示例（Ollama / LM Studio 本地模型接入方法）

**Commit**: `docs: add model selection and comparison guide`

---

## Phase 7: 自动化脚本与 CI/CD（v0043 - v0048）

### v0043: Schema 校验脚本

**目标**：提供独立的 Schema 校验工具，可本地和 CI 使用。

**产出文件**：
- `scripts/validate_schemas.py`
- `requirements.txt`

**脚本行为**：
- 校验 docs/_templates/*/type.json 是否符合 doc-type.schema.v1.json
- 校验 .docforge/inbox/*.json 是否符合 remote.response.v1.json
- 输出校验结果（JSON 格式），非零退出码表示失败

**Commit**: `feat: add schema validation script`

---

### v0044: 文档质量门禁脚本

**目标**：在 CI 中作为质量门禁，拒绝不合格的文档变更。

**产出文件**：
- `scripts/doc_quality_gate.py`

**脚本行为**：
- 检查 docs/ 下所有 .md 文件的基本规范（标题层级、空行、格式）
- 可配置最低质量分数阈值（--min-score 参数）
- 输出质量报告，不合格时非零退出

**Commit**: `feat: add document quality gate script`

---

### v0045: Pre-commit hooks 配置

**目标**：在提交前自动运行基本检查。

**产出文件**：
- `.pre-commit-config.yaml`

**Hooks 包含**：
- 尾部空格修复
- 文件末尾换行
- 合并冲突标记检测
- JSON 格式校验
- Schema 校验（调用 validate_schemas.py）

**Commit**: `chore: configure pre-commit hooks`

---

### v0046: GitHub Actions —— 文档 CI

**目标**：每次 PR/Push 自动运行文档质量检查。

**产出文件**：
- `.github/workflows/docs-ci.yml`

**工作流**：
- 触发：PR + push to main
- 步骤：Checkout -> Python setup -> Install deps -> Schema 校验 -> 质量门禁
- 权限：contents: read（最小权限）

**Commit**: `ci: add GitHub Actions workflow for document validation`

---

### v0047: GitHub Actions —— 安全扫描

**目标**：自动扫描 PR 中的敏感信息泄露。

**产出文件**：
- `.github/workflows/security.yml`

**工作流**：
- 触发：PR
- 步骤：检测 .env 文件是否被意外提交、扫描常见密钥模式
- 失败时阻断合并

**Commit**: `ci: add security scanning workflow`

---

### v0048: Makefile / Task Runner

**目标**：提供统一的任务入口，简化开发和使用体验。

**产出文件**：
- `Makefile`

**任务清单**：
- `make validate` —— 运行 Schema 校验
- `make quality` —— 运行质量门禁
- `make audit` —— 运行全套检查
- `make setup` —— 安装依赖 + pre-commit hooks
- `make clean` —— 清理运行时产物

**Commit**: `chore: add Makefile for common development tasks`

---

## Phase 8: 测试（v0049 - v0052）

### v0049: 测试框架搭建

**目标**：建立测试基础设施。

**产出文件**：
- `tests/conftest.py`（pytest 配置）
- `tests/__init__.py`
- 在 requirements.txt 中追加 pytest

**Commit**: `test: scaffold test framework with pytest`

---

### v0050: Schema 验证测试

**目标**：确保所有 JSON Schema 本身合法，且内置模板符合 Schema。

**产出文件**：
- `tests/test_schemas.py`

**测试用例**：
- 每个 Schema 文件自身是合法的 JSON Schema
- 每个内置 type.json 符合 doc-type.schema.v1.json
- 远程协议示例符合 remote.request/response.v1.json
- 无效输入被正确拒绝

**Commit**: `test: add schema validation tests`

---

### v0051: Golden Test 黄金样例

**目标**：为核心 Skills 建立基线输出样例，防止回归。

**产出文件**：
- `tests/golden/outline_input.md`（固定输入）
- `tests/golden/outline_expected_structure.json`（期望的结构）
- `tests/test_golden.py`

**测试策略**：
- 结构稳定性：章节数量、标题层级、必需字段是否存在
- 允许文本内容漂移（AI 生成内容不可能完全一致）

**Commit**: `test: add golden test fixtures for core skills`

---

### v0052: 端到端测试场景

**目标**：验证从创建到审阅的完整工作流。

**产出文件**：
- `tests/e2e/test_create_flow.py`
- `tests/e2e/test_review_flow.py`

**测试场景**：
- 使用 opencode run 非交互模式运行 /create 命令
- 验证产出文件存在且结构合法
- 运行 /review 并验证审阅报告结构

**Commit**: `test: add end-to-end test scenarios`

---

## Phase 9: 更多内置文档类型（v0053 - v0056）

### v0053: 内置文档类型 —— 项目提案

**产出文件**：
- `docs/_templates/project-proposal/type.json`
- `docs/_templates/project-proposal/template.md`
- `docs/_templates/project-proposal/guidelines.md`

**章节**：问题陈述、解决方案、目标受众、竞品分析、实施计划、资源需求、风险评估、预期收益

**Commit**: `feat: add built-in document type - project proposal`

---

### v0054: 内置文档类型 —— 会议纪要

**产出文件**：
- `docs/_templates/meeting-notes/type.json`
- `docs/_templates/meeting-notes/template.md`
- `docs/_templates/meeting-notes/guidelines.md`

**章节**：会议信息（时间/参与者/主题）、议程、讨论要点、决议事项、待办清单（Action Items）、下次会议安排

**Commit**: `feat: add built-in document type - meeting notes`

---

### v0055: 内置文档类型 —— API 文档

**产出文件**：
- `docs/_templates/api-doc/type.json`
- `docs/_templates/api-doc/template.md`
- `docs/_templates/api-doc/guidelines.md`

**章节**：API 概述、认证方式、端点列表、请求/响应示例、错误码、限流策略、变更日志

**Commit**: `feat: add built-in document type - API documentation`

---

### v0056: 内置文档类型 —— ADR（架构决策记录）

**产出文件**：
- `docs/_templates/adr/type.json`
- `docs/_templates/adr/template.md`
- `docs/_templates/adr/guidelines.md`

**章节**：标题与编号、状态（Proposed/Accepted/Deprecated/Superseded）、上下文、决策、后果、替代方案

**Commit**: `feat: add built-in document type - Architecture Decision Record`

---

## Phase 10: 用户文档与品牌打磨（v0057 - v0063）

### v0057: Quickstart 指南

**目标**：让新用户最快速度跑通第一个文档生成。

**产出文件**：
- `docs/guides/quickstart.md`

**内容**：
- 前置要求（Open Code 安装）
- 克隆 MaeDoc 仓库
- 运行第一个 /create 命令
- 查看和编辑生成的文档
- 运行 /review 审阅

**Commit**: `docs: add quickstart guide`

---

### v0058: Skill 开发指南

**目标**：教用户如何创建自己的 Skills。

**产出文件**：
- `docs/guides/skill-development.md`

**内容**：
- Skill 类型说明（提示型 vs 工具型）
- SKILL.md 编写规范与 frontmatter 字段
- 工具型 Skill（.ts）开发示例
- Skill Contract 规范引用
- 测试与注册

**Commit**: `docs: add skill development guide`

---

### v0059: 自定义文档类型指南

**目标**：教用户如何创建自己的文档类型。

**产出文件**：
- `docs/guides/custom-doc-types.md`

**内容**：
- 文档类型的三件套：type.json + template.md + guidelines.md
- 使用 /new-type 命令交互式创建
- 手动创建的详细步骤
- Schema 字段说明
- 最佳实践

**Commit**: `docs: add custom document type creation guide`

---

### v0060: 端到端示例 —— 技术设计文档

**目标**：提供完整的使用示例，展示从想法到成稿的全过程。

**产出文件**：
- `docs/examples/tech-design-example.md`（演示结果）
- `docs/examples/tech-design-walkthrough.md`（操作步骤）

**内容**：
- 完整的命令序列
- 每步的输入输出展示
- 迭代修改示例
- 远程增强示例

**Commit**: `docs: add end-to-end example - technical design document`

---

### v0061: 端到端示例 —— 博客文章

**目标**：展示 MaeDoc 在非技术文档场景的能力。

**产出文件**：
- `docs/examples/blog-post-example.md`
- `docs/examples/blog-post-walkthrough.md`

**Commit**: `docs: add end-to-end example - blog post creation`

---

### v0062: CONTRIBUTING.md + CHANGELOG.md

**目标**：为社区贡献做好准备。

**产出文件**：
- `CONTRIBUTING.md`
- `CHANGELOG.md`

**CONTRIBUTING 内容**：
- 如何报告 Bug
- 如何贡献新的文档类型
- 如何贡献新的 Skill
- 代码/文档规范
- Conventional Commits 要求
- PR 流程

**Commit**: `docs: add CONTRIBUTING.md and CHANGELOG.md`

---

### v0063: README 最终打磨与品牌升级

**目标**：把 README 打磨到"网红级"吸引力。

**产出文件**：
- `README.md`（全面更新）

**更新内容**：
- 项目 Logo / Banner（可后续替换）
- Badges：License、CI Status、Stars、Open Issues
- 一句话 Tagline
- 动图/截图展示（使用示例的终端录屏）
- Feature 清单（分类展示，含状态标记）
- 完整的 Quick Start（简化版，链接到详细指南）
- 内置文档类型展示表
- Skills 列表概览
- 架构图（Mermaid）
- Roadmap
- 社区链接（Discussions、Issues）
- 致谢与引用
- 中英文双语（README.md 英文 + README_CN.md 中文）

**Commit**: `docs: polish README for public launch`

---

## 里程碑概览

| 里程碑 | 版本范围 | 核心交付 | 可演示能力 |
|--------|---------|---------|-----------|
| M0: 基础设施 | v0001-v0004 | 项目骨架、配置、规则 | 项目可被克隆和理解 |
| M1: 文档类型 | v0005-v0010 | 类型系统 + 3 种内置类型 | 模板可浏览 |
| M2: AI 写作 | v0011-v0018 | 8 个核心 Skills | AI 可生成/审阅/迭代文档 |
| M3: 写作命令 | v0019-v0024 | 6 个用户命令 | 一键创建文档 |
| M4: 技能治理 | v0025-v0029 | Schema + 治理 Skills | 技能生态可自检 |
| M5: 远程桥接 | v0030-v0036 | 远程增强全流程 | 本地+远程协同写作 |
| M6: 安全审计 | v0037-v0042 | 安全 Skills + 插件 + 指南 | 安全可控 |
| M7: CI/CD | v0043-v0048 | 脚本 + CI + Task Runner | 自动化质量保障 |
| M8: 测试 | v0049-v0052 | 测试框架 + 用例 | 可回归验证 |
| M9: 更多类型 | v0053-v0056 | 4 种新文档类型 | 丰富的开箱即用体验 |
| M10: 品牌发布 | v0057-v0063 | 文档 + 示例 + README | 可公开发布 |

---

## 建议执行节奏

- **M0-M3（v0001-v0024）为核心 MVP**：完成后即可对外展示和使用
- **M4-M6（v0025-v0042）为增强 MVP**：补齐治理、安全、远程能力
- **M7-M10（v0043-v0063）为发布准备**：CI/CD、测试、文档、品牌

每个迭代（v-number）对应一次独立 Commit，遵循 Conventional Commits 规范。建议使用 `feat:` / `docs:` / `chore:` / `ci:` / `test:` 前缀。
