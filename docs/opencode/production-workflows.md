# OpenCode 生产级工作流

> **所属系列**：[OpenCode 使用指南](./index.md)
> **最后更新**：2026-02-22
> **知识来源**：[The definitive guide to OpenCode](https://reading.sh/the-definitive-guide-to-opencode-from-first-install-to-production-workflows-aae1e95855fb)

---

## 概述

本节介绍经过实战验证的 OpenCode 工作流模式，帮助你在真实项目中高效使用 AI 编码代理。

**核心理念**：
- **Plan → Build**：先规划再执行，避免误解导致的错误代码
- **多 Agent 协作**：让专业 Agent 处理专业领域
- **自动化反馈循环**：Agent 修改后自动验证，形成闭环

---

## 工作流 1：多 Agent 代码审查

### 问题

一次 PR 审查需要关注多个维度：前端可访问性、后端 API 设计、DevOps 配置安全。让一个开发者全面审查效率低下。

### 解决方案：三视角代码审查

创建三个专业 Agent，从不同角度审查同一份代码。

#### Step 1：定义专业 Agent

**前端审查 Agent**（`.opencode/agents/review-frontend.md`）：

```yaml
---
description: 前端专家审查
mode: subagent
hidden: true
tools:
  edit: false
  write: false
  bash: false
  task: false
---

你是前端专家。审查时关注：
- React 组件模式
- 可访问性（a11y）
- 性能（包体积、渲染周期）
- CSS 架构
```

**后端审查 Agent**（`.opencode/agents/review-backend.md`）：

```yaml
---
description: 后端专家审查
mode: subagent
hidden: true
tools:
  edit: false
  write: false
  bash: false
  task: false
---

你是后端专家。审查时关注：
- API 设计
- 数据库查询（N+1 问题）
- 错误处理
- 安全漏洞
```

**DevOps 审查 Agent**（`.opencode/agents/review-infra.md`）：

```yaml
---
description: DevOps 专家审查
mode: subagent
hidden: true
tools:
  edit: false
  write: false
  bash: false
  task: false
---

你是 DevOps 专家。审查时关注：
- 部署配置
- 环境变量安全
- 健康检查
- 监控指标
```

#### Step 2：创建编排命令

**审查命令**（`.opencode/commands/review.md`）：

```markdown
---
description: 多视角代码审查
agent: build
---

分析当前 diff（`git diff main...HEAD`）。

然后并行调用以下审查者：
- @review-frontend 审查所有 .tsx、.css、.scss 文件
- @review-backend 审查 api/ 或 server/ 下的 .ts 文件
- @review-infra 审查所有配置文件（yaml、json、Dockerfile）

综合三方发现，生成一个按优先级排序的审查报告。
```

#### Step 3：使用

```bash
/review
```

一次命令，获得三份专业视角的审查报告。

---

## 工作流 2：功能实现流水线

### 问题

从需求到实现涉及多个步骤，容易遗漏测试、文档或验证。

### 解决方案：四阶段流水线命令

**功能实现命令**（`.opencode/commands/implement.md`）：

```markdown
---
description: 从规格实现功能
---

## Phase 1: 分析

- 读取规格文档 @docs/specs/$ARGUMENTS.md
- 识别受影响的文件
- 列出规格不明确的问题

## Phase 2: 规划

- 创建实现计划
- 识别需要的测试
- 列出潜在陷阱

## Phase 3: 实现

- 编写代码
- 添加测试
- 更新文档

## Phase 4: 验证

- 运行测试套件
- 检查类型错误
- 验证无回归
```

**使用**：

```bash
/implement user-auth
```

OpenCode 会读取 `docs/specs/user-auth.md`，按四阶段执行完整流程。

---

## 工作流 3：代码库探索

### 问题

加入新项目时，理解代码库结构需要大量时间。

### 解决方案：结构化探索 Skill

**探索 Skill**（`.opencode/skills/explore-codebase/SKILL.md`）：

```markdown
---
name: explore-codebase
description: 系统化代码库探索方法
---

## 探索陌生代码库的步骤

1. 从 package.json/composer.json 了解依赖
2. 阅读 AGENTS.md 或 README 获取项目概览
3. 识别入口点（main、index、server 文件）
4. 追踪请求流：入口 → 数据库
5. 记录模式：DI、Repository、Service 层
6. 生成探索摘要供后续参考

## 需要回答的问题

- 使用什么框架？
- 使用什么数据库？
- 认证如何处理？
- 测试如何组织？
- 部署目标是什么？
```

**使用**：

```bash
@explore-codebase 这个项目是怎么组织的？
```

---

## 工作流 4：自动化 PR 准备

### 问题

写 PR 描述耗时，经常遗漏重要信息。

### 解决方案：PR 准备命令

**PR 准备命令**（`.opencode/commands/prepare-pr.md`）：

```markdown
---
description: 准备 PR 及描述
---

1. 运行 `git diff main...HEAD --stat` 查看变更文件
2. 运行 `git log main...HEAD --oneline` 查看提交历史
3. 加载 skill: git-release
4. 生成 PR 描述，包含：
   - 变更摘要
   - 测试说明
   - 迁移步骤（如有）
   - 截图占位符
5. 输出可直接粘贴的 `gh pr create` 命令
```

**使用**：

```bash
/prepare-pr
```

---

## 工作流 5：Plan → Build 模式

### 核心模式

OpenCode 内置两种模式，用 **Tab 键**切换：

| 模式 | 权限 | 适用场景 |
|------|------|---------|
| **Plan** | 只读 | 不确定方案时，先让 AI 分析 |
| **Build** | 完全 | 确定要做时，执行修改 |

### 推荐工作流

```
1. [Plan 模式] 描述需求，请求方案
2. 审查方案，提出澄清问题
3. 反复迭代直到方案清晰
4. [Build 模式] "按这个方案执行"
```

### 示例

```bash
# Plan 模式
[Tab 切换到 Plan]

我需要给笔记添加软删除功能：
- 标记删除而非物理删除
- 创建"最近删除"页面
- 支持恢复或永久删除

你建议怎么实现？

# 审查 AI 返回的方案...
# 确认后切换模式

[Tab 切换到 Build]

方案可行，开始实现。
```

---

## 工作流 6：图片驱动开发

### 能力

OpenCode 支持拖拽图片到终端，AI 会分析图片内容。

### 适用场景

| 场景 | 用法 |
|------|------|
| **UI 设计稿** | "按这张设计稿实现组件" |
| **错误截图** | "我看到这个错误，问题在哪？" |
| **架构图** | "按这个架构图实现" |

### 示例

```
[拖拽 Figma 设计稿截图]

按这个设计实现登录页面，使用 Tailwind CSS。
```

---

## 工作流 7：会话管理

### 恢复会话

关闭 OpenCode 后继续之前的工作：

```bash
# 在 OpenCode 内
/sessions

# 或从命令行
opencode --continue
opencode -c

# 恢复特定会话
opencode --session ses_abc123
```

### 命名会话

为重要会话命名，便于后续查找：

```bash
opencode run --title "支付 API 重构" "重构支付模块以使用 Stripe"
```

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `ctrl+x l` | 打开会话选择器 |

---

## 最佳实践总结

| 实践 | 说明 |
|------|------|
| **先 Plan 后 Build** | 避免误解导致的错误代码 |
| **用 @ 引用文件** | 明确告诉 AI 关注哪个文件 |
| **并行调用 Agent** | 让专业 Agent 处理专业领域 |
| **利用图片输入** | 设计稿、错误截图直接拖拽 |
| **命名重要会话** | 方便后续查找和恢复 |
| **/undo 撤销** | 做错了立即撤销重来 |

---

## 相关文档

- [内置命令参考](./commands-built-in.md) — /undo、/sessions 等
- [Agents/Rules/Skills](./extensibility/agents-rules-skills.md) — 定义专业 Agent
- [最佳实践](./best-practices.md) — Prompt 工程技巧

---

*本文档整合自 OpenCode 实战指南，最后更新：2026-02-22*
