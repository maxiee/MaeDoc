# OpenCode Agents / Rules / Skills 体系

> **所属系列**：[OpenCode 使用指南](../index.md) → [扩展能力](./index.md)
> **最后更新**：2026-02-22

---

## 概述

**Agents / Rules / Skills** 是 OpenCode 的**可组合工作流定义体系**，从"提示词/权限/可用工具/延迟加载知识"层面定义 AI 的行为模式。

```
┌─────────────────────────────────────────────────────┐
│                    Agent (代理)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   Rules     │  │   Skills    │  │   Tools     │  │
│  │  (行为规则)  │  │  (能力模块)  │  │  (可用工具)  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

**三者关系**：
- **Agents** — 定义一个完整的 AI 代理（角色、权限、可用资源）
- **Rules** — 定义代理的行为约束和决策规则
- **Skills** — 定义代理的专项能力（可延迟加载）

---

## Agents（代理）

Agent 是 OpenCode 的核心抽象，代表一个具有特定职责的 AI 实体。

### Agent 定义

```yaml
---
name: code-reviewer
description: 专注于代码审查的代理，关注质量和安全
model: anthropic/claude-3-5-sonnet-20241022
tools:
  read: true
  edit: ask
  bash: false
  skill: true
skills:
  - git-master
  - frontend-ui-ux
instructions: |
  你是一个专业的代码审查助手。
  关注点：代码质量、安全漏洞、性能问题。
  输出风格：简洁、具体、可操作。
---
```

### Agent 字段说明

| 字段 | 必填 | 说明 |
|------|:----:|------|
| `name` | ✓ | 代理名称（唯一标识） |
| `description` | ✓ | 功能描述 |
| `model` | | 覆盖默认模型 |
| `tools` | | 工具权限配置 |
| `skills` | | 预加载的 Skills 列表 |
| `instructions` | | 系统提示词 |

### 内置代理

| 代理 | 职责 |
|------|------|
| `build` | 执行模式，可修改文件和运行命令 |
| `plan` | 规划模式，只分析不执行 |
| `chat` | 通用对话模式 |

---

## Rules（规则）

Rules 定义代理的行为约束，决定代理在特定场景下如何响应。

### Rule 定义

```markdown
---
name: no-force-push
description: 禁止执行 force push 操作
triggers:
  - command: "git push --force"
  - command: "git push -f"
action: deny
message: "Force push 被安全规则阻止。如需强制推送，请手动执行。"
---
```

### Rule 类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `deny` | 拒绝执行 | 禁止删除生产环境文件 |
| `ask` | 需要确认 | 执行数据库迁移前询问 |
| `allow` | 允许执行 | 允许读取任意文件 |

### Rule 配置

```jsonc
// opencode.jsonc
{
  "rules": {
    "protected-branches": {
      "pattern": ["main", "master", "production"],
      "actions": {
        "push": "ask",
        "delete": "deny"
      }
    },
    "sensitive-files": {
      "pattern": [".env", "*.key", "credentials.*"],
      "actions": {
        "read": "ask",
        "edit": "deny"
      }
    }
  }
}
```

---

## Skills（能力模块）

Skills 是可复用的能力定义，可以被多个 Agent 加载。

### Skill 定义结构

```markdown
---
name: git-master
description: Git 高级操作专家，处理 rebase/squash/blame 等
triggers:
  - "commit"
  - "rebase"
  - "squash"
  - "blame"
---

## 职责

处理复杂的 Git 操作：
- 原子提交
- 交互式 rebase
- 历史搜索
- 冲突解决

## 工作流程

1. 确认操作范围
2. 检查工作区状态
3. 执行操作
4. 验证结果
```

### Skill 加载方式

**项目级**（`.opencode/skills/`）：
```
.opencode/skills/
├── my-skill/
│   └── SKILL.md
└── another-skill/
    └── SKILL.md
```

**全局级**（`~/.config/opencode/skills/`）：
```
~/.config/opencode/skills/
├── common-skill/
│   └── SKILL.md
```

### Skill 权限

```jsonc
{
  "permission": {
    "skill": {
      "*": "ask",
      "git-*": "allow",
      "internal-*": "deny"
    }
  }
}
```

---

## 三者协同工作流

### 示例：代码审查工作流

```yaml
# 定义 code-reviewer Agent
name: code-reviewer
tools:
  read: true
  edit: false    # 只读模式
  bash: false
