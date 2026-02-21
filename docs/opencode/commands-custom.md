# OpenCode 自定义命令开发

> **所属系列**：[OpenCode 使用指南](./index.md)
> **来源**：[OpenCode 官方文档](https://opencode.ai/docs/zh-cn/commands/)
> **最后更新**：2026-02-22

---

## 简介

自定义命令允许你为重复任务创建可复用的提示词模板。

```bash
/my-command
```

自定义命令是 `/init`、`/undo`、`/redo`、`/share`、`/help` 等内置命令之外的补充。

---

## 创建命令文件

在 `commands/` 目录中创建 Markdown 文件来定义自定义命令。

创建 `.opencode/commands/test.md`：

```markdown
---
description: Run tests with coverage
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---

Run the full test suite with coverage report and show any failures.
Focus on the failing tests and suggest fixes.
```

**结构说明**：
- **frontmatter**：定义命令属性（description、agent、model 等）
- **正文内容**：成为执行时发送给 LLM 的提示词模板

通过输入 `/` 后跟命令名称来使用该命令：

```bash
/test
```

---

## 配置方式

### 方式一：Markdown 文件（推荐）

将 Markdown 文件放在以下位置：

- **全局**：`~/.config/opencode/commands/`
- **项目级**：`.opencode/commands/`

Markdown 文件名即为命令名。例如 `test.md` 允许你运行：

```bash
/test
```

### 方式二：JSON 配置

在 OpenCode [配置](./environment-variables.md) 中使用 `command` 选项：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    "test": {
      "template": "Run the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes.",
      "description": "Run tests with coverage",
      "agent": "build",
      "model": "anthropic/claude-3-5-sonnet-20241022"
    }
  }
}
```

---

## 提示词配置

自定义命令的提示词支持多种特殊占位符和语法。

### 参数传递

使用 `$ARGUMENTS` 占位符向命令传递参数：

```markdown
---
description: Create a new component
---

Create a new React component named $ARGUMENTS with TypeScript support.
Include proper typing and basic structure.
```

带参数运行命令：

```bash
/component Button
```

`$ARGUMENTS` 将被替换为 `Button`。

### 位置参数

使用位置参数访问各个参数：

| 占位符 | 含义 |
|--------|------|
| `$1` | 第一个参数 |
| `$2` | 第二个参数 |
| `$3` | 第三个参数 |
| ... | 以此类推 |

**示例**：

```markdown
---
description: Create a new file with content
---

Create a file named $1 in the directory $2
with the following content: $3
```

运行命令：

```bash
/create-file config.json src "{ \"key\": \"value\" }"
```

替换结果：
- `$1` → `config.json`
- `$2` → `src`
- `$3` → `{ "key": "value" }`

### Shell 输出注入

使用 `!`command`` 将 bash 命令输出注入到提示词中。

**示例 1：分析测试覆盖率**

```markdown
---
description: Analyze test coverage
---

Here are the current test results:
!\`npm test\`

Based on these results, suggest improvements to increase coverage.
```

**示例 2：查看最近更改**

```markdown
---
description: Review recent changes
---

Recent git commits:
!\`git log --oneline -10\`

Review these changes and suggest any improvements.
```

命令在项目的根目录中运行，其输出会成为提示词的一部分。

### 文件引用

使用 `@` 后跟文件名在命令中引用文件：

```markdown
---
description: Review component
---

Review the component in @src/components/Button.tsx.
Check for performance issues and suggest improvements.
```

文件内容会自动包含在提示词中。

---

## 配置选项详解

### template（必需）

定义执行命令时发送给 LLM 的提示词。

```json
{
  "command": {
    "test": {
      "template": "Run the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes."
    }
  }
}
```

### description（可选）

提供命令功能的简要描述，在 TUI 中显示。

```json
{
  "command": {
    "test": {
      "description": "Run tests with coverage"
    }
  }
}
```

### agent（可选）

指定由哪个代理执行此命令。

```json
{
  "command": {
    "review": {
      "agent": "plan"
    }
  }
}
```

如果未指定，默认使用你当前的代理。如果这是一个子代理，该命令默认会触发子代理调用。

### subtask（可选）

强制命令触发子代理调用。如果你希望命令不污染主要上下文，这会很有用。

```json
{
  "command": {
    "analyze": {
      "subtask": true
    }
  }
}
```

设置为 `true` 会**强制**代理作为子代理运行，即使代理配置中的 `mode` 设置为 `primary`。

### model（可选）

覆盖此命令的默认模型。

```json
{
  "command": {
    "analyze": {
      "model": "anthropic/claude-3-5-sonnet-20241022"
    }
  }
}
```

---

## 内置命令

OpenCode 包含多个内置命令：

| 命令 | 功能 |
|------|------|
| `/init` | 初始化项目，加载配置和 Skills |
| `/undo` | 撤销上一步操作 |
| `/redo` | 重做被撤销的操作 |
| `/share` | 分享当前会话 |
| `/help` | 查看帮助信息 |

> **注意**：如果你定义了同名的自定义命令，它将覆盖内置命令。

---

## 完整示例

### 示例 1：代码审查命令

`.opencode/commands/review.md`：

```markdown
---
description: Review code changes
agent: plan
---

Review the following git diff and provide feedback:
!\`git diff HEAD~1\`

Focus on:
1. Code quality and best practices
2. Potential bugs or issues
3. Performance considerations
4. Suggestions for improvement
```

使用：

```bash
/review
```

### 示例 2：创建组件命令

`.opencode/commands/component.md`：

```markdown
---
description: Create a new React component
agent: build
---

Create a new React component named $ARGUMENTS with:
- TypeScript support
- CSS Modules for styling
- Jest test file
- Storybook story

Place it in src/components/$ARGUMENTS/
```

使用：

```bash
/component UserProfile
```

### 示例 3：分析性能命令

`.opencode/commands/perf.md`：

```markdown
---
description: Analyze bundle performance
model: anthropic/claude-3-5-sonnet-20241022
---

Analyze the bundle size and performance:
!\`npm run build 2>&1 | grep -E "(Size|Gzip)"\`

Check the main entry points:
@src/index.ts

Suggest optimizations to reduce bundle size and improve performance.
```

---

## 相关文档

- [内置命令参考](./commands-built-in.md)：了解 OpenCode 内置命令
- [Skills 使用入门](./skills-basics.md)：了解 Skills 生态
- [SKILL.md 开发规范](./skill-md-spec.md)：开发自己的 Skills
- [环境变量配置](./environment-variables.md)：配置 API 和模型

---

*本文档翻译自 [OpenCode 官方文档](https://opencode.ai/docs/zh-cn/commands/)，最后更新：2026-02-22*
