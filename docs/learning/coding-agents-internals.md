# Coding Agents 内部机制：OpenCode 深度解析

> **来源**：[How Coding Agents Actually Work: Inside OpenCode](https://cefboud.com/posts/coding-agents-internals-opencode-deepdive/)
> **作者**：Moncef Abboud
> **阅读日期**：2026-02-22
> **最后更新**：2026-02-22

---

## 概述

本文是对《How Coding Agents Actually Work: Inside OpenCode》一文的深度学习笔记，提取了对 **MaeDoc 项目**有直接应用价值的设计模式和最佳实践。

**核心收获**：
- Coding Agent 不是"聊天机器人 + 工具"，而是一个完整的**行动者系统**
- 关键在于：**系统提示词设计**、**工具描述模式**、**子代理协作**、**上下文管理**

---

## 1. 为什么需要 Coding Agent？

### 1.1 LLM 的局限

单独使用 LLM（如 ChatGPT）存在以下问题：

| 问题 | 描述 |
|------|------|
| 上下文管理繁琐 | 手动粘贴代码、错误信息、文件内容 |
| 输出应用困难 | 需要手动复制建议到代码中 |
| 缺乏环境感知 | 无法运行测试、查看实际效果 |
| 无法自主迭代 | 需要人类持续在循环中 |

### 1.2 Coding Agent 的核心能力

```
LLM + 工具访问 + 反馈循环 = Coding Agent
```

**关键能力**：

1. **文件操作**：直接读写、编辑代码文件
2. **命令执行**：运行 bash 命令、执行测试
3. **LSP 集成**：获取代码诊断、类型检查结果
4. **自主迭代**：根据执行结果调整下一步行动

### 1.3 对 MaeDoc 的启示

| OpenCode 实践 | MaeDoc 对应 |
|--------------|------------|
| LLM 作为大脑，工具作为手脚 | LLM 作为作家，Skills 作为写作能力 |
| Plan → Build 模式切换 | `/create` 的大纲确认 → 内容填充流程 |
| 反馈循环（测试→诊断→调整） | `/review` → `/iterate` 的迭代优化 |

---

## 2. 架构设计

### 2.1 OpenCode 架构

```
┌─────────────────────────────────────────────────────────┐
│                    OpenCode 架构                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────────┐    ┌─────────────┐                   │
│   │   TUI (Go)  │◄──►│ HTTP Server │◄── SDK/其他客户端  │
│   └─────────────┘    │   (Bun/JS)  │                   │
│                      └──────┬──────┘                   │
│                             │                           │
│   ┌─────────────────────────┼─────────────────────────┐│
│   │                         │                         ││
│   │  ┌──────────┐  ┌────────▼────────┐  ┌──────────┐  ││
│   │  │  AI SDK  │  │ Session Manager │  │   Tools  │  ││
│   │  │(统一接口)│  │  (对话/摘要)     │  │ (bash等) │  ││
│   │  └──────────┘  └─────────────────┘  └──────────┘  ││
│   │                                                     ││
│   │  ┌──────────────────────────────────────────────┐  ││
│   │  │              LSP Client Manager              │  ││
│   │  └──────────────────────────────────────────────┘  ││
│   │                                                     ││
│   └─────────────────────────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 关键设计决策

| 决策 | 说明 |
|------|------|
| **Provider-agnostic** | 通过 AI SDK 统一不同模型接口（Anthropic/OpenAI/Gemini） |
| **Client/Server 分离** | TUI 和 HTTP Server 分离，支持多种客户端 |
| **SDK 自动生成** | 使用 Stainless 从 OpenAPI 生成类型安全客户端 |
| **持久化会话** | 会话消息持久化到磁盘，支持断点续传 |

### 2.3 对 MaeDoc 的启示

MaeDoc 基于 OpenCode 运行，可以直接复用这些基础设施：

- **AI SDK**：MaeDoc 通过 OpenCode 自动获得多模型支持
- **Tools**：MaeDoc 的 Skills 就是 OpenCode Tools 的文档领域特化
- **Session**：MaeDoc 继承 OpenCode 的会话管理能力

---

## 3. System Prompt 设计模式

> **这是文章中最有价值的部分之一**

### 3.1 System Prompt 的角色

```
System Prompt + Tools List + User Prompt → LLM 决策
```

System Prompt 告诉 LLM：
- **角色定义**：你是什么
- **行为准则**：你应该如何表现
- **工具使用**：你有哪些工具，如何使用
- **安全规则**：你不能做什么

### 3.2 OpenCode 的 System Prompt 结构

OpenCode 为每个模型提供定制化的 System Prompt，以下是 Gemini 版本的结构：

```markdown
You are opencode, an interactive CLI agent specializing in 
software engineering tasks...

# Operational Guidelines

## Tone and Style (CLI Interaction)
- **Concise & Direct:** 采用专业、直接、简洁的语气
- **Minimal Output:** 每次响应文本输出不超过 3 行（不含工具调用）
- **Clarity over Brevity:** 必要时优先清晰而非简洁
- **No Chitchat:** 避免闲聊填充（"好的，我现在..."）
- **Formatting:** 使用 GitHub 风格 Markdown
- **Tools vs. Text:** 工具用于行动，文本仅用于沟通

## Security and Safety Rules
- **Explain Critical Commands:** 执行修改性命令前必须解释
- **Security First:** 永不引入暴露敏感信息的代码

## Tool Usage
- **File Paths:** 始终使用绝对路径
- **Parallelism:** 尽可能并行执行独立工具调用
- **Command Execution:** 使用 bash 工具运行 shell 命令
- **Background Processes:** 使用 & 运行长期进程
- **Interactive Commands:** 避免需要用户交互的命令
- **Respect User Confirmations:** 用户取消工具调用时尊重选择
```

### 3.3 关键设计模式

| 模式 | 描述 | 示例 |
|------|------|------|
| **极简输出** | 每次响应不超过 3 行文本 | 避免冗长解释 |
| **无闲聊** | 不要说"好的，我来..." | 直接行动 |
| **行动优先** | 工具用于行动，文本用于沟通 | 不在工具调用中加注释 |
| **安全第一** | 解释危险操作，不暴露敏感信息 | 命令前说明目的 |

### 3.4 对 MaeDoc AGENTS.md 的启示

MaeDoc 的 AGENTS.md 可以吸收以下最佳实践：

**现有设计** ✅：
- 角色定义明确
- 安全红线清晰
- 行为准则结构化

**可以改进**：
- 添加"No Chitchat"规则
- 添加"Minimal Output"规则
- 明确"工具用于行动，文本用于沟通"原则

---

## 4. Tools 的设计哲学

### 4.1 工具即 Prompt

> **核心洞察**：工具的 DESCRIPTION 不是"功能说明"，而是"使用指南"

每个工具的描述应该告诉 LLM：
- 这个工具做什么
- 什么时候应该使用
- 如何正确使用
- 常见错误和注意事项

### 4.2 Read 工具的描述示例

```markdown
Reads a file from the local filesystem. You can access any 
file directly by using this tool.

Usage:
- The filePath parameter must be an absolute path
- By default, it reads up to 2000 lines from the beginning
- You can optionally specify offset and limit for long files
- Any lines longer than 2000 characters will be truncated
- Results use cat -n format with line numbers starting at 1
- This tool cannot read binary files, including images
- You can call multiple tools in parallel - always better to 
  read multiple potentially useful files as a batch
- If you read a file that exists but has empty contents, 
  you will receive a warning
```

**关键点**：
- 不仅仅是"读取文件"，而是详细的使用指南
- 包含边界情况处理（空文件、二进制文件、超长行）
- 鼓励并行读取多个文件

### 4.3 Bash 工具的描述示例

```markdown
Executes a given bash command in a persistent shell session...

Before executing the command, please follow these steps:

1. Directory Verification:
   - If creating new directories/files, first verify parent 
     directory exists using LS tool
   - Example: before "mkdir foo/bar", check "foo" exists

2. Command Execution:
   - Always quote file paths containing spaces with double quotes
   - Examples:
     - cd "/Users/name/My Documents" (correct)
     - cd /Users/name/My Documents (incorrect - will fail)
```

**关键点**：
- 包含操作前检查步骤
- 提供正确/错误示例对比
- 强调安全最佳实践

### 4.4 对 MaeDoc Skills 的启示

MaeDoc 的 Skills 应该采用类似的描述模式：

**当前设计**：SKILL.md 中的正文是任务说明
**改进方向**：添加详细的"使用指南"，包括：
- 什么时候应该使用这个 Skill
- 输入参数的正确格式
- 常见错误和注意事项
- 与其他 Skills 的协作方式

---

## 5. SubAgent 协作模式

### 5.1 Task Tool 设计

OpenCode 通过 **Task Tool** 实现子代理调用：

```typescript
// Task Tool 的核心设计
TaskTool.define("task", {
  description: "Launch a specialized subagent for a specific task",
  parameters: z.object({
    description: z.string().describe("3-5 word task description"),
    prompt: z.string().describe("Detailed task for the subagent"),
    subagent_type: z.string().describe("Type of agent to use"),
  }),
  async execute(params, ctx) {
    // 1. 获取目标 Agent 的配置
    const agent = await Agent.get(params.subagent_type)
    
    // 2. 为子 Agent 创建新 Session
    const session = await Session.create(
      ctx.sessionID, 
      params.description + ` (@${agent.name} subagent)`
    )
    
    // 3. 使用子 Agent 的工具和提示词执行
    const result = await Session.prompt({
      sessionID: session.id,
      agent: agent.name,
      tools: agent.tools,  // 子 Agent 可能有不同的工具集
      // ...
    })
    
    // 4. 返回结果给主 Agent
    return { output: result.text }
  }
})
```

### 5.2 SubAgent 定义示例

```yaml
# code-reviewer.md
---
description: Reviews code for quality and best practices
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
---
You are in code review mode. Focus on:
- Code quality and best practices
- Potential bugs and edge cases
- Performance implications
- Security considerations

Provide constructive feedback without making direct changes.
```

**关键设计**：
- **model**：子 Agent 可以使用不同的模型
- **tools**：子 Agent 可以有受限的工具集（如只读权限）
- **temperature**：子 Agent 可以有独立的温度设置

### 5.3 递归调用

Task Tool 支持**递归调用**：主 Agent 可以调用子 Agent，子 Agent 还可以调用更深层的子 Agent。

这是实现**自主性**的关键：一个 Agent 可以根据需要"雇佣"其他专业 Agent。

### 5.4 对 MaeDoc 的启示

MaeDoc 可以采用类似的 SubAgent 模式：

| OpenCode | MaeDoc 对应 |
|----------|------------|
| `@security-auditor` | `@doc-reviewer`（专注于特定维度的审阅）|
| 递归调用 | explore → librarian → oracle 的协作链 |
| 受限工具集 | 只读型 Skills（不修改文档）|

---

## 6. LLM 循环与上下文管理

### 6.1 核心循环

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   ┌─────────────┐                                    │
│   │ 用户输入    │                                    │
│   └──────┬──────┘                                    │
│          │                                           │
│          ▼                                           │
│   ┌─────────────┐                                    │
│   │ 组装上下文  │ ← System Prompt + Tools + History  │
│   └──────┬──────┘                                    │
│          │                                           │
│          ▼                                           │
│   ┌─────────────┐                                    │
│   │ 调用 LLM    │                                    │
│   └──────┬──────┘                                    │
│          │                                           │
│          ▼                                           │
│   ┌─────────────┐                                    │
│   │ 处理响应    │ ← 文本输出 / 工具调用              │
│   └──────┬──────┘                                    │
│          │                                           │
│          ├─────────────┐                             │
│          │             │                             │
│          ▼             ▼                             │
│   ┌──────────┐  ┌─────────────┐                     │
│   │ 文本输出 │  │ 执行工具    │                     │
│   └──────────┘  └──────┬──────┘                     │
│                        │                             │
│                        ▼                             │
│                 ┌─────────────┐                     │
│                 │ 工具结果    │ ← 加入上下文        │
│                 └──────┬──────┘                     │
│                        │                             │
│                        ▼                             │
│                 ┌─────────────┐                     │
│                 │ 继续调用 LLM│ ← 循环               │
│                 └─────────────┘                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 6.2 自动摘要

当对话历史接近上下文限制时，OpenCode 自动触发摘要：

```typescript
if (tokens > (model.contextLimit - outputLimit) * 0.9) {
  // 触发自动摘要
  const summary = await streamText({
    model: model.language,
    messages: [...history, {
      role: "user",
      content: "Provide a detailed but concise summary..."
    }]
  })
}
```

### 6.3 Plan → Build 模式切换

OpenCode 通过特殊的系统提示词实现模式切换：

```markdown
<system-reminder>
Your operational mode has changed from plan to build.
You are no longer in read-only mode.
You are permitted to make file changes, run shell commands, 
and utilize your arsenal of tools as needed.
</system-reminder>
```

### 6.4 快照恢复

每个 step 开始时，OpenCode 使用 Git 创建快照：

```typescript
// step 开始时
const snapshot = await Snapshot.track()

// 如果出错，可以恢复
await Snapshot.restore(snapshot)
```

这提供了**撤销能力**：如果 Agent 走错方向，可以回滚到之前的状态。

### 6.5 对 MaeDoc 的启示

| 机制 | MaeDoc 应用 |
|------|------------|
| 自动摘要 | 长文档审阅时的上下文压缩 |
| 模式切换 | Plan 模式（只读分析）→ Build 模式（执行修改）|
| 快照恢复 | `/iterate` 前自动备份，支持回滚 |

---

## 7. TODO 管理

### 7.1 OpenCode 的 TODO 设计

```typescript
const TodoInfo = z.object({
  content: z.string().describe("Brief description"),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  priority: z.enum(["high", "medium", "low"]),
  id: z.string().describe("Unique identifier"),
})

// todowrite：更新 TODO 列表
TodoWriteTool.define("todowrite", {
  parameters: z.object({
    todos: z.array(TodoInfo)
  }),
  execute(params, ctx) {
    state[ctx.sessionID] = params.todos
    return { output: JSON.stringify(params.todos) }
  }
})

// todoread：读取 TODO 列表
TodoReadTool.define("todoread", {
  execute(_params, ctx) {
    return { output: JSON.stringify(state[ctx.sessionID] ?? []) }
  }
})
```

### 7.2 设计亮点

1. **状态机**：`pending → in_progress → completed/cancelled`
2. **优先级**：`high/medium/low`
3. **会话隔离**：每个 session 有独立的 TODO 列表
4. **LLM 可操作**：LLM 可以主动更新 TODO 状态

### 7.3 与 MaeDoc 的对照

| OpenCode | MaeDoc |
|----------|--------|
| `todowrite` | `todo-append` Skill |
| Session 隔离 | `docs/TODO.md` 全局共享 |
| LLM 主动管理 | 由 Command 触发管理 |

**MaeDoc 的优势**：`docs/TODO.md` 持久化、跨会话、可追溯
**OpenCode 的优势**：LLM 可以主动管理 TODO 状态

---

## 8. LSP 集成

### 8.1 为什么需要 LSP？

- LLM 编辑代码后，需要知道**是否有错误**
- IDE 中的"波浪线"就来自 LSP 诊断
- 将诊断结果反馈给 LLM，形成**编辑→诊断→调整**的循环

### 8.2 OpenCode 的 LSP 设计

```typescript
// 文件编辑后，触发 LSP 诊断
await LSP.touchFile(filePath, true)
const diagnostics = await LSP.diagnostics()
```

诊断结果格式：

```json
{
  "uri": "file:///path/to/file.js",
  "diagnostics": [{
    "range": { "start": {"line": 10, "character": 4}, 
               "end": {"line": 10, "character": 10} },
    "severity": 1,
    "code": "no-undef",
    "message": "'myVar' is not defined."
  }]
}
```

### 8.3 对 MaeDoc 的启示

MaeDoc 主要处理**文档**而非代码，但可以借鉴**反馈循环**的设计：

- 文档修改后，可以自动运行 `doc-evaluate`
- 将评分和问题反馈给 LLM，指导下一步修改
- 形成"修改→评估→调整"的循环

---

## 9. 行动清单

基于本文的学习，以下是对 MaeDoc 的具体改进建议：

### 9.1 AGENTS.md 改进

| 改进项 | 内容 |
|--------|------|
| 添加 "Tone and Style" 章节 | 明确"No Chitchat"、"Minimal Output"规则 |
| 添加 "Tool Usage" 章节 | 明确"工具用于行动，文本用于沟通"原则 |
| 优化 "Security Rules" | 参考 OpenCode 的安全描述模式 |

### 9.2 Skills 设计改进

| 改进项 | 内容 |
|--------|------|
| 添加详细的使用指南 | 每个 SKILL.md 包含 Usage 章节 |
| 添加正确/错误示例 | 帮助 LLM 正确使用 Skill |
| 添加边界情况处理 | 明确输入约束和错误处理 |

### 9.3 SubAgent 模式引入

| 改进项 | 内容 |
|--------|------|
| 定义 SubAgent 机制 | 主 Skill 可以调用子 Skill |
| 支持受限工具集 | 某些 Skill 只读，不修改文档 |
| 支持递归调用 | 形成协作链（explore → librarian → oracle）|

### 9.4 反馈循环建立

| 改进项 | 内容 |
|--------|------|
| 自动质量评估 | 文档修改后自动调用 `doc-evaluate` |
| 诊断结果反馈 | 将问题反馈给 LLM 指导下一步修改 |
| 支持快照恢复 | `/iterate` 前自动备份，支持回滚 |

---

## 相关文档

- [AGENTS.md](../../AGENTS.md) — MaeDoc AI Agent 行为准则
- [Skill 契约设计](../maedoc/skill-contract.md) — Skill 设计原则
- [扩展能力总览](../opencode/extensibility/index.md) — OpenCode 六支柱架构
- [Agents/Rules/Skills](../opencode/extensibility/agents-rules-skills.md) — 工作流定义体系

---

*本文档由 `/create` 命令基于外部文章学习笔记生成，记录 MaeDoc 可借鉴的 Coding Agent 设计模式。*