skills:
  - git-master   # 可查看 git 历史
  - frontend-ui-ux  # 可审阅前端代码
rules:
  - no-secrets-in-code  # 应用安全规则
```

**执行流程**：

1. **用户请求** → `/review src/auth.ts`
2. **Agent 匹配** → 加载 `code-reviewer` Agent
3. **Skills 加载** → 加载 `git-master`、`frontend-ui-ux`
4. **Rules 应用** → 检查 `no-secrets-in-code` 规则
5. **执行审查** → 读取文件、分析、生成报告

---

## 延迟加载知识

Skills 支持**延迟加载**，只在需要时才读取知识内容：

```markdown
---
name: api-reference
description: 项目 API 参考文档
lazyLoad: true
knowledgeBase:
  - ./docs/api/*.md
---

当用户询问 API 相关问题时，加载相关知识库内容。
```

**优势**：
- 减少初始上下文大小
- 按需加载，节省 token
- 知识库更新无需重启

---

## Agent 继承与组合

### Agent 继承

```yaml
---
name: senior-reviewer
extends: code-reviewer
skills:
  - git-master
  - frontend-ui-ux
  - security-audit  # 新增能力
---
```

### Skill 组合

```yaml
---
name: full-stack-dev
skills:
  - git-master
  - frontend-ui-ux
  - backend-api
  - database-expert
---
```

---

## 配置示例

### 完整项目配置

```jsonc
// opencode.jsonc
{
  "agents": {
    "build": {
      "model": "anthropic/claude-3-5-sonnet-20241022",
      "tools": {
        "read": true,
        "edit": true,
        "bash": true
      }
    },
    "reviewer": {
      "model": "anthropic/claude-3-5-sonnet-20241022",
      "tools": {
        "read": true,
        "edit": false,
        "bash": false
      },
      "skills": ["git-master"]
    }
  },
  
  "rules": {
    "production-safety": {
      "pattern": ["production", "prod"],
      "actions": {
        "edit": "ask",
        "bash": "deny"
      }
    }
  },
  
  "permission": {
    "skill": {
      "*": "ask",
      "git-*": "allow"
    }
  }
}
```

---

## Commands / Skills / Agents：精炼总结

> **来源**：[The definitive guide to OpenCode](https://reading.sh/the-definitive-guide-to-opencode-from-first-install-to-production-workflows-aae1e95855fb)

**一句话总结**：

> **Commands** 是 **what**（做什么），**Skills** 是 **how**（怎么做），**Agents** 是 **who**（谁来做）。

### 何时使用

| 机制 | 触发方式 | 适用场景 |
|------|---------|---------|
| **Commands** | `/command-name` | 重复性任务、固定流程、需要参数的模板 |
| **Skills** | 自动加载或 `@skill-name` | 领域知识、最佳实践、工作方法 |
| **Agents** | `@agent-name` 或 Task Tool | 专门角色、受限权限、不同模型配置 |

### 协作示例

```markdown
# 用户输入
/review src/auth.ts

# 实际执行
1. Command `/review` 被触发（what：执行代码审查）
2. Skill `git-master` 被加载（how：使用 Git 最佳实践）
3. Agent `reviewer` 被激活（who：只读权限的审查专家）
```

### 与 Commands 的关系

Commands（自定义命令）与 Skills/Agents 的区别：

| 特性 | Command | Skill | Agent |
|------|---------|-------|-------|
| 执行时机 | 用户显式调用 | 自动加载或手动引用 | 用户引用或 Task Tool |
| 主要作用 | 预定义 prompt 模板 | 知识和方法 | 角色和权限 |
| 可组合性 | 可加载 Skills | 可被 Command/Agent 加载 | 可加载 Skills |
| 典型用例 | `/commit`、`/review` | `git-master`、`frontend-ui-ux` | `reviewer`、`security-auditor` |


## 相关文档

- [Skills 使用入门](../skills-basics.md) — Skills 基础概念
- [SKILL.md 开发规范](../skill-md-spec.md) — Skill 文件规范
- [Plugins 扩展机制](./plugins.md) — 底层事件钩子
- [Custom Tools](./custom-tools.md) — 可执行工具定义

---

*本文档基于 OpenCode 架构设计、《The definitive guide to OpenCode》及社区最佳实践整理，最后更新：2026-02-22*
